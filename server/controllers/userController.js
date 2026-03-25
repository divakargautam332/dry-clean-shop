const User = require('../models/User');
const Order = require('../models/Order');
const Review = require('../models/Review');
const Notification = require('../models/Notification');
const { generateToken } = require('../utils/generateToken');

// @desc    Get user dashboard data
// @route   GET /api/user/dashboard
// @access  Private
const getUserDashboard = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        // Get recent orders
        const recentOrders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(5);

        // Get order stats
        const orderStats = await Order.aggregate([
            { $match: { user: req.user._id } },
            {
                $group: {
                    _id: null,
                    totalOrders: { $sum: 1 },
                    totalSpent: { $sum: '$totalAmount' },
                    completedOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'delivered'] }, 1, 0] }
                    },
                    cancelledOrders: {
                        $sum: { $cond: [{ $eq: ['$orderStatus', 'cancelled'] }, 1, 0] }
                    }
                }
            }
        ]);

        // Get unread notifications count
        const unreadNotifications = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        // Get pending reviews count
        const pendingReviews = await Review.countDocuments({
            user: req.user._id,
            isApproved: false
        });

        res.json({
            success: true,
            data: {
                user,
                recentOrders,
                orderStats: orderStats[0] || {
                    totalOrders: 0,
                    totalSpent: 0,
                    completedOrders: 0,
                    cancelledOrders: 0
                },
                unreadNotifications,
                pendingReviews
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

// @desc    Get user orders
// @route   GET /api/user/orders
// @access  Private
const getUserOrders = async (req, res) => {
    try {
        const { status, page = 1, limit = 10 } = req.query;

        let query = { user: req.user._id };

        if (status) {
            query.orderStatus = status;
        }

        const orders = await Order.find(query)
            .populate('items.service', 'name image')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Order.countDocuments(query);

        res.json({
            success: true,
            data: orders,
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

// @desc    Get user notifications
// @route   GET /api/user/notifications
// @access  Private
const getUserNotifications = async (req, res) => {
    try {
        const { page = 1, limit = 20 } = req.query;

        const notifications = await Notification.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const unreadCount = await Notification.countDocuments({
            user: req.user._id,
            isRead: false
        });

        const total = await Notification.countDocuments({ user: req.user._id });

        res.json({
            success: true,
            data: notifications,
            unreadCount,
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

// @desc    Mark notification as read
// @route   PUT /api/user/notifications/:id/read
// @access  Private
const markNotificationRead = async (req, res) => {
    try {
        const notification = await Notification.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!notification) {
            res.status(404);
            throw new Error('Notification not found');
        }

        notification.isRead = true;
        notification.readAt = new Date();
        await notification.save();

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
// @route   PUT /api/user/notifications/read-all
// @access  Private
const markAllNotificationsRead = async (req, res) => {
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

// @desc    Add or update user review
// @route   POST /api/user/reviews
// @access  Private
const addReview = async (req, res) => {
    try {
        const { orderId, serviceId, rating, title, comment } = req.body;

        // Check if order belongs to user and is delivered
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
            orderStatus: 'delivered'
        });

        if (!order) {
            res.status(400);
            throw new Error('You can only review delivered orders');
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            order: orderId,
            service: serviceId,
            user: req.user._id
        });

        if (existingReview) {
            res.status(400);
            throw new Error('You have already reviewed this service');
        }

        const review = await Review.create({
            user: req.user._id,
            order: orderId,
            service: serviceId,
            rating,
            title,
            comment,
            isVerified: true
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user reviews
// @route   GET /api/user/reviews
// @access  Private
const getUserReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('order', 'orderNumber')
            .populate('service', 'name image')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user review
// @route   PUT /api/user/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        review.rating = req.body.rating || review.rating;
        review.title = req.body.title || review.title;
        review.comment = req.body.comment || review.comment;

        await review.save();

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user review
// @route   DELETE /api/user/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get loyalty points and rewards
// @route   GET /api/user/loyalty
// @access  Private
const getLoyaltyInfo = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('loyaltyPoints totalOrders');

        // Calculate next reward tier
        const pointsToNextReward = 100 - (user.loyaltyPoints % 100);
        const availableRewards = Math.floor(user.loyaltyPoints / 100);

        res.json({
            success: true,
            data: {
                points: user.loyaltyPoints,
                totalOrders: user.totalOrders,
                pointsToNextReward,
                availableRewards,
                rewardValue: availableRewards * 50 // ₹50 per 100 points
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

// @desc    Redeem loyalty points
// @route   POST /api/user/loyalty/redeem
// @access  Private
const redeemLoyaltyPoints = async (req, res) => {
    try {
        const { points } = req.body;

        const user = await User.findById(req.user._id);

        if (user.loyaltyPoints < points) {
            res.status(400);
            throw new Error('Insufficient loyalty points');
        }

        user.loyaltyPoints -= points;
        await user.save();

        res.json({
            success: true,
            data: {
                redeemed: points,
                remainingPoints: user.loyaltyPoints,
                discountAmount: points * 0.5 // ₹0.50 per point
            }
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};