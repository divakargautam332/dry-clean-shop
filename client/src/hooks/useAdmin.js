import adminService from '../services/adminService';

const useAdmin = () => {
    const getDashboardStats = async () => {
        const result = await adminService.getDashboardStats();
        return result;
    };

    const getUsers = async (params = {}) => {
        const result = await adminService.getUsers(params);
        return result;
    };

    const getUserById = async (id) => {
        const result = await adminService.getUserById(id);
        return result;
    };

    const updateUser = async (id, userData) => {
        const result = await adminService.updateUser(id, userData);
        return result;
    };

    const deleteUser = async (id) => {
        const result = await adminService.deleteUser(id);
        return result;
    };

    const getAllOrders = async (params = {}) => {
        const result = await adminService.getAllOrders(params);
        return result;
    };

    const getOrderById = async (id) => {
        const result = await adminService.getOrderById(id);
        return result;
    };

    const updateOrderStatus = async (id, status) => {
        const result = await adminService.updateOrderStatus(id, status);
        return result;
    };

    const updatePaymentStatus = async (id, paymentStatus) => {
        const result = await adminService.updatePaymentStatus(id, paymentStatus);
        return result;
    };

    const getAllReviews = async (params = {}) => {
        const result = await adminService.getAllReviews(params);
        return result;
    };

    const approveReview = async (id) => {
        const result = await adminService.approveReview(id);
        return result;
    };

    const replyToReview = async (id, reply) => {
        const result = await adminService.replyToReview(id, reply);
        return result;
    };

    const getSalesReport = async (params = {}) => {
        const result = await adminService.getSalesReport(params);
        return result;
    };

    // ✅ Add missing report functions
    const getOrdersReport = async (params = {}) => {
        const result = await adminService.getOrdersReport(params);
        return result;
    };

    const getServicesReport = async (params = {}) => {
        const result = await adminService.getServicesReport(params);
        return result;
    };

    const getCustomersReport = async (params = {}) => {
        const result = await adminService.getCustomersReport(params);
        return result;
    };

    const getRevenueReport = async (params = {}) => {
        const result = await adminService.getRevenueReport(params);
        return result;
    };

    const getCoupons = async () => {
        const result = await adminService.getCoupons();
        return result;
    };

    const createCoupon = async (couponData) => {
        const result = await adminService.createCoupon(couponData);
        return result;
    };

    const deleteCoupon = async (id) => {
        const result = await adminService.deleteCoupon(id);
        return result;
    };

    const toggleCouponStatus = async (id) => {
        const result = await adminService.toggleCouponStatus(id);
        return result;
    };

    const getDeliveryStaff = async () => {
        const result = await adminService.getDeliveryStaff();
        return result;
    };

    const createDeliveryStaff = async (staffData) => {
        const result = await adminService.createDeliveryStaff(staffData);
        return result;
    };

    const updateDeliveryStaff = async (id, staffData) => {
        const result = await adminService.updateDeliveryStaff(id, staffData);
        return result;
    };

    const deleteDeliveryStaff = async (id) => {
        const result = await adminService.deleteDeliveryStaff(id);
        return result;
    };

    const updateSettings = async (settings) => {
        const result = await adminService.updateSettings(settings);
        return result;
    };

    const getSettings = async () => {
        const result = await adminService.getSettings();
        return result;
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    };

    return {
        getDashboardStats,
        getUsers,
        getUserById,
        updateUser,
        deleteUser,
        getAllOrders,
        getOrderById,
        updateOrderStatus,
        updatePaymentStatus,
        getAllReviews,
        approveReview,
        replyToReview,
        getSalesReport,
        getOrdersReport,        // ✅ Added
        getServicesReport,      // ✅ Added
        getCustomersReport,     // ✅ Added
        getRevenueReport,       // ✅ Added
        getCoupons,
        createCoupon,
        deleteCoupon,
        toggleCouponStatus,
        getDeliveryStaff,
        createDeliveryStaff,
        updateDeliveryStaff,
        deleteDeliveryStaff,
        updateSettings,
        getSettings,
        formatCurrency,
        formatDate
    };
};

export { useAdmin };
export default useAdmin;