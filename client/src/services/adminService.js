import api from './api';

// Get dashboard statistics
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

// Get all users
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

// Get user by ID
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

// Update user (admin)
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

// Delete user
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

// Get all orders (admin)
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

// Get all reviews (admin)
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

// Approve review
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

// Reply to review
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

// Get sales report
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

// Send bulk notification
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

// Get order status statistics
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

// Get revenue data for charts
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

// Export data as CSV
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

// Format currency
const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(amount);
};

// Format date
const formatDate = (date) => {
    return new Date(date).toLocaleDateString('en-IN', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
};

const adminService = {
    getDashboardStats,
    getUsers,
    getUserById,
    updateUser,
    deleteUser,
    getAllOrders,
    getAllReviews,
    approveReview,
    replyToReview,
    getSalesReport,
    sendBulkNotification,
    getOrderStatusStats,
    getRevenueData,
    exportToCSV,
    formatCurrency,
    formatDate
};

export default adminService;