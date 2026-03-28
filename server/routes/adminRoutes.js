const express = require('express');
const router = express.Router();
const {
    getDashboardStats,
    getAllUsers,
    getUserById,
    updateUserByAdmin,
    deleteUser,
    getAllOrders,
    getAllReviews,
    approveReview,
    replyToReview,
    getSalesReport,
    sendBulkNotification,
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getSettings,
    updateSettings,
    // ✅ Add these report functions
    getOrdersReport,
    getServicesReport,
    getCustomersReport,
    getRevenueReport,

    getDeliveryStaff,
    getDeliveryStaffById,
    createDeliveryStaff,
    updateDeliveryStaff,
    deleteDeliveryStaff,
    updateStaffAvailability,
    assignOrderToStaff,
    getStaffAssignedOrders
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/authMiddleware');

// All admin routes require authentication and admin role
router.use(protect, adminOnly);

// Dashboard
router.get('/stats', getDashboardStats);

// User management
router.get('/users', getAllUsers);
router.get('/users/:id', getUserById);
router.put('/users/:id', updateUserByAdmin);
router.delete('/users/:id', deleteUser);

// Order management
router.get('/orders', getAllOrders);

// Review management
router.get('/reviews', getAllReviews);
router.put('/reviews/:id/approve', approveReview);
router.post('/reviews/:id/reply', replyToReview);

// Reports
router.get('/reports/sales', getSalesReport);
router.get('/reports/orders', getOrdersReport);      // ✅ Add this
router.get('/reports/services', getServicesReport);  // ✅ Add this
router.get('/reports/customers', getCustomersReport); // ✅ Add this
router.get('/reports/revenue', getRevenueReport);    // ✅ Add this

// Notifications
router.post('/notifications/send', sendBulkNotification);

// Coupon Management
router.get('/coupons', getCoupons);
router.post('/coupons', createCoupon);
router.put('/coupons/:id', updateCoupon);
router.delete('/coupons/:id', deleteCoupon);
router.put('/coupons/:id/toggle', toggleCouponStatus);

// Settings
router.get('/settings', getSettings);
router.put('/settings', updateSettings);


router.get('/delivery-staff', getDeliveryStaff);
router.get('/delivery-staff/:id', getDeliveryStaffById);
router.post('/delivery-staff', createDeliveryStaff);
router.put('/delivery-staff/:id', updateDeliveryStaff);
router.delete('/delivery-staff/:id', deleteDeliveryStaff);
router.put('/delivery-staff/:id/availability', updateStaffAvailability);
router.get('/delivery-staff/:id/orders', getStaffAssignedOrders);
router.post('/delivery-staff/assign', assignOrderToStaff);

module.exports = router;