import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useOrder } from '../../context/OrderContext';
import { useAuth } from '../../context/AuthContext';
import OrderStatus from '../../components/user/OrderStatus';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOrderById, cancelOrder, getStatusColor, getStatusLabel, canCancelOrder } = useOrder();
    const { user } = useAuth();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [cancelModalOpen, setCancelModalOpen] = useState(false);
    const [cancelling, setCancelling] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        const result = await getOrderById(id);
        if (result.success) {
            setOrder(result.data);
        } else {
            navigate('/my-orders');
        }
        setLoading(false);
    };

    const handleCancelOrder = async () => {
        setCancelling(true);
        const result = await cancelOrder(order._id, 'Cancelled by user');
        if (result.success) {
            setOrder(result.data);
            toast.success('Order cancelled successfully');
        }
        setCancelling(false);
        setCancelModalOpen(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!order) {
        return null;
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                {/* Header */}
                <div className="mb-6">
                    <Link to="/my-orders" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                        ← Back to Orders
                    </Link>
                    <div className="flex flex-wrap justify-between items-start gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-gray-800">
                                Order #{order.orderNumber}
                            </h1>
                            <p className="text-gray-500 mt-1">
                                Placed on {formatDate(order.createdAt)}
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

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Order Status */}
                        <OrderStatus
                            status={order.orderStatus}
                            statusHistory={order.statusHistory}
                        />

                        {/* Items List */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered</h2>
                            <div className="space-y-3">
                                {order.items.map((item, index) => (
                                    <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                        <div>
                                            <p className="font-medium text-gray-800">{item.serviceName}</p>
                                            <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                            {item.specialInstructions && (
                                                <p className="text-xs text-gray-400 mt-1">
                                                    Instructions: {item.specialInstructions}
                                                </p>
                                            )}
                                        </div>
                                        <p className="font-medium text-gray-800">
                                            {formatCurrency(item.totalPrice)}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
                            <div className="text-gray-600">
                                <p className="font-medium">{order.deliveryAddress?.name}</p>
                                <p>{order.deliveryAddress?.address}</p>
                                <p>{order.deliveryAddress?.city}, {order.deliveryAddress?.state}</p>
                                <p>Pincode: {order.deliveryAddress?.pincode}</p>
                                {order.deliveryAddress?.landmark && (
                                    <p className="text-sm text-gray-500 mt-1">Landmark: {order.deliveryAddress.landmark}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-6">
                        {/* Order Summary */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal</span>
                                    <span>{formatCurrency(order.subtotal)}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charge</span>
                                    <span>{order.deliveryCharge === 0 ? 'Free' : formatCurrency(order.deliveryCharge)}</span>
                                </div>
                                {order.expressCharge > 0 && (
                                    <div className="flex justify-between text-gray-600">
                                        <span>Express Charge</span>
                                        <span>{formatCurrency(order.expressCharge)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span>{formatCurrency(order.gst)}</span>
                                </div>
                                {order.discount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Discount</span>
                                        <span>-{formatCurrency(order.discount)}</span>
                                    </div>
                                )}
                                {order.couponCode && (
                                    <div className="text-xs text-green-600">
                                        Coupon: {order.couponCode}
                                    </div>
                                )}
                                <div className="border-t border-gray-200 pt-2 mt-2">
                                    <div className="flex justify-between font-bold text-gray-800">
                                        <span>Total</span>
                                        <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Pickup Details */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup Details</h2>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Date:</span>
                                    <span className="text-gray-700">{formatDate(order.pickupDate)}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">Time Slot:</span>
                                    <span className="text-gray-700">{order.pickupTimeSlot}</span>
                                </div>
                                {order.isExpress && (
                                    <div className="mt-2 p-2 bg-orange-50 rounded text-orange-700 text-xs">
                                        🚀 Express Service Selected
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* Actions */}
                        {canCancelOrder(order) && (
                            <div className="bg-white rounded-lg shadow-md p-5">
                                <button
                                    onClick={() => setCancelModalOpen(true)}
                                    className="w-full px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50 transition-colors"
                                >
                                    Cancel Order
                                </button>
                            </div>
                        )}

                        {/* Need Help */}
                        <div className="bg-gray-50 rounded-lg p-5 text-center">
                            <h3 className="font-semibold text-gray-800 mb-2">Need Help?</h3>
                            <p className="text-sm text-gray-600 mb-3">Have questions about your order?</p>
                            <Link
                                to="/contact"
                                className="text-blue-600 hover:text-blue-700 text-sm"
                            >
                                Contact Support →
                            </Link>
                        </div>
                    </div>
                </div>
            </div>

            {/* Cancel Confirmation Modal */}
            <ConfirmModal
                isOpen={cancelModalOpen}
                onClose={() => setCancelModalOpen(false)}
                onConfirm={handleCancelOrder}
                title="Cancel Order"
                message="Are you sure you want to cancel this order? This action cannot be undone."
                confirmText={cancelling ? 'Cancelling...' : 'Yes, Cancel Order'}
                cancelText="No, Keep Order"
                confirmVariant="danger"
                loading={cancelling}
            />
        </div>
    );
};

export default OrderDetail;