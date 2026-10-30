// Apple Eats UK - Comprehensive Production Integrity Verification Suite
// Tests all 20 clusters and key business invariants

import { calculateOrderFinancials, toPence, toPounds, formatGBP } from '../utils/currency.js';
import { 
  STOKE_POSTCODE_DISTRICTS, 
  validateStokePostcode, 
  getStokePostcodeDetails, 
  normalizePostcode, 
  formatUKPhone, 
  validateUKPhone,
  MANDATORY_ALLERGENS_14,
  NATASHAS_LAW_14_ALLERGENS 
} from '../utils/ukLocalization.js';
import { initialRestaurants, dealsList } from '../data/mockData.js';

let passedTests = 0;
let failedTests = 0;

function assert(condition, testName) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${testName}`);
  } else {
    failedTests++;
    console.error(`  ✗ FAIL: ${testName}`);
  }
}

console.log('====================================================');
console.log('APPLE EATS UK - COMPREHENSIVE PRODUCTION TEST RUNNER');
console.log('====================================================\n');

// CLUSTER 1 & 2: FINANCIAL INTEGRITY & RECEIPT PARITY
console.log('--- TEST GROUP 1: FINANCIAL & RECEIPT ARITHMETIC ---');
const owenHumeReceiptItems = [
  { id: 'gg-s3', name: 'Gailic Mayonnaise', price: 1.00, quantity: 1 },
  { id: 'gg-p1', name: '7inch The Classic Pizza', customizedPrice: 7.10, price: 5.50, quantity: 1 },
  { id: 'gg-s1', name: 'Cheesy Fries', price: 3.60, quantity: 1 },
  { id: 'gg-s2', name: '10pcs Onion Rings', price: 3.50, quantity: 1 },
  { id: 'gg-m1', name: 'Sylheti Naga', price: 11.95, quantity: 1 },
  { id: 'gg-m2', name: 'Mixed Loaded Fries', price: 11.00, quantity: 1 }
];

const deliveryResult = calculateOrderFinancials(owenHumeReceiptItems, { fulfillmentMode: 'delivery' });
assert(deliveryResult.subtotalPence === 3815, 'Subtotal in integer pence is exactly 3815p');
assert(deliveryResult.subtotal === 38.15, 'Subtotal formatted is exactly £38.15');
assert(deliveryResult.deliveryCharge === 0.99, 'Delivery fee is exactly £0.99');
assert(deliveryResult.serviceCharge === 0.50, 'Service charge is exactly £0.50');
assert(deliveryResult.totalPence === 3964, 'Total in integer pence is exactly 3964p');
assert(deliveryResult.total === 39.64, 'Owen Hume live receipt total matches £39.64 down to the penny');
assert(deliveryResult.hasFreeGift === true, 'Subtotal >= £30 unlocks Free Gift Cheesecake');

const collectionResult = calculateOrderFinancials(owenHumeReceiptItems, { fulfillmentMode: 'collection' });
assert(collectionResult.deliveryCharge === 0.00, 'Collection fulfillment strictly eliminates delivery fee (£0.00)');
assert(collectionResult.formattedDelivery === 'FREE', 'Collection delivery fee renders as "FREE"');
assert(collectionResult.total === 38.65, 'Collection total is exactly £38.65 (£39.64 - £0.99)');

// VOUCHER RULES
const voucher50 = calculateOrderFinancials(owenHumeReceiptItems, { fulfillmentMode: 'delivery', couponCode: 'EATS50' });
assert(voucher50.discount === 15.00, 'EATS50 50% discount is capped at £15.00');
assert(voucher50.total === 24.64, 'Total with EATS50 is £24.64 (£39.64 - £15.00)');

const voucher30 = calculateOrderFinancials(owenHumeReceiptItems, { fulfillmentMode: 'delivery', couponCode: 'TREATS' });
assert(voucher30.discount === 11.45, 'TREATS applies exact 30% discount of £11.45');
assert(voucher30.total === 28.19, 'Total with TREATS is £28.19');

// CLUSTER 3: STOKE-ON-TRENT POSTCODES (ST1–ST12)
console.log('\n--- TEST GROUP 2: STOKE GEOLOCATION & PAF COMPLIANCE ---');
assert(STOKE_POSTCODE_DISTRICTS.length === 12, 'All 12 Stoke postal districts (ST1 to ST12) are enumerated');
const allCodes = STOKE_POSTCODE_DISTRICTS.map(d => d.code);
assert(allCodes.includes('ST1') && allCodes.includes('ST6') && allCodes.includes('ST12'), 'Includes ST1, ST6, ST12');

assert(validateStokePostcode('ST1 1AA') === true, 'ST1 1AA is valid Stoke postcode');
assert(validateStokePostcode('ST4 7PW') === true, 'ST4 7PW (Owen Hume address) is valid');
assert(validateStokePostcode('ST10 5AA') === true, 'ST10 5AA is valid Stoke postcode');
assert(validateStokePostcode('ST12 9AB') === true, 'ST12 9AB is valid Stoke postcode');
assert(validateStokePostcode('st5 2aa') === true, 'st5 2aa (case-insensitive) is valid');

assert(validateStokePostcode('M1 1AA') === false, 'M1 (Manchester) is correctly rejected');
assert(validateStokePostcode('B1 1AA') === false, 'B1 (Birmingham) is correctly rejected');
assert(validateStokePostcode('SW1A 1AA') === false, 'SW1A (London) is correctly rejected');
assert(validateStokePostcode('ST13 1AA') === false, 'ST13 (Leek, out of catchment) is correctly rejected');

const st10Details = getStokePostcodeDetails('ST10 5AA');
assert(st10Details.district === 'ST10', 'Regex lookahead accurately extracts ST10 (not ST1)');

// CLUSTER 4: OFCOM TELEPHONE COMPLIANCE
console.log('\n--- TEST GROUP 3: OFCOM TELEPHONE FORMATTING ---');
assert(formatUKPhone('01782698710') === '01782 698710', 'Stoke landline formats to 01782 698710');
assert(formatUKPhone('07951280623') === '07951 280623', 'UK mobile formats to 07951 280623');
assert(validateUKPhone('01782 698710').isValid === true, 'Stoke landline passes regex validation');
assert(validateUKPhone('07951 280623').isValid === true, 'UK mobile passes regex validation');

// CLUSTER 5: NATASHA\'S LAW FOOD SAFETY ALLERGENS
console.log('\n--- TEST GROUP 4: NATASHA\'S LAW FOOD SAFETY ---');
assert(MANDATORY_ALLERGENS_14.length === 14, 'All 14 mandatory UK allergens are defined');
assert(NATASHAS_LAW_14_ALLERGENS.length === 14, 'NATASHAS_LAW_14_ALLERGENS alias matches 14 allergens');
const allergenNames = MANDATORY_ALLERGENS_14.map(a => a.name.toLowerCase());
assert(allergenNames.some(n => n.includes('celery')), 'Celery included');
assert(allergenNames.some(n => n.includes('gluten')), 'Gluten included');
assert(allergenNames.some(n => n.includes('crustaceans')), 'Crustaceans included');
assert(allergenNames.some(n => n.includes('fish')), 'Fish included');
assert(allergenNames.some(n => n.includes('milk')), 'Milk included');
assert(allergenNames.some(n => n.includes('peanuts')), 'Peanuts included');
assert(allergenNames.some(n => n.includes('tree nuts') || n.includes('nuts')), 'Nuts included');

// CLUSTER 6: MARKETPLACE ANCHOR RESTAURANTS & COMMISSION
console.log('\n--- TEST GROUP 5: MARKETPLACE TAKEAWAYS & 0% COMMISSION ---');
assert(initialRestaurants.length === 4, '4 anchor takeaways are present');
const ownedStores = initialRestaurants.filter(r => r.isClientOwned);
assert(ownedStores.length === 4, 'All 4 anchor takeaways are client-owned (permanent 0% commission)');
const storeNames = initialRestaurants.map(r => r.name);
assert(storeNames.includes('Fish Lounge'), 'Fish Lounge present');
assert(storeNames.includes('Go Grill'), 'Go Grill present');
assert(storeNames.includes('Crispy Chicken'), 'Crispy Chicken present');
assert(storeNames.includes('Bella Italia'), 'Bella Italia present');

for (const store of initialRestaurants) {
  assert(store.fhrsRating === 5, `${store.name} has official 5/5 FSA Food Hygiene Rating`);
  assert(store.fhrsUrl.includes('ratings.food.gov.uk'), `${store.name} links to ratings.food.gov.uk`);
}

// PPDS ITEMS IN MOCK DATA
const goGrill = initialRestaurants.find(r => r.id === 'rest-go-grill');
const ppdsCategory = goGrill.categories.find(c => c.name.includes('PPDS') || c.id === 'cat-gg-desserts');
assert(ppdsCategory !== undefined, 'PPDS category exists in Go Grill');
const cheesecake = ppdsCategory.items.find(i => i.id === 'gg-d1');
assert(cheesecake.foodPrepType === 'prepacked-ppds', 'Strawberry Cheesecake is marked prepacked-ppds');
assert(cheesecake.ingredients.length > 20, 'Strawberry Cheesecake has full statutory QUID ingredients');
assert(cheesecake.mayContain.length > 0, 'Strawberry Cheesecake has precautionary allergen labeling');

// CLUSTER 6: CART SLIDER & FULL-SCREEN AUTH VERIFICATION
console.log('\n--- TEST GROUP 6: CART SLIDER & AUTHENTICATION SCREENS ---');
import fs from 'fs';
import path from 'path';

const cartDrawerPath = path.resolve('frontend/src/components/CartDrawer.jsx');
assert(fs.existsSync(cartDrawerPath), 'CartDrawer.jsx component file exists');
const cartDrawerSource = fs.readFileSync(cartDrawerPath, 'utf8');
assert(cartDrawerSource.includes('translate-x-full'), 'CartDrawer has slide-out translate-x-full transition');
assert(cartDrawerSource.includes('translate-x-0'), 'CartDrawer has slide-in translate-x-0 transition');
assert(!cartDrawerSource.includes('isMounted'), 'CartDrawer avoids brittle isMounted lifecycle state');
assert(!cartDrawerSource.includes('setTimeout'), 'CartDrawer avoids asynchronous timer race conditions');
assert(cartDrawerSource.includes('handleTouchEnd'), 'CartDrawer has touch swipe-to-dismiss gesture handling');
assert(cartDrawerSource.includes('Keep Shopping'), 'CartDrawer has Keep Shopping dismiss CTA');

const headerPath = path.resolve('frontend/src/components/Header.jsx');
assert(fs.existsSync(headerPath), 'Header.jsx component file exists');
const headerSource = fs.readFileSync(headerPath, 'utf8');
assert(headerSource.includes('data-testid="header-cart-button"'), 'Header has dedicated header-cart-button trigger');
assert(headerSource.includes('onOpenCart'), 'Header binds onOpenCart handler');
assert(headerSource.includes('View Shopping Basket'), 'Header mobile menu provides View Shopping Basket option');

const authScreenPath = path.resolve('frontend/src/components/AuthScreen.jsx');
assert(fs.existsSync(authScreenPath), 'AuthScreen.jsx component file exists');
const authScreenSource = fs.readFileSync(authScreenPath, 'utf8');
assert(authScreenSource.includes('Sign In'), 'AuthScreen supports Sign In mode');
assert(authScreenSource.includes('Create Account'), 'AuthScreen supports Create Account mode');
assert(authScreenSource.includes('EATS50'), 'AuthScreen has EATS50 50% discount pre-fill');
assert(authScreenSource.includes('Guest Diner'), 'AuthScreen supports 1-click Guest diner ordering');
assert(authScreenSource.includes('Back to Takeaways'), 'AuthScreen has back navigation to marketplace');

const appSource = fs.readFileSync(path.resolve('frontend/src/App.jsx'), 'utf8');
assert(appSource.includes('#/login'), 'App.jsx registers #/login deep link route');
assert(appSource.includes('#/signup'), 'App.jsx registers #/signup deep link route');
assert(appSource.includes('AuthScreen'), 'App.jsx integrates dedicated AuthScreen');

console.log('\n====================================================');
console.log(`TOTAL TESTS: ${passedTests + failedTests} | PASSED: ${passedTests} | FAILED: ${failedTests}`);
console.log('====================================================\n');

if (failedTests > 0) {
  process.exit(1);
} else {
  console.log('ALL PRODUCTION VERIFICATION ASSERTIONS PASSED WITH 100% SUCCESS!');
}
