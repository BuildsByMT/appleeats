// Restaurants & Takeaways Routing (Stoke-on-Trent)
const express = require('express');
const router = express.Router();
const { restaurants } = require('../data/seedData');

// GET /api/v1/restaurants - List & filter takeaways
router.get('/', (req, res) => {
  const { postcode, fulfillment, cuisine, search } = req.query;

  let filtered = [...restaurants];

  // Postcode filter (ST1 - ST12)
  if (postcode) {
    const formattedPostcode = postcode.toUpperCase().trim();
    filtered = filtered.filter(r => 
      r.deliverySettings.allowedPostcodes.some(p => formattedPostcode.startsWith(p))
    );
  }

  // Fulfillment filter (delivery vs collection)
  if (fulfillment === 'collection') {
    filtered = filtered.filter(r => r.supportsCollection);
  } else if (fulfillment === 'delivery') {
    filtered = filtered.filter(r => r.supportsDelivery);
  }

  // Cuisine filter
  if (cuisine && cuisine.toLowerCase() !== 'all') {
    filtered = filtered.filter(r => 
      r.cuisineTypes.some(c => c.toLowerCase() === cuisine.toLowerCase())
    );
  }

  // Search filter
  if (search) {
    const q = search.toLowerCase();
    filtered = filtered.filter(r => 
      r.name.toLowerCase().includes(q) ||
      r.cuisineTypes.some(c => c.toLowerCase().includes(q)) ||
      r.categories.some(cat => cat.items.some(item => item.name.toLowerCase().includes(q)))
    );
  }

  res.json({
    success: true,
    data: filtered,
    total: filtered.length
  });
});

// GET /api/v1/restaurants/:slug - Fetch full takeaway profile and menu
router.get('/:slug', (req, res) => {
  const { slug } = req.params;
  const restaurant = restaurants.find(r => r.slug === slug || r.id === slug);

  if (!restaurant) {
    return res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Takeaway not found in Stoke-on-Trent' }
    });
  }

  res.json({
    success: true,
    data: restaurant
  });
});

// GET /api/v1/restaurants/:id/items/:itemId - Get single dish with customization groups
router.get('/:id/items/:itemId', (req, res) => {
  const { id, itemId } = req.params;
  const restaurant = restaurants.find(r => r.slug === id || r.id === id);

  if (!restaurant) {
    return res.status(404).json({ success: false, error: { message: 'Takeaway not found' } });
  }

  let foundItem = null;
  for (const cat of restaurant.categories) {
    const it = cat.items.find(i => i.id === itemId);
    if (it) {
      foundItem = it;
      break;
    }
  }

  if (!foundItem) {
    return res.status(404).json({ success: false, error: { message: 'Menu item not found' } });
  }

  res.json({
    success: true,
    data: foundItem
  });
});

module.exports = router;
