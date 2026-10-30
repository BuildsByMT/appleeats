// backend/src/routes/admin.js
// Apple Eats - Locked & Stealth Admin Controller
// Note: This route is NOT linked anywhere in public customer navigation.

const express = require('express');
const router = express.Router();
const { restaurants } = require('../data/seedData');
const { adminSecurityGuard } = require('../middleware/authGuard');
const { authLimiter } = require('../middleware/rateLimiter');

// In-memory takeaway application queue
const partnerApplications = [
  {
    id: "app-stk-101",
    takeawayName: "Potteries Balti House",
    cuisineType: "Indian & Balti",
    address: "24 Snow Hill, Shelton, Stoke-on-Trent, ST1 4LY",
    contactName: "Tariq Mahmood",
    phone: "01782283921",
    fhrsRating: 5,
    status: "pending",
    commissionRate: 12.0,
    documents: [
      { type: "Food Hygiene Certificate", url: "/docs/fhrs-cert.pdf" },
      { type: "Council Takeaway License", url: "/docs/license.pdf" }
    ],
    submittedAt: new Date(Date.now() - 48 * 3600000).toISOString()
  }
];

// Apply rate limiting and zero-trust admin guard
router.use(authLimiter);
router.use(adminSecurityGuard);

// GET /api/v1/ops/applications - List pending onboarding applications
router.get('/applications', (req, res) => {
  res.json({
    success: true,
    data: partnerApplications
  });
});

// PATCH /api/v1/ops/applications/:id/decide - Approve or Reject takeaway
router.patch('/applications/:id/decide', (req, res) => {
  const { id } = req.params;
  const { decision, notes } = req.body;

  if (!decision || !['approved', 'rejected'].includes(decision)) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'INVALID_DECISION',
        message: "Decision must be either 'approved' or 'rejected'."
      }
    });
  }

  const app = partnerApplications.find(a => a.id === id);
  if (!app) {
    return res.status(404).json({
      success: false,
      error: { code: 'APPLICATION_NOT_FOUND', message: 'Application not found' }
    });
  }

  app.status = decision;
  app.reviewNotes = notes ? String(notes).trim().slice(0, 500) : null;
  app.decidedAt = new Date().toISOString();

  res.json({
    success: true,
    data: app
  });
});

// GET /api/v1/ops/commission-rates - Overview of commission matrix
router.get('/commission-rates', (req, res) => {
  const rates = restaurants.map(r => ({
    restaurantId: r.id,
    name: r.name,
    isClientOwned: Boolean(r.isClientOwned),
    commissionRatePercent: r.isClientOwned ? 0.0 : 12.0
  }));

  res.json({
    success: true,
    data: rates
  });
});

module.exports = router;
