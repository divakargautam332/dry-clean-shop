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


// 🔓 Public route
router.get('/track/:orderNumber', trackOrder);


// 🔐 Protected routes
router.route('/')
    .post(protect, createOrder)
    .get(protect, getMyOrders); // ✅ get all orders of logged-in user


// ✅ OPTIONAL (if you want /myorders)
router.get('/myorders', protect, getMyOrders);


// ✅ Specific routes FIRST
router.get('/number/:orderNumber', protect, getOrderByNumber);
router.put('/:id/cancel', protect, cancelOrder);


// ❗ Admin routes
router.put('/:id/status', protect, adminOnly, updateOrderStatus);
router.put('/:id/payment', protect, adminOnly, updatePaymentStatus);


// ❗ ALWAYS LAST (very important)
router.get('/:id', protect, getOrderById);


module.exports = router;