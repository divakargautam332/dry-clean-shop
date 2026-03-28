import React from 'react';
import { Link } from 'react-router-dom';

const ShippingPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Shipping Policy</h1>
                    <p className="text-gray-500 text-sm mb-6">Last Updated: March 2026</p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Pickup & Delivery</h2>
                            <p className="text-gray-600">We offer free pickup and delivery for orders above ₹500. For orders below ₹500, a delivery charge of ₹50 applies.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Service Areas</h2>
                            <p className="text-gray-600">We currently serve Delhi NCR region. Please contact us to confirm service availability in your area.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Processing Time</h2>
                            <p className="text-gray-600">Standard processing time is 24-48 hours. Express service is available for same-day delivery at additional charge.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Delivery Time Slots</h2>
                            <p className="text-gray-600">Choose from available time slots: 9-11 AM, 11-1 PM, 1-3 PM, 3-5 PM, 5-7 PM.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Delayed Delivery</h2>
                            <p className="text-gray-600">In case of delay due to unforeseen circumstances, we will notify you immediately. Express service guaranteed delivery within promised timeframe.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ShippingPolicy;