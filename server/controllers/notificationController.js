const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    Get user notifications
// @route   GET /api/notifications
// @access  Private
const getNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const result = await Notification.getUserNotifications(
            req.user._id,
            parseInt(limit),
            (parseInt(page) - 1) * parseInt(limit)
        );

        res.json({
            success: true,
            data: result.notifications,
            unreadCount: result.unreadCount,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: result.hasMore
            }
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark notification as read
// @route   PUT /api/notifications/:id/read
// @access  Private
const markAsRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        await notification.markAsRead();

        res.json({
            success: true,
            message: 'Notification marked as read'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark all notifications as read
// @route   PUT /api/notifications/read-all
// @access  Private
const markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany(
            { user: req.user._id, isRead: false },
            { isRead: true, readAt: new Date() }
        );

        res.json({
            success: true,
            message: 'All notifications marked as read'
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete notification
// @route   DELETE /api/notifications/:id
// @access  Private
const deleteNotification = async (req, res) => {
    try {
        const notification = await Notification.findOneAndDelete({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        res.json({
            success: true,
            message: 'Notification deleted successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get unread notification count
// @route   GET /api/notifications/unread-count
// @access  Private
const getUnreadCount = async (req, res) => {
    try {
        const count = await Notification.getUnreadCount(req.user._id);

        res.json({
            success: true,
            data: { count }
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// ============= ADMIN FUNCTIONS =============

// @desc    Send bulk notification to users
// @route   POST /api/notifications/bulk
// @access  Private/Admin
const sendBulkNotification = async (req, res) => {
    try {
        const { title, message, type, userFilter, priority = 'medium' } = req.body;

        if (!title || !message) {
            res.status(400);
            throw new Error('Title and message are required');
        }

        // Build user query based on filter
        let userQuery = {};

        if (userFilter === 'customers') {
            userQuery.role = 'customer';
        } else if (userFilter === 'active') {
            userQuery.isActive = true;
        } else if (userFilter === 'inactive') {
            userQuery.isActive = false;
        }

        const users = await User.find(userQuery).select('_id');

        if (users.length === 0) {
            res.status(404);
            throw new Error('No users found matching the filter');
        }

        // Create notifications for all users
        const notifications = users.map(user => ({
            user: user._id,
            title,
            message,
            type: type || 'promotion',
            priority,
            sentVia: { email: false, sms: false, push: true }
        }));

        await Notification.insertMany(notifications);

        res.json({
            success: true,
            message: `Notification sent to ${users.length} users`,
            data: { usersCount: users.length }
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Send notification to specific user
// @route   POST /api/notifications/user/:userId
// @access  Private/Admin
const sendUserNotification = async (req, res) => {
    try {
        const { title, message, type, actionUrl, actionType, actionId } = req.body;
        const { userId } = req.params;

        if (!title || !message) {
            res.status(400);
            throw new Error('Title and message are required');
        }

        const user = await User.findById(userId);
        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        const notification = await Notification.create({
            user: userId,
            title,
            message,
            type: type || 'system',
            actionUrl,
            actionType,
            actionId,
            sentVia: { email: false, sms: false, push: true }
        });

        res.status(201).json({
            success: true,
            message: 'Notification sent successfully',
            data: notification
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all notifications (admin)
// @route   GET /api/notifications/admin/all
// @access  Private/Admin
const getAllNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 50, type, isRead } = req.query;

        let query = {};
        if (type) query.type = type;
        if (isRead !== undefined) query.isRead = isRead === 'true';

        const notifications = await Notification.find(query)
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .skip((parseInt(page) - 1) * parseInt(limit));

        const total = await Notification.countDocuments(query);

        res.json({
            success: true,
            data: notifications,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete old notifications (cleanup)
// @route   DELETE /api/notifications/admin/cleanup
// @access  Private/Admin
const cleanupOldNotifications = async (req, res) => {
    try {
        const { days = 30 } = req.query;
        const result = await Notification.cleanupOldNotifications(parseInt(days));

        res.json({
            success: true,
            message: `Cleaned up ${result.deletedCount} old notifications`,
            data: { deletedCount: result.deletedCount }
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create order notification (internal use)
const createOrderNotification = async (userId, orderId, status) => {
    try {
        const statusMessages = {
            pending: 'Your order has been placed successfully',
            confirmed: 'Your order has been confirmed',
            collected: 'Your items have been collected',
            processing: 'Your order is being processed',
            out_for_delivery: 'Your order is out for delivery',
            delivered: 'Your order has been delivered'
        };

        await Notification.create({
            user: userId,
            title: `Order ${statusMessages[status] ? 'Update' : 'Placed'}`,
            message: statusMessages[status] || `Your order status is now: ${status}`,
            type: 'order',
            actionType: 'order',
            actionId: orderId,
            metadata: { orderId, status }
        });
    } catch (error) {
        console.error('Error creating order notification:', error);
    }
};

// @desc    Create payment notification (internal use)
const createPaymentNotification = async (userId, orderId, status) => {
    try {
        const messages = {
            paid: 'Payment received successfully',
            failed: 'Payment failed. Please try again',
            refunded: 'Payment has been refunded'
        };

        if (messages[status]) {
            await Notification.create({
                user: userId,
                title: `Payment ${status === 'paid' ? 'Success' : 'Update'}`,
                message: messages[status],
                type: 'payment',
                actionType: 'order',
                actionId: orderId,
                metadata: { orderId, paymentStatus: status }
            });
        }
    } catch (error) {
        console.error('Error creating payment notification:', error);
    }
};

// @desc    Create promotional notification (internal use)
const createPromotionalNotification = async (userId, title, message, couponId = null) => {
    try {
        await Notification.create({
            user: userId,
            title,
            message,
            type: 'promotion',
            actionType: couponId ? 'offer' : null,
            actionId: couponId,
            priority: 'high'
        });
    } catch (error) {
        console.error('Error creating promotional notification:', error);
    }
};

module.exports = {
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
    cleanupOldNotifications,

    // Internal functions
    createOrderNotification,
    createPaymentNotification,
    createPromotionalNotification
};