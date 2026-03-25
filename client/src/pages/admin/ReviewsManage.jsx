import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import ReviewCard from '../../components/user/ReviewCard';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const ReviewsManage = () => {
    const { getAllReviews, approveReview, replyToReview, formatDate } = useAdmin();
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [replyModal, setReplyModal] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadReviews();
    }, [filter]);

    const loadReviews = async () => {
        setLoading(true);
        const params = filter === 'pending' ? { isApproved: false } : {};
        const result = await getAllReviews(params);
        if (result.success) {
            setReviews(result.data);
        }
        setLoading(false);
    };

    const handleApprove = async (reviewId) => {
        setActionLoading(true);
        const result = await approveReview(reviewId);
        if (result.success) {
            toast.success('Review approved successfully');
            loadReviews();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const handleReply = async () => {
        if (!replyModal || !replyText.trim()) return;

        setActionLoading(true);
        const result = await replyToReview(replyModal, replyText);
        if (result.success) {
            toast.success('Reply added successfully');
            setReplyModal(null);
            setReplyText('');
            loadReviews();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const filteredReviews = reviews.filter(review => {
        if (filter === 'approved') return review.isApproved;
        if (filter === 'pending') return !review.isApproved;
        return true;
    });

    const stats = {
        total: reviews.length,
        approved: reviews.filter(r => r.isApproved).length,
        pending: reviews.filter(r => !r.isApproved).length,
        avgRating: reviews.length > 0
            ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
            : 0
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Review Management</h1>
                <p className="text-gray-500">Manage customer reviews and ratings</p>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-500">Total Reviews</p>
                    <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-500">Approved</p>
                    <p className="text-2xl font-bold text-green-600">{stats.approved}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-500">Pending</p>
                    <p className="text-2xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <div className="bg-white rounded-lg shadow-md p-4">
                    <p className="text-sm text-gray-500">Average Rating</p>
                    <p className="text-2xl font-bold text-blue-600">{stats.avgRating} ⭐</p>
                </div>
            </div>

            {/* Filter Tabs */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-6">
                <div className="flex space-x-1">
                    <button
                        onClick={() => setFilter('all')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'all'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        All Reviews ({stats.total})
                    </button>
                    <button
                        onClick={() => setFilter('approved')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'approved'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Approved ({stats.approved})
                    </button>
                    <button
                        onClick={() => setFilter('pending')}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === 'pending'
                                ? 'bg-blue-600 text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                            }`}
                    >
                        Pending ({stats.pending})
                    </button>
                </div>
            </div>

            {/* Reviews List */}
            {filteredReviews.length > 0 ? (
                <div className="space-y-4">
                    {filteredReviews.map((review) => (
                        <div key={review._id} className="bg-white rounded-lg shadow-md p-5">
                            <div className="flex flex-wrap justify-between items-start gap-4 mb-4">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-800">{review.user?.name || 'User'}</p>
                                        <div className="flex items-center gap-2">
                                            <div className="flex">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <svg
                                                        key={star}
                                                        className={`w-4 h-4 ${star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                                                            }`}
                                                        fill="currentColor"
                                                        viewBox="0 0 20 20"
                                                    >
                                                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                                                    </svg>
                                                ))}
                                            </div>
                                            <span className="text-xs text-gray-500">
                                                {formatDate(review.createdAt)}
                                            </span>
                                            {review.isVerified && (
                                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                                                    Verified
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {!review.isApproved && (
                                        <button
                                            onClick={() => handleApprove(review._id)}
                                            disabled={actionLoading}
                                            className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm hover:bg-green-200"
                                        >
                                            Approve
                                        </button>
                                    )}
                                    <button
                                        onClick={() => setReplyModal(review._id)}
                                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-lg text-sm hover:bg-blue-200"
                                    >
                                        {review.adminReply?.reply ? 'Edit Reply' : 'Reply'}
                                    </button>
                                </div>
                            </div>

                            <p className="text-gray-700 mb-3">{review.comment}</p>

                            {review.service && (
                                <p className="text-sm text-gray-500 mb-2">
                                    Service: {review.service.name}
                                </p>
                            )}

                            {review.adminReply?.reply && (
                                <div className="mt-3 bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                                    <p className="text-xs font-semibold text-gray-500">
                                        Admin Response • {formatDate(review.adminReply.repliedAt)}
                                    </p>
                                    <p className="text-sm text-gray-600 mt-1">{review.adminReply.reply}</p>
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-md p-12 text-center">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                    </svg>
                    <p className="text-gray-500">No reviews found</p>
                </div>
            )}

            {/* Reply Modal */}
            {replyModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-lg w-full p-6">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">Reply to Review</h3>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder="Write your response to this review..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                        <div className="flex justify-end gap-3 mt-4">
                            <button
                                onClick={() => {
                                    setReplyModal(null);
                                    setReplyText('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReply}
                                disabled={!replyText.trim() || actionLoading}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                            >
                                {actionLoading ? 'Sending...' : 'Post Reply'}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewsManage;