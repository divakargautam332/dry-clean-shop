import React, { useState } from 'react';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Contact = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        subject: '',
        message: ''
    });
    const [loading, setLoading] = useState(false);
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};
        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.message.trim()) newErrors.message = 'Message is required';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        try {
            const response = await fetch('http://localhost:5000/api/contact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const data = await response.json();

            if (data.success) {
                toast.success('Message sent successfully! We will get back to you soon.');
                setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
            } else {
                toast.error(data.message || 'Failed to send message');
            }
        } catch (error) {
            console.error('Contact error:', error);
            toast.error('Failed to send message. Please try again later.');
        } finally {
            setLoading(false);
        }
    };

    const contactInfo = [
        {
            icon: '📞',
            title: 'Phone',
            details: ['+91 99584 83887', '+91 82873 77620'],
            action: 'Call Now',
            link: 'tel:+919958483887'
        },
        {
            icon: '✉️',
            title: 'Email',
            details: ['dipanshuk565@gmail.com', 'divakargautam7900@gmail.com'],
            action: 'Send Email',
            link: 'mailto:dipanshuk565@gmail.com?subject=Inquiry%20from%20Website&body=Hello%2C%20I%20would%20like%20to%20know%20more%20about%20your%20services...'
        },
        {
            icon: '📍',
            title: 'Address',
            details: ['E-80/524, Block E, Jhilmil Colony, Delhi, 110095'],
            action: 'Get Directions',
            link: 'https://www.google.com/maps/place/Deep+DryCleaners/@28.6687428,77.3080162,17z/data=!3m1!4b1!4m6!3m5!1s0x390cfb9bcb2ce397:0x2fca2385f87f14b5!8m2!3d28.6687428!4d77.3080162!16s%2Fg%2F11n00nnzsf!18m1!1e1?entry=ttu&g_ep=EgoyMDI2MDMyMy4xIKXMDSoASAFQAw%3D%3D'
        },
        {
            icon: '⏰',
            title: 'Business Hours',
            details: ['Monday - Sunday: 10:00 AM - 9:30 PM'],
            action: ''
        }
    ];

    const faqs = [
        {
            question: 'How do I book a service?',
            answer: 'You can book a service by clicking on the "Services" tab, selecting your desired service, and adding it to cart. Then proceed to checkout to schedule pickup.'
        },
        {
            question: 'What is the processing time?',
            answer: 'Standard processing time is 24-48 hours. Express service is available for same-day delivery at an additional charge.'
        },
        {
            question: 'Do you offer free pickup and delivery?',
            answer: 'Yes, we offer free pickup and delivery for orders above ₹500. For orders below ₹500, a nominal delivery charge of ₹50 applies.'
        },
        {
            question: 'How can I track my order?',
            answer: 'You can track your order using the "Track Order" page by entering your order number, or check your order status in your dashboard.'
        }
    ];

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Contact Us</h1>
                    <p className="text-gray-600">Have questions? We'd love to hear from you</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Contact Info Cards */}
                    <div className="lg:col-span-1 space-y-4">
                        {contactInfo.map((info, index) => (
                            <div key={index} className="bg-white rounded-lg shadow-md p-5">
                                <div className="text-3xl mb-3">{info.icon}</div>
                                <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                                {info.details.map((detail, i) => (
                                    <p key={i} className="text-gray-600 text-sm mb-1">{detail}</p>
                                ))}
                                {info.action && (
                                    <a
                                        href={info.link}
                                        className="inline-block mt-3 text-blue-600 hover:text-blue-700 text-sm font-medium"
                                    >
                                        {info.action} →
                                    </a>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Contact Form */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Send us a Message</h2>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Your Name"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        required
                                    />
                                </div>
                                <div className="grid md:grid-cols-2 gap-4">
                                    <Input
                                        label="Phone Number (Optional)"
                                        name="phone"
                                        type="tel"
                                        value={formData.phone}
                                        onChange={handleChange}
                                    />
                                    <Input
                                        label="Subject"
                                        name="subject"
                                        value={formData.subject}
                                        onChange={handleChange}
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
                                    <textarea
                                        name="message"
                                        rows={5}
                                        value={formData.message}
                                        onChange={handleChange}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="How can we help you?"
                                    />
                                    {errors.message && <p className="mt-1 text-sm text-red-500">{errors.message}</p>}
                                </div>
                                <Button type="submit" variant="primary" fullWidth loading={loading}>
                                    Send Message
                                </Button>
                            </form>
                        </div>

                        {/* FAQ Section */}
                        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                            <h2 className="text-xl font-semibold text-gray-800 mb-4">Frequently Asked Questions</h2>
                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <details key={index} className="group">
                                        <summary className="flex justify-between items-center cursor-pointer list-none">
                                            <span className="font-medium text-gray-800">{faq.question}</span>
                                            <span className="transition group-open:rotate-180">
                                                <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                                </svg>
                                            </span>
                                        </summary>
                                        <p className="text-gray-600 text-sm mt-2 pl-4">{faq.answer}</p>
                                    </details>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Map Section */}
                <div className="mt-8">
                    <div className="bg-white rounded-lg shadow-md overflow-hidden">
                        <iframe
                            title="Store Location"
                            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3770.6075208251536!2d72.847722!3d19.125997!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9f1a8f5b5b5%3A0x5b5b5b5b5b5b5b5b!2sMumbai!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                            width="100%"
                            height="300"
                            style={{ border: 0 }}
                            allowFullScreen
                            loading="lazy"
                            referrerPolicy="no-referrer-when-downgrade"
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;