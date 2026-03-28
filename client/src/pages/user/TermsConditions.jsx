import React from 'react';
import { Link } from 'react-router-dom';

const TermsConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50 py-12">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/" className="text-blue-600 hover:text-blue-700">
                        ← Back to Home
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-4">Terms & Conditions</h1>
                    <p className="text-gray-500 text-sm mb-6">Last Updated: March 2026</p>

                    <div className="space-y-6">
                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">1. Acceptance of Terms</h2>
                            <p className="text-gray-600">By accessing or using DryCleanPro, you agree to be bound by these Terms & Conditions. If you do not agree, please do not use our services.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">2. Our Services</h2>
                            <p className="text-gray-600">We provide professional dry cleaning and laundry services including pickup and delivery. Service availability may vary by location.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">3. Account Registration</h2>
                            <p className="text-gray-600">You must be 18 years or older to create an account. You are responsible for maintaining the confidentiality of your account information.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">4. Pricing and Payment</h2>
                            <p className="text-gray-600">Prices are subject to change without notice. We accept various payment methods including credit cards, UPI, and cash on delivery.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">5. Liability for Garments</h2>
                            <p className="text-gray-600">We take utmost care of your garments. However, we are not liable for normal wear and tear, pre-existing damage, or damage from following manufacturer's care instructions.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">6. Cancellation and Refunds</h2>
                            <p className="text-gray-600">Orders can be cancelled before pickup. Refunds are processed according to our Refund Policy.</p>
                        </section>

                        <section>
                            <h2 className="text-xl font-semibold text-gray-800 mb-3">7. Changes to Terms</h2>
                            <p className="text-gray-600">We may modify these terms at any time. Continued use of our services constitutes acceptance of the modified terms.</p>
                        </section>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default TermsConditions;