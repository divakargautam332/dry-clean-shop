const express = require('express');
const router = express.Router();
const {
    getCoupons,
    getActiveCoupons,
    getCouponById,
    validateCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponStats
} = require('../controllers/couponController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/active', getActiveCoupons);
router.post('/validate', protect, validateCoupon);

// Admin only routes
router.get('/', protect, adminOnly, getCoupons);
router.post('/', protect, adminOnly, createCoupon);
router.get('/:id/stats', protect, adminOnly, getCouponStats);
router.put('/:id/toggle', protect, adminOnly, toggleCouponStatus);
router.route('/:id')
    .get(protect, adminOnly, getCouponById)
    .put(protect, adminOnly, updateCoupon)
    .delete(protect, adminOnly, deleteCoupon);

module.exports = router;