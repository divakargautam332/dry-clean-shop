const express = require('express');
const router = express.Router();
const { protect, adminOnly } = require('../middleware/authMiddleware');
const {
    // User functions
    getNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getUnreadCount,

    // Admin functions
    sendBulkNotification,
    sendUserNotification,
    getAllNotifications,
    cleanupOldNotifications
} = require('../controllers/notificationController');

// ============= PROTECTED USER ROUTES =============
// All user routes require authentication
router.use(protect);

// Get user notifications
router.get('/', getNotifications);

// Get unread count
router.get('/unread-count', getUnreadCount);

// Mark all as read
router.put('/read-all', markAllAsRead);

// Mark single as read
router.put('/:id/read', markAsRead);

// Delete notification
router.delete('/:id', deleteNotification);

// ============= ADMIN ONLY ROUTES =============

// Send bulk notification to all users
router.post('/bulk', adminOnly, sendBulkNotification);

// Send notification to specific user
router.post('/user/:userId', adminOnly, sendUserNotification);

// Get all notifications (admin view)
router.get('/admin/all', adminOnly, getAllNotifications);

// Cleanup old notifications
router.delete('/admin/cleanup', adminOnly, cleanupOldNotifications);

module.exports = router;