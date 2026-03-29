import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const WriteReview = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { getOrderById, canReviewOrder } = useOrder();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [formData, setFormData] = useState({
        serviceId: '',
        rating: 5,
        title: '',
        comment: '',
        pros: '',
        cons: ''
    });

    useEffect(() => {
        loadOrder();
    }, [orderId]);

    const loadOrder = async () => {
        setLoading(true);
        const result = await getOrderById(orderId);
        if (result.success) {
            setOrder(result.data);
        } else {
            toast.error('Order not found');
            navigate('/my-orders');
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.comment.trim()) {
            toast.error('Please write a review');
            return;
        }

        setSubmitting(true);

        try {
            const token = localStorage.getItem('token');
            console.log('📝 Submitting review for order:', orderId);

            const response = await fetch('https://dry-clean-shop-1.onrender.com/api/reviews', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify({
                    orderId: orderId,
                    serviceId: formData.serviceId || null,
                    rating: formData.rating,
                    title: formData.title || `Rating: ${formData.rating}/5`,
                    comment: formData.comment,
                    pros: formData.pros,
                    cons: formData.cons
                })
            });

            console.log('📥 Response status:', response.status);
            const data = await response.json();
            console.log('📥 Review response:', data);

            if (data.success) {
                toast.success('Review submitted successfully!');
                // ✅ Small delay before redirect to avoid 500 error
                setTimeout(() => {
                    navigate('/my-orders');
                }, 1000);
            } else {
                toast.error(data.message || 'Failed to submit review');
            }
        } catch (error) {
            console.error('❌ Submit review error:', error);
            toast.error('Failed to submit review. Please try again.');
        } finally {
            setSubmitting(false);
        }
    };

    const handleRatingChange = (rating) => {
        setFormData({ ...formData, rating });
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">Loading...</div>
            </div>
        );
    }

    if (!order || !canReviewOrder(order)) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Cannot Review This Order</h1>
                    <p className="text-gray-600 mb-6">You can only review delivered orders that haven't been reviewed yet.</p>
                    <Link to="/my-orders" className="text-blue-600 hover:text-blue-700">
                        Back to My Orders →
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-3xl">
                <div className="mb-6">
                    <Link to="/my-orders" className="text-blue-600 hover:text-blue-700">
                        ← Back to Orders
                    </Link>
                </div>

                <div className="bg-white rounded-lg shadow-md p-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">Write a Review</h1>
                    <p className="text-gray-600 mb-6">
                        Order #{order.orderNumber} - {order.items.length} item(s)
                    </p>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Service Selection */}
                        {order.items.length > 1 && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Which service are you reviewing?
                                </label>
                                <select
                                    value={formData.serviceId}
                                    onChange={(e) => setFormData({ ...formData, serviceId: e.target.value })}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="">Overall Order Review</option>
                                    {order.items.map((item, idx) => (
                                        <option key={idx} value={item.service}>
                                            {item.serviceName} (x{item.quantity})
                                        </option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {/* Rating Stars */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Rating *
                            </label>
                            <div className="flex space-x-2">
                                {[1, 2, 3, 4, 5].map((star) => (
                                    <button
                                        key={star}
                                        type="button"
                                        onClick={() => handleRatingChange(star)}
                                        className="focus:outline-none"
                                    >
                                        <svg
                                            className={`w-8 h-8 ${star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                                            fill="currentColor"
                                            viewBox="0 0 20 20"
                                        >
                                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                        </svg>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {/* Title */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Review Title (Optional)
                            </label>
                            <input
                                type="text"
                                value={formData.title}
                                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                placeholder="e.g., Great service!"
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Comment */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Your Review *
                            </label>
                            <textarea
                                rows={5}
                                value={formData.comment}
                                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                                placeholder="Share your experience with this service..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                required
                            />
                        </div>

                        {/* Pros */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What did you like? (Optional)
                            </label>
                            <textarea
                                rows={2}
                                value={formData.pros}
                                onChange={(e) => setFormData({ ...formData, pros: e.target.value })}
                                placeholder="e.g., Quick delivery, perfect cleaning..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Cons */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                What could be improved? (Optional)
                            </label>
                            <textarea
                                rows={2}
                                value={formData.cons}
                                onChange={(e) => setFormData({ ...formData, cons: e.target.value })}
                                placeholder="e.g., Packaging could be better..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex justify-end space-x-3 pt-4">
                            <Link
                                to="/my-orders"
                                className="px-4 py-2 text-gray-600 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                            >
                                Cancel
                            </Link>
                            <Button
                                type="submit"
                                variant="primary"
                                loading={submitting}
                                disabled={submitting}
                            >
                                Submit Review
                            </Button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default WriteReview;