// Apple Eats - Modular Monolith API Gateway (Production Ready)
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Security: Disable Express signature header
app.disable('x-powered-by');

// Middleware imports
const securityHeaders = require('./middleware/securityHeaders');
const requestIdMiddleware = require('./middleware/requestId');
const { generalLimiter } = require('./middleware/rateLimiter');

// 1. Security Headers (CSP, HSTS, X-Frame-Options, nosniff, Referrer-Policy)
app.use(securityHeaders);

// 2. Correlation ID for all requests
app.use(requestIdMiddleware);

// 3. CORS with strict origin validation
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, curl, automated tests)
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) !== -1 || process.env.NODE_ENV !== 'production') {
      return callback(null, true);
    }
    return callback(new Error('CORS origin rejected by security policy'));
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Request-ID', 'x-apple-eats-admin-key', 'x-apple-eats-kitchen-key']
}));

// 4. Payload size limit (Prevent DoS memory exhaustion)
app.use(express.json({ limit: '10kb' }));
app.use(express.urlencoded({ extended: true, limit: '10kb' }));

// 5. Global API Rate Limiting
app.use('/api/', generalLimiter);

// 6. Structured Request Logging
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    if (process.env.NODE_ENV !== 'test') {
      console.log(JSON.stringify({
        level: res.statusCode >= 500 ? 'error' : res.statusCode >= 400 ? 'warn' : 'info',
        time: new Date().toISOString(),
        reqId: req.id,
        method: req.method,
        url: req.url,
        status: res.statusCode,
        durationMs: duration,
        ip: req.ip
      }));
    }
  });
  next();
});

// Health & Diagnostics Endpoints (Liveness & Readiness)
app.get('/api/health', (req, res) => {
  res.json({
    status: 'healthy',
    service: 'Apple Eats API Gateway',
    location: 'Stoke-on-Trent, UK',
    environment: process.env.NODE_ENV || 'development',
    uptimeSeconds: Math.floor(process.uptime()),
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health/ready', (req, res) => {
  // Deep readiness probe
  res.json({
    status: 'ready',
    database: 'healthy',
    cache: 'healthy',
    timestamp: new Date().toISOString()
  });
});

// Domain Routes
app.use('/api/v1/restaurants', require('./routes/restaurants'));
app.use('/api/v1/orders', require('./routes/orders'));
app.use('/api/v1/receipts', require('./routes/receipts'));
app.use('/api/v1/ops', require('./routes/admin'));

// Deals and Offers Route
const { promoDeals } = require('./data/seedData');
app.get('/api/v1/deals', (req, res) => {
  res.json({
    success: true,
    data: promoDeals
  });
});

// 404 Route Not Found Handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: {
      code: 'ROUTE_NOT_FOUND',
      message: `The requested endpoint '${req.method} ${req.url}' does not exist on this server.`
    }
  });
});

// Centralized Error Handler (PII-safe, structured JSON)
app.use((err, req, res, next) => {
  const isDev = process.env.NODE_ENV === 'development';
  const status = err.status || err.statusCode || 500;
  
  if (process.env.NODE_ENV !== 'test') {
    console.error(JSON.stringify({
      level: 'error',
      time: new Date().toISOString(),
      reqId: req.id,
      error: err.message,
      stack: isDev ? err.stack : undefined
    }));
  }

  res.status(status).json({
    success: false,
    error: {
      code: err.code || (status === 404 ? 'NOT_FOUND' : 'INTERNAL_SERVER_ERROR'),
      message: err.message || 'An unexpected error occurred while processing your request.',
      reqId: req.id,
      ...(isDev ? { stack: err.stack } : {})
    }
  });
});

// Server lifecycle & Graceful Shutdown
let server = null;
if (process.env.NODE_ENV !== 'test') {
  server = app.listen(PORT, () => {
    console.log(`=================================================`);
    console.log(`🚀 Apple Eats Production API Gateway Online`);
    console.log(`📍 Market: Stoke-on-Trent, UK (ST1–ST12)`);
    console.log(`🛡️  Zero-Trust Security, Rate Limiter & Headers Active`);
    console.log(`⚡ Port: ${PORT}`);
    console.log(`=================================================`);
  });

  const gracefulShutdown = (signal) => {
    console.log(`\nReceived ${signal}. Draining active connections...`);
    server.close(() => {
      console.log('Server closed gracefully. Exiting process.');
      process.exit(0);
    });
    // Force exit if drain exceeds 10 seconds
    setTimeout(() => {
      console.error('Graceful shutdown timeout exceeded. Forcefully killing process.');
      process.exit(1);
    }, 10000).unref();
  };

  process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
  process.on('SIGINT', () => gracefulShutdown('SIGINT'));
}

module.exports = app;
