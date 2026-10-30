// backend/src/services/financialEngine.js
// Enterprise Integer-Pence Financial Calculation Engine
// Enforces HMRC Notice 709/1 UK VAT splits, discount bounds, and eliminates IEEE 754 rounding errors

/**
 * Convert pounds float to integer pence (e.g. 39.64 -> 3964p)
 */
function toPence(pounds) {
  if (pounds === null || pounds === undefined || isNaN(Number(pounds))) return 0;
  return Math.round(Number(pounds) * 100);
}

/**
 * Convert integer pence to formatted pounds string (e.g. 3964p -> "39.64")
 */
function toPounds(pence) {
  const safePence = Math.max(0, Math.round(Number(pence) || 0));
  return (safePence / 100).toFixed(2);
}

/**
 * Calculate complete order financials in integer pence
 */
function calculateOrderFinancials({
  items = [],
  fulfillmentType = 'delivery',
  couponDiscountPence = 0,
  restaurantDeliveryFeePence = null
}) {
  let subtotalPence = 0;
  let standardVatPence = 0; // Items subject to 20% VAT (hot food, soft drinks, alcohol)
  let zeroVatPence = 0;     // Cold takeaway food items zero-rated (0% VAT)

  items.forEach(item => {
    const basePricePence = toPence(item.price || item.basePrice || 0);
    let optionsPence = 0;

    if (item.selectedOptions && Array.isArray(item.selectedOptions)) {
      item.selectedOptions.forEach(opt => {
        optionsPence += toPence(opt.priceDelta || 0);
      });
    }

    const itemUnitPence = basePricePence + optionsPence;
    const quantity = Math.max(1, Math.round(Number(item.quantity) || 1));
    const lineTotalPence = itemUnitPence * quantity;

    subtotalPence += lineTotalPence;

    // HMRC Categorization: Most hot prepared takeaway food is standard-rated (20% VAT included)
    if (item.isZeroRated) {
      zeroVatPence += lineTotalPence;
    } else {
      standardVatPence += lineTotalPence;
    }
  });

  const isDelivery = fulfillmentType === 'delivery';
  
  // Delivery Fee: £0.00 for collection; custom or default 99p for delivery
  const deliveryFeePence = isDelivery
    ? (restaurantDeliveryFeePence !== null ? Math.max(0, restaurantDeliveryFeePence) : 99)
    : 0;

  // Platform Service Fee: strictly 50p
  const serviceFeePence = 50;

  // Free Gift Basket Rule: Orders >= £30.00 (3000p) get Strawberry Cheesecake
  const qualifiesForFreeGift = subtotalPence >= 3000;
  const freeGiftDescription = qualifiesForFreeGift ? "Free Gift Strawberry Cheesecake" : null;

  // Discount bound: cannot exceed subtotal
  const safeDiscountPence = Math.min(Math.max(0, couponDiscountPence), subtotalPence);

  // Final Total calculation in integer pence
  const totalPence = Math.max(0, subtotalPence + deliveryFeePence + serviceFeePence - safeDiscountPence);

  // UK VAT Extraction (1/6th of VAT-inclusive standard rated food and fees per HMRC)
  // Delivery & Service charges are standard rated 20%
  const taxableFeesPence = deliveryFeePence + serviceFeePence;
  const totalStandardGrossPence = Math.max(0, standardVatPence - safeDiscountPence) + taxableFeesPence;
  const vatAmountPence = Math.round(totalStandardGrossPence / 6); // 20% VAT from gross = gross * 20/120 = gross / 6
  const netAmountPence = totalPence - vatAmountPence;

  return {
    subtotalPence,
    deliveryFeePence,
    serviceFeePence,
    discountPence: safeDiscountPence,
    totalPence,
    vatAmountPence,
    netAmountPence,
    qualifiesForFreeGift,
    freeGiftDescription,
    formatted: {
      subtotal: `£${toPounds(subtotalPence)}`,
      deliveryFee: deliveryFeePence === 0 ? "FREE" : `£${toPounds(deliveryFeePence)}`,
      serviceFee: `£${toPounds(serviceFeePence)}`,
      discount: safeDiscountPence > 0 ? `£${toPounds(safeDiscountPence)}` : "£0.00",
      total: `£${toPounds(totalPence)}`,
      vatAmount: `£${toPounds(vatAmountPence)}`,
      netAmount: `£${toPounds(netAmountPence)}`
    }
  };
}

module.exports = {
  toPence,
  toPounds,
  calculateOrderFinancials
};
