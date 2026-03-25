import React, { createContext, useState, useContext, useEffect } from 'react';
import orderService from '../services/orderService';
import { toast } from 'react-toastify';

const OrderContext = createContext();

export const useOrder = () => {
    const context = useContext(OrderContext);
    if (!context) {
        throw new Error('useOrder must be used within OrderProvider');
    }
    return context;
};

export const OrderProvider = ({ children }) => {
    const [orders, setOrders] = useState([]);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [orderStats, setOrderStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        cancelledOrders: 0,
        totalSpent: 0
    });

    // Load user orders on mount (if authenticated)
    useEffect(() => {
        const token = localStorage.getItem('token');
        if (token) {
            loadUserOrders();
        }
    }, []);

    // Load user orders
    const loadUserOrders = async () => {
        setLoading(true);
        const response = await orderService.getMyOrders();
        if (response.success) {
            setOrders(response.data);
            calculateStats(response.data);
        }
        setLoading(false);
    };

    // Calculate order statistics
    const calculateStats = (ordersList) => {
        const stats = {
            totalOrders: ordersList.length,
            completedOrders: ordersList.filter(o => o.orderStatus === 'delivered').length,
            pendingOrders: ordersList.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)).length,
            cancelledOrders: ordersList.filter(o => o.orderStatus === 'cancelled').length,
            totalSpent: ordersList
                .filter(o => o.orderStatus === 'delivered' && o.paymentStatus === 'paid')
                .reduce((sum, o) => sum + o.totalAmount, 0)
        };
        setOrderStats(stats);
    };

    // Create new order
    const createOrder = async (orderData) => {
        setLoading(true);
        const response = await orderService.createOrder(orderData);

        if (response.success) {
            toast.success(`Order #${response.data.orderNumber} created successfully!`);
            await loadUserOrders();
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    // Get order by ID
    const getOrderById = async (id) => {
        setLoading(true);
        const response = await orderService.getOrderById(id);

        if (response.success) {
            setCurrentOrder(response.data);
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    // Get order by number
    const getOrderByNumber = async (orderNumber) => {
        setLoading(true);
        const response = await orderService.getOrderByNumber(orderNumber);

        if (response.success) {
            setCurrentOrder(response.data);
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    // Track order (public)
    const trackOrder = async (orderNumber) => {
        setLoading(true);
        const response = await orderService.trackOrder(orderNumber);

        if (response.success) {
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    // Cancel order
    const cancelOrder = async (id, reason) => {
        setLoading(true);
        const response = await orderService.cancelOrder(id, reason);

        if (response.success) {
            toast.success(response.message);
            await loadUserOrders();
            if (currentOrder && currentOrder._id === id) {
                setCurrentOrder(response.data);
            }
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    // Get order status steps for tracking
    const getOrderStatusSteps = (status) => {
        return orderService.getOrderStatusSteps(status);
    };

    // Get status color
    const getStatusColor = (status) => {
        return orderService.getStatusColor(status);
    };

    // Get status label
    const getStatusLabel = (status) => {
        return orderService.getStatusLabel(status);
    };

    // Get payment status color
    const getPaymentStatusColor = (status) => {
        return orderService.getPaymentStatusColor(status);
    };

    // Filter orders by status
    const filterOrdersByStatus = (status) => {
        if (!status) return orders;
        return orders.filter(order => order.orderStatus === status);
    };

    // Get recent orders (last 5)
    const getRecentOrders = () => {
        return orders.slice(0, 5);
    };

    // Check if order can be cancelled
    const canCancelOrder = (order) => {
        if (!order) return false;
        const cancelStatuses = ['pending', 'confirmed'];
        return cancelStatuses.includes(order.orderStatus);
    };

    // Check if order can be reviewed
    const canReviewOrder = (order) => {
        if (!order) return false;
        return order.orderStatus === 'delivered' && !order.review;
    };

    // Get estimated delivery date
    const getEstimatedDelivery = (order) => {
        if (order.deliveryDate) {
            return new Date(order.deliveryDate).toLocaleDateString();
        }
        if (order.pickupDate && order.items?.[0]?.processingTime) {
            const date = new Date(order.pickupDate);
            const hours = parseInt(order.items[0].processingTime) || 24;
            date.setHours(date.getHours() + hours);
            return date.toLocaleDateString();
        }
        return 'Pending';
    };

    // Format order summary for display
    const formatOrderSummary = (order) => {
        return orderService.formatOrderSummary(order);
    };

    const value = {
        orders,
        currentOrder,
        loading,
        orderStats,
        loadUserOrders,
        createOrder,
        getOrderById,
        getOrderByNumber,
        trackOrder,
        cancelOrder,
        getOrderStatusSteps,
        getStatusColor,
        getStatusLabel,
        getPaymentStatusColor,
        filterOrdersByStatus,
        getRecentOrders,
        canCancelOrder,
        canReviewOrder,
        getEstimatedDelivery,
        formatOrderSummary,
        setCurrentOrder
    };

    return (
        <OrderContext.Provider value={value}>
            {children}
        </OrderContext.Provider>
    );
};

export default OrderContext;