const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/auth');
const { getProfile, updateProfile, addAddress, deleteAddress, toggleFavourite, getAllUsers } = require('../controllers/userController');

router.get('/profile', protect, getProfile);
router.put('/profile', protect, updateProfile);
router.post('/address', protect, addAddress);
router.delete('/address/:id', protect, deleteAddress);
router.post('/favourite/:itemId', protect, toggleFavourite);
router.get('/', protect, adminOnly, getAllUsers);

module.exports = router;
