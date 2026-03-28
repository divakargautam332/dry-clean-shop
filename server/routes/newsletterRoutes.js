const express = require('express');
const router = express.Router();
const {
    subscribe,
    unsubscribe,
    getSubscribers,
    sendBulkEmail
} = require('../controllers/newsletterController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.post('/subscribe', subscribe);
router.get('/unsubscribe', unsubscribe);

// Admin routes
router.get('/subscribers', protect, adminOnly, getSubscribers);
router.post('/send-bulk', protect, adminOnly, sendBulkEmail);

module.exports = router;