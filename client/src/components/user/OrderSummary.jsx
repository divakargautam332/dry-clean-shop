import React from 'react';
import { Link } from 'react-router-dom';

const OrderSummary = ({ order }) => {
    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
        });
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            pickup_assigned: 'bg-purple-100 text-purple-800',
            collected: 'bg-indigo-100 text-indigo-800',
            processing: 'bg-orange-100 text-orange-800',
            quality_check: 'bg-pink-100 text-pink-800',
            out_for_delivery: 'bg-cyan-100 text-cyan-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
        };
        return colors[status] || colors.pending;
    };

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
            cancelled: 'Cancelled',
        };
        return labels[status] || status;
    };

    return (
        <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
            <div className="p-4 border-b border-gray-100">
                <div className="flex flex-wrap justify-between items-start gap-2">
                    <div>
                        <Link to={`/orders/${order._id}`}>
                            <h3 className="text-lg font-semibold text-blue-600 hover:underline">
                                #{order.orderNumber}
                            </h3>
                        </Link>
                        <p className="text-sm text-gray-500">
                            {formatDate(order.createdAt)}
                        </p>
                    </div>
                    <div className="text-right">
                        <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(order.orderStatus)}`}>
                            {getStatusLabel(order.orderStatus)}
                        </span>
                        <p className="text-sm text-gray-500 mt-1">
                            {order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}
                        </p>
                    </div>
                </div>
            </div>

            <div className="p-4">
                {/* Items List */}
                <div className="space-y-2">
                    {order.items.slice(0, 3).map((item, index) => (
                        <div key={index} className="flex justify-between text-sm">
                            <span className="text-gray-600">
                                {item.quantity}x {item.serviceName}
                            </span>
                            <span className="font-medium">₹{item.totalPrice}</span>
                        </div>
                    ))}
                    {order.items.length > 3 && (
                        <p className="text-sm text-gray-500">
                            +{order.items.length - 3} more items
                        </p>
                    )}
                </div>

                {/* Divider */}
                <div className="border-t border-gray-100 my-3"></div>

                {/* Total */}
                <div className="flex justify-between items-center font-semibold">
                    <span>Total Amount</span>
                    <span className="text-lg text-blue-600">₹{order.totalAmount}</span>
                </div>

                {/* Delivery Address */}
                {order.deliveryAddress && (
                    <div className="mt-3 pt-3 border-t border-gray-100">
                        <p className="text-xs text-gray-500">Delivery Address:</p>
                        <p className="text-sm text-gray-700">
                            {order.deliveryAddress.name}, {order.deliveryAddress.address},<br />
                            {order.deliveryAddress.city}, {order.deliveryAddress.state} - {order.deliveryAddress.pincode}
                        </p>
                    </div>
                )}
            </div>

            {/* Action Buttons */}
            <div className="bg-gray-50 px-4 py-3 flex flex-wrap gap-2 justify-between">
                <Link
                    to={`/orders/${order._id}`}
                    className="text-blue-600 hover:text-blue-700 text-sm font-medium"
                >
                    View Details →
                </Link>
                {order.orderStatus === 'delivered' && !order.review && (
                    <Link
                        to={`/orders/${order._id}/review`}
                        className="text-green-600 hover:text-green-700 text-sm font-medium"
                    >
                        Write a Review
                    </Link>
                )}
                {(order.orderStatus === 'pending' || order.orderStatus === 'confirmed') && (
                    <button
                        className="text-red-600 hover:text-red-700 text-sm font-medium"
                        onClick={() => {/* Handle cancel */ }}
                    >
                        Cancel Order
                    </button>
                )}
            </div>
        </div>
    );
};

export default OrderSummary;