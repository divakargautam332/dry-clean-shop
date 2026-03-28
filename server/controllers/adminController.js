const User = require('../models/User');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');
const Notification = require('../models/Notification');
const DeliveryStaff = require('../models/DeliveryStaff');

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
        console.error('Dashboard stats error:', error);
        res.status(500).json({
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
        console.error('Get all users error:', error);
        res.status(500).json({
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
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
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
        console.error('Get user by ID error:', error);
        res.status(500).json({
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
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
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
        console.error('Update user error:', error);
        res.status(500).json({
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
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role === 'admin') {
            return res.status(400).json({
                success: false,
                message: 'Cannot delete admin user'
            });
        }

        await user.deleteOne();

        res.json({
            success: true,
            message: 'User removed successfully'
        });
    } catch (error) {
        console.error('Delete user error:', error);
        res.status(500).json({
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
        console.error('Get all orders error:', error);
        res.status(500).json({
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
        console.error('Get all reviews error:', error);
        res.status(500).json({
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
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        review.isApproved = true;
        await review.save();

        res.json({
            success: true,
            message: 'Review approved successfully',
            data: review
        });
    } catch (error) {
        console.error('Approve review error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ✅ FIXED: Reply to review with better error handling
// @desc    Reply to review
// @route   POST /api/admin/reviews/:id/reply
// @access  Private/Admin
const replyToReview = async (req, res) => {
    try {
        const { reply } = req.body;

        console.log('📝 Replying to review:', req.params.id);
        console.log('💬 Reply content:', reply);

        if (!reply || reply.trim() === '') {
            return res.status(400).json({
                success: false,
                message: 'Reply cannot be empty'
            });
        }

        const review = await Review.findById(req.params.id);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: 'Review not found'
            });
        }

        // Update admin reply
        review.adminReply = {
            reply: reply.trim(),
            repliedBy: req.user._id,
            repliedAt: new Date()
        };

        await review.save();
        console.log('✅ Reply added to review:', review._id);

        // Create notification for user (non-blocking)
        try {
            await Notification.create({
                user: review.user,
                title: 'Admin Replied to Your Review',
                message: `Admin responded to your review: "${reply.substring(0, 100)}${reply.length > 100 ? '...' : ''}"`,
                type: 'review',
                actionType: 'review',
                actionId: review._id,
                metadata: { reviewId: review._id }
            });
            console.log('✅ Notification sent to user');
        } catch (notifError) {
            console.error('Notification error (non-critical):', notifError.message);
        }

        res.json({
            success: true,
            message: 'Reply added successfully',
            data: review
        });
    } catch (error) {
        console.error('❌ Reply to review error:', error);
        console.error('Error stack:', error.stack);
        res.status(500).json({
            success: false,
            message: error.message || 'Failed to add reply'
        });
    }
};

// @desc    Get sales report
// @route   GET /api/admin/reports/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

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
        console.error('Get sales report error:', error);
        res.status(500).json({
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
        console.error('Send bulk notification error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// ============= SETTINGS MANAGEMENT =============

// @desc    Get settings
// @route   GET /api/admin/settings
// @access  Private/Admin
const getSettings = async (req, res) => {
    try {
        // You can store settings in a separate collection or return default values
        // For now, return default settings
        const settings = {
            general: {
                shopName: 'DryCleanPro',
                shopEmail: 'dipanshuk565@gmail.com',
                shopPhone: '+91 99584 83887',
                shopAddress: 'E-80/524, Block E, Jhilmil Colony, Delhi, 110095',
                gstNumber: '27ABCDE1234F1Z5',
                businessHours: {
                    monday: '10:00 AM - 9:30 PM',
                    tuesday: '10:00 AM - 9:30 PM',
                    wednesday: '10:00 AM - 9:30 PM',
                    thursday: '10:00 AM - 9:30 PM',
                    friday: '10:00 AM - 9:30 PM',
                    saturday: '10:00 AM - 9:30 PM',
                    sunday: '10:00 AM - 9:30 PM'
                }
            },
            pricing: {
                deliveryCharge: 50,
                freeDeliveryMinOrder: 500,
                expressCharge: 100,
                gstRate: 18,
                loyaltyPointsRate: 1,
                loyaltyPointsRedemption: 0.5
            },
            notifications: {
                emailNotifications: true,
                smsNotifications: false,
                orderConfirmation: true,
                orderStatusUpdate: true,
                promotionalEmails: true,
                adminAlerts: true
            },
            payment: {
                razorpayKeyId: '',
                razorpayKeySecret: '',
                upiId: 'dryclean@okhdfcbank',
                bankName: 'HDFC Bank',
                accountNumber: 'XXXX1234',
                ifscCode: 'HDFC0001234'
            }
        };

        res.json({
            success: true,
            data: settings
        });
    } catch (error) {
        console.error('Get settings error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update settings
// @route   PUT /api/admin/settings
// @access  Private/Admin
const updateSettings = async (req, res) => {
    try {
        // For now, just return success
        // You can implement database storage later
        const settings = req.body;

        console.log('Settings updated:', settings);

        res.json({
            success: true,
            message: 'Settings saved successfully',
            data: settings
        });
    } catch (error) {
        console.error('Update settings error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============= REPORT FUNCTIONS =============

// @desc    Get orders report
// @route   GET /api/admin/reports/orders
// @access  Private/Admin
const getOrdersReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Daily trend
        const dailyTrend = await Order.aggregate([
            { $match: dateFilter },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    orders: { $sum: 1 },
                    amount: { $sum: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        res.json({
            success: true,
            data: {
                ordersByStatus,
                dailyTrend,
                totalOrders: dailyTrend.reduce((sum, day) => sum + day.orders, 0),
                totalAmount: dailyTrend.reduce((sum, day) => sum + day.amount, 0),
                avgProcessingTime: 0
            }
        });
    } catch (error) {
        console.error('Orders report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get services report
// @route   GET /api/admin/reports/services
// @access  Private/Admin
const getServicesReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                'order.createdAt': {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Top services
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
            { $limit: 10 }
        ]);

        // Revenue by category
        const servicesByCategory = await Order.aggregate([
            { $unwind: '$items' },
            {
                $lookup: {
                    from: 'services',
                    localField: 'items.service',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' },
            {
                $group: {
                    _id: '$serviceDetails.category',
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                topServices,
                servicesByCategory,
                serviceRatings: []
            }
        });
    } catch (error) {
        console.error('Services report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get customers report
// @route   GET /api/admin/reports/customers
// @access  Private/Admin
const getCustomersReport = async (req, res) => {
    try {
        // Top customers
        const topCustomers = await Order.aggregate([
            {
                $match: {
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: '$user',
                    totalSpent: { $sum: '$totalAmount' },
                    totalOrders: { $sum: 1 }
                }
            },
            { $sort: { totalSpent: -1 } },
            { $limit: 10 },
            {
                $lookup: {
                    from: 'users',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'userDetails'
                }
            },
            { $unwind: '$userDetails' }
        ]);

        const totalCustomers = await User.countDocuments({ role: 'customer' });

        // Repeat customers count
        const repeatCustomers = await Order.aggregate([
            {
                $group: {
                    _id: '$user',
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    repeatCount: {
                        $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
                    }
                }
            }
        ]);

        const repeatCount = repeatCustomers[0]?.repeatCount || 0;

        res.json({
            success: true,
            data: {
                topCustomers,
                customerRetention: {
                    totalCustomers,
                    oneTime: totalCustomers - repeatCount,
                    repeat: repeatCount,
                    retentionRate: totalCustomers > 0 ? (repeatCount / totalCustomers * 100).toFixed(1) : 0
                }
            }
        });
    } catch (error) {
        console.error('Customers report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get revenue report
// @route   GET /api/admin/reports/revenue
// @access  Private/Admin
const getRevenueReport = async (req, res) => {
    try {
        const { startDate, endDate } = req.query;

        let dateFilter = {};
        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        const revenue = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: null,
                    totalRevenue: { $sum: '$totalAmount' },
                    subtotal: { $sum: '$subtotal' },
                    gst: { $sum: '$gst' },
                    deliveryCharges: { $sum: '$deliveryCharge' },
                    expressCharges: { $sum: '$expressCharge' },
                    discounts: { $sum: '$discount' }
                }
            }
        ]);

        // Monthly trend
        const monthlyTrend = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m', date: '$createdAt' } },
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 12 }
        ]);

        res.json({
            success: true,
            data: {
                summary: revenue[0] || {
                    totalRevenue: 0,
                    subtotal: 0,
                    gst: 0,
                    deliveryCharges: 0,
                    expressCharges: 0,
                    discounts: 0
                },
                monthlyTrend
            }
        });
    } catch (error) {
        console.error('Revenue report error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// ============= COUPON MANAGEMENT =============

// @desc    Get all coupons
// @route   GET /api/admin/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    try {
        const coupons = await Coupon.find({}).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error('Get coupons error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create coupon
// @route   POST /api/admin/coupons
// @access  Private/Admin
const createCoupon = async (req, res) => {
    try {
        const {
            code,
            name,
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount,
            validFrom,
            validTill,
            usageLimit,
            perUserLimit,
            applicableFor,
            applicableServices,
            applicableCategories,
            isActive,
            isFeatured,
            userSpecific
        } = req.body;

        // Check if coupon already exists
        const couponExists = await Coupon.findOne({ code: code.toUpperCase() });
        if (couponExists) {
            return res.status(400).json({
                success: false,
                message: 'Coupon code already exists'
            });
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            name,
            description,
            discountType,
            discountValue,
            maxDiscount: maxDiscount || null,
            minOrderAmount: minOrderAmount || 0,
            validFrom: validFrom || new Date(),
            validTill,
            usageLimit: usageLimit || null,
            perUserLimit: perUserLimit || 1,
            applicableFor: applicableFor || 'all',
            applicableServices: applicableServices || [],
            applicableCategories: applicableCategories || [],
            isActive: isActive !== undefined ? isActive : true,
            isFeatured: isFeatured || false,
            userSpecific: userSpecific || []
        });

        res.status(201).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        console.error('Create coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update coupon
// @route   PUT /api/admin/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        coupon.code = req.body.code ? req.body.code.toUpperCase() : coupon.code;
        coupon.name = req.body.name || coupon.name;
        coupon.description = req.body.description || coupon.description;
        coupon.discountType = req.body.discountType || coupon.discountType;
        coupon.discountValue = req.body.discountValue || coupon.discountValue;
        coupon.maxDiscount = req.body.maxDiscount !== undefined ? req.body.maxDiscount : coupon.maxDiscount;
        coupon.minOrderAmount = req.body.minOrderAmount !== undefined ? req.body.minOrderAmount : coupon.minOrderAmount;
        coupon.validFrom = req.body.validFrom || coupon.validFrom;
        coupon.validTill = req.body.validTill || coupon.validTill;
        coupon.usageLimit = req.body.usageLimit !== undefined ? req.body.usageLimit : coupon.usageLimit;
        coupon.perUserLimit = req.body.perUserLimit || coupon.perUserLimit;
        coupon.applicableFor = req.body.applicableFor || coupon.applicableFor;
        coupon.applicableServices = req.body.applicableServices || coupon.applicableServices;
        coupon.applicableCategories = req.body.applicableCategories || coupon.applicableCategories;
        coupon.isActive = req.body.isActive !== undefined ? req.body.isActive : coupon.isActive;
        coupon.isFeatured = req.body.isFeatured !== undefined ? req.body.isFeatured : coupon.isFeatured;
        coupon.userSpecific = req.body.userSpecific || coupon.userSpecific;

        const updatedCoupon = await coupon.save();

        res.json({
            success: true,
            data: updatedCoupon
        });
    } catch (error) {
        console.error('Update coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/admin/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        await coupon.deleteOne();

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        console.error('Delete coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle coupon status (active/inactive)
// @route   PUT /api/admin/coupons/:id/toggle
// @access  Private/Admin
const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({
            success: true,
            data: coupon,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        console.error('Toggle coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get coupon stats (usage details)
// @route   GET /api/admin/coupons/:id/stats
// @access  Private/Admin
const getCouponStats = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Coupon not found'
            });
        }

        // Get orders using this coupon
        const orders = await Order.find({ couponCode: coupon.code })
            .populate('user', 'name email')
            .sort({ createdAt: -1 });

        const totalDiscountGiven = orders.reduce((sum, order) => sum + order.discount, 0);
        const totalRevenueFromCoupon = orders.reduce((sum, order) => sum + order.totalAmount, 0);

        res.json({
            success: true,
            data: {
                coupon,
                stats: {
                    usedCount: coupon.usedCount,
                    totalOrders: orders.length,
                    totalDiscountGiven,
                    totalRevenueFromCoupon,
                    averageDiscount: orders.length > 0 ? totalDiscountGiven / orders.length : 0,
                    orders
                }
            }
        });
    } catch (error) {
        console.error('Get coupon stats error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get active coupons for customers
// @route   GET /api/coupons/active
// @access  Public
const getActiveCoupons = async (req, res) => {
    try {
        const now = new Date();

        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validTill: { $gte: now }
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            data: coupons
        });
    } catch (error) {
        console.error('Get active coupons error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Validate coupon
// @route   POST /api/coupons/validate
// @access  Private
const validateCoupon = async (req, res) => {
    try {
        const { code, orderAmount } = req.body;

        const coupon = await Coupon.findOne({ code: code.toUpperCase() });

        if (!coupon) {
            return res.status(404).json({
                success: false,
                message: 'Invalid coupon code'
            });
        }

        const validation = coupon.isValid(req.user._id, orderAmount);

        if (!validation.valid) {
            return res.status(400).json({
                success: false,
                message: validation.message
            });
        }

        const discount = coupon.calculateDiscount(orderAmount);

        res.json({
            success: true,
            data: {
                coupon,
                discount,
                message: validation.message
            }
        });
    } catch (error) {
        console.error('Validate coupon error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// ============= DELIVERY STAFF MANAGEMENT =============

// @desc    Get all delivery staff
// @route   GET /api/admin/delivery-staff
// @access  Private/Admin
const getDeliveryStaff = async (req, res) => {
    try {
        const { isAvailable, isActive, search } = req.query;

        let query = {};

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
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

        const staff = await DeliveryStaff.find(query)
            .select('-password')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: staff,
            count: staff.length
        });
    } catch (error) {
        console.error('Get delivery staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get delivery staff by ID
// @route   GET /api/admin/delivery-staff/:id
// @access  Private/Admin
const getDeliveryStaffById = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id).select('-password');

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Delivery staff not found'
            });
        }

        // Get assigned orders
        const assignedOrders = await Order.find({
            deliveryPartner: staff._id,
            orderStatus: { $in: ['out_for_delivery', 'pickup_assigned'] }
        });

        // Get delivery history
        const deliveryHistory = await Order.find({
            deliveryPartner: staff._id,
            orderStatus: 'delivered'
        }).sort({ createdAt: -1 }).limit(20);

        res.json({
            success: true,
            data: {
                staff,
                assignedOrders,
                deliveryHistory,
                currentWorkload: staff.currentWorkload
            }
        });
    } catch (error) {
        console.error('Get delivery staff by ID error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create delivery staff
// @route   POST /api/admin/delivery-staff
// @access  Private/Admin
const createDeliveryStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address,
            city,
            pincode,
            vehicleType,
            vehicleNumber,
            drivingLicense,
            workSchedule,
            preferredArea,
            isAvailable,
            isActive
        } = req.body;

        // Check if staff already exists
        const staffExists = await DeliveryStaff.findOne({ $or: [{ email }, { phone }] });
        if (staffExists) {
            return res.status(400).json({
                success: false,
                message: 'Staff with this email or phone already exists'
            });
        }

        // Hash password
        const bcrypt = require('bcryptjs');
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = await DeliveryStaff.create({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            city,
            pincode,
            vehicleType: vehicleType || 'bike',
            vehicleNumber,
            drivingLicense,
            workSchedule: workSchedule || {
                monday: { start: '09:00', end: '18:00', isWorking: true },
                tuesday: { start: '09:00', end: '18:00', isWorking: true },
                wednesday: { start: '09:00', end: '18:00', isWorking: true },
                thursday: { start: '09:00', end: '18:00', isWorking: true },
                friday: { start: '09:00', end: '18:00', isWorking: true },
                saturday: { start: '09:00', end: '18:00', isWorking: true },
                sunday: { start: '09:00', end: '18:00', isWorking: false }
            },
            preferredArea: preferredArea || [],
            isAvailable: isAvailable !== undefined ? isAvailable : true,
            isActive: isActive !== undefined ? isActive : true
        });

        res.status(201).json({
            success: true,
            data: staff,
            message: 'Delivery staff created successfully'
        });
    } catch (error) {
        console.error('Create delivery staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update delivery staff
// @route   PUT /api/admin/delivery-staff/:id
// @access  Private/Admin
const updateDeliveryStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Delivery staff not found'
            });
        }

        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.phone = req.body.phone || staff.phone;
        staff.address = req.body.address || staff.address;
        staff.city = req.body.city || staff.city;
        staff.pincode = req.body.pincode || staff.pincode;
        staff.vehicleType = req.body.vehicleType || staff.vehicleType;
        staff.vehicleNumber = req.body.vehicleNumber || staff.vehicleNumber;
        staff.drivingLicense = req.body.drivingLicense || staff.drivingLicense;
        staff.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : staff.isAvailable;
        staff.isActive = req.body.isActive !== undefined ? req.body.isActive : staff.isActive;
        staff.workSchedule = req.body.workSchedule || staff.workSchedule;
        staff.preferredArea = req.body.preferredArea || staff.preferredArea;

        if (req.body.password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            staff.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedStaff = await staff.save();

        res.json({
            success: true,
            data: updatedStaff,
            message: 'Delivery staff updated successfully'
        });
    } catch (error) {
        console.error('Update delivery staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete delivery staff
// @route   DELETE /api/admin/delivery-staff/:id
// @access  Private/Admin
const deleteDeliveryStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Delivery staff not found'
            });
        }

        await staff.deleteOne();

        res.json({
            success: true,
            message: 'Delivery staff deleted successfully'
        });
    } catch (error) {
        console.error('Delete delivery staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update staff availability
// @route   PUT /api/admin/delivery-staff/:id/availability
// @access  Private/Admin
const updateStaffAvailability = async (req, res) => {
    try {
        const { isAvailable } = req.body;
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Delivery staff not found'
            });
        }

        staff.isAvailable = isAvailable;
        await staff.save();

        res.json({
            success: true,
            data: staff,
            message: `Staff marked ${isAvailable ? 'available' : 'unavailable'}`
        });
    } catch (error) {
        console.error('Update staff availability error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign order to staff
// @route   POST /api/admin/delivery-staff/assign
// @access  Private/Admin
const assignOrderToStaff = async (req, res) => {
    try {
        const { orderId, staffId } = req.body;

        const order = await Order.findById(orderId);
        const staff = await DeliveryStaff.findById(staffId);

        if (!order) {
            return res.status(404).json({
                success: false,
                message: 'Order not found'
            });
        }

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }

        // Check if staff can take more orders
        if (!staff.canTakeMoreOrders) {
            return res.status(400).json({
                success: false,
                message: 'Staff cannot take more orders at this time'
            });
        }

        // Assign order to staff
        order.deliveryPartner = staff._id;
        order.orderStatus = 'pickup_assigned';
        order.statusHistory.push({
            status: 'pickup_assigned',
            note: `Assigned to delivery staff: ${staff.name}`,
            updatedBy: req.user._id
        });
        await order.save();

        // Add to staff's assigned orders
        staff.assignedOrders.push({
            order: order._id,
            assignedAt: new Date(),
            status: 'assigned'
        });
        await staff.save();

        res.json({
            success: true,
            message: `Order ${order.orderNumber} assigned to ${staff.name}`,
            data: { order, staff }
        });
    } catch (error) {
        console.error('Assign order to staff error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get staff assigned orders
// @route   GET /api/admin/delivery-staff/:id/orders
// @access  Private/Admin
const getStaffAssignedOrders = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            return res.status(404).json({
                success: false,
                message: 'Staff not found'
            });
        }

        const orders = await Order.find({ deliveryPartner: staff._id })
            .sort({ createdAt: -1 })
            .populate('user', 'name email phone');

        res.json({
            success: true,
            data: orders,
            count: orders.length
        });
    } catch (error) {
        console.error('Get staff orders error:', error);
        res.status(500).json({
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
    sendBulkNotification,


    //coupon
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getSettings,
    updateSettings,

    // report 

    getOrdersReport,
    getServicesReport,
    getCustomersReport,
    getRevenueReport,


    //deliverystaff

    getDeliveryStaff,
    getDeliveryStaffById,
    createDeliveryStaff,
    updateDeliveryStaff,
    deleteDeliveryStaff,
    updateStaffAvailability,
    assignOrderToStaff,
    getStaffAssignedOrders
};