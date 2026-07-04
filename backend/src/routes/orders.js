const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { placeOrder, getMyOrders, getOrder, getAllOrders, updateOrderStatus, verifyPayment } = require('../controllers/orderController');

router.post('/', protect, placeOrder);
router.get('/my', protect, getMyOrders);
router.get('/', protect, adminOnly, getAllOrders);
router.get('/:id', protect, getOrder);
router.patch('/:id/status', protect, adminOnly, updateOrderStatus);
router.post('/:id/verify-payment', protect, verifyPayment);

module.exports = router;
