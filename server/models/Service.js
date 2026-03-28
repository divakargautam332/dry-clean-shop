const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add service name'],
            trim: true,
            unique: true,
        },
        category: {
            type: String,
            required: [true, 'Please add category'],
            enum: ['shirts', 'pants', 'suits', 'ethnic', 'winter', 'home', 'other'],
            default: 'other'
        },
        price: {
            type: Number,
            required: [true, 'Please add price'],
            min: [0, 'Price cannot be negative']
        },
        discountedPrice: {
            type: Number,
            default: null,
            min: [0, 'Discounted price cannot be negative']
        },
        processingTime: {
            type: String,
            required: [true, 'Please add processing time'],
            default: '24 hours'
        },
        description: {
            type: String,
            required: [true, 'Please add description'],
        },
        shortDescription: {
            type: String,
        },
        image: {
            type: String,
            default: 'https://via.placeholder.com/300x200?text=Service'
        },
        icon: {
            type: String,
            default: 'fa-solid fa-shirt'
        },
        isActive: {
            type: Boolean,
            default: true
        },
        isPopular: {
            type: Boolean,
            default: false
        },
        isNew: {
            type: Boolean,
            default: false
        },
        tags: [{
            type: String,
            enum: [
                'dry-clean',
                'ironing',
                'wash-fold',
                'stain-removal',
                'express',
                'delicate',
                'wool-care',
                'leather-care',
                'home',
                'wedding',
                'jeans',
                'winter',
                'ethnic',
                'other'
            ]
        }],
        minOrderQuantity: {
            type: Number,
            default: 1,
        },
        maxOrderQuantity: {
            type: Number,
            default: 50,
        }
    },
    {
        timestamps: true
    }
);

serviceSchema.virtual('actualPrice').get(function () {
    return this.discountedPrice || this.price;
});

serviceSchema.virtual('isOnDiscount').get(function () {
    return this.discountedPrice !== null && this.discountedPrice < this.price;
});

serviceSchema.virtual('discountPercentage').get(function () {
    if (this.isOnDiscount) {
        return Math.round(((this.price - this.discountedPrice) / this.price) * 100);
    }
    return 0;
});

const Service = mongoose.model('Service', serviceSchema);

module.exports = Service;