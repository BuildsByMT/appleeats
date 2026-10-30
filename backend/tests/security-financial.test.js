// backend/tests/security-financial.test.js
const test = require('node:test');
const assert = require('node:assert');
const { calculateOrderFinancials, toPence, toPounds } = require('../src/services/financialEngine');
const { generateReceiptData, generateEscPosBytes } = require('../src/services/receiptService');
const { validateStatusTransition, STOKE_POSTCODE_REGEX, UK_PHONE_REGEX } = require('../src/middleware/validator');
const { timingSafeCompare, signJwt, verifyJwt } = require('../src/middleware/authGuard');

test('Financial Engine: Integer Pence Precision & Tax Splits', () => {
  // Test Owen Hume Order items
  const items = [
    { name: "Garlic Mayo", price: 1.00, quantity: 1 },
    {
      name: "7inch Pizza",
      price: 5.50,
      quantity: 1,
      selectedOptions: [
        { name: "Tuna", priceDelta: 0.80 },
        { name: "Sweetcorn", priceDelta: 0.80 }
      ]
    },
    { name: "Cheesy Fries", price: 3.60, quantity: 1 },
    { name: "Onion Rings", price: 3.50, quantity: 1 },
    {
      name: "Sylheti Naga",
      price: 11.95,
      quantity: 1,
      selectedOptions: [{ name: "Peri Fries", priceDelta: 0.00 }]
    },
    { name: "Mixed Loaded Fries", price: 11.00, quantity: 1 }
  ];

  const financials = calculateOrderFinancials({
    items,
    fulfillmentType: 'delivery',
    couponDiscountPence: 0
  });

  // Verify subtotal, fees, and total match down to the exact penny
  assert.strictEqual(financials.subtotalPence, 3815, "Subtotal must be exactly 3815 pence (£38.15)");
  assert.strictEqual(financials.deliveryFeePence, 99, "Delivery fee must be 99 pence (£0.99)");
  assert.strictEqual(financials.serviceFeePence, 50, "Service fee must be 50 pence (£0.50)");
  assert.strictEqual(financials.totalPence, 3964, "Total must be exactly 3964 pence (£39.64)");
  assert.strictEqual(financials.qualifiesForFreeGift, true, "Subtotal >= £30 must unlock Free Gift Cheesecake");
  assert.strictEqual(financials.freeGiftDescription, "Free Gift Strawberry Cheesecake");

  // Verify VAT 20% calculation (standard hot food gross / 6)
  // Standard gross = 3815 + 99 + 50 = 3964 pence. VAT = round(3964 / 6) = 661 pence (£6.61)
  assert.strictEqual(financials.vatAmountPence, 661, "VAT must be 661 pence (£6.61)");
  assert.strictEqual(financials.netAmountPence, 3303, "Net amount must be 3303 pence (£33.03)");
});

test('Financial Engine: Collection Fulfillment Zeroes Delivery Fee', () => {
  const items = [{ name: "Burger", price: 10.00, quantity: 1 }];
  const financials = calculateOrderFinancials({
    items,
    fulfillmentType: 'collection'
  });

  assert.strictEqual(financials.deliveryFeePence, 0, "Collection must have zero delivery fee");
  assert.strictEqual(financials.formatted.deliveryFee, "FREE");
  assert.strictEqual(financials.totalPence, 1050, "Total must be £10.00 + £0.50 service fee = 1050 pence");
});

test('State Machine: Order Transition Validation', () => {
  // Allowed transitions
  assert.strictEqual(validateStatusTransition('placed', 'accepted').valid, true);
  assert.strictEqual(validateStatusTransition('accepted', 'preparing').valid, true);
  assert.strictEqual(validateStatusTransition('preparing', 'ready').valid, true);
  assert.strictEqual(validateStatusTransition('ready', 'dispatched').valid, true);
  assert.strictEqual(validateStatusTransition('dispatched', 'delivered').valid, true);
  assert.strictEqual(validateStatusTransition('placed', 'cancelled').valid, true);
  assert.strictEqual(validateStatusTransition('accepted', 'cancelled').valid, true);

  // Illegal transitions
  assert.strictEqual(validateStatusTransition('placed', 'delivered').valid, false);
  assert.strictEqual(validateStatusTransition('cancelled', 'delivered').valid, false);
  assert.strictEqual(validateStatusTransition('delivered', 'placed').valid, false);
  assert.strictEqual(validateStatusTransition('delivered', 'cancelled').valid, false);
});

