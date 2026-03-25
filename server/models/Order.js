const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({
    service: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service',
        required: true
    },
    serviceName: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: [1, 'Quantity must be at least 1']
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price cannot be negative']
    },
    totalPrice: {
        type: Number,
        required: true,
        min: [0, 'Total price cannot be negative']
    },
    specialInstructions: {
        type: String,
        maxlength: [200, 'Instructions cannot exceed 200 characters']
    }
});

const orderSchema = new mongoose.Schema(
    {
        orderNumber: {
            type: String,
            required: true,
            unique: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: true
        },
        customerDetails: {
            name: { type: String, required: true },
            email: { type: String, required: true },
            phone: { type: String, required: true }
        },
        items: [orderItemSchema],
        subtotal: {
            type: Number,
            required: true,
            min: [0, 'Subtotal cannot be negative']
        },
        gst: {
            type: Number,
            required: true,
            default: 0
        },
        deliveryCharge: {
            type: Number,
            required: true,
            default: 0
        },
        discount: {
            type: Number,
            default: 0,
            min: [0, 'Discount cannot be negative']
        },
        couponCode: {
            type: String,
            default: null
        },
        totalAmount: {
            type: Number,
            required: true,
            min: [0, 'Total amount cannot be negative']
        },
        paymentMethod: {
            type: String,
            required: true,
            enum: ['cod', 'online', 'wallet']
        },
        paymentStatus: {
            type: String,
            enum: ['pending', 'paid', 'failed', 'refunded'],
            default: 'pending'
        },
        paymentDetails: {
            razorpayOrderId: String,
            razorpayPaymentId: String,
            razorpaySignature: String
        },
        orderStatus: {
            type: String,
            enum: [
                'pending',
                'confirmed',
                'pickup_assigned',
                'collected',
                'processing',
                'quality_check',
                'out_for_delivery',
                'delivered',
                'cancelled'
            ],
            default: 'pending'
        },
        statusHistory: [
            {
                status: { type: String, required: true },
                timestamp: { type: Date, default: Date.now },
                note: String,
                updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
            }
        ],
        pickupAddress: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            landmark: String
        },
        deliveryAddress: {
            name: { type: String, required: true },
            address: { type: String, required: true },
            city: { type: String, required: true },
            state: { type: String, required: true },
            pincode: { type: String, required: true },
            landmark: String
        },
        pickupDate: {
            type: Date,
            required: true
        },
        pickupTimeSlot: {
            type: String,
            required: true
        },
        deliveryDate: {
            type: Date,
            required: true
        },
        assignedStaff: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        specialInstructions: {
            type: String,
            maxlength: [500, 'Instructions cannot exceed 500 characters']
        },
        isExpress: {
            type: Boolean,
            default: false
        },
        expressCharge: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            min: 1,
            max: 5
        },
        review: {
            type: String,
            maxlength: [500, 'Review cannot exceed 500 characters']
        }
    },
    {
        timestamps: true
    }
);

orderSchema.pre('save', async function (next) {
    if (!this.orderNumber) {
        const date = new Date();
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const random = Math.floor(Math.random() * 10000).toString().padStart(4, '0');
        this.orderNumber = `DRY${year}${month}${day}${random}`;
    }
    next();
});

orderSchema.pre('save', function (next) {
    let itemsTotal = 0;
    this.items.forEach(item => {
        itemsTotal += item.totalPrice;
    });
    this.subtotal = itemsTotal;
    this.gst = this.subtotal * 0.18;
    this.totalAmount = this.subtotal + this.gst + this.deliveryCharge + this.expressCharge - this.discount;
    next();
});

orderSchema.virtual('totalItems').get(function () {
    return this.items.reduce((total, item) => total + item.quantity, 0);
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;