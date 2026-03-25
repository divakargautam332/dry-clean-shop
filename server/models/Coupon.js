const mongoose = require('mongoose');

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, 'Please add coupon code'],
            unique: true,
            uppercase: true,
            trim: true,
        },
        name: {
            type: String,
            required: [true, 'Please add coupon name'],
            trim: true,
        },
        description: {
            type: String,
        },
        discountType: {
            type: String,
            required: true,
            enum: ['percentage', 'fixed'],
            default: 'percentage'
        },
        discountValue: {
            type: Number,
            required: true,
            min: [0, 'Discount value cannot be negative']
        },
        maxDiscount: {
            type: Number,
            default: null,
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        validFrom: {
            type: Date,
            required: true,
            default: Date.now
        },
        validTill: {
            type: Date,
            required: true
        },
        usageLimit: {
            type: Number,
            default: null,
        },
        usedCount: {
            type: Number,
            default: 0,
        },
        perUserLimit: {
            type: Number,
            default: 1,
        },
        applicableFor: {
            type: String,
            enum: ['all', 'new_users', 'existing_users', 'first_order'],
            default: 'all'
        },
        applicableServices: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service'
        }],
        applicableCategories: [{
            type: String,
            enum: ['shirts', 'pants', 'suits', 'ethnic', 'winter', 'home', 'other']
        }],
        isActive: {
            type: Boolean,
            default: true
        },
        isFeatured: {
            type: Boolean,
            default: false
        },
        userSpecific: [{
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        }],
        usedBy: [{
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User'
            },
            usedAt: {
                type: Date,
                default: Date.now
            },
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            }
        }]
    },
    {
        timestamps: true
    }
);

couponSchema.methods.isValid = function (userId = null, orderAmount = 0) {
    const now = new Date();

    if (!this.isActive) {
        return { valid: false, message: 'Coupon is not active' };
    }

    if (now < this.validFrom) {
        return { valid: false, message: 'Coupon is not yet valid' };
    }

    if (now > this.validTill) {
        return { valid: false, message: 'Coupon has expired' };
    }

    if (this.usageLimit && this.usedCount >= this.usageLimit) {
        return { valid: false, message: 'Coupon usage limit exceeded' };
    }

    if (orderAmount < this.minOrderAmount) {
        return {
            valid: false,
            message: `Minimum order amount of ₹${this.minOrderAmount} required`
        };
    }

    if (this.userSpecific && this.userSpecific.length > 0 && userId) {
        if (!this.userSpecific.includes(userId)) {
            return { valid: false, message: 'Coupon is not valid for this user' };
        }
    }

    if (userId && this.perUserLimit) {
        const userUsageCount = this.usedBy.filter(u => u.user && u.user.toString() === userId.toString()).length;
        if (userUsageCount >= this.perUserLimit) {
            return { valid: false, message: 'You have already used this coupon maximum times' };
        }
    }

    return { valid: true, message: 'Coupon is valid' };
};

couponSchema.methods.calculateDiscount = function (orderAmount) {
    let discount = 0;

    if (this.discountType === 'percentage') {
        discount = (orderAmount * this.discountValue) / 100;
        if (this.maxDiscount) {
            discount = Math.min(discount, this.maxDiscount);
        }
    } else if (this.discountType === 'fixed') {
        discount = this.discountValue;
    }

    return Math.min(discount, orderAmount);
};

couponSchema.virtual('discountDisplay').get(function () {
    if (this.discountType === 'percentage') {
        return `${this.discountValue}% OFF`;
    } else {
        return `₹${this.discountValue} OFF`;
    }
});

const Coupon = mongoose.model('Coupon', couponSchema);

module.exports = Coupon;