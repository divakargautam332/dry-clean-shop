const Review = require('../models/Review');
const Order = require('../models/Order');
const Service = require('../models/Service');
const Notification = require('../models/Notification');

// @desc    Get all reviews (public)
// @route   GET /api/reviews
// @access  Public
const getReviews = async (req, res) => {
    try {
        const { serviceId, rating, page = 1, limit = 10 } = req.query;

        let query = { isApproved: true };

        if (serviceId) {
            query.service = serviceId;
        }

        if (rating) {
            query.rating = parseInt(rating);
        }

        const reviews = await Review.find(query)
            .populate('user', 'name profileImage')
            .populate('service', 'name image')
            .populate('order', 'orderNumber')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments(query);

        // Get rating statistics
        const stats = await Review.getStats();

        res.json({
            success: true,
            data: reviews,
            stats,
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

// @desc    Get reviews for a specific service
// @route   GET /api/reviews/service/:serviceId
// @access  Public
const getServiceReviews = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;

        const query = {
            service: req.params.serviceId,
            isApproved: true
        };

        const reviews = await Review.find(query)
            .populate('user', 'name profileImage')
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await Review.countDocuments(query);

        // Get average rating for this service
        const ratingStats = await Review.getAverageRating(req.params.serviceId);

        res.json({
            success: true,
            data: reviews,
            ratingStats,
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

// @desc    Get review by ID
// @route   GET /api/reviews/:id
// @access  Public
const getReviewById = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id)
            .populate('user', 'name profileImage')
            .populate('service', 'name image price')
            .populate('order', 'orderNumber');

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create a review
// @route   POST /api/reviews
// @access  Private
const createReview = async (req, res) => {
    try {
        const { orderId, serviceId, rating, title, comment, pros, cons, images } = req.body;

        // Check if order belongs to user and is delivered
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
            orderStatus: 'delivered'
        });

        if (!order) {
            res.status(400);
            throw new Error('You can only review delivered orders');
        }

        // Check if already reviewed
        const existingReview = await Review.findOne({
            order: orderId,
            service: serviceId,
            user: req.user._id
        });

        if (existingReview) {
            res.status(400);
            throw new Error('You have already reviewed this service');
        }

        // If no specific service, review overall order
        const reviewData = {
            user: req.user._id,
            order: orderId,
            rating,
            title: title || `Rating: ${rating}/5`,
            comment,
            pros,
            cons,
            images: images || [],
            isVerified: true
        };

        if (serviceId) {
            reviewData.service = serviceId;
        }

        const review = await Review.create(reviewData);

        // Create notification for admin
        await Notification.create({
            user: null, // System notification
            title: 'New Review',
            message: `New review received from ${req.user.name} with rating ${rating}/5`,
            type: 'review',
            actionType: 'review',
            actionId: review._id
        });

        res.status(201).json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a review
// @route   PUT /api/reviews/:id
// @access  Private
const updateReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        // Check if review can be edited (within 30 days)
        const daysSinceCreation = (Date.now() - review.createdAt) / (1000 * 60 * 60 * 24);
        if (daysSinceCreation > 30) {
            res.status(400);
            throw new Error('Reviews can only be edited within 30 days of creation');
        }

        review.rating = req.body.rating || review.rating;
        review.title = req.body.title || review.title;
        review.comment = req.body.comment || review.comment;
        review.pros = req.body.pros || review.pros;
        review.cons = req.body.cons || review.cons;

        if (req.body.images) {
            review.images = req.body.images;
        }

        // Reset approval status after edit
        review.isApproved = false;

        await review.save();

        res.json({
            success: true,
            data: review
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a review
// @route   DELETE /api/reviews/:id
// @access  Private
const deleteReview = async (req, res) => {
    try {
        const review = await Review.findOne({
            _id: req.params.id,
            user: req.user._id
        });

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        await review.deleteOne();

        res.json({
            success: true,
            message: 'Review deleted successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Mark review as helpful
// @route   PUT /api/reviews/:id/helpful
// @access  Private
const markHelpful = async (req, res) => {
    try {
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        // Check if user already marked helpful
        if (review.helpful.users.includes(req.user._id)) {
            res.status(400);
            throw new Error('You have already marked this review as helpful');
        }

        review.helpful.count += 1;
        review.helpful.users.push(req.user._id);
        await review.save();

        res.json({
            success: true,
            message: 'Review marked as helpful',
            helpfulCount: review.helpful.count
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Report a review
// @route   POST /api/reviews/:id/report
// @access  Private
const reportReview = async (req, res) => {
    try {
        const { reason } = req.body;
        const review = await Review.findById(req.params.id);

        if (!review) {
            res.status(404);
            throw new Error('Review not found');
        }

        // Check if user already reported
        const alreadyReported = review.reported.reports.some(
            report => report.user.toString() === req.user._id.toString()
        );

        if (alreadyReported) {
            res.status(400);
            throw new Error('You have already reported this review');
        }

        review.reported.reports.push({
            user: req.user._id,
            reason: reason || 'No reason provided'
        });

        if (review.reported.reports.length >= 3) {
            review.reported.isReported = true;
        }

        await review.save();

        // Notify admin about report
        await Notification.create({
            user: null,
            title: 'Review Reported',
            message: `Review ${review._id} has been reported by ${req.user.name}. Reason: ${reason}`,
            type: 'review',
            actionType: 'review',
            actionId: review._id
        });

        res.json({
            success: true,
            message: 'Review reported successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user's own reviews
// @route   GET /api/reviews/my-reviews
// @access  Private
const getMyReviews = async (req, res) => {
    try {
        const reviews = await Review.find({ user: req.user._id })
            .populate('service', 'name image')
            .populate('order', 'orderNumber')
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            data: reviews
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
    getReviews,
    getServiceReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview,
    getMyReviews
};