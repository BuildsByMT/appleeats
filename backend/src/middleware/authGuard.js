// backend/src/middleware/authGuard.js
const crypto = require('crypto');

const JWT_SECRET = process.env.JWT_SECRET || 'apple_eats_uk_jwt_secret_stoke_2026';
const SECRET_ADMIN_KEY = process.env.APPLE_EATS_ADMIN_KEY || 'ae_ops_stk_secret_99812';
const KITCHEN_SECRET_KEY = process.env.APPLE_EATS_KITCHEN_KEY || 'ae_kitchen_stk_live_4491';

/**
 * Constant-time string comparison preventing timing attack vulnerabilities
 */
function timingSafeCompare(provided, expected) {
  if (typeof provided !== 'string' || typeof expected !== 'string') {
    return false;
  }
  const provBuf = Buffer.from(provided);
  const expBuf = Buffer.from(expected);

  if (provBuf.length !== expBuf.length) {
    // Constant time dummy check to prevent timing leaks on length
    crypto.timingSafeEqual(expBuf, expBuf);
    return false;
  }

  return crypto.timingSafeEqual(provBuf, expBuf);
}

/**
 * Native cryptographic JWT implementation (Zero external dependency)
 */
function signJwt(payload, expiresInSeconds = 3600) {
  const header = { alg: 'HS256', typ: 'JWT' };
  const now = Math.floor(Date.now() / 1000);
  const claims = {
    ...payload,
    iat: now,
    exp: now + expiresInSeconds,
    iss: 'apple-eats-api',
    aud: 'apple-eats-client'
  };

  const b64Header = Buffer.from(JSON.stringify(header)).toString('base64url');
  const b64Payload = Buffer.from(JSON.stringify(claims)).toString('base64url');
  const signature = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  return `${b64Header}.${b64Payload}.${signature}`;
}

function verifyJwt(token) {
  if (!token || typeof token !== 'string') {
    return { valid: false, error: 'Token missing' };
  }

  const parts = token.split('.');
  if (parts.length !== 3) {
    return { valid: false, error: 'Malformed token structure' };
  }

  const [b64Header, b64Payload, signature] = parts;
  const expectedSig = crypto
    .createHmac('sha256', JWT_SECRET)
    .update(`${b64Header}.${b64Payload}`)
    .digest('base64url');

  if (!timingSafeCompare(signature, expectedSig)) {
    return { valid: false, error: 'Invalid token signature' };
  }

  try {
    const claims = JSON.parse(Buffer.from(b64Payload, 'base64url').toString('utf8'));
    const now = Math.floor(Date.now() / 1000);
    if (claims.exp && now > claims.exp) {
      return { valid: false, error: 'Token has expired' };
    }
    return { valid: true, claims };
  } catch (err) {
    return { valid: false, error: 'Invalid payload encoding' };
  }
}

/**
 * Stealth Admin Guard:
 * Accepts ONLY header 'x-apple-eats-admin-key'
 * Explicitly rejects query parameters (req.query.adminKey) to prevent token leaks in URLs and access logs
 */
function adminSecurityGuard(req, res, next) {
  // Reject tokens passed in query parameters for OWASP compliance
  if (req.query && req.query.adminKey) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INSECURE_AUTH_TRANSPORT',
        message: 'Admin security key must be provided in x-apple-eats-admin-key header, never in URL query parameters.'
      }
    });
  }

  const providedKey = req.headers['x-apple-eats-admin-key'];

  if (!providedKey || !timingSafeCompare(providedKey, SECRET_ADMIN_KEY)) {
    // Return standard 404 to avoid disclosing endpoint existence to unauthorized scanners
    return res.status(404).json({
      success: false,
      error: {
        code: 'ROUTE_NOT_FOUND',
        message: 'Route not found'
      }
    });
  }

  req.user = { role: 'admin', authorizedAt: new Date().toISOString() };
  next();
}

/**
 * Kitchen OMS Queue Guard:
 * Authorizes kitchen tablets and display monitors
 */
function kitchenSecurityGuard(req, res, next) {
  const authHeader = req.headers['authorization'];
  const kitchenHeaderKey = req.headers['x-apple-eats-kitchen-key'];

  // Check Bearer JWT
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);
    const result = verifyJwt(token);
    if (result.valid && (result.claims.role === 'kitchen' || result.claims.role === 'admin')) {
      req.user = result.claims;
      return next();
    }
  }

  // Check static hardware key
  if (kitchenHeaderKey && timingSafeCompare(kitchenHeaderKey, KITCHEN_SECRET_KEY)) {
    req.user = { role: 'kitchen', restaurantId: req.query.restaurantId || 'all' };
    return next();
  }

  // In test / development environment without keys, allow with demo kitchen context
  if (process.env.NODE_ENV === 'test' || !process.env.NODE_ENV) {
    req.user = { role: 'kitchen', restaurantId: req.query.restaurantId || 'rest-go-grill' };
    return next();
  }

  return res.status(401).json({
    success: false,
    error: {
      code: 'UNAUTHORIZED_KITCHEN_TERMINAL',
      message: 'Kitchen terminal authorization required. Provide valid Bearer token or x-apple-eats-kitchen-key header.'
    }
  });
}

module.exports = {
  timingSafeCompare,
  signJwt,
  verifyJwt,
  adminSecurityGuard,
  kitchenSecurityGuard,
  JWT_SECRET,
  SECRET_ADMIN_KEY,
  KITCHEN_SECRET_KEY
};
