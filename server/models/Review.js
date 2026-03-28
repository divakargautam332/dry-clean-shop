const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User',
            required: [true, 'Please add user']
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Order',
            required: [true, 'Please add order']
        },
        service: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Service',
            default: null
        },
        rating: {
            type: Number,
            required: [true, 'Please add rating'],
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        title: {
            type: String,
            trim: true,
        },
        comment: {
            type: String,
            required: [true, 'Please add review comment'],
        },
        images: [{
            type: String,
            default: []
        }],
        pros: {
            type: String,
        },
        cons: {
            type: String,
        },
        isVerified: {
            type: Boolean,
            default: false
        },
        isApproved: {
            type: Boolean,
            default: true
        },
        adminReply: {
            reply: { type: String },
            repliedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
            repliedAt: { type: Date }
        },
        helpful: {
            count: { type: Number, default: 0 },
            users: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
        },
        reported: {
            isReported: { type: Boolean, default: false },
            reports: [{
                user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
                reason: String,
                reportedAt: { type: Date, default: Date.now }
            }]
        }
    },
    {
        timestamps: true
    }
);

reviewSchema.index({ order: 1, service: 1 }, { unique: true });

reviewSchema.virtual('formattedDate').get(function () {
    return this.createdAt.toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    });
});

reviewSchema.virtual('stars').get(function () {
    return '★'.repeat(this.rating) + '☆'.repeat(5 - this.rating);
});

reviewSchema.virtual('hasImages').get(function () {
    return this.images && this.images.length > 0;
});

reviewSchema.virtual('hasAdminReply').get(function () {
    return this.adminReply && this.adminReply.reply && this.adminReply.reply.trim() !== '';
});

reviewSchema.statics.getAverageRating = async function (serviceId) {
    const result = await this.aggregate([
        {
            $match: {
                service: serviceId,
                isApproved: true
            }
        },
        {
            $group: {
                _id: '$service',
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 }
            }
        }
    ]);

    return {
        averageRating: result.length > 0 ? result[0].averageRating.toFixed(1) : 0,
        totalReviews: result.length > 0 ? result[0].totalReviews : 0
    };
};

reviewSchema.statics.getStats = async function () {
    const result = await this.aggregate([
        {
            $match: { isApproved: true }
        },
        {
            $group: {
                _id: null,
                averageRating: { $avg: '$rating' },
                totalReviews: { $sum: 1 },
                rating5: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
                rating4: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
                rating3: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
                rating2: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
                rating1: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } }
            }
        }
    ]);

    if (result.length > 0) {
        const stats = result[0];
        return {
            averageRating: stats.averageRating.toFixed(1),
            totalReviews: stats.totalReviews,
            ratingDistribution: {
                5: stats.rating5,
                4: stats.rating4,
                3: stats.rating3,
                2: stats.rating2,
                1: stats.rating1
            }
        };
    }

    return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    };
};

const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;