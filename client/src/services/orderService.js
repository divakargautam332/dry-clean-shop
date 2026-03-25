import api from './api';

// Create new order
const createOrder = async (orderData) => {
    try {
        const response = await api.post('/orders', orderData);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create order'
        };
    }
};

// Get my orders (logged in user)
const getMyOrders = async (params = {}) => {
    try {
        const response = await api.get('/orders', { params });
        return {
            success: true,
            data: response.data.data,
            count: response.data.count
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch orders'
        };
    }
};

// Get order by ID
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

// Get order by order number
const getOrderByNumber = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/number/${orderNumber}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Order not found'
        };
    }
};

// Cancel order
const cancelOrder = async (id, reason = '') => {
    try {
        const response = await api.put(`/orders/${id}/cancel`, { reason });
        return {
            success: true,
            data: response.data.data,
            message: 'Order cancelled successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to cancel order'
        };
    }
};

// Track order (public)
const trackOrder = async (orderNumber) => {
    try {
        const response = await api.get(`/orders/track/${orderNumber}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Order not found'
        };
    }
};

// Admin: Get all orders
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

// Admin: Update order status
const updateOrderStatus = async (id, status, note = '') => {
    try {
        const response = await api.put(`/orders/${id}/status`, { status, note });
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

// Admin: Update payment status
const updatePaymentStatus = async (id, paymentStatus, paymentDetails = null) => {
    try {
        const response = await api.put(`/orders/${id}/payment`, { paymentStatus, paymentDetails });
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

// Get order status steps for tracking
const getOrderStatusSteps = (status) => {
    const steps = [
        { key: 'pending', label: 'Order Placed', icon: '📝', completed: false },
        { key: 'confirmed', label: 'Confirmed', icon: '✅', completed: false },
        { key: 'pickup_assigned', label: 'Pickup Assigned', icon: '🚗', completed: false },
        { key: 'collected', label: 'Items Collected', icon: '📦', completed: false },
        { key: 'processing', label: 'Processing', icon: '🧺', completed: false },
        { key: 'quality_check', label: 'Quality Check', icon: '🔍', completed: false },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚', completed: false },
        { key: 'delivered', label: 'Delivered', icon: '🏠', completed: false }
    ];

    const statusOrder = [
        'pending', 'confirmed', 'pickup_assigned', 'collected',
        'processing', 'quality_check', 'out_for_delivery', 'delivered'
    ];

    const currentIndex = statusOrder.indexOf(status);

    return steps.map((step, index) => ({
        ...step,
        completed: index <= currentIndex,
        active: index === currentIndex && status !== 'delivered' && status !== 'cancelled'
    }));
};

// Get status color for badges
const getStatusColor = (status) => {
    const colors = {
        pending: 'yellow',
        confirmed: 'blue',
        pickup_assigned: 'purple',
        collected: 'indigo',
        processing: 'orange',
        quality_check: 'pink',
        out_for_delivery: 'cyan',
        delivered: 'green',
        cancelled: 'red'
    };
    return colors[status] || 'gray';
};

// Get status label
const getStatusLabel = (status) => {
    const labels = {
        pending: 'Order Placed',
        confirmed: 'Confirmed',
        pickup_assigned: 'Pickup Assigned',
        collected: 'Items Collected',
        processing: 'Processing',
        quality_check: 'Quality Check',
        out_for_delivery: 'Out for Delivery',
        delivered: 'Delivered',
        cancelled: 'Cancelled'
    };
    return labels[status] || status;
};

// Get payment status color
const getPaymentStatusColor = (status) => {
    const colors = {
        pending: 'yellow',
        paid: 'green',
        failed: 'red',
        refunded: 'orange'
    };
    return colors[status] || 'gray';
};

// Calculate estimated delivery date
const getEstimatedDelivery = (pickupDate, processingTime = '24 hours') => {
    const date = new Date(pickupDate);
    const hours = parseInt(processingTime) || 24;
    date.setHours(date.getHours() + hours);
    return date;
};

// Format order summary
const formatOrderSummary = (order) => {
    return {
        orderNumber: order.orderNumber,
        totalAmount: order.totalAmount,
        itemCount: order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0,
        status: order.orderStatus,
        statusLabel: getStatusLabel(order.orderStatus),
        createdAt: new Date(order.createdAt).toLocaleDateString(),
        estimatedDelivery: order.deliveryDate ? new Date(order.deliveryDate).toLocaleDateString() : 'Pending'
    };
};

const orderService = {
    createOrder,
    getMyOrders,
    getOrderById,
    getOrderByNumber,
    cancelOrder,
    trackOrder,
    getAllOrders,
    updateOrderStatus,
    updatePaymentStatus,
    getOrderStatusSteps,
    getStatusColor,
    getStatusLabel,
    getPaymentStatusColor,
    getEstimatedDelivery,
    formatOrderSummary
};

export default orderService;