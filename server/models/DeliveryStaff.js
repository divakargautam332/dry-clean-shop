const mongoose = require('mongoose');

const deliveryStaffSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add name'],
            trim: true,
        },
        email: {
            type: String,
            required: [true, 'Please add email'],
            unique: true,
            lowercase: true,
            trim: true,
        },
        phone: {
            type: String,
            required: [true, 'Please add phone number'],
            match: [/^[0-9]{10}$/, 'Please add a valid 10-digit phone number']
        },
        password: {
            type: String,
            required: [true, 'Please add password'],
            minlength: [6, 'Password must be at least 6 characters'],
            select: false
        },
        profileImage: {
            type: String,
            default: ''
        },
        address: {
            type: String,
            required: [true, 'Please add address']
        },
        city: {
            type: String,
            required: [true, 'Please add city']
        },
        pincode: {
            type: String,
            required: [true, 'Please add pincode']
        },
        vehicleType: {
            type: String,
            enum: ['bike', 'scooter', 'car', 'bicycle'],
            default: 'bike'
        },
        vehicleNumber: {
            type: String,
            trim: true
        },
        drivingLicense: {
            type: String,
            trim: true
        },
        isAvailable: {
            type: Boolean,
            default: true
        },
        isActive: {
            type: Boolean,
            default: true
        },
        currentLocation: {
            lat: { type: Number, default: 0 },
            lng: { type: Number, default: 0 },
            address: { type: String, default: '' },
            lastUpdated: { type: Date, default: Date.now }
        },
        assignedOrders: [{
            order: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
            assignedAt: {
                type: Date,
                default: Date.now
            },
            status: {
                type: String,
                enum: ['assigned', 'picked_up', 'delivered', 'cancelled'],
                default: 'assigned'
            }
        }],
        completedOrders: {
            type: Number,
            default: 0
        },
        totalEarnings: {
            type: Number,
            default: 0
        },
        rating: {
            type: Number,
            default: 0,
            min: 0,
            max: 5
        },
        totalRatings: {
            type: Number,
            default: 0
        },
        documents: {
            aadharCard: { type: String, default: '' },
            panCard: { type: String, default: '' },
            rcBook: { type: String, default: '' }
        },
        bankDetails: {
            accountHolderName: { type: String, default: '' },
            accountNumber: { type: String, default: '' },
            ifscCode: { type: String, default: '' },
            bankName: { type: String, default: '' }
        },
        workSchedule: {
            monday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            tuesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            wednesday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            thursday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            friday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            saturday: { start: String, end: String, isWorking: { type: Boolean, default: true } },
            sunday: { start: String, end: String, isWorking: { type: Boolean, default: false } }
        },
        preferredArea: [{
            pincode: String,
            area: String
        }]
    },
    {
        timestamps: true
    }
);

// Virtual for checking if staff is on duty
deliveryStaffSchema.virtual('isOnDuty').get(function () {
    const now = new Date();
    const day = now.toLocaleDateString('en-US', { weekday: 'lowercase' });
    const schedule = this.workSchedule[day];

    if (!schedule || !schedule.isWorking) {
        return false;
    }

    const currentTime = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
    return currentTime >= schedule.start && currentTime <= schedule.end;
});

// Virtual for current workload
deliveryStaffSchema.virtual('currentWorkload').get(function () {
    return this.assignedOrders.filter(order => order.status === 'assigned' || order.status === 'picked_up').length;
});

// Virtual for max capacity
deliveryStaffSchema.virtual('maxCapacity').get(function () {
    // Based on vehicle type
    const capacities = {
        bike: 5,
        scooter: 5,
        car: 10,
        bicycle: 3
    };
    return capacities[this.vehicleType] || 5;
});

// Virtual for can take more orders
deliveryStaffSchema.virtual('canTakeMoreOrders').get(function () {
    return this.currentWorkload < this.maxCapacity;
});

// Method to calculate distance from pickup location
deliveryStaffSchema.methods.calculateDistance = function (destinationLat, destinationLng) {
    if (!this.currentLocation.lat || !this.currentLocation.lng) {
        return null;
    }

    const R = 6371; // Earth's radius in km
    const dLat = (destinationLat - this.currentLocation.lat) * Math.PI / 180;
    const dLng = (destinationLng - this.currentLocation.lng) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(this.currentLocation.lat * Math.PI / 180) * Math.cos(destinationLat * Math.PI / 180) *
        Math.sin(dLng / 2) * Math.sin(dLng / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return distance;
};

// Method to update rating
deliveryStaffSchema.methods.updateRating = function (newRating) {
    const total = (this.rating * this.totalRatings) + newRating;
    this.totalRatings += 1;
    this.rating = total / this.totalRatings;
    return this.save();
};

const DeliveryStaff = mongoose.model('DeliveryStaff', deliveryStaffSchema);

module.exports = DeliveryStaff;