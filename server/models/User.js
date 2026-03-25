const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add an email'],
            unique: true,
            lowercase: true,
            trim: true,
            match: [
                /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
                'Please add a valid email'
            ]
        },
        password: {
            type: String,
            required: [true, 'Please add a password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        phone: {
            type: String,
            required: [true, 'Please add a phone number'],
            match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
        },
        role: {
            type: String,
            enum: ['customer', 'admin', 'staff'],
            default: 'customer'
        },
        addresses: [
            {
                name: { type: String, required: true },
                address: { type: String, required: true },
                city: { type: String, required: true },
                state: { type: String, required: true },
                pincode: { type: String, required: true },
                landmark: { type: String },
                isDefault: { type: Boolean, default: false }
            }
        ],
        profileImage: {
            type: String,
            default: ''
        },
        isActive: {
            type: Boolean,
            default: true
        },
        loyaltyPoints: {
            type: Number,
            default: 0
        },
        totalOrders: {
            type: Number,
            default: 0
        },
        resetPasswordToken: String,
        resetPasswordExpire: Date
    },
    {
        timestamps: true
    }
);

userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;