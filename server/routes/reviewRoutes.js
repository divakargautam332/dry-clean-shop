const express = require('express');
const router = express.Router();
const {
    getReviews,
    getServiceReviews,
    getReviewById,
    createReview,
    updateReview,
    deleteReview,
    markHelpful,
    reportReview,
    getMyReviews
} = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getReviews);
router.get('/service/:serviceId', getServiceReviews);
router.get('/:id', getReviewById);

// Protected routes
router.get('/my-reviews', protect, getMyReviews);
router.post('/', protect, createReview);
router.put('/:id', protect, updateReview);
router.delete('/:id', protect, deleteReview);
router.put('/:id/helpful', protect, markHelpful);
router.post('/:id/report', protect, reportReview);

module.exports = router;