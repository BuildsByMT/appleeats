// Apple Eats UK - High-Precision Financial & Currency Utility (Integer-Pence Calculation)
// Eliminates IEEE-754 floating-point drift and banker's rounding discrepancies

/**
 * Converts British Pounds to Integer Pence
 * e.g., 38.15 -> 3815
 */
export const toPence = (pounds) => {
  if (pounds === undefined || pounds === null || isNaN(pounds)) return 0;
  return Math.round(Number(pounds) * 100);
};

/**
 * Converts Integer Pence to formatted British Pounds string or number
 * e.g., 3815 -> "38.15"
 */
export const toPounds = (pence) => {
  if (pence === undefined || pence === null || isNaN(pence)) return "0.00";
  return (Number(pence) / 100).toFixed(2);
};

/**
 * Standard British Currency Formatter (Intl en-GB)
 */
const gbpFormatter = new Intl.NumberFormat('en-GB', {
  style: 'currency',
  currency: 'GBP',
  minimumFractionDigits: 2,
  maximumFractionDigits: 2
});

export const formatGBP = (amount) => {
  return gbpFormatter.format(Number(amount) || 0);
};

/**
 * Comprehensive Order Financials Calculation in Integer Pence
 */
export const calculateOrderFinancials = (arg1 = [], arg2 = {}) => {
  let items = [];
  let fulfillmentMode = 'delivery';
  let couponCode = '';
  let restaurantDeliveryFee = 0.99;
  let restaurantMinOrder = 10.00;

  if (Array.isArray(arg1)) {
    items = arg1;
    fulfillmentMode = arg2.fulfillmentMode || 'delivery';
    couponCode = arg2.couponCode || arg2.voucherCode || '';
    restaurantDeliveryFee = arg2.restaurantDeliveryFee !== undefined ? arg2.restaurantDeliveryFee : 0.99;
    restaurantMinOrder = arg2.restaurantMinOrder !== undefined ? arg2.restaurantMinOrder : 10.00;
  } else if (typeof arg1 === 'object' && arg1 !== null) {
    items = arg1.items || [];
    fulfillmentMode = arg1.fulfillmentMode || 'delivery';
    couponCode = arg1.couponCode || arg1.voucherCode || '';
    restaurantDeliveryFee = arg1.restaurantDeliveryFee !== undefined ? arg1.restaurantDeliveryFee : 0.99;
    restaurantMinOrder = arg1.restaurantMinOrder !== undefined ? arg1.restaurantMinOrder : 10.00;
  }
  // 1. Calculate Subtotal in Pence
  const subtotalPence = items.reduce((acc, item) => {
    const unitPrice = item.customizedPrice !== undefined ? item.customizedPrice : item.price;
    const unitPence = toPence(unitPrice);
    const qty = Number(item.quantity) || 1;
    return acc + (unitPence * qty);
  }, 0);

  // If basket is empty, all fees and totals are zero
  if (items.length === 0) {
    return {
      subtotalPence: 0,
      deliveryPence: 0,
      servicePence: 0,
      discountPence: 0,
      totalPence: 0,
      subtotal: 0.00,
      deliveryCharge: 0.00,
      serviceCharge: 0.00,
      discount: 0.00,
      total: 0.00,
      hasFreeGift: false,
      meetsMinOrder: false
    };
  }

  const isDelivery = fulfillmentMode === 'delivery';
  const deliveryPence = isDelivery ? toPence(restaurantDeliveryFee) : 0;
  const servicePence = 50; // Standard UK aggregator service charge (£0.50)

  // 2. Coupon Discount Calculation in Integer Pence
  let discountPence = 0;
  const normalizedCoupon = (couponCode || '').toUpperCase().trim();

  if (normalizedCoupon === 'EATS50') {
    // 50% off for first-time customers, capped at £15.00 (1500 pence)
    const rawDiscount = Math.round(subtotalPence * 0.50);
    discountPence = Math.min(rawDiscount, 1500);
  } else if (normalizedCoupon === 'TREATS' || normalizedCoupon === 'GOGRILL30') {
    // 30% discount
    discountPence = Math.round(subtotalPence * 0.30);
  } else if (normalizedCoupon === 'ITALIA20') {
    // 20% discount on pasta/pizza
    discountPence = Math.round(subtotalPence * 0.20);
  } else if (normalizedCoupon === 'CRISPYBOGO') {
    // Buy 1 Get 1 Free (e.g. £4.99 discount)
    discountPence = Math.min(subtotalPence, 499);
  }

  // 3. Free Gift Qualification (Subtotal >= £30.00)
  const hasFreeGift = subtotalPence >= 3000;

  // 4. Total Payable in Pence
  const totalPence = Math.max(0, subtotalPence + deliveryPence + servicePence - discountPence);

  // 5. Minimum Order Requirement
  const minOrderPence = toPence(restaurantMinOrder);
  const meetsMinOrder = !isDelivery || (subtotalPence >= minOrderPence);

  return {
    subtotalPence,
    deliveryPence,
    servicePence,
    discountPence,
    totalPence,
    subtotal: Number(toPounds(subtotalPence)),
    deliveryCharge: Number(toPounds(deliveryPence)),
    serviceCharge: Number(toPounds(servicePence)),
    discount: Number(toPounds(discountPence)),
    total: Number(toPounds(totalPence)),
    hasFreeGift,
    meetsMinOrder,
    formattedSubtotal: formatGBP(toPounds(subtotalPence)),
    formattedDelivery: deliveryPence === 0 ? 'FREE' : formatGBP(toPounds(deliveryPence)),
    formattedService: formatGBP(toPounds(servicePence)),
    formattedDiscount: discountPence > 0 ? `-${formatGBP(toPounds(discountPence))}` : '£0.00',
    formattedTotal: formatGBP(toPounds(totalPence))
  };
};
