// Apple Eats - Customer Loyalty & Voucher Calculation Engine
// Enforces 50% first-order discount and 5-order £6.99/£10 loyalty voucher rules

const userOrderHistory = new Map(); // In-memory fallback / fast cache

function getUserLoyaltyStatus(userId) {
  if (!userOrderHistory.has(userId)) {
    userOrderHistory.set(userId, {
      completedOrdersCount: 0,
      currentMilestoneStamps: 0,
      earnedVouchers: []
    });
  }
  return userOrderHistory.get(userId);
}

function recordCompletedOrder(userId) {
  const status = getUserLoyaltyStatus(userId);
  status.completedOrdersCount += 1;
  status.currentMilestoneStamps = (status.completedOrdersCount % 5);

  let newVoucherGenerated = null;
  // Every 5th order triggers a £6.99 loyalty voucher milestone!
  if (status.completedOrdersCount > 0 && status.completedOrdersCount % 5 === 0) {
    const voucherCode = `LOYALTY5-${Math.random().toString(36).substring(2, 8).toUpperCase()}`;
    newVoucherGenerated = {
      code: voucherCode,
      amount: 6.99,
      minSpend: 15.00,
      createdAt: new Date().toISOString(),
      expiresAt: new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString(),
      isRedeemed: false
    };
    status.earnedVouchers.push(newVoucherGenerated);
  }

  return {
    completedOrdersCount: status.completedOrdersCount,
    currentMilestoneStamps: status.currentMilestoneStamps,
    stampsNeededForNextReward: 5 - status.currentMilestoneStamps,
    newVoucherGenerated
  };
}

function evaluateCoupon(couponCode, subtotal, isFirstOrder = false) {
  const code = (couponCode || '').toUpperCase().trim();
  
  if (code === 'EATS50') {
    if (!isFirstOrder) {
      return { isValid: false, reason: 'EATS50 is only valid on your first order with Apple Eats' };
    }
    // 50% off capped at £15.00
    const rawDiscount = subtotal * 0.50;
    const discountAmount = Math.min(rawDiscount, 15.00);
    return {
      isValid: true,
      discountAmount,
      description: '50% Off First Order (Capped at £15.00)'
    };
  }

  if (code === 'TREATS') {
    // 30% off on subtotal
    const discountAmount = subtotal * 0.30;
    return {
      isValid: true,
      discountAmount,
      description: '30% Off Feast on Favorites'
    };
  }

  if (code.startsWith('LOYALTY5-')) {
    if (subtotal < 15.00) {
      return { isValid: false, reason: 'Loyalty voucher requires a minimum spend of £15.00' };
    }
    return {
      isValid: true,
      discountAmount: 6.99,
      description: '5-Order Loyalty Reward Voucher (£6.99 Off)'
    };
  }

  return { isValid: false, reason: 'Invalid or expired coupon code' };
}

module.exports = {
  getUserLoyaltyStatus,
  recordCompletedOrder,
  evaluateCoupon
};
