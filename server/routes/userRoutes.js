const express = require('express');
const router = express.Router();
const {
    getUserDashboard,
    getUserOrders,
    getUserNotifications,
    markNotificationRead,
    markAllNotificationsRead,
    addReview,
    getUserReviews,
    updateReview,
    deleteReview,
    getLoyaltyInfo,
    redeemLoyaltyPoints
} = require('../controllers/userController');
const { protect } = require('../middleware/authMiddleware');

// All user routes require authentication
router.use(protect);

// Dashboard
router.get('/dashboard', getUserDashboard);

// Orders
router.get('/orders', getUserOrders);

// Notifications
router.get('/notifications', getUserNotifications);
router.put('/notifications/read-all', markAllNotificationsRead);
router.put('/notifications/:id/read', markNotificationRead);

// Reviews
router.get('/reviews', getUserReviews);
router.post('/reviews', addReview);
router.put('/reviews/:id', updateReview);
router.delete('/reviews/:id', deleteReview);

// Loyalty
router.get('/loyalty', getLoyaltyInfo);
router.post('/loyalty/redeem', redeemLoyaltyPoints);

module.exports = router;