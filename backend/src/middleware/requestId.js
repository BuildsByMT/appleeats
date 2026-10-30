// backend/src/middleware/requestId.js
const crypto = require('crypto');

function requestIdMiddleware(req, res, next) {
  const incomingId = req.headers['x-request-id'];
  const reqId = (incomingId && typeof incomingId === 'string' && incomingId.length <= 64)
    ? incomingId
    : crypto.randomUUID();

  req.id = reqId;
  res.setHeader('X-Request-ID', reqId);
  next();
}

module.exports = requestIdMiddleware;
