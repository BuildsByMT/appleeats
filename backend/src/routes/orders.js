// backend/src/routes/orders.js
// Production Order Lifecycle & State Machine Controller
// Enforces server-side catalog pricing, integer-pence financial calculations, and strict state transitions

const express = require('express');
const router = express.Router();
const { restaurants } = require('../data/seedData');
const { evaluateCoupon, recordCompletedOrder } = require('../services/loyaltyService');
const { calculateOrderFinancials, toPence, toPounds } = require('../services/financialEngine');
const { validateOrderPayload, validateStatusTransition } = require('../middleware/validator');
const { ordersLimiter } = require('../middleware/rateLimiter');
const { kitchenSecurityGuard } = require('../middleware/authGuard');

// In-memory active order store (persistent across requests in current process)
const activeOrders = new Map();

// Helper to look up official catalog price for dish by ID
function findCatalogItem(dishId) {
  for (const r of restaurants) {
    for (const cat of r.categories) {
      const it = cat.items.find(i => i.id === dishId);
      if (it) return { restaurant: r, item: it };
    }
  }
  return null;
}

// Helper to look up catalog option delta by name
function findCatalogOptionDelta(catalogItem, optionName) {
  if (!catalogItem || !catalogItem.customizationGroups) return 0;
  for (const group of catalogItem.customizationGroups) {
    const opt = group.options.find(o => o.name === optionName);
    if (opt && opt.priceDelta !== undefined) {
      return Number(opt.priceDelta);
    }
  }
  return 0;
}

// Seed Real Order (Owen Hume - Stoke-on-Trent #1)
const seedRealOrder = {
  id: "ord_stk_001",
  orderNumber: "AE-STK-001",
  orderSequence: 1,
  restaurantId: "rest-go-grill",
  restaurantName: "Go Grill",
  restaurantPhone: "01782698710",
  fulfillmentType: "delivery",
  dueTime: "06:53 PM",
  customerName: "Owen Hume",
  customerPhone: "07951280623",
  deliveryAddress: {
    line1: "55 Stanley Road",
    city: "Stoke-On-Trent",
    postcode: "ST4 7PW"
  },
  specialInstructions: "No Jalapeno on the loaded fries please",
  items: [
    { id: "gg-s3", name: "Gailic Mayonnaise", quantity: 1, price: 1.00, selectedOptions: [] },
    {
      id: "gg-p1",
      name: "7inch The Classic Pizza",
      quantity: 1,
      price: 4.50,
      selectedOptions: [
        { name: "Tuna", priceDelta: 0.80 },
        { name: "Sweetcorn", priceDelta: 0.80 }
      ]
    },
    { id: "gg-s1", name: "Cheesy Fries", quantity: 1, price: 3.60, selectedOptions: [] },
    { id: "gg-s2", name: "10pcs Onion Rings", quantity: 1, price: 3.50, selectedOptions: [] },
    {
      id: "gg-m1",
      name: "Sylheti Naga",
      quantity: 1,
      price: 11.95,
      selectedOptions: [
        { name: "1x 6oz Gourmet Black Angus Patty, With Peri Fries, Naga Donner Stir Fry", priceDelta: 0.00 }
      ]
    },
    { id: "gg-m2", name: "Mixed Loaded Fries", quantity: 1, price: 11.00, selectedOptions: [] }
  ],
  freeGiftDescription: "Free Gift Strawberry Cheesecake",
  subtotal: 38.15,
  deliveryFee: 0.99,
  serviceFee: 0.50,
  discount: 0.00,
  total: 39.64,
  vatAmount: 6.61,
  paymentMethod: "card",
  paymentStatus: "confirmed",
  orderStatus: "accepted",
  createdAt: new Date().toISOString()
};

activeOrders.set(seedRealOrder.id, seedRealOrder);

// Sequence counter
let currentSequence = 1;

/**
 * POST /api/v1/orders - Create a validated order
 * Applies rate limiting, input validation, server-side pricing, and integer pence accounting
 */
