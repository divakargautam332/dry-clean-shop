const Coupon = require('../models/Coupon');
const Order = require('../models/Order');

// @desc    Get all coupons
// @route   GET /api/coupons
// @access  Private/Admin
const getCoupons = async (req, res) => {
    try {
        const { isActive, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { code: { $regex: search, $options: 'i' } },
                { name: { $regex: search, $options: 'i' } }
            ];
        }

        const coupons = await Coupon.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Coupon.countDocuments(query);

        res.json({
            success: true,
            data: coupons,
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
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get coupon by ID
// @route   GET /api/coupons/:id
// @access  Private/Admin
const getCouponById = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
        }

        res.json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
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
            res.status(404);
            throw new Error('Invalid coupon code');
        }

        const validation = coupon.isValid(req.user._id, orderAmount);

        if (!validation.valid) {
            res.status(400);
            throw new Error(validation.message);
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
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create coupon
// @route   POST /api/coupons
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
            res.status(400);
            throw new Error('Coupon code already exists');
        }

        const coupon = await Coupon.create({
            code: code.toUpperCase(),
            name,
            description,
            discountType,
            discountValue,
            maxDiscount,
            minOrderAmount: minOrderAmount || 0,
            validFrom: validFrom || new Date(),
            validTill,
            usageLimit,
            perUserLimit: perUserLimit || 1,
            applicableFor: applicableFor || 'all',
            applicableServices,
            applicableCategories,
            isActive: isActive !== undefined ? isActive : true,
            isFeatured: isFeatured || false,
            userSpecific
        });

        res.status(201).json({
            success: true,
            data: coupon
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update coupon
// @route   PUT /api/coupons/:id
// @access  Private/Admin
const updateCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
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
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete coupon
// @route   DELETE /api/coupons/:id
// @access  Private/Admin
const deleteCoupon = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
        }

        await coupon.deleteOne();

        res.json({
            success: true,
            message: 'Coupon deleted successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle coupon status
// @route   PUT /api/coupons/:id/toggle
// @access  Private/Admin
const toggleCouponStatus = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
        }

        coupon.isActive = !coupon.isActive;
        await coupon.save();

        res.json({
            success: true,
            message: `Coupon ${coupon.isActive ? 'activated' : 'deactivated'} successfully`,
            data: coupon
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get coupon usage stats
// @route   GET /api/coupons/:id/stats
// @access  Private/Admin
const getCouponStats = async (req, res) => {
    try {
        const coupon = await Coupon.findById(req.params.id);

        if (!coupon) {
            res.status(404);
            throw new Error('Coupon not found');
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
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getCoupons,
    getActiveCoupons,
    getCouponById,
    validateCoupon,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponStats
};