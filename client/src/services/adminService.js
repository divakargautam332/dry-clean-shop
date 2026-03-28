import api from './api';

// ============= DASHBOARD =============
const getDashboardStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch dashboard stats'
        };
    }
};

const getOrderStatusStats = async () => {
    try {
        const response = await api.get('/admin/stats');
        const { orderStatusDistribution } = response.data.data;

        const stats = {
            pending: 0,
            confirmed: 0,
            processing: 0,
            delivered: 0,
            cancelled: 0
        };

        orderStatusDistribution?.forEach(item => {
            if (stats[item._id] !== undefined) {
                stats[item._id] = item.count;
            }
        });

        return {
            success: true,
            data: stats
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch order stats'
        };
    }
};

const getRevenueData = async (period = 'daily') => {
    try {
        const response = await api.get('/admin/reports/sales', { params: { period } });
        const { breakdown, summary } = response.data.data;

        const chartData = {
            labels: breakdown.map(item => item._id),
            revenue: breakdown.map(item => item.revenue),
            orders: breakdown.map(item => item.orders)
        };

        return {
            success: true,
            data: {
                chartData,
                summary
            }
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch revenue data'
        };
    }
};

// ============= USER MANAGEMENT =============
const getUsers = async (params = {}) => {
    try {
        const response = await api.get('/admin/users', { params });
        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch users'
        };
    }
};

const getUserById = async (id) => {
    try {
        const response = await api.get(`/admin/users/${id}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch user'
        };
    }
};

const updateUser = async (id, userData) => {
    try {
        const response = await api.put(`/admin/users/${id}`, userData);
        return {
            success: true,
            data: response.data.data,
            message: 'User updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update user'
        };
    }
};

const deleteUser = async (id) => {
    try {
        const response = await api.delete(`/admin/users/${id}`);
        return {
            success: true,
            message: response.data.message || 'User deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete user'
        };
    }
};

// ============= ORDER MANAGEMENT =============
// Get all orders (admin) - ✅ Correct
const getAllOrders = async (params = {}) => {
    try {
        const response = await api.get('/admin/orders', { params });
        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orders'
        };
    }
};

// ✅ FIXED: Get order by ID - NO /admin prefix
const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch order'
        };
    }
};

// ✅ FIXED: Update order status - NO /admin prefix
const updateOrderStatus = async (id, status) => {
    try {
        const response = await api.put(`/orders/${id}/status`, { status });
        return {
            success: true,
            data: response.data.data,
            message: 'Order status updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update order status'
        };
    }
};

// ✅ FIXED: Update payment status - NO /admin prefix
const updatePaymentStatus = async (id, paymentStatus) => {
    try {
        const response = await api.put(`/orders/${id}/payment`, { paymentStatus });
        return {
            success: true,
            data: response.data.data,
            message: 'Payment status updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update payment status'
        };
    }
};

// ============= REVIEW MANAGEMENT =============
const getAllReviews = async (params = {}) => {
    try {
        const response = await api.get('/admin/reviews', { params });
        return {
            success: true,
            data: response.data.data,
            pagination: response.data.pagination
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch reviews'
        };
    }
};

const approveReview = async (id) => {
    try {
        const response = await api.put(`/admin/reviews/${id}/approve`);
        return {
            success: true,
            data: response.data.data,
            message: 'Review approved successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to approve review'
        };
    }
};

const replyToReview = async (id, reply) => {
    try {
        const response = await api.post(`/admin/reviews/${id}/reply`, { reply });
        return {
            success: true,
            data: response.data.data,
            message: 'Reply added successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add reply'
        };
    }
};

// ============= REPORTS =============
const getSalesReport = async (params = {}) => {
    try {
        const response = await api.get('/admin/reports/sales', { params });
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch sales report'
        };
    }
};

const getOrdersReport = async (params = {}) => {
    try {
        const response = await api.get('/admin/reports/orders', { params });
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orders report'
        };
    }
};

const getServicesReport = async (params = {}) => {
    try {
        const response = await api.get('/admin/reports/services', { params });
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services report'
        };
    }
};

const getCustomersReport = async (params = {}) => {
    try {
        const response = await api.get('/admin/reports/customers', { params });
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch customers report'
        };
    }
};

const getRevenueReport = async (params = {}) => {
    try {
        const response = await api.get('/admin/reports/revenue', { params });
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch revenue report'
        };
    }
};

// ============= COUPON MANAGEMENT =============
const getCoupons = async () => {
    try {
        const response = await api.get('/admin/coupons');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch coupons'
        };
    }
};

const createCoupon = async (couponData) => {
    try {
        const response = await api.post('/admin/coupons', couponData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create coupon'
        };
    }
};

const updateCoupon = async (id, couponData) => {
    try {
        const response = await api.put(`/admin/coupons/${id}`, couponData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update coupon'
        };
    }
};

const deleteCoupon = async (id) => {
    try {
        const response = await api.delete(`/admin/coupons/${id}`);
        return {
            success: true,
            message: response.data.message || 'Coupon deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete coupon'
        };
    }
};

const toggleCouponStatus = async (id) => {
    try {
        const response = await api.put(`/admin/coupons/${id}/toggle`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to toggle coupon status'
        };
    }
};

// ============= DELIVERY STAFF MANAGEMENT =============
const getDeliveryStaff = async () => {
    try {
        const response = await api.get('/admin/delivery-staff');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch delivery staff'
        };
    }
};

const createDeliveryStaff = async (staffData) => {
    try {
        const response = await api.post('/admin/delivery-staff', staffData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create delivery staff'
        };
    }
};

const updateDeliveryStaff = async (id, staffData) => {
    try {
        const response = await api.put(`/admin/delivery-staff/${id}`, staffData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update delivery staff'
        };
    }
};

const deleteDeliveryStaff = async (id) => {
    try {
        const response = await api.delete(`/admin/delivery-staff/${id}`);
        return {
            success: true,
            message: response.data.message || 'Staff deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete delivery staff'
        };
    }
};

// ============= SETTINGS =============
const updateSettings = async (settings) => {
    try {
        const response = await api.put('/admin/settings', settings);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update settings'
        };
    }
};

const getSettings = async () => {
    try {
        const response = await api.get('/admin/settings');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch settings'
        };
    }
};

// ============= NOTIFICATIONS =============
const sendBulkNotification = async (notificationData) => {
    try {
        const response = await api.post('/admin/notifications/send', notificationData);
        return {
            success: true,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to send notification'
        };
    }
};

// ============= HELPER FUNCTIONS =============
const exportToCSV = (data, filename) => {
    if (!data || data.length === 0) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
        const values = headers.map(header => {
            const value = row[header] || '';
            return `"${String(value).replace(/"/g, '""')}"`;
        });
        csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
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

// ============= EXPORTS =============
const adminService = {
    // Dashboard
    getDashboardStats,
    getOrderStatusStats,
    getRevenueData,

    // User Management
    getUsers,
    getUserById,
    updateUser,
    deleteUser,

    // Order Management
    getAllOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,

    // Review Management
    getAllReviews,
    approveReview,
    replyToReview,

    // Reports
    getSalesReport,
    getOrdersReport,
    getServicesReport,
    getCustomersReport,
    getRevenueReport,

    // Coupon Management
    getCoupons,
    createCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,

    // Delivery Staff
    getDeliveryStaff,
    createDeliveryStaff,
    updateDeliveryStaff,
    deleteDeliveryStaff,

    // Settings
    updateSettings,
    getSettings,

    // Notifications
    sendBulkNotification,

    // Helpers
    exportToCSV,
    formatCurrency,
    formatDate
};

export default adminService;