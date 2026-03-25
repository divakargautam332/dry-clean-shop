const express = require('express');
const router = express.Router();
const {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServicesByCategory,
    getPopularServices,
    getNewServices,
    getCategories,
    toggleServiceStatus,
    bulkUpdateServices
} = require('../controllers/serviceController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// Public routes
router.get('/', getServices);
router.get('/categories', getCategories);
router.get('/popular', getPopularServices);
router.get('/new', getNewServices);
router.get('/category/:category', getServicesByCategory);
router.get('/:id', getServiceById);

// Admin only routes
router.post('/', protect, adminOnly, createService);
router.put('/bulk/update', protect, adminOnly, bulkUpdateServices);
router.put('/:id/toggle-status', protect, adminOnly, toggleServiceStatus);
router.route('/:id')
    .put(protect, adminOnly, updateService)
    .delete(protect, adminOnly, deleteService);

module.exports = router;