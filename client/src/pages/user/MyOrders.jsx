import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import OrderSummary from '../../components/user/OrderSummary';
import Loader from '../../components/common/Loader';

const MyOrders = () => {
    const { orders, loading, loadUserOrders, getStatusColor, getStatusLabel } = useOrder();
    const location = useLocation();
    const [activeFilter, setActiveFilter] = useState('all');
    const [filteredOrders, setFilteredOrders] = useState([]);

    useEffect(() => {
        loadUserOrders();
    }, []);

    useEffect(() => {
        // Get filter from URL query params
        const params = new URLSearchParams(location.search);
        const statusParam = params.get('status');
        if (statusParam && ['pending', 'confirmed', 'processing', 'delivered', 'cancelled'].includes(statusParam)) {
            setActiveFilter(statusParam);
        } else {
            setActiveFilter('all');
        }
    }, [location.search]);

    useEffect(() => {
        if (orders.length > 0) {
            if (activeFilter === 'all') {
                setFilteredOrders(orders);
            } else {
                setFilteredOrders(orders.filter(order => order.orderStatus === activeFilter));
            }
        } else {
            setFilteredOrders([]);
        }
    }, [orders, activeFilter]);

    const filters = [
        { value: 'all', label: 'All Orders', count: orders.length },
        { value: 'pending', label: 'Pending', count: orders.filter(o => o.orderStatus === 'pending').length },
        { value: 'confirmed', label: 'Confirmed', count: orders.filter(o => o.orderStatus === 'confirmed').length },
        { value: 'processing', label: 'Processing', count: orders.filter(o => ['processing', 'quality_check'].includes(o.orderStatus)).length },
        { value: 'delivered', label: 'Delivered', count: orders.filter(o => o.orderStatus === 'delivered').length },
        { value: 'cancelled', label: 'Cancelled', count: orders.filter(o => o.orderStatus === 'cancelled').length }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-8">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">My Orders</h1>
                    <p className="text-gray-600">View and manage all your orders</p>
                </div>

                {/* Filter Tabs */}
                <div className="bg-white rounded-lg shadow-sm p-2 mb-6 overflow-x-auto">
                    <div className="flex space-x-1 min-w-max">
                        {filters.map((filter) => (
                            <Link
                                key={filter.value}
                                to={`/my-orders${filter.value !== 'all' ? `?status=${filter.value}` : ''}`}
                                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeFilter === filter.value
                                        ? 'bg-blue-600 text-white'
                                        : 'text-gray-600 hover:bg-gray-100'
                                    }`}
                            >
                                {filter.label}
                                {filter.count > 0 && (
                                    <span className={`ml-2 px-1.5 py-0.5 rounded-full text-xs ${activeFilter === filter.value
                                            ? 'bg-blue-500 text-white'
                                            : 'bg-gray-200 text-gray-600'
                                        }`}>
                                        {filter.count}
                                    </span>
                                )}
                            </Link>
                        ))}
                    </div>
                </div>

                {/* Orders List */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <OrderSummary key={order._id} order={order} />
                        ))}
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-md p-12 text-center">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
                            />
                        </svg>
                        <h3 className="text-lg font-semibold text-gray-700 mb-2">No orders found</h3>
                        <p className="text-gray-500 mb-6">
                            {activeFilter === 'all'
                                ? "You haven't placed any orders yet"
                                : `No ${activeFilter} orders found`}
                        </p>
                        {activeFilter !== 'all' && (
                            <Link
                                to="/my-orders"
                                className="text-blue-600 hover:text-blue-700"
                            >
                                View all orders →
                            </Link>
                        )}
                        {activeFilter === 'all' && (
                            <Link
                                to="/services"
                                className="inline-block px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                            >
                                Browse Services
                            </Link>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default MyOrders;