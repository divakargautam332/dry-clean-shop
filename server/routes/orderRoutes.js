const express = require('express');
const router = express.Router();
const {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    trackOrder,
    getOrderByNumber
} = require('../controllers/orderController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public route (track order without auth)
router.get('/track/:orderNumber', trackOrder);

// Protected routes (require authentication)
router.route('/')
    .post(protect, createOrder)
    .get(protect, getMyOrders);

router.get('/number/:orderNumber', protect, getOrderByNumber);
router.put('/:id/cancel', protect, cancelOrder);
router.get('/:id', protect, getOrderById);

// Admin only routes
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, adminOnly, updatePaymentStatus);

module.exports = router;