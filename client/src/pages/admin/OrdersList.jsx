import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { useOrder } from '../../context/OrderContext';
import Loader from '../../components/common/Loader';
import OrderTable from '../../components/admin/OrderTable';
import { toast } from 'react-toastify';

const OrdersList = () => {
    const { getAllOrders, updateOrderStatus, formatCurrency, formatDate } = useAdmin();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        status: '',
        search: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1
    });

    useEffect(() => {
        loadOrders();
    }, [filters]);

    const loadOrders = async () => {
        setLoading(true);
        const result = await getAllOrders(filters);
        if (result.success) {
            setOrders(result.data);
            setPagination(result.pagination);
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            toast.success(`Order status updated to ${newStatus}`);
            loadOrders();
        } else {
            toast.error(result.message);
        }
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handleSearch = (e) => {
        e.preventDefault();
        loadOrders();
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    const statusOptions = [
        { value: '', label: 'All Orders' },
        { value: 'pending', label: 'Pending' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pickup_assigned', label: 'Pickup Assigned' },
        { value: 'collected', label: 'Collected' },
        { value: 'processing', label: 'Processing' },
        { value: 'quality_check', label: 'Quality Check' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    if (loading && orders.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>
                <p className="text-gray-500">View and manage all customer orders</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status Filter</label>
                        <select
                            name="status"
                            value={filters.status}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Order ID, Customer name, Phone"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ status: '', search: '', page: 1, limit: 20 })}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <OrderTable
                    orders={orders}
                    onStatusChange={handleStatusChange}
                />

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Showing {((pagination.page - 1) * filters.limit) + 1} to {Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total} orders
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                                {pagination.page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrdersList;