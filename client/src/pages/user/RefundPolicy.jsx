import React from 'react';
import { Link } from 'react-router-dom';

const RefundPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Refund Policy</h1>
                    <p className="text-gray-500 text-sm mb-6">Last Updated: March 2026</p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Refund Eligibility</h2>
                            <p className="text-gray-600">Refunds are considered in the following cases:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Order cancelled before pickup (100% refund)</li>
                                <li>Damaged items (after inspection)</li>
                                <li>Lost items (full compensation)</li>
                                <li>Service quality issues (partial or full refund)</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Non-Refundable Cases</h2>
                            <p className="text-gray-600">Refunds are not provided for:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Normal wear and tear</li>
                                <li>Items with pre-existing damage</li>
                                <li>Delay in service (unless guaranteed express service)</li>
                                <li>Customer dissatisfaction without valid reason</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Refund Process</h2>
                            <p className="text-gray-600">To request a refund, contact us within 24 hours of delivery. Refunds will be processed within 3-5 business days to the original payment method.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Contact for Refunds</h2>
                            <p className="text-gray-600">Email: dipanshuk565@gmail.com<br />Phone: +91 99584 83887<br />Address: E-80/524, Block E, Jhilmil Colony, Delhi, 110095</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default RefundPolicy;