test('Validator: Stoke-on-Trent Postcode Regex', () => {
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST4 7PW'), true, "ST4 7PW should be valid");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST1 1AA'), true, "ST1 1AA should be valid");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST10 5AA'), true, "ST10 5AA should be valid");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST12 9AB'), true, "ST12 9AB should be valid");

  // Out of catchment postcodes
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('M1 1AA'), false, "Manchester M1 should be rejected");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('B1 1AA'), false, "Birmingham B1 should be rejected");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST13 1AA'), false, "Leek ST13 should be rejected");
  assert.strictEqual(STOKE_POSTCODE_REGEX.test('ST15 1AA'), false, "Stone ST15 should be rejected");
});

test('Security: Constant-Time String Comparison & JWT Token Signing', () => {
  // Constant time comparison
  assert.strictEqual(timingSafeCompare('secret_123', 'secret_123'), true);
  assert.strictEqual(timingSafeCompare('secret_123', 'secret_wrong'), false);
  assert.strictEqual(timingSafeCompare('short', 'longer_string'), false);

  // Native JWT signing and verification
  const token = signJwt({ role: 'kitchen', restaurantId: 'rest-go-grill' }, 60);
  assert.ok(typeof token === 'string' && token.split('.').length === 3);

  const verified = verifyJwt(token);
  assert.strictEqual(verified.valid, true);
  assert.strictEqual(verified.claims.role, 'kitchen');
  assert.strictEqual(verified.claims.restaurantId, 'rest-go-grill');

  // Tampered token check
  const tampered = token.slice(0, -4) + 'abcd';
  assert.strictEqual(verifyJwt(tampered).valid, false);
});

test('ESC/POS Thermal Printing: Code Page 437 Pound Symbol (0x9C)', () => {
  const mockReceipt = {
    takeawayPhone: "01782698710",
    orderSequenceHeader: "#1 Delivery",
    dueTime: "Due at 06:53 PM",
    customer: {
      name: "Owen Hume",
      addressLine1: "55 Stanley Road",
      city: "Stoke-On-Trent",
      postcode: "ST4 7PW",
      phone: "07951280623"
    },
    lines: [{ qty: 1, name: "Cheesy Fries", price: "3.60", options: [] }],
    freeGift: null,
    financials: {
      subtotal: "3.60",
      deliveryCharge: "0.99",
      serviceCharge: "0.50",
      discount: "0.00",
      total: "5.09",
      paymentMethod: "Card",
      isPaid: true
    }
  };

  const buffer = generateEscPosBytes(mockReceipt);
  assert.ok(Buffer.isBuffer(buffer), "Should return a raw byte Buffer");

  // Check initialization command ESC @ (0x1B 0x40)
  assert.strictEqual(buffer[0], 0x1B);
  assert.strictEqual(buffer[1], 0x40);

  // Check code page selection ESC t 0 (0x1B 0x74 0x00)
  assert.strictEqual(buffer[2], 0x1B);
  assert.strictEqual(buffer[3], 0x74);
  assert.strictEqual(buffer[4], 0x00);

  // Check that 0x9C byte exists in the buffer (the PC437 British pound symbol £)
  assert.ok(buffer.includes(0x9C), "Buffer must contain PC437 pound symbol byte 0x9C");

  // Check paper cut command GS V 0x42 0x00 at the end of buffer
  const len = buffer.length;
  assert.strictEqual(buffer[len - 4], 0x1D); // GS
  assert.strictEqual(buffer[len - 3], 0x56); // V
  assert.strictEqual(buffer[len - 2], 0x42); // 66 (partial cut)
  assert.strictEqual(buffer[len - 1], 0x00);
});
