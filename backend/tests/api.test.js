// Automated Integration & Unit Tests for Apple Eats API
const test = require('node:test');
const assert = require('node:assert');
const { generateReceiptData, generateEscPosBytes } = require('../src/services/receiptService');
const { evaluateCoupon, recordCompletedOrder } = require('../src/services/loyaltyService');
const { restaurants } = require('../src/data/seedData');

test('Seed Data: Verify 4 Stoke-on-Trent Takeaways', () => {
  assert.ok(restaurants.length >= 3, 'Should have at least 3-4 takeaways');
  const fishLounge = restaurants.find(r => r.name === 'Fish Lounge');
  const goGrill = restaurants.find(r => r.name === 'Go Grill');
  const crispyChicken = restaurants.find(r => r.name === 'Crispy Chicken');

  assert.ok(fishLounge, 'Fish Lounge must be seeded');
  assert.ok(goGrill, 'Go Grill must be seeded');
  assert.ok(crispyChicken, 'Crispy Chicken must be seeded');

  assert.strictEqual(fishLounge.phone, '01782698710');
  assert.strictEqual(fishLounge.address.city, 'Stoke-on-Trent');
});

test('Customization Engine: Go Grill 7inch Pizza options', () => {
  const goGrill = restaurants.find(r => r.name === 'Go Grill');
  const pizza = goGrill.categories[0].items.find(i => i.id === 'gg-p1');

  assert.ok(pizza.isCustomizable, 'Pizza must be customizable');
  const sizeGroup = pizza.customizationGroups.find(g => g.name === 'Size');
  const toppingsGroup = pizza.customizationGroups.find(g => g.name === 'Add Extra Toppings');

  assert.ok(sizeGroup, 'Must have Size group');
  assert.ok(toppingsGroup, 'Must have Add Extra Toppings group');

  const tuna = toppingsGroup.options.find(o => o.name === 'Tuna');
  const sweetcorn = toppingsGroup.options.find(o => o.name === 'Sweetcorn');
  assert.strictEqual(tuna.priceDelta, 0.80);
  assert.strictEqual(sweetcorn.priceDelta, 0.80);

  // Base 4.50 + 0.80 + 0.80 = 6.10
  const calculatedTotal = pizza.price + tuna.priceDelta + sweetcorn.priceDelta;
  assert.strictEqual(calculatedTotal, 6.10);
});

test('Thermal Receipt Generation: Reproduces Owen Hume #1 Delivery Receipt', () => {
  const testOrder = {
    orderSequence: 1,
    fulfillmentType: 'delivery',
    restaurantPhone: '01782698710',
    dueTime: '06:53 PM',
    customerName: 'Owen Hume',
    customerPhone: '07951280623',
    deliveryAddress: {
      line1: '55 Stanley Road',
      city: 'Stoke-On-Trent',
      postcode: 'ST4 7PW'
    },
    specialInstructions: 'No Jalapeno on the loaded fries please',
    items: [
      { name: 'Gailic Mayonnaise', quantity: 1, price: 1.00, selectedOptions: [] },
      {
        name: '7inch The Classic Pizza',
        quantity: 1,
        price: 5.50,
        selectedOptions: [
          { name: 'Tuna', priceDelta: 0.80 },
          { name: 'Sweetcorn', priceDelta: 0.80 }
        ]
      },
      { name: 'Cheesy Fries', quantity: 1, price: 3.60, selectedOptions: [] },
      { name: '10pcs Onion Rings', quantity: 1, price: 3.50, selectedOptions: [] },
      {
        name: 'Sylheti Naga',
        quantity: 1,
        price: 11.95,
        selectedOptions: [
          { name: '1x 6oz Gourmet Black Angus Patty, With Peri Fries, Naga Donner Stir Fry', priceDelta: 0.00 }
        ]
      },
      { name: 'Mixed Loaded Fries', quantity: 1, price: 11.00, selectedOptions: [] }
    ],
    freeGiftDescription: 'Free Gift Strawberry Cheesecake',
    subtotal: 38.15,
    deliveryFee: 0.99,
    serviceFee: 0.50,
    total: 39.64,
    paymentMethod: 'card'
  };

  const receipt = generateReceiptData(testOrder);

  assert.strictEqual(receipt.takeawayPhone, '01782698710');
  assert.strictEqual(receipt.orderSequenceHeader, '#1 Delivery');
  assert.strictEqual(receipt.customer.name, 'Owen Hume');
  assert.strictEqual(receipt.customer.postcode, 'ST4 7PW');
  assert.strictEqual(receipt.specialInstructions, 'No Jalapeno on the loaded fries please');
  assert.strictEqual(receipt.financials.subtotal, '38.15');
  assert.strictEqual(receipt.financials.deliveryCharge, '0.99');
  assert.strictEqual(receipt.financials.serviceCharge, '0.50');
  assert.strictEqual(receipt.financials.total, '39.64');
  assert.strictEqual(receipt.financials.isPaid, true);

  // Test ESC/POS binary generator
  const bytes = generateEscPosBytes(receipt);
  assert.ok(Buffer.isBuffer(bytes), 'Must return binary Buffer');
  assert.ok(bytes.length > 100, 'Byte buffer should have formatted length');
});

test('Loyalty & Coupon Rules: 50% first order and 5-order milestone', () => {
  // Test 50% discount on first order
  const couponRes = evaluateCoupon('EATS50', 30.00, true);
  assert.strictEqual(couponRes.isValid, true);
  assert.strictEqual(couponRes.discountAmount, 15.00); // 50% of 30 = 15.00

  // Test 5-order reward milestone
  const testUserId = 'test_cust_999';
  let loyaltyStatus;
  for (let i = 1; i <= 5; i++) {
    loyaltyStatus = recordCompletedOrder(testUserId);
  }

  assert.strictEqual(loyaltyStatus.completedOrdersCount, 5);
  assert.ok(loyaltyStatus.newVoucherGenerated, 'Must generate voucher on 5th order');
  assert.strictEqual(loyaltyStatus.newVoucherGenerated.amount, 6.99);
});
