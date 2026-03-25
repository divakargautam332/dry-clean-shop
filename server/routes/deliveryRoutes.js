const express = require('express');
const router = express.Router();
const {
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    assignOrder,
    updateDeliveryStatus,
    getAvailableStaff,
    updateStaffLocation
} = require('../controllers/deliveryController');
const { protect, adminOnly, staffOnly } = require('../middleware/authMiddleware');

// Admin only routes
router.get('/staff', protect, adminOnly, getAllStaff);
router.get('/staff/available', protect, adminOnly, getAvailableStaff);
router.post('/staff', protect, adminOnly, createStaff);
router.post('/assign', protect, adminOnly, assignOrder);
router.route('/staff/:id')
    .get(protect, adminOnly, getStaffById)
    .put(protect, adminOnly, updateStaff)
    .delete(protect, adminOnly, deleteStaff);

// Staff routes (for delivery staff)
router.put('/location', protect, staffOnly, updateStaffLocation);
router.put('/status/:orderId', protect, staffOnly, updateDeliveryStatus);

module.exports = router;