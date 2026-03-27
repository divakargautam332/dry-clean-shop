const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please add user'],
            index: true
        },
        title: {
            type: String,
            required: [true, 'Please add title'],
            trim: true,
            maxlength: [100, 'Title cannot exceed 100 characters']
        },
        message: {
            type: String,
            required: [true, 'Please add message'],
            trim: true,
            maxlength: [500, 'Message cannot exceed 500 characters']
        },
        type: {
            type: String,
            enum: [
                'order',           // Order related notifications
                'payment',         // Payment related
                'promotion',       // Promotional offers
                'delivery',        // Delivery updates
                'system',          // System notifications
                'reminder',        // Reminders
                'review'           // Review related
            ],
            default: 'system'
        },
        priority: {
            type: String,
            enum: ['low', 'medium', 'high', 'urgent'],
            default: 'medium'
        },
        isRead: {
            type: Boolean,
            default: false
        },
        isClicked: {
            type: Boolean,
            default: false
        },
        readAt: {
            type: Date,
            default: null
        },
        clickedAt: {
            type: Date,
            default: null
        },
        actionUrl: {
            type: String,
            default: null
        },
        actionType: {
            type: String,
            enum: ['order', 'service', 'profile', 'offer', 'external'],
            default: null
        },
        actionId: {
            type: mongoose.Schema.Types.ObjectId,
            default: null
        },
        metadata: {
            orderId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Order'
            },
            serviceId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Service'
            },
            couponId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'Coupon'
            },
            customData: {
                type: mongoose.Schema.Types.Mixed,
                default: {}
            }
        },
        sentVia: {
            email: { type: Boolean, default: false },
            sms: { type: Boolean, default: false },
            push: { type: Boolean, default: true },
            whatsapp: { type: Boolean, default: false }
        },
        expiresAt: {
            type: Date,
            default: null
        },
        isArchived: {
            type: Boolean,
            default: false
        },
        archivedAt: {
            type: Date,
            default: null
        }
    },
    {
        timestamps: true
    }
);

// Index for faster queries
notificationSchema.index({ user: 1, isRead: 1, createdAt: -1 });
notificationSchema.index({ user: 1, isArchived: 1, createdAt: -1 });
notificationSchema.index({ expiresAt: 1 }, { expireAfterSeconds: 0 });

// Virtual for time ago
notificationSchema.virtual('timeAgo').get(function () {
    const now = new Date();
    const diff = Math.floor((now - this.createdAt) / 1000); // seconds

    if (diff < 60) return `${diff} seconds ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)} minutes ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)} hours ago`;
    if (diff < 2592000) return `${Math.floor(diff / 86400)} days ago`;
    return this.createdAt.toLocaleDateString();
});

// Virtual for notification status
notificationSchema.virtual('status').get(function () {
    if (this.isRead) return 'read';
    if (this.expiresAt && new Date() > this.expiresAt) return 'expired';
    return 'unread';
});

// Method to mark as read
notificationSchema.methods.markAsRead = async function () {
    if (!this.isRead) {
        this.isRead = true;
        this.readAt = new Date();
        await this.save();
    }
    return this;
};

// Method to mark as clicked
notificationSchema.methods.markAsClicked = async function () {
    if (!this.isClicked) {
        this.isClicked = true;
        this.clickedAt = new Date();
        await this.save();
    }
    return this;
};

// Method to archive notification
notificationSchema.methods.archive = async function () {
    if (!this.isArchived) {
        this.isArchived = true;
        this.archivedAt = new Date();
        await this.save();
    }
    return this;
};

// Static method to get unread count for user
notificationSchema.statics.getUnreadCount = async function (userId) {
    const count = await this.countDocuments({
        user: userId,
        isRead: false,
        isArchived: false,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gt: new Date() } }
        ]
    });
    return count;
};

// Static method to get all notifications for user
notificationSchema.statics.getUserNotifications = async function (userId, limit = 20, skip = 0) {
    const notifications = await this.find({
        user: userId,
        isArchived: false,
        $or: [
            { expiresAt: { $exists: false } },
            { expiresAt: { $gt: new Date() } }
        ]
    })
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip(skip);

    const unreadCount = await this.getUnreadCount(userId);

    return {
        notifications,
        unreadCount,
        hasMore: notifications.length === limit
    };
};

// Static method to delete old notifications
notificationSchema.statics.cleanupOldNotifications = async function (daysToKeep = 30) {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

    const result = await this.deleteMany({
        isArchived: true,
        archivedAt: { $lt: cutoffDate }
    });

    return result;
};

// Pre-save middleware to handle expiry
notificationSchema.pre('save', async function () {
    if (!this.expiresAt && this.type !== 'promotion') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 30);
        this.expiresAt = expiryDate;
    } else if (!this.expiresAt && this.type === 'promotion') {
        const expiryDate = new Date();
        expiryDate.setDate(expiryDate.getDate() + 7);
        this.expiresAt = expiryDate;
    }
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;