// backend/src/middleware/validator.js
// Production runtime schema validation and input sanitization

const VALID_STATUSES = ['placed', 'accepted', 'preparing', 'ready', 'dispatched', 'delivered', 'cancelled'];

const ALLOWED_TRANSITIONS = {
  placed: ['accepted', 'cancelled'],
  accepted: ['preparing', 'cancelled'],
  preparing: ['ready', 'cancelled'],
  ready: ['dispatched', 'delivered', 'cancelled'],
  dispatched: ['delivered', 'cancelled'],
  delivered: [],
  cancelled: []
};

// Stoke-on-Trent Postal District Regex (ST1 through ST12)
const STOKE_POSTCODE_REGEX = /^ST(?:1[0-2]|[1-9])\s?[0-9][A-Z]{2}$/i;

// UK Phone Number Regex (07xxx mobile or 01xxx/02xxx landline)
const UK_PHONE_REGEX = /^(?:(?:\+44\s?|0)(?:7\d{3}|1\d{3}|2\d{3})\s?\d{3}\s?\d{3})$/;

/**
 * Basic XSS / HTML sanitization
 */
function sanitizeString(str, maxLength = 255) {
  if (typeof str !== 'string') return '';
  return str
    .replace(/[<>]/g, '') // Strip HTML tags
    .trim()
    .slice(0, maxLength);
}

/**
 * Order placement validation
 */
function validateOrderPayload(req, res, next) {
  const body = req.body || {};
  const errors = [];

  // 1. Items Validation
  if (!body.items || !Array.isArray(body.items) || body.items.length === 0) {
    errors.push('Order must contain at least one menu item.');
  } else if (body.items.length > 50) {
    errors.push('Order cannot exceed 50 distinct items.');
  } else {
    body.items.forEach((item, idx) => {
      if (!item.id || typeof item.id !== 'string') {
        errors.push(`Item at index ${idx} is missing a valid item ID.`);
      }
      const qty = Number(item.quantity);
      if (!Number.isInteger(qty) || qty < 1 || qty > 50) {
        errors.push(`Item '${item.name || idx}' quantity must be an integer between 1 and 50.`);
      }
      if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
        item.selectedOptions.forEach((opt, optIdx) => {
          if (!opt.name || typeof opt.name !== 'string') {
            errors.push(`Option ${optIdx} for item ${item.name || idx} requires a name.`);
          }
          if (opt.priceDelta !== undefined && (isNaN(Number(opt.priceDelta)) || Number(opt.priceDelta) < 0)) {
            errors.push(`Option '${opt.name}' has an invalid price delta.`);
          }
        });
      }
    });
  }

  // 2. Fulfillment Type Validation
  const fulfillmentType = body.fulfillmentType || 'delivery';
  if (!['delivery', 'collection'].includes(fulfillmentType)) {
    errors.push("Fulfillment type must be either 'delivery' or 'collection'.");
  }

  // 3. Payment Method Validation
  const paymentMethod = body.paymentMethod || 'card';
  if (!['card', 'cash_on_delivery', 'apple_pay', 'google_pay'].includes(paymentMethod)) {
    errors.push("Payment method must be 'card', 'cash_on_delivery', 'apple_pay', or 'google_pay'.");
  }

  // 4. Delivery Address Validation (Required if fulfillment is delivery)
  if (fulfillmentType === 'delivery') {
    const addr = body.deliveryAddress;
    if (!addr || typeof addr !== 'object') {
      errors.push('Delivery address is required for delivery fulfillment.');
    } else {
      if (!addr.line1 || typeof addr.line1 !== 'string' || addr.line1.trim().length === 0) {
        errors.push('Delivery address line 1 is required.');
      }
      if (!addr.postcode || typeof addr.postcode !== 'string') {
        errors.push('Delivery postcode is required.');
      } else {
        const cleanedPostcode = addr.postcode.trim().toUpperCase();
        if (!STOKE_POSTCODE_REGEX.test(cleanedPostcode)) {
          errors.push(`Postcode '${addr.postcode}' is not a valid Stoke-on-Trent (ST1–ST12) delivery district.`);
        }
      }
    }
  }

  // 5. Customer Phone Validation
  if (body.customerPhone) {
    const cleanedPhone = body.customerPhone.replace(/[\s-]/g, '');
    if (!UK_PHONE_REGEX.test(cleanedPhone) && !/^\d{10,11}$/.test(cleanedPhone)) {
      errors.push('Customer phone number must be a valid UK mobile or landline number.');
    }
  }

  // 6. Special Instructions Sanitization
  if (body.specialInstructions) {
    body.specialInstructions = sanitizeString(body.specialInstructions, 300);
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_FAILED',
        message: 'The submitted order failed input validation checks.',
        details: errors
      }
    });
  }

  next();
}

/**
 * Order status transition state machine validation
 */
function validateStatusTransition(currentStatus, targetStatus) {
  if (!VALID_STATUSES.includes(targetStatus)) {
    return {
      valid: false,
      error: `Invalid status '${targetStatus}'. Allowed: ${VALID_STATUSES.join(', ')}`
    };
  }

  if (currentStatus === targetStatus) {
    return { valid: true }; // Idempotent same-status update
  }

  const allowedNext = ALLOWED_TRANSITIONS[currentStatus] || [];
  if (!allowedNext.includes(targetStatus)) {
    return {
      valid: false,
      error: `Illegal state transition from '${currentStatus}' to '${targetStatus}'. Allowed transitions: ${allowedNext.join(', ') || 'None (terminal state)'}`
    };
  }

  return { valid: true };
}

module.exports = {
  validateOrderPayload,
  validateStatusTransition,
  sanitizeString,
  STOKE_POSTCODE_REGEX,
  UK_PHONE_REGEX,
  VALID_STATUSES
};
