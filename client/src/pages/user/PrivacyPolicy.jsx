import React from 'react';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Privacy Policy</h1>
                    <p className="text-gray-500 text-sm mb-6">Last Updated: March 2026</p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Information We Collect</h2>
                            <p className="text-gray-600">We collect information you provide directly to us, such as when you create an account, place an order, or contact us. This includes:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Name and contact information (email, phone number, address)</li>
                                <li>Payment information</li>
                                <li>Order history and preferences</li>
                                <li>Communications with us</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. How We Use Your Information</h2>
                            <p className="text-gray-600">We use the information we collect to:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Process and deliver your orders</li>
                                <li>Communicate with you about your orders</li>
                                <li>Send you promotional offers (with your consent)</li>
                                <li>Improve our services</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Information Sharing</h2>
                            <p className="text-gray-600">We do not sell your personal information. We may share your information with:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Service providers who assist in order fulfillment</li>
                                <li>Law enforcement when required by law</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Data Security</h2>
                            <p className="text-gray-600">We implement appropriate security measures to protect your personal information. However, no method of transmission over the internet is 100% secure.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Your Rights</h2>
                            <p className="text-gray-600">You have the right to:</p>
                            <ul className="list-disc list-inside mt-2 text-gray-600 space-y-1">
                                <li>Access your personal information</li>
                                <li>Correct inaccurate information</li>
                                <li>Request deletion of your information</li>
                                <li>Opt-out of marketing communications</li>
                            </ul>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Contact Us</h2>
                            <p className="text-gray-600">If you have questions about this Privacy Policy, please contact us at:</p>
                            <p className="text-gray-600 mt-2">Email: dipanshuk565@gmail.com<br />Phone: +91 99584 83887</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PrivacyPolicy;