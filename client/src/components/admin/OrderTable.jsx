import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const OrderTable = ({ orders, onStatusChange, onViewDetails }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [newStatus, setNewStatus] = useState('');

    const statusOptions = [
        { value: 'pending', label: 'Order Placed', color: 'yellow' },
        { value: 'confirmed', label: 'Confirmed', color: 'blue' },
        { value: 'pickup_assigned', label: 'Pickup Assigned', color: 'purple' },
        { value: 'collected', label: 'Items Collected', color: 'indigo' },
        { value: 'processing', label: 'Processing', color: 'orange' },
        { value: 'quality_check', label: 'Quality Check', color: 'pink' },
        { value: 'out_for_delivery', label: 'Out for Delivery', color: 'cyan' },
        { value: 'delivered', label: 'Delivered', color: 'green' },
        { value: 'cancelled', label: 'Cancelled', color: 'red' },
    ];

    const getStatusColor = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        const colors = {
            yellow: 'bg-yellow-100 text-yellow-800',
            blue: 'bg-blue-100 text-blue-800',
            purple: 'bg-purple-100 text-purple-800',
            indigo: 'bg-indigo-100 text-indigo-800',
            orange: 'bg-orange-100 text-orange-800',
            pink: 'bg-pink-100 text-pink-800',
            cyan: 'bg-cyan-100 text-cyan-800',
            green: 'bg-green-100 text-green-800',
            red: 'bg-red-100 text-red-800',
        };
        return colors[option?.color || 'gray'] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const option = statusOptions.find(opt => opt.value === status);
        return option?.label || status;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    const handleStatusChange = (order) => {
        setSelectedOrder(order);
        setNewStatus(order.orderStatus);
        setStatusModalOpen(true);
    };

    const handleUpdateStatus = () => {
        if (selectedOrder && newStatus !== selectedOrder.orderStatus) {
            onStatusChange(selectedOrder._id, newStatus);
        }
        setStatusModalOpen(false);
        setSelectedOrder(null);
    };

    return (
        <>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Order ID
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Customer
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Date
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Items
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Total
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Status
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Payment
                            </th>
                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Actions
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {orders.map((order) => (
                            <tr key={order._id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <Link
                                        to={`/admin/orders/${order._id}`}
                                        className="text-sm font-medium text-blue-600 hover:text-blue-800"
                                    >
                                        #{order.orderNumber}
                                    </Link>
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm font-medium text-gray-900">
                                        {order.customerDetails?.name || order.user?.name}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        {order.customerDetails?.phone || order.user?.phone}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {formatDate(order.createdAt)}
                                </td>
                                <td className="px-6 py-4">
                                    <div className="text-sm text-gray-900">
                                        {order.items?.length || 0} items
                                    </div>
                                    <div className="text-xs text-gray-500">
                                        {order.items?.slice(0, 2).map(item => item.serviceName).join(', ')}
                                        {order.items?.length > 2 && '...'}
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {formatCurrency(order.totalAmount)}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="relative group">
                                        <select
                                            value={order.orderStatus}
                                            onChange={(e) => {
                                                if (e.target.value !== order.orderStatus) {
                                                    onStatusChange(order._id, e.target.value);
                                                }
                                            }}
                                            className={`text-sm rounded-full px-3 py-1 font-medium border-0 focus:ring-2 focus:ring-blue-500 cursor-pointer ${getStatusColor(order.orderStatus)}`}
                                        >
                                            {statusOptions.map((opt) => (
                                                <option key={opt.value} value={opt.value}>
                                                    {opt.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${order.paymentStatus === 'paid'
                                            ? 'bg-green-100 text-green-800'
                                            : order.paymentStatus === 'pending'
                                                ? 'bg-yellow-100 text-yellow-800'
                                                : order.paymentStatus === 'failed'
                                                    ? 'bg-red-100 text-red-800'
                                                    : 'bg-gray-100 text-gray-800'
                                        }`}>
                                        {order.paymentStatus === 'paid' ? 'Paid' :
                                            order.paymentStatus === 'pending' ? 'Pending' :
                                                order.paymentStatus === 'failed' ? 'Failed' : 'Refunded'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                    <Link
                                        to={`/admin/orders/${order._id}`}
                                        className="text-blue-600 hover:text-blue-900 mr-3"
                                    >
                                        View
                                    </Link>
                                    <button
                                        onClick={() => handleStatusChange(order)}
                                        className="text-gray-600 hover:text-gray-900"
                                    >
                                        Status
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>

            {/* Status Change Modal */}
            {statusModalOpen && selectedOrder && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Update Order Status</h3>
                        <p className="text-sm text-gray-500 mb-4">
                            Order #{selectedOrder.orderNumber}
                        </p>
                        <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                        >
                            {statusOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={() => setStatusModalOpen(false)}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleUpdateStatus}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Update
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default OrderTable;