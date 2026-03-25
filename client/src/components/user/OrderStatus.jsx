import React from 'react';

const OrderStatus = ({ status, statusHistory }) => {
    const statusSteps = [
        { key: 'pending', label: 'Order Placed', icon: '📝' },
        { key: 'confirmed', label: 'Confirmed', icon: '✅' },
        { key: 'pickup_assigned', label: 'Pickup Assigned', icon: '🚗' },
        { key: 'collected', label: 'Items Collected', icon: '📦' },
        { key: 'processing', label: 'Processing', icon: '🧺' },
        { key: 'quality_check', label: 'Quality Check', icon: '🔍' },
        { key: 'out_for_delivery', label: 'Out for Delivery', icon: '🚚' },
        { key: 'delivered', label: 'Delivered', icon: '🏠' },
    ];

    const statusOrder = [
        'pending', 'confirmed', 'pickup_assigned', 'collected',
        'processing', 'quality_check', 'out_for_delivery', 'delivered'
    ];

    const currentIndex = statusOrder.indexOf(status);
    const isCancelled = status === 'cancelled';

    const getStatusColor = (stepIndex) => {
        if (isCancelled) return 'bg-red-500';
        if (stepIndex < currentIndex) return 'bg-green-500';
        if (stepIndex === currentIndex) return 'bg-blue-500 animate-pulse';
        return 'bg-gray-300';
    };

    const formatDate = (date) => {
        if (!date) return '';
        return new Date(date).toLocaleDateString('en-IN', {
            day: 'numeric',
            month: 'short',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (isCancelled) {
        return (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-3">
                    <span className="text-2xl">❌</span>
                    <div>
                        <h3 className="font-semibold text-red-800">Order Cancelled</h3>
                        <p className="text-sm text-red-600">
                            This order has been cancelled.
                            {statusHistory?.find(h => h.status === 'cancelled')?.note &&
                                ` Reason: ${statusHistory.find(h => h.status === 'cancelled').note}`
                            }
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-6">Order Status</h3>

            {/* Desktop Timeline */}
            <div className="hidden md:block">
                <div className="relative">
                    {/* Progress Line */}
                    <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                        <div
                            className="h-full bg-green-500 transition-all duration-500"
                            style={{ width: `${(currentIndex / (statusSteps.length - 1)) * 100}%` }}
                        />
                    </div>

                    {/* Steps */}
                    <div className="relative flex justify-between">
                        {statusSteps.map((step, index) => (
                            <div key={step.key} className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center text-white z-10 transition-all ${getStatusColor(index)}`}
                                >
                                    <span className="text-lg">{step.icon}</span>
                                </div>
                                <p className={`text-xs font-medium mt-2 text-center ${index <= currentIndex ? 'text-gray-800' : 'text-gray-400'
                                    }`}>
                                    {step.label}
                                </p>
                                {index === currentIndex && (
                                    <p className="text-xs text-blue-500 mt-1">Current</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Mobile Timeline (Vertical) */}
            <div className="md:hidden space-y-4">
                {statusSteps.map((step, index) => (
                    <div key={step.key} className="flex items-start space-x-3">
                        <div className="relative">
                            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white z-10 ${getStatusColor(index)}`}>
                                <span className="text-sm">{step.icon}</span>
                            </div>
                            {index < statusSteps.length - 1 && (
                                <div className={`absolute top-8 left-3.5 w-0.5 h-12 ${index < currentIndex ? 'bg-green-500' : 'bg-gray-300'
                                    }`} />
                            )}
                        </div>
                        <div className="flex-1 pt-1">
                            <p className={`text-sm font-medium ${index <= currentIndex ? 'text-gray-800' : 'text-gray-400'}`}>
                                {step.label}
                            </p>
                            {index === currentIndex && (
                                <p className="text-xs text-blue-500">Current Status</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>

            {/* Status History */}
            {statusHistory && statusHistory.length > 0 && (
                <div className="mt-6 pt-6 border-t border-gray-100">
                    <h4 className="text-sm font-semibold text-gray-700 mb-3">Status History</h4>
                    <div className="space-y-2">
                        {statusHistory.slice().reverse().map((history, index) => (
                            <div key={index} className="flex items-start space-x-3 text-sm">
                                <span className="text-gray-400 text-xs whitespace-nowrap">
                                    {formatDate(history.timestamp)}
                                </span>
                                <span className="text-gray-600">
                                    {history.status === 'pending' ? 'Order Placed' :
                                        history.status === 'confirmed' ? 'Order Confirmed' :
                                            history.status === 'pickup_assigned' ? 'Pickup Assigned' :
                                                history.status === 'collected' ? 'Items Collected' :
                                                    history.status === 'processing' ? 'Processing Started' :
                                                        history.status === 'quality_check' ? 'Quality Check' :
                                                            history.status === 'out_for_delivery' ? 'Out for Delivery' :
                                                                history.status === 'delivered' ? 'Delivered' :
                                                                    history.status}
                                </span>
                                {history.note && (
                                    <span className="text-gray-400 text-xs">- {history.note}</span>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default OrderStatus;