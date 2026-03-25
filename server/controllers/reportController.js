const Order = require('../models/Order');
const User = require('../models/User');
const Service = require('../models/Service');
const Review = require('../models/Review');
const Coupon = require('../models/Coupon');

// @desc    Get sales report
// @route   GET /api/reports/sales
// @access  Private/Admin
const getSalesReport = async (req, res) => {
    try {
        const { startDate, endDate, period = 'daily' } = req.query;

        let dateFilter = {};

        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        // Get orders matching criteria
        const orders = await Order.find({
            ...dateFilter,
            paymentStatus: 'paid',
            orderStatus: { $ne: 'cancelled' }
        });

        const totalRevenue = orders.reduce((sum, order) => sum + order.totalAmount, 0);
        const totalOrders = orders.length;
        const averageOrderValue = totalOrders > 0 ? totalRevenue / totalOrders : 0;

        // Group by period
        let groupFormat;
        switch (period) {
            case 'hourly':
                groupFormat = { $dateToString: { format: '%Y-%m-%d %H:00', date: '$createdAt' } };
                break;
            case 'weekly':
                groupFormat = { $week: '$createdAt' };
                break;
            case 'monthly':
                groupFormat = { $dateToString: { format: '%Y-%m', date: '$createdAt' } };
                break;
            default:
                groupFormat = { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } };
        }

        const breakdown = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: groupFormat,
                    revenue: { $sum: '$totalAmount' },
                    orders: { $sum: 1 },
                    avgOrderValue: { $avg: '$totalAmount' }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Get payment method breakdown
        const paymentBreakdown = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    paymentStatus: 'paid',
                    orderStatus: { $ne: 'cancelled' }
                }
            },
            {
                $group: {
                    _id: '$paymentMethod',
                    count: { $sum: 1 },
                    amount: { $sum: '$totalAmount' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                summary: {
                    totalRevenue,
                    totalOrders,
                    averageOrderValue,
                    period
                },
                breakdown,
                paymentBreakdown,
                orders: orders.slice(0, 100) // Limit orders in report
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

// @desc    Get orders report
// @route   GET /api/reports/orders
// @access  Private/Admin
const getOrdersReport = async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;

        let dateFilter = {};
        let statusFilter = {};

        if (startDate && endDate) {
            dateFilter = {
                createdAt: {
                    $gte: new Date(startDate),
                    $lte: new Date(endDate)
                }
            };
        }

        if (status) {
            statusFilter = { orderStatus: status };
        }

        // Orders by status
        const ordersByStatus = await Order.aggregate([
            { $match: { ...dateFilter, ...statusFilter } },
            {
                $group: {
                    _id: '$orderStatus',
                    count: { $sum: 1 },
                    totalAmount: { $sum: '$totalAmount' }
                }
            }
        ]);

        // Daily order trend
        const dailyTrend = await Order.aggregate([
            { $match: { ...dateFilter, ...statusFilter } },
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

        // Average processing time
        const processingTime = await Order.aggregate([
            {
                $match: {
                    ...dateFilter,
                    orderStatus: 'delivered',
                    'statusHistory.status': 'processing'
                }
            },
            {
                $project: {
                    processingTime: {
                        $subtract: [
                            {
                                $arrayElemAt: [
                                    '$statusHistory.timestamp',
                                    { $indexOfArray: ['$statusHistory.status', 'processing'] }
                                ]
                            },
                            {
                                $arrayElemAt: [
                                    '$statusHistory.timestamp',
                                    { $indexOfArray: ['$statusHistory.status', 'collected'] }
                                ]
                            }
                        ]
                    }
                }
            },
            {
                $group: {
                    _id: null,
                    avgProcessingTime: { $avg: '$processingTime' }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                ordersByStatus,
                dailyTrend,
                avgProcessingTime: processingTime[0]?.avgProcessingTime / (1000 * 60 * 60) || 0, // in hours
                totalOrders: dailyTrend.reduce((sum, day) => sum + day.orders, 0),
                totalAmount: dailyTrend.reduce((sum, day) => sum + day.amount, 0)
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

// @desc    Get services report
// @route   GET /api/reports/services
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

        // Top services by quantity
        const topServices = await Order.aggregate([
            { $match: { ...dateFilter, orderStatus: { $ne: 'cancelled' } } },
            { $unwind: '$items' },
            {
                $group: {
                    _id: '$items.serviceName',
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' },
                    ordersCount: { $sum: 1 }
                }
            },
            { $sort: { totalQuantity: -1 } },
            { $limit: 10 }
        ]);

        // Services by category
        const servicesByCategory = await Order.aggregate([
            { $match: { ...dateFilter, orderStatus: { $ne: 'cancelled' } } },
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
                    totalQuantity: { $sum: '$items.quantity' },
                    totalRevenue: { $sum: '$items.totalPrice' }
                }
            }
        ]);

        // Service ratings
        const serviceRatings = await Review.aggregate([
            {
                $match: {
                    service: { $ne: null },
                    isApproved: true
                }
            },
            {
                $group: {
                    _id: '$service',
                    averageRating: { $avg: '$rating' },
                    totalReviews: { $sum: 1 }
                }
            },
            {
                $lookup: {
                    from: 'services',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'serviceDetails'
                }
            },
            { $unwind: '$serviceDetails' }
        ]);

        res.json({
            success: true,
            data: {
                topServices,
                servicesByCategory,
                serviceRatings,
                totalServices: await Service.countDocuments()
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

// @desc    Get customers report
// @route   GET /api/reports/customers
// @access  Private/Admin
const getCustomersReport = async (req, res) => {
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

        // Customer acquisition over time
        const customerAcquisition = await User.aggregate([
            { $match: { ...dateFilter, role: 'customer' } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
                    newCustomers: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } },
            { $limit: 30 }
        ]);

        // Top customers by order value
        const topCustomers = await Order.aggregate([
            { $match: { paymentStatus: 'paid', orderStatus: { $ne: 'cancelled' } } },
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

        // Customer retention (repeat customers)
        const repeatCustomers = await Order.aggregate([
            { $match: { paymentStatus: 'paid' } },
            {
                $group: {
                    _id: '$user',
                    orderCount: { $sum: 1 }
                }
            },
            {
                $group: {
                    _id: null,
                    oneTimeCustomers: {
                        $sum: { $cond: [{ $eq: ['$orderCount', 1] }, 1, 0] }
                    },
                    repeatCustomers: {
                        $sum: { $cond: [{ $gt: ['$orderCount', 1] }, 1, 0] }
                    }
                }
            }
        ]);

        const totalCustomers = await User.countDocuments({ role: 'customer' });

        res.json({
            success: true,
            data: {
                customerAcquisition,
                topCustomers,
                customerRetention: {
                    totalCustomers,
                    oneTime: repeatCustomers[0]?.oneTimeCustomers || 0,
                    repeat: repeatCustomers[0]?.repeatCustomers || 0,
                    retentionRate: totalCustomers > 0
                        ? ((repeatCustomers[0]?.repeatCustomers || 0) / totalCustomers * 100).toFixed(2)
                        : 0
                }
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

// @desc    Get coupons report
// @route   GET /api/reports/coupons
// @access  Private/Admin
const getCouponsReport = async (req, res) => {
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

        // Coupon usage
        const couponUsage = await Order.aggregate([
            { $match: { ...dateFilter, couponCode: { $ne: null } } },
            {
                $group: {
                    _id: '$couponCode',
                    usedCount: { $sum: 1 },
                    totalDiscount: { $sum: '$discount' },
                    totalRevenue: { $sum: '$totalAmount' }
                }
            },
            { $sort: { usedCount: -1 } }
        ]);

        // Active coupons
        const activeCoupons = await Coupon.find({
            isActive: true,
            validTill: { $gte: new Date() }
        });

        // Expired coupons
        const expiredCoupons = await Coupon.find({
            validTill: { $lt: new Date() }
        });

        res.json({
            success: true,
            data: {
                couponUsage,
                activeCoupons: activeCoupons.length,
                expiredCoupons: expiredCoupons.length,
                totalDiscountGiven: couponUsage.reduce((sum, c) => sum + c.totalDiscount, 0),
                topCoupons: couponUsage.slice(0, 5)
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

// @desc    Get revenue report
// @route   GET /api/reports/revenue
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

        // Total revenue
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

        // Monthly revenue trend
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
                summary: {
                    totalRevenue: revenue[0]?.totalRevenue || 0,
                    subtotal: revenue[0]?.subtotal || 0,
                    gst: revenue[0]?.gst || 0,
                    deliveryCharges: revenue[0]?.deliveryCharges || 0,
                    expressCharges: revenue[0]?.expressCharges || 0,
                    discounts: revenue[0]?.discounts || 0
                },
                monthlyTrend
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

module.exports = {
    getSalesReport,
    getOrdersReport,
    getServicesReport,
    getCustomersReport,
    getCouponsReport,
    getRevenueReport
};