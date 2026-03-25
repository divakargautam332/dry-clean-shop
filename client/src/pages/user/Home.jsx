import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useCart } from '../../context/CartContext';
import ServiceCard from '../../components/user/ServiceCard';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const Home = () => {
    const { popularServices, newServices, loading, getActualPrice, formatPrice } = useService();
    const { addToCart } = useCart();
    const [selectedService, setSelectedService] = useState(null);

    const features = [
        {
            icon: '🚚',
            title: 'Free Pickup & Delivery',
            description: 'We pick up and deliver your laundry at your doorstep'
        },
        {
            icon: '✨',
            title: 'Premium Quality',
            description: 'Expert care for all your garments with premium products'
        },
        {
            icon: '⏱️',
            title: 'Express Service',
            description: 'Same day delivery available for urgent needs'
        },
        {
            icon: '💰',
            title: 'Best Price Guarantee',
            description: 'Competitive pricing with no hidden charges'
        }
    ];

    const steps = [
        {
            number: '01',
            title: 'Select Service',
            description: 'Choose from our wide range of laundry services',
            icon: '📱'
        },
        {
            number: '02',
            title: 'Schedule Pickup',
            description: 'Select date and time for free pickup',
            icon: '📅'
        },
        {
            number: '03',
            title: 'We Clean',
            description: 'Professional cleaning with quality check',
            icon: '🧺'
        },
        {
            number: '04',
            title: 'Get Delivered',
            description: 'Fresh, clean clothes delivered to your door',
            icon: '🏠'
        }
    ];

    const testimonials = [
        {
            name: 'Rajesh Sharma',
            location: 'Mumbai',
            rating: 5,
            comment: 'Excellent service! They picked up and delivered on time. Clothes were perfectly cleaned and pressed.',
            image: 'https://randomuser.me/api/portraits/men/1.jpg'
        },
        {
            name: 'Priya Patel',
            location: 'Delhi',
            rating: 5,
            comment: 'Very professional service. My silk saree was handled with care. Highly recommended!',
            image: 'https://randomuser.me/api/portraits/women/2.jpg'
        },
        {
            name: 'Amit Kumar',
            location: 'Bangalore',
            rating: 4,
            comment: 'Great service at reasonable prices. The app is easy to use and tracking is very helpful.',
            image: 'https://randomuser.me/api/portraits/men/3.jpg'
        }
    ];

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    return (
        <div>
            {/* Hero Section */}
            <section className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
                <div className="container mx-auto px-4 py-16 md:py-24">
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        <div>
                            <h1 className="text-4xl md:text-5xl font-bold leading-tight mb-4">
                                Professional Dry Cleaning & Laundry Services
                            </h1>
                            <p className="text-lg text-blue-100 mb-6">
                                We take care of your clothes so you can focus on what matters most.
                                Free pickup and delivery, quality guaranteed.
                            </p>
                            <div className="flex flex-wrap gap-4">
                                <Link
                                    to="/services"
                                    className="bg-white text-blue-600 px-6 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                                >
                                    Book Now
                                </Link>
                                <Link
                                    to="/track-order"
                                    className="border-2 border-white text-white px-6 py-3 rounded-lg font-semibold hover:bg-white hover:text-blue-600 transition-colors"
                                >
                                    Track Order
                                </Link>
                            </div>
                        </div>
                        <div className="hidden md:block">
                            <img
                                src="https://images.unsplash.com/photo-1545173168-9f1947eebb7f?w=500&h=400&fit=crop"
                                alt="Laundry Service"
                                className="rounded-lg shadow-xl"
                            />
                        </div>
                    </div>
                </div>
            </section>

            {/* Features Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">Why Choose Us?</h2>
                        <p className="text-gray-600">We provide the best laundry experience</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {features.map((feature, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 text-center shadow-sm hover:shadow-md transition-shadow">
                                <div className="text-4xl mb-4">{feature.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{feature.title}</h3>
                                <p className="text-gray-500 text-sm">{feature.description}</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Popular Services Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-800 mb-2">Popular Services</h2>
                            <p className="text-gray-600">Most loved by our customers</p>
                        </div>
                        <Link to="/services" className="text-blue-600 hover:text-blue-700 font-medium">
                            View All →
                        </Link>
                    </div>
                    {loading ? (
                        <div className="flex justify-center py-12">
                            <Loader size="lg" />
                        </div>
                    ) : (
                        <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {popularServices.slice(0, 4).map((service) => (
                                <ServiceCard key={service._id} service={service} />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* How It Works Section */}
            <section className="py-16 bg-gray-50">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">How It Works</h2>
                        <p className="text-gray-600">Simple steps to get your laundry done</p>
                    </div>
                    <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {steps.map((step, index) => (
                            <div key={index} className="relative">
                                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                                    <div className="text-3xl mb-3">{step.icon}</div>
                                    <div className="text-4xl font-bold text-blue-600 mb-2">{step.number}</div>
                                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{step.title}</h3>
                                    <p className="text-gray-500 text-sm">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="hidden lg:block absolute top-1/2 -right-3 transform -translate-y-1/2">
                                        <svg className="w-6 h-6 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                        </svg>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Testimonials Section */}
            <section className="py-16">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold text-gray-800 mb-2">What Our Customers Say</h2>
                        <p className="text-gray-600">Trusted by thousands of happy customers</p>
                    </div>
                    <div className="grid md:grid-cols-3 gap-6">
                        {testimonials.map((testimonial, index) => (
                            <div key={index} className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
                                <div className="flex items-center mb-4">
                                    <img
                                        src={testimonial.image}
                                        alt={testimonial.name}
                                        className="w-12 h-12 rounded-full object-cover mr-3"
                                    />
                                    <div>
                                        <h4 className="font-semibold text-gray-800">{testimonial.name}</h4>
                                        <p className="text-xs text-gray-500">{testimonial.location}</p>
                                    </div>
                                </div>
                                <div className="mb-3">{renderStars(testimonial.rating)}</div>
                                <p className="text-gray-600 text-sm italic">"{testimonial.comment}"</p>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* CTA Section */}
            <section className="bg-blue-600 py-16">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold text-white mb-4">Ready to experience the best laundry service?</h2>
                    <p className="text-blue-100 mb-6">Get your first order and enjoy special discounts!</p>
                    <Link
                        to="/services"
                        className="inline-block bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                    >
                        Book Your First Order
                    </Link>
                </div>
            </section>
        </div>
    );
};

export default Home;