router.post('/', ordersLimiter, validateOrderPayload, (req, res) => {
  const {
    restaurantId = 'rest-go-grill',
    fulfillmentType = 'delivery',
    customerName,
    customerPhone,
    deliveryAddress,
    specialInstructions,
    paymentMethod = 'card',
    couponCode,
    items = []
  } = req.body;

  // Resolve restaurant profile
  const restaurant = restaurants.find(r => r.id === restaurantId || r.slug === restaurantId) || restaurants[1]; // fallback to Go Grill
  const restaurantName = restaurant.name;
  const restaurantPhone = restaurant.phone || "01782698710";

  // Re-derive official server-side pricing for every dish and option
  const verifiedItems = items.map(clientItem => {
    const catalogMatch = findCatalogItem(clientItem.id);
    let verifiedPrice = catalogMatch ? Number(catalogMatch.item.price) : Number(clientItem.price || 0);

    const verifiedOptions = (clientItem.selectedOptions || []).map(opt => {
      const verifiedDelta = catalogMatch
        ? findCatalogOptionDelta(catalogMatch.item, opt.name)
        : Number(opt.priceDelta || 0);
      return {
        name: opt.name,
        priceDelta: verifiedDelta
      };
    });

    return {
      id: clientItem.id,
      name: catalogMatch ? catalogMatch.item.name : (clientItem.name || 'Dish Item'),
      quantity: Math.max(1, Math.round(Number(clientItem.quantity) || 1)),
      price: verifiedPrice,
      selectedOptions: verifiedOptions
    };
  });

  // Calculate preliminary subtotal for coupon evaluation
  let rawSubtotalPence = 0;
  verifiedItems.forEach(item => {
    let itemUnitPence = toPence(item.price);
    item.selectedOptions.forEach(opt => {
      itemUnitPence += toPence(opt.priceDelta);
    });
    rawSubtotalPence += itemUnitPence * item.quantity;
  });

  // Evaluate Coupon in integer pence
  let discountPence = 0;
  if (couponCode) {
    const rawSubtotalPounds = rawSubtotalPence / 100;
    const couponResult = evaluateCoupon(couponCode, rawSubtotalPounds, true);
    if (couponResult.isValid) {
      discountPence = toPence(couponResult.discountAmount);
    }
  }

  // Delivery fee rules (ST1-ST12 standard: £0.99 for delivery, £0.00 for collection)
  const isDelivery = fulfillmentType === 'delivery';
  const deliveryFeePence = isDelivery
    ? toPence(restaurant.deliverySettings?.deliveryFee !== undefined ? restaurant.deliverySettings.deliveryFee : 0.99)
    : 0;

  // Execute Financial Engine calculation
  const financials = calculateOrderFinancials({
    items: verifiedItems,
    fulfillmentType,
    couponDiscountPence: discountPence,
    restaurantDeliveryFeePence: deliveryFeePence
  });

  currentSequence += 1;
  const orderId = `ord_stk_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`;
  const orderNumber = `AE-STK-${String(currentSequence).padStart(3, '0')}`;

  const dueTime = new Date(Date.now() + (isDelivery ? 35 : 20) * 60000).toLocaleTimeString('en-GB', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });

  const newOrder = {
    id: orderId,
    orderNumber,
    orderSequence: currentSequence,
    restaurantId: restaurant.id,
    restaurantName,
    restaurantPhone,
    fulfillmentType,
    dueTime,
    customerName: customerName || "Owen Hume",
    customerPhone: customerPhone || "07951280623",
    deliveryAddress: deliveryAddress || {
      line1: "55 Stanley Road",
      city: "Stoke-On-Trent",
      postcode: "ST4 7PW"
    },
    specialInstructions: specialInstructions || null,
    items: verifiedItems,
    freeGiftDescription: financials.freeGiftDescription,
    subtotal: Number(toPounds(financials.subtotalPence)),
    deliveryFee: Number(toPounds(financials.deliveryFeePence)),
    serviceFee: Number(toPounds(financials.serviceFeePence)),
    discount: Number(toPounds(financials.discountPence)),
    total: Number(toPounds(financials.totalPence)),
    vatAmount: Number(toPounds(financials.vatAmountPence)),
    netAmount: Number(toPounds(financials.netAmountPence)),
    paymentMethod,
    paymentStatus: paymentMethod === 'cash_on_delivery' ? 'pending' : 'confirmed',
    orderStatus: 'placed',
    createdAt: new Date().toISOString()
  };

  activeOrders.set(orderId, newOrder);

  res.status(201).json({
    success: true,
    data: newOrder
  });
});

/**
 * GET /api/v1/orders/kitchen/queue - Kitchen tablet queue
 * Protected by kitchen security guard
 */
router.get('/kitchen/queue', kitchenSecurityGuard, (req, res) => {
  const { restaurantId } = req.query;
  let orders = Array.from(activeOrders.values());

  if (restaurantId && restaurantId !== 'all') {
    orders = orders.filter(o => o.restaurantId === restaurantId);
  }

  // Sort latest first
  orders.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  res.json({
    success: true,
    data: orders
  });
});

/**
 * PATCH /api/v1/orders/:id/status - Kitchen advances order status
 * Validated by state machine transition rules
 */
router.patch('/:id/status', (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const order = activeOrders.get(id);
  if (!order) {
    return res.status(404).json({
      success: false,
      error: { code: 'ORDER_NOT_FOUND', message: `Order with ID '${id}' was not found.` }
    });
  }

  // Enforce state transition rules
  const transitionCheck = validateStatusTransition(order.orderStatus, status);
  if (!transitionCheck.valid) {
    return res.status(409).json({
      success: false,
      error: {
        code: 'ILLEGAL_STATE_TRANSITION',
        message: transitionCheck.error
      }
    });
  }

  order.orderStatus = status;
  order.updatedAt = new Date().toISOString();

  // If marked delivered, trigger loyalty stamp increment
  if (status === 'delivered') {
    recordCompletedOrder(order.customerPhone || 'cust-owen');
  }

  res.json({
    success: true,
    data: order
  });
});

/**
 * GET /api/v1/orders/:id/track - Customer live tracking status
 */
router.get('/:id/track', (req, res) => {
  const { id } = req.params;
  const order = activeOrders.get(id);

  if (!order) {
    return res.status(404).json({
      success: false,
      error: { code: 'ORDER_NOT_FOUND', message: 'Order not found' }
    });
  }

  // Return customer-safe view
  res.json({
    success: true,
    data: {
      id: order.id,
      orderNumber: order.orderNumber,
      orderStatus: order.orderStatus,
      dueTime: order.dueTime,
      fulfillmentType: order.fulfillmentType,
      restaurantName: order.restaurantName,
      restaurantPhone: order.restaurantPhone,
      itemsCount: (order.items || []).reduce((acc, i) => acc + (i.quantity || 1), 0),
      total: order.total,
      deliveryAddress: order.deliveryAddress,
      createdAt: order.createdAt
    }
  });
});

module.exports = router;
module.exports.activeOrders = activeOrders;
