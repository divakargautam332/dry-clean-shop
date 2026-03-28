import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import { useOrder } from '../../context/OrderContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const OrderDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getOrderById, updateOrderStatus, updatePaymentStatus, formatCurrency, formatDate } = useAdmin();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [statusModalOpen, setStatusModalOpen] = useState(false);
    const [paymentModalOpen, setPaymentModalOpen] = useState(false);
    const [selectedStatus, setSelectedStatus] = useState('');
    const [selectedPaymentStatus, setSelectedPaymentStatus] = useState('');
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        loadOrder();
    }, [id]);

    const loadOrder = async () => {
        setLoading(true);
        const result = await getOrderById(id);
        if (result.success) {
            setOrder(result.data);
            setSelectedStatus(result.data.orderStatus);
            setSelectedPaymentStatus(result.data.paymentStatus);
        } else {
            navigate('/admin/orders');
        }
        setLoading(false);
    };

    const handleStatusUpdate = async () => {
        setUpdating(true);
        const result = await updateOrderStatus(id, selectedStatus);
        if (result.success) {
            setOrder(result.data);
            toast.success('Order status updated successfully');
            setStatusModalOpen(false);
        } else {
            toast.error(result.message);
        }
        setUpdating(false);
    };

    const handlePaymentUpdate = async () => {
        setUpdating(true);
        const result = await updatePaymentStatus(id, selectedPaymentStatus);
        if (result.success) {
            setOrder(result.data);
            toast.success('Payment status updated successfully');
            setPaymentModalOpen(false);
        } else {
            toast.error(result.message);
        }
        setUpdating(false);
    };

    // ✅ Function to open Google Maps with address
    const openGoogleMaps = (address) => {
        if (!address) {
            toast.error('Address not available');
            return;
        }

        // Create full address string
        const fullAddress = `${address.name}, ${address.address}, ${address.city}, ${address.state} - ${address.pincode}`;
        const encodedAddress = encodeURIComponent(fullAddress);
        const mapsUrl = `https://www.google.com/maps/search/${encodedAddress}`;

        window.open(mapsUrl, '_blank');
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
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
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
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    };

    const getPaymentStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            failed: 'bg-red-100 text-red-800',
            refunded: 'bg-orange-100 text-orange-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const statusOptions = [
        { value: 'pending', label: 'Order Placed' },
        { value: 'confirmed', label: 'Confirmed' },
        { value: 'pickup_assigned', label: 'Pickup Assigned' },
        { value: 'collected', label: 'Items Collected' },
        { value: 'processing', label: 'Processing' },
        { value: 'quality_check', label: 'Quality Check' },
        { value: 'out_for_delivery', label: 'Out for Delivery' },
        { value: 'delivered', label: 'Delivered' },
        { value: 'cancelled', label: 'Cancelled' }
    ];

    const paymentOptions = [
        { value: 'pending', label: 'Pending' },
        { value: 'paid', label: 'Paid' },
        { value: 'failed', label: 'Failed' },
        { value: 'refunded', label: 'Refunded' }
    ];

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    if (!order) return null;

    return (
        <div className="p-6 max-w-6xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <Link to="/admin/orders" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Orders
                </Link>
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Order #{order.orderNumber}</h1>
                        <p className="text-gray-500 mt-1">Placed on {formatDate(order.createdAt)}</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStatusModalOpen(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Update Status
                        </button>
                        <button
                            onClick={() => setPaymentModalOpen(true)}
                            className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50"
                        >
                            Update Payment
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Customer Info */}
                    <div className="bg-white rounded-lg shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Customer Information</h2>
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <p className="text-sm text-gray-500">Name</p>
                                <p className="font-medium">{order.customerDetails?.name || order.user?.name}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Email</p>
                                <p className="font-medium">{order.customerDetails?.email || order.user?.email}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">Phone</p>
                                <p className="font-medium">{order.customerDetails?.phone || order.user?.phone}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500">User ID</p>
                                <p className="font-mono text-sm">{order.user?._id}</p>
                            </div>
                        </div>
                    </div>

                    {/* Items Ordered */}
                    <div className="bg-white rounded-lg shadow-md p-5">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered</h2>
                        <div className="space-y-3">
                            {order.items.map((item, index) => (
                                <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                    <div>
                                        <p className="font-medium text-gray-800">{item.serviceName}</p>
                                        <p className="text-sm text-gray-500">Quantity: {item.quantity}</p>
                                        {item.specialInstructions && (
                                            <p className="text-xs text-gray-400 mt-1">Instructions: {item.specialInstructions}</p>
                                        )}
                                    </div>
                                    <p className="font-medium text-gray-800">{formatCurrency(item.totalPrice)}</p>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* ✅ Addresses with Map Buttons */}
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Pickup Address */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Pickup Address</h2>
                                <button
                                    onClick={() => openGoogleMaps(order.pickupAddress)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100 transition-colors text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Open in Maps
                                </button>
                            </div>
                            <div className="text-gray-600">
                                <p className="font-medium">{order.pickupAddress?.name}</p>
                                <p>{order.pickupAddress?.address}</p>
                                <p>{order.pickupAddress?.city}, {order.pickupAddress?.state}</p>
                                <p>Pincode: {order.pickupAddress?.pincode}</p>
                                {order.pickupAddress?.landmark && (
                                    <p className="text-sm text-gray-500 mt-1">Landmark: {order.pickupAddress.landmark}</p>
                                )}
                            </div>
                        </div>

                        {/* Delivery Address */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Delivery Address</h2>
                                <button
                                    onClick={() => openGoogleMaps(order.deliveryAddress)}
                                    className="flex items-center gap-2 px-3 py-1.5 bg-green-50 text-green-600 rounded-lg hover:bg-green-100 transition-colors text-sm"
                                >
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
                                    </svg>
                                    Open in Maps
                                </button>
                            </div>
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

                    {/* Status History */}
                    {order.statusHistory && order.statusHistory.length > 0 && (
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Status History</h2>
                            <div className="space-y-2">
                                {order.statusHistory.slice().reverse().map((history, index) => (
                                    <div key={index} className="flex items-start gap-3 text-sm">
                                        <span className="text-gray-400 text-xs whitespace-nowrap">
                                            {formatDate(history.timestamp)}
                                        </span>
                                        <span className={`px-2 py-0.5 rounded-full text-xs ${getStatusColor(history.status)}`}>
                                            {getStatusLabel(history.status)}
                                        </span>
                                        {history.note && (
                                            <span className="text-gray-500 text-xs">{history.note}</span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
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
                                <div className="text-xs text-green-600">Coupon: {order.couponCode}</div>
                            )}
                            <div className="border-t border-gray-200 pt-2 mt-2">
                                <div className="flex justify-between font-bold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-blue-600">{formatCurrency(order.totalAmount)}</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Status Cards */}
                    <div className="bg-white rounded-lg shadow-md p-5">
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Order Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-sm ${getStatusColor(order.orderStatus)}`}>
                                    {getStatusLabel(order.orderStatus)}
                                </span>
                            </div>
                        </div>
                        <div className="mb-4">
                            <p className="text-sm text-gray-500">Payment Status</p>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-1 rounded-full text-sm ${getPaymentStatusColor(order.paymentStatus)}`}>
                                    {order.paymentStatus === 'paid' ? 'Paid' :
                                        order.paymentStatus === 'pending' ? 'Pending' :
                                            order.paymentStatus === 'failed' ? 'Failed' : 'Refunded'}
                                </span>
                            </div>
                        </div>
                        <div>
                            <p className="text-sm text-gray-500">Payment Method</p>
                            <p className="font-medium mt-1">
                                {order.paymentMethod === 'cod' ? 'Cash on Delivery' :
                                    order.paymentMethod === 'online' ? 'Online Payment' : 'Wallet'}
                            </p>
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
                                    🚀 Express Service
                                </div>
                            )}
                            {order.specialInstructions && (
                                <div className="mt-2">
                                    <p className="text-gray-500 text-xs">Special Instructions:</p>
                                    <p className="text-gray-700 text-sm mt-1">{order.specialInstructions}</p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            <ConfirmModal
                isOpen={statusModalOpen}
                onClose={() => setStatusModalOpen(false)}
                onConfirm={handleStatusUpdate}
                title="Update Order Status"
                message={
                    <>
                        <p className="text-gray-600 mb-3">Select new status for this order:</p>
                        <select
                            value={selectedStatus}
                            onChange={(e) => setSelectedStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {statusOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </>
                }
                confirmText={updating ? 'Updating...' : 'Update'}
                cancelText="Cancel"
                confirmVariant="primary"
                loading={updating}
            />

            {/* Payment Update Modal */}
            <ConfirmModal
                isOpen={paymentModalOpen}
                onClose={() => setPaymentModalOpen(false)}
                onConfirm={handlePaymentUpdate}
                title="Update Payment Status"
                message={
                    <>
                        <p className="text-gray-600 mb-3">Select new payment status:</p>
                        <select
                            value={selectedPaymentStatus}
                            onChange={(e) => setSelectedPaymentStatus(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {paymentOptions.map(opt => (
                                <option key={opt.value} value={opt.value}>{opt.label}</option>
                            ))}
                        </select>
                    </>
                }
                confirmText={updating ? 'Updating...' : 'Update'}
                cancelText="Cancel"
                confirmVariant="primary"
                loading={updating}
            />
        </div>
    );
};

export default OrderDetails;