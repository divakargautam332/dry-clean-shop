import axios from 'axios';

// Create axios instance with base URL
const API_URL = 'http://localhost:5000/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor to add token
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor for error handling
api.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        if (error.response?.status === 401) {
            // Token expired or invalid
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login';
        }
        return Promise.reject(error);
    }
);

// Auth Services
export const authService = {
    register: (userData) => api.post('/auth/register', userData),
    login: (credentials) => api.post('/auth/login', credentials),
    getProfile: () => api.get('/auth/profile'),
    updateProfile: (userData) => api.put('/auth/profile', userData),
    changePassword: (passwords) => api.put('/auth/change-password', passwords),
    addAddress: (address) => api.post('/auth/address', address),
    updateAddress: (addressId, address) => api.put(`/auth/address/${addressId}`, address),
    deleteAddress: (addressId) => api.delete(`/auth/address/${addressId}`),
};

// Service Services
export const serviceService = {
    getAll: (params) => api.get('/services', { params }),
    getById: (id) => api.get(`/services/${id}`),
    getByCategory: (category) => api.get(`/services/category/${category}`),
    getPopular: () => api.get('/services/popular'),
    getNew: () => api.get('/services/new'),
    getCategories: () => api.get('/services/categories'),
    // Admin only
    create: (serviceData) => api.post('/services', serviceData),
    update: (id, serviceData) => api.put(`/services/${id}`, serviceData),
    delete: (id) => api.delete(`/services/${id}`),
    toggleStatus: (id) => api.put(`/services/${id}/toggle-status`),
    bulkUpdate: (data) => api.put('/services/bulk/update', data),
};

// Order Services
export const orderService = {
    create: (orderData) => api.post('/orders', orderData),
    getMyOrders: () => api.get('/orders'),
    getById: (id) => api.get(`/orders/${id}`),
    getByNumber: (orderNumber) => api.get(`/orders/number/${orderNumber}`),
    cancel: (id, reason) => api.put(`/orders/${id}/cancel`, { reason }),
    track: (orderNumber) => api.get(`/orders/track/${orderNumber}`),
    // Admin only
    getAll: (params) => api.get('/admin/orders', { params }),
    updateStatus: (id, status, note) => api.put(`/orders/${id}/status`, { status, note }),
    updatePayment: (id, paymentStatus, paymentDetails) => api.put(`/orders/${id}/payment`, { paymentStatus, paymentDetails }),
};

// User Services
export const userService = {
    getDashboard: () => api.get('/user/dashboard'),
    getOrders: (params) => api.get('/user/orders', { params }),
    getNotifications: (params) => api.get('/user/notifications', { params }),
    markNotificationRead: (id) => api.put(`/user/notifications/${id}/read`),
    markAllNotificationsRead: () => api.put('/user/notifications/read-all'),
    getReviews: () => api.get('/user/reviews'),
    addReview: (reviewData) => api.post('/user/reviews', reviewData),
    updateReview: (id, reviewData) => api.put(`/user/reviews/${id}`, reviewData),
    deleteReview: (id) => api.delete(`/user/reviews/${id}`),
    getLoyalty: () => api.get('/user/loyalty'),
    redeemLoyalty: (points) => api.post('/user/loyalty/redeem', { points }),
};

// Admin Services
export const adminService = {
    getStats: () => api.get('/admin/stats'),
    getUsers: (params) => api.get('/admin/users', { params }),
    getUserById: (id) => api.get(`/admin/users/${id}`),
    updateUser: (id, userData) => api.put(`/admin/users/${id}`, userData),
    deleteUser: (id) => api.delete(`/admin/users/${id}`),
    getAllOrders: (params) => api.get('/admin/orders', { params }),
    getAllReviews: (params) => api.get('/admin/reviews', { params }),
    approveReview: (id) => api.put(`/admin/reviews/${id}/approve`),
    replyToReview: (id, reply) => api.post(`/admin/reviews/${id}/reply`, { reply }),
    getSalesReport: (params) => api.get('/admin/reports/sales', { params }),
    sendNotification: (notificationData) => api.post('/admin/notifications/send', notificationData),
    // Coupons
    getCoupons: () => api.get('/admin/coupons'),
    createCoupon: (couponData) => api.post('/admin/coupons', couponData),
    updateCoupon: (id, couponData) => api.put(`/admin/coupons/${id}`, couponData),
    deleteCoupon: (id) => api.delete(`/admin/coupons/${id}`),
    toggleCouponStatus: (id) => api.put(`/admin/coupons/${id}/toggle`),
    // Delivery Staff
    getDeliveryStaff: () => api.get('/admin/delivery-staff'),
    createDeliveryStaff: (staffData) => api.post('/admin/delivery-staff', staffData),
    updateDeliveryStaff: (id, staffData) => api.put(`/admin/delivery-staff/${id}`, staffData),
    deleteDeliveryStaff: (id) => api.delete(`/admin/delivery-staff/${id}`),
    // Settings
    updateSettings: (settings) => api.put('/admin/settings', settings),
    getSettings: () => api.get('/admin/settings'),
};

// Coupon Services
export const couponService = {
    getActive: () => api.get('/coupons/active'),
    validate: (code, orderAmount) => api.post('/coupons/validate', { code, orderAmount }),
    // Admin only
    getAll: (params) => api.get('/coupons', { params }),
    getById: (id) => api.get(`/coupons/${id}`),
    create: (couponData) => api.post('/coupons', couponData),
    update: (id, couponData) => api.put(`/coupons/${id}`, couponData),
    delete: (id) => api.delete(`/coupons/${id}`),
    toggleStatus: (id) => api.put(`/coupons/${id}/toggle`),
    getStats: (id) => api.get(`/coupons/${id}/stats`),
};

// Delivery Services
export const deliveryService = {
    // Staff only
    updateLocation: (location) => api.put('/delivery/location', location),
    updateDeliveryStatus: (orderId, status, note, location) => api.put(`/delivery/status/${orderId}`, { status, note, location }),
    // Admin only
    getAllStaff: (params) => api.get('/delivery/staff', { params }),
    getStaffById: (id) => api.get(`/delivery/staff/${id}`),
    createStaff: (staffData) => api.post('/delivery/staff', staffData),
    updateStaff: (id, staffData) => api.put(`/delivery/staff/${id}`, staffData),
    deleteStaff: (id) => api.delete(`/delivery/staff/${id}`),
    getAvailableStaff: () => api.get('/delivery/staff/available'),
    assignOrder: (orderId, staffId) => api.post('/delivery/assign', { orderId, staffId }),
};

// Review Services (Public)
export const reviewService = {
    getAll: (params) => api.get('/reviews', { params }),
    getByService: (serviceId, params) => api.get(`/reviews/service/${serviceId}`, { params }),
    getById: (id) => api.get(`/reviews/${id}`),
    getMyReviews: () => api.get('/reviews/my-reviews'),
    create: (reviewData) => api.post('/reviews', reviewData),
    update: (id, reviewData) => api.put(`/reviews/${id}`, reviewData),
    delete: (id) => api.delete(`/reviews/${id}`),
    markHelpful: (id) => api.put(`/reviews/${id}/helpful`),
    report: (id, reason) => api.post(`/reviews/${id}/report`, { reason }),
};

export default api;