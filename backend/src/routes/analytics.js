const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getSummary, getRevenue, getBestsellers, getCategoryRevenue } = require('../controllers/analyticsController');

router.get('/summary', protect, adminOnly, getSummary);
router.get('/revenue', protect, adminOnly, getRevenue);
router.get('/bestsellers', protect, adminOnly, getBestsellers);
router.get('/categories', protect, adminOnly, getCategoryRevenue);

module.exports = router;
