import React, { useState } from 'react';
import { useOrder } from '../../context/OrderContext';
import OrderStatus from '../../components/user/OrderStatus';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';

const TrackOrder = () => {
    const { trackOrder } = useOrder();
    const [orderNumber, setOrderNumber] = useState('');
    const [orderData, setOrderData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleTrackOrder = async (e) => {
        e.preventDefault();
        if (!orderNumber.trim()) {
            setError('Please enter an order number');
            return;
        }

        setLoading(true);
        setError('');
        const result = await trackOrder(orderNumber);

        if (result.success) {
            setOrderData(result.data);
        } else {
            setError(result.message);
            setOrderData(null);
        }
        setLoading(false);
    };

    const formatDate = (date) => {
        if (!date) return 'N/A';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
        });
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
                    <p className="text-gray-600">Enter your order number to track the status</p>
                </div>

                {/* Search Form */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                    <form onSubmit={handleTrackOrder} className="flex flex-col sm:flex-row gap-3">
                        <input
                            type="text"
                            value={orderNumber}
                            onChange={(e) => setOrderNumber(e.target.value)}
                            placeholder="Enter order number (e.g., DRY202412010001)"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                        <Button
                            type="submit"
                            variant="primary"
                            disabled={loading}
                            className="px-6"
                        >
                            {loading ? 'Tracking...' : 'Track Order'}
                        </Button>
                    </form>
                    {error && (
                        <p className="mt-3 text-red-500 text-sm">{error}</p>
                    )}
                </div>

                {/* Order Details */}
                {orderData && (
                    <div className="space-y-6">
                        {/* Order Info Card */}
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                                <div>
                                    <p className="text-sm text-gray-500">Order Number</p>
                                    <p className="text-lg font-semibold text-gray-800">{orderData.orderNumber}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Estimated Delivery</p>
                                    <p className="text-lg font-semibold text-gray-800">
                                        {orderData.estimatedDelivery ? formatDate(orderData.estimatedDelivery) : 'Pending'}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-500">Current Status</p>
                                    <span className={`inline-block px-3 py-1 rounded-full text-sm font-medium ${orderData.status === 'delivered' ? 'bg-green-100 text-green-800' :
                                            orderData.status === 'cancelled' ? 'bg-red-100 text-red-800' :
                                                'bg-blue-100 text-blue-800'
                                        }`}>
                                        {orderData.status === 'pending' ? 'Order Placed' :
                                            orderData.status === 'confirmed' ? 'Confirmed' :
                                                orderData.status === 'pickup_assigned' ? 'Pickup Assigned' :
                                                    orderData.status === 'collected' ? 'Items Collected' :
                                                        orderData.status === 'processing' ? 'Processing' :
                                                            orderData.status === 'quality_check' ? 'Quality Check' :
                                                                orderData.status === 'out_for_delivery' ? 'Out for Delivery' :
                                                                    orderData.status === 'delivered' ? 'Delivered' :
                                                                        orderData.status === 'cancelled' ? 'Cancelled' : orderData.status}
                                    </span>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        <OrderStatus
                            status={orderData.status}
                            statusHistory={orderData.statusHistory}
                        />

                        {/* Items List */}
                        {orderData.items && orderData.items.length > 0 && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h3 className="text-lg font-semibold text-gray-800 mb-4">Items Ordered</h3>
                                <div className="space-y-2">
                                    {orderData.items.map((item, index) => (
                                        <div key={index} className="flex justify-between py-2 border-b border-gray-100 last:border-0">
                                            <span className="text-gray-700">{item.quantity}x {item.name}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Help Section */}
                        <div className="bg-blue-50 rounded-lg p-6 text-center">
                            <h3 className="text-lg font-semibold text-blue-800 mb-2">Need Help?</h3>
                            <p className="text-blue-600 mb-4">Having trouble tracking your order? Contact our support team</p>
                            <div className="flex justify-center space-x-4">
                                <a href="tel:+919876543210" className="text-blue-600 hover:text-blue-700">
                                    📞 Call Us
                                </a>
                                <a href="mailto:support@drycleanpro.com" className="text-blue-600 hover:text-blue-700">
                                    ✉️ Email Support
                                </a>
                                <a href="/contact" className="text-blue-600 hover:text-blue-700">
                                    💬 Live Chat
                                </a>
                            </div>
                        </div>
                    </div>
                )}

                {/* Sample Order Info */}
                {!orderData && !loading && (
                    <div className="bg-gray-100 rounded-lg p-6 text-center">
                        <p className="text-gray-600 mb-2">Don't have an order number?</p>
                        <p className="text-sm text-gray-500">
                            Your order number is sent to your registered email and phone after placing an order.
                            You can also find it in your order history after logging in.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default TrackOrder;