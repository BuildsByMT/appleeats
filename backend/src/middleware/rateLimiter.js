// backend/src/middleware/rateLimiter.js
// High-performance in-memory sliding window rate limiter

const stores = new Map();

function createRateLimiter({
  windowMs = 60 * 1000,
  maxRequests = 100,
  tierName = 'standard',
  keyGenerator = (req) => req.ip || req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown'
} = {}) {
  const store = new Map();
  stores.set(tierName, store);

  // Periodic cleanup of expired entries every 2 minutes
  const cleanupInterval = setInterval(() => {
    const now = Date.now();
    for (const [key, record] of store.entries()) {
      if (now > record.resetTime) {
        store.delete(key);
      }
    }
  }, 2 * 60 * 1000);
  cleanupInterval.unref();

  return function rateLimitMiddleware(req, res, next) {
    // Skip rate limiting in automated test environment if requested
    if (process.env.NODE_ENV === 'test' && !process.env.ENFORCE_RATE_LIMITS) {
      return next();
    }

    const key = keyGenerator(req);
    const now = Date.now();

    let record = store.get(key);
    if (!record || now > record.resetTime) {
      record = {
        count: 1,
        resetTime: now + windowMs
      };
      store.set(key, record);
    } else {
      record.count += 1;
    }

    const remaining = Math.max(0, maxRequests - record.count);
    const resetSeconds = Math.ceil((record.resetTime - now) / 1000);

    res.setHeader('RateLimit-Limit', maxRequests);
    res.setHeader('RateLimit-Remaining', remaining);
    res.setHeader('RateLimit-Reset', resetSeconds);
    res.setHeader('RateLimit-Policy', `${maxRequests};w=${Math.ceil(windowMs / 1000)}`);

    if (record.count > maxRequests) {
      res.setHeader('Retry-After', resetSeconds);
      return res.status(429).json({
        success: false,
        error: {
          code: 'RATE_LIMIT_EXCEEDED',
          message: `Too many requests on ${tierName} tier. Please retry in ${resetSeconds} seconds.`,
          retryAfterSeconds: resetSeconds
        }
      });
    }

    next();
  };
}

module.exports = {
  createRateLimiter,
  generalLimiter: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 180, tierName: 'general' }),
  ordersLimiter: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 30, tierName: 'orders' }),
  authLimiter: createRateLimiter({ windowMs: 60 * 1000, maxRequests: 15, tierName: 'auth' })
};
