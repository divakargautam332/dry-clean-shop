import React, { useState } from 'react';
import { Link } from 'react-router-dom';

const FAQ = () => {
    const [openSection, setOpenSection] = useState(null);

    const faqCategories = [
        {
            title: 'Order & Booking',
            icon: '📝',
            questions: [
                {
                    q: 'How do I place an order?',
                    a: 'You can place an order by browsing our services, selecting the items you want, adding them to cart, and proceeding to checkout. You\'ll need to provide pickup address and schedule a pickup time.'
                },
                {
                    q: 'Can I modify or cancel my order?',
                    a: 'Yes, you can modify or cancel your order before it is confirmed. Once the order status changes to "Pickup Assigned", modifications may not be possible. Contact our support team for assistance.'
                },
                {
                    q: 'What is the minimum order value?',
                    a: 'There is no minimum order value. However, free pickup and delivery is available for orders above ₹500. For orders below ₹500, a nominal delivery charge of ₹50 applies.'
                }
            ]
        },
        {
            title: 'Services & Pricing',
            icon: '🧺',
            questions: [
                {
                    q: 'What types of services do you offer?',
                    a: 'We offer a wide range of services including dry cleaning, ironing, wash & fold, stain removal, and express service for all types of garments including shirts, pants, suits, ethnic wear, winter wear, and home furnishings.'
                },
                {
                    q: 'How is pricing calculated?',
                    a: 'Pricing is based on the type of service and the item. Each service has a fixed price per item. We also offer discounted prices on bulk orders and combo packages.'
                },
                {
                    q: 'Do you offer express service?',
                    a: 'Yes, we offer express service for urgent requirements. Express orders are processed within 12 hours and delivered the same day. An additional charge of ₹100 applies for express service.'
                }
            ]
        },
        {
            title: 'Pickup & Delivery',
            icon: '🚚',
            questions: [
                {
                    q: 'When do you pick up and deliver?',
                    a: 'We offer flexible pickup and delivery slots from 9:00 AM to 7:00 PM. You can choose your preferred time slot during checkout. Our delivery partners will arrive during the selected time window.'
                },
                {
                    q: 'Is pickup and delivery free?',
                    a: 'Yes, we offer free pickup and delivery for orders above ₹500. For orders below ₹500, a delivery charge of ₹50 is applicable.'
                },
                {
                    q: 'What if I\'m not available during pickup?',
                    a: 'You can leave your items with a neighbor or security guard. Alternatively, you can reschedule your pickup by contacting our support team at least 2 hours before the scheduled time.'
                }
            ]
        },
        {
            title: 'Payment',
            icon: '💰',
            questions: [
                {
                    q: 'What payment methods do you accept?',
                    a: 'We accept Cash on Delivery (COD), UPI, credit/debit cards, net banking, and mobile wallets. All payments are secure and encrypted.'
                },
                {
                    q: 'Is online payment safe?',
                    a: 'Yes, we use industry-standard encryption and secure payment gateways to ensure your payment information is safe and protected.'
                },
                {
                    q: 'When do I pay for my order?',
                    a: 'For COD orders, you can pay when your items are delivered. For online payments, you\'ll need to pay at the time of placing the order.'
                }
            ]
        },
        {
            title: 'Order Tracking',
            icon: '📍',
            questions: [
                {
                    q: 'How can I track my order?',
                    a: 'You can track your order using the "Track Order" page by entering your order number. You can also view real-time status updates in your dashboard after logging in.'
                },
                {
                    q: 'What do the different order statuses mean?',
                    a: 'Order statuses include: Order Placed → Confirmed → Pickup Assigned → Items Collected → Processing → Quality Check → Out for Delivery → Delivered. You\'ll receive notifications at each stage.'
                }
            ]
        },
        {
            title: 'Quality & Care',
            icon: '✨',
            questions: [
                {
                    q: 'How do you ensure quality?',
                    a: 'We have a thorough quality check process where each item is inspected before and after cleaning. Our trained professionals use premium cleaning products and techniques.'
                },
                {
                    q: 'What about delicate fabrics?',
                    a: 'We handle delicate fabrics with special care. You can add special instructions during checkout mentioning any specific requirements like "hand wash only" or "no starch".'
                },
                {
                    q: 'What if my items are damaged?',
                    a: 'We take utmost care of your garments. In the rare event of damage, we have a compensation policy. Please contact our support team within 24 hours of delivery.'
                }
            ]
        }
    ];

    const toggleSection = (index) => {
        setOpenSection(openSection === index ? null : index);
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
                    <p className="text-gray-600">Find answers to common questions about our services</p>
                </div>

                {/* Quick Links */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3 mb-8">
                    {faqCategories.map((category, idx) => (
                        <button
                            key={idx}
                            onClick={() => {
                                const element = document.getElementById(`category-${idx}`);
                                if (element) element.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className="bg-white rounded-lg shadow-sm p-3 text-center hover:shadow-md transition-shadow"
                        >
                            <div className="text-2xl mb-1">{category.icon}</div>
                            <p className="text-xs text-gray-600">{category.title}</p>
                        </button>
                    ))}
                </div>

                {/* FAQ Sections */}
                {faqCategories.map((category, catIndex) => (
                    <div key={catIndex} id={`category-${catIndex}`} className="mb-8">
                        <div className="flex items-center gap-2 mb-4">
                            <span className="text-2xl">{category.icon}</span>
                            <h2 className="text-xl font-semibold text-gray-800">{category.title}</h2>
                        </div>
                        <div className="space-y-3">
                            {category.questions.map((item, qIndex) => {
                                const isOpen = openSection === `${catIndex}-${qIndex}`;
                                return (
                                    <div
                                        key={qIndex}
                                        className="bg-white rounded-lg shadow-sm border border-gray-100 overflow-hidden"
                                    >
                                        <button
                                            onClick={() => toggleSection(`${catIndex}-${qIndex}`)}
                                            className="w-full px-5 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                        >
                                            <span className="font-medium text-gray-800">{item.q}</span>
                                            <svg
                                                className={`w-5 h-5 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                                                fill="none"
                                                stroke="currentColor"
                                                viewBox="0 0 24 24"
                                            >
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                            </svg>
                                        </button>
                                        {isOpen && (
                                            <div className="px-5 pb-4">
                                                <p className="text-gray-600 text-sm">{item.a}</p>
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                ))}

                {/* Still Have Questions */}
                <div className="bg-blue-50 rounded-lg p-6 text-center mt-8">
                    <h3 className="text-lg font-semibold text-blue-800 mb-2">Still have questions?</h3>
                    <p className="text-blue-600 mb-4">We're here to help you</p>
                    <div className="flex flex-wrap justify-center gap-3">
                        <Link
                            to="/contact"
                            className="inline-block px-5 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Contact Support
                        </Link>
                        <a
                            href="tel:+919876543210"
                            className="inline-block px-5 py-2 border border-blue-600 text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        >
                            Call Us
                        </a>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FAQ;