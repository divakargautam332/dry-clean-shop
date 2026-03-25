const express = require('express');
const router = express.Router();
const {
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    changePassword
} = require('../controllers/authController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.post('/register', registerUser);
router.post('/login', loginUser);

// Protected routes (require authentication)
router.route('/profile')
    .get(protect, getUserProfile)
    .put(protect, updateUserProfile);

router.put('/change-password', protect, changePassword);

// Address management
router.route('/address')
    .post(protect, addAddress);

router.route('/address/:addressId')
    .put(protect, updateAddress)
    .delete(protect, deleteAddress);

module.exports = router;