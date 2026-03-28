import React from 'react';
import { Link } from 'react-router-dom';

const CancellationPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Cancellation Policy</h1>
                    <p className="text-gray-500 text-sm mb-6">Last Updated: March 2026</p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Order Cancellation</h2>
                            <p className="text-gray-600">You can cancel your order before pickup:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Before pickup: 100% refund</li>
                                <li>After pickup but before processing: 80% refund</li>
                                <li>After processing started: No refund</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How to Cancel</h2>
                            <p className="text-gray-600">Cancel your order through:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Your account dashboard → My Orders</li>
                                <li>Contact customer support</li>
                                <li>Call us at +91 99584 83887</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Cancellation by Us</h2>
                            <p className="text-gray-600">We may cancel orders due to:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Service unavailable in your area</li>
                                <li>Payment issues</li>
                                <li>Invalid or suspicious orders</li>
                            </ul>
                            <p className="text-gray-600 mt-2">Full refund will be provided in such cases.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Refund Timeline</h2>
                            <p className="text-gray-600">Refunds are processed within 3-5 business days to the original payment method.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CancellationPolicy;