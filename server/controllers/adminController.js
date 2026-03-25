const User = require('../models/User');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');

// @desc    Get dashboard stats
// @route   GET /api/admin/stats
// @access  Private/Admin
const getDashboardStats = async (req, res) => {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
        const startOfWeek = new Date(today);
        startOfWeek.setDate(today.getDate() - today.getDay());

        // Get all counts
        const totalUsers = await User.countDocuments({ role: 'customer' });
        const totalOrders = await Order.countDocuments();
        const totalServices = await Service.countDocuments();
        const totalReviews = await Review.countDocuments();

        const pendingOrders = await Order.countDocuments({
            orderStatus: { $in: ['pending', 'confirmed', 'pickup_assigned'] }
        });

        // Get today's orders
        const todayOrders = await Order.countDocuments({
            createdAt: { $gte: today }
        });

        // Get revenue stats
        const revenueStats = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    todayRevenue: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', today] },
                                '$totalAmount',
                                0
                            ]
                        }
                    },
                    weeklyRevenue: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', startOfWeek] },
                                '$totalAmount',
                                0
                            ]
                        }
                    },
                    monthlyRevenue: {
                        $sum: {
                            $cond: [
                                { $gte: ['$createdAt', startOfMonth] },
                                '$totalAmount',
                                0
                            ]
                        }
                    }
                }
            }
        ]);

        // Get recent orders
        const recentOrders = await Order.find()
            .populate('user', 'name email')
            .sort({ createdAt: -1 })
            .limit(10);

        // Get top services
        const topServices = await Order.aggregate([
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.serviceName',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 5 }
        ]);

        // Get order status distribution
        const orderStatusDistribution = await Order.aggregate([
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalUsers,
                totalOrders,
                totalServices,
                totalReviews,
                pendingOrders,
                todayOrders,
                revenue: revenueStats[0] || { totalRevenue: 0, todayRevenue: 0, weeklyRevenue: 0, monthlyRevenue: 0 },
                recentOrders,
                topServices,
                orderStatusDistribution
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

// @desc    Get all users
// @route   GET /api/admin/users
// @access  Private/Admin
const getAllUsers = async (req, res) => {
    try {
        const { role, isActive, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (role) {
            query.role = role;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const users = await User.find(query)
            .select('-password')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await User.countDocuments(query);

        res.json({
            success: true,
            data: users,
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

// @desc    Get user by ID
// @route   GET /api/admin/users/:id
// @access  Private/Admin
const getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id).select('-password');

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        // Get user orders
        const orders = await Order.find({ user: user._id }).sort({ createdAt: -1 }).limit(10);

        res.json({
            success: true,
            data: {
                user,
                orders
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

// @desc    Update user (admin)
// @route   PUT /api/admin/users/:id
// @access  Private/Admin
const updateUserByAdmin = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        user.name = req.body.name || user.name;
        user.email = req.body.email || user.email;
        user.phone = req.body.phone || user.phone;
        user.role = req.body.role || user.role;
        user.isActive = req.body.isActive !== undefined ? req.body.isActive : user.isActive;
        user.loyaltyPoints = req.body.loyaltyPoints !== undefined ? req.body.loyaltyPoints : user.loyaltyPoints;

        const updatedUser = await user.save();

        res.json({
            success: true,
            data: updatedUser
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete user
// @route   DELETE /api/admin/users/:id
// @access  Private/Admin
const deleteUser = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            res.status(404);
            throw new Error('User not found');
        }

        if (user.role === 'admin') {
            res.status(400);
            throw new Error('Cannot delete admin user');
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User removed successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get all orders (admin)
// @route   GET /api/admin/orders
// @access  Private/Admin
const getAllOrders = async (req, res) => {
    try {
        const { status, paymentStatus, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (status) {
            query.orderStatus = status;
        }

        if (paymentStatus) {
            query.paymentStatus = paymentStatus;
        }

        if (search) {
            query.$or = [
                { orderNumber: { $regex: search, $options: 'i' } },
                { 'customerDetails.name': { $regex: search, $options: 'i' } },
                { 'customerDetails.phone': { $regex: search, $options: 'i' } }
            ];
        }

        const orders = await Order.find(query)
            .populate('user', 'name email phone')
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

// @desc    Get all reviews (admin)
// @route   GET /api/admin/reviews
// @access  Private/Admin
const getAllReviews = async (req, res) => {
    try {
        const { isApproved, rating, page = 1, limit = 20 } = req.query;

        let query = {};

        if (isApproved !== undefined) {
            query.isApproved = isApproved === 'true';
        }

        if (rating) {
            query.rating = parseInt(rating);
        }

        const reviews = await Review.find(query)
            .populate('user', 'name email')
            .populate('order', 'orderNumber')
            .populate('service', 'name')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments(query);

        res.json({
            success: true,
            data: reviews,
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

// @desc    Approve review
// @route   PUT /api/admin/reviews/:id/approve
// @access  Private/Admin
const approveReview = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        review.isApproved = true;
        await review.save();

        res.json({
            success: true,
            message: 'Review approved successfully',
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

// @desc    Reply to review
// @route   POST /api/admin/reviews/:id/reply
// @access  Private/Admin
const replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        review.adminReply = {
            reply,
            repliedBy: req.user._id,
            repliedAt: new Date()
        };

        await review.save();

        await Notification.create({
            user: review.user,
            title: 'Review Reply',
            message: `Admin replied to your review: "${reply.substring(0, 100)}"`,
            type: 'review',
            actionType: 'review',
            actionId: review._id
        });

        res.json({
            success: true,
            message: 'Reply added successfully',
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

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, period } = req.query;

        let dateFilter = {};

        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        const orders = await Order.find({
            ...dateFilter,
            paymentStatus: 'paid',
            orderStatus: { $ne: 'cancelled' }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Group by date
        const dailyBreakdown = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        res.json({
            success: true,
            data: {
                totalRevenue,
                totalOrders,
                averageOrderValue,
                dailyBreakdown,
                orders
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

// @desc    Send notification to all users
// @route   POST /api/admin/notifications/send
// @access  Private/Admin
const sendBulkNotification = async (req, res) => {
    try {
        const { title, message, type, userFilter } = req.body;

        let query = {};

        if (userFilter === 'customers') {
            query.role = 'customer';
        } else if (userFilter === 'active') {
            query.isActive = true;
        }

        const users = await User.find(query);

        const notifications = users.map(user => ({
            user: user._id,
            title,
            message,
            type: type || 'promotion'
        }));

        await Notification.insertMany(notifications);

        res.json({
            success: true,
            message: `Notification sent to ${users.length} users`
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
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
};