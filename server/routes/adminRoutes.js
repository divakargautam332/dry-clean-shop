const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUser,
    getAllOrders,
    getAllReviews,
    approveReview,
    replyToReview,
    getSalesReport,
    sendBulkNotification
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);

// Review management
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.post('/reviews/:id/reply', replyToReview);

// Reports
router.get('/reports/sales', getSalesReport);

// Notifications
router.post('/notifications/send', sendBulkNotification);

module.exports = router;