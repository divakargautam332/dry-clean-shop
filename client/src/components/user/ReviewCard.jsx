import React, { useState } from 'react';
import { formatDate, timeAgo } from '../../utils/helpers';

const ReviewCard = ({ review, showActions = false, onHelpful, onReport, onDelete }) => {
    const [isReporting, setIsReporting] = useState(false);
    const [reportReason, setReportReason] = useState('');

    const renderStars = (rating) => {
        return (
            <div className="flex items-center">
                {[1, 2, 3, 4, 5].map((star) => (
                    <svg
                        key={star}
                        className={`w-4 h-4 ${star <= rating ? 'text-yellow-400' : 'text-gray-300'
                            }`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                    >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                ))}
            </div>
        );
    };

    const handleHelpful = () => {
        if (onHelpful) onHelpful(review._id);
    };

    const handleReport = () => {
        if (reportReason.trim() && onReport) {
            onReport(review._id, reportReason);
            setIsReporting(false);
            setReportReason('');
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow">
            {/* Header */}
            <div className="flex items-start justify-between">
                <div className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                        {review.user?.name?.charAt(0).toUpperCase() || 'U'}
                    </div>
                    <div>
                        <h4 className="font-semibold text-gray-800">{review.user?.name || 'User'}</h4>
                        <div className="flex items-center space-x-2 mt-1">
                            {renderStars(review.rating)}
                            <span className="text-xs text-gray-500">
                                {timeAgo(review.createdAt)}
                            </span>
                        </div>
                    </div>
                </div>
                {review.isVerified && (
                    <span className="text-xs text-green-600 bg-green-50 px-2 py-1 rounded-full">
                        Verified Purchase
                    </span>
                )}
            </div>

            {/* Title */}
            {review.title && (
                <h3 className="text-lg font-semibold text-gray-800 mt-3">{review.title}</h3>
            )}

            {/* Comment */}
            <p className="text-gray-600 mt-2">{review.comment}</p>

            {/* Pros & Cons */}
            {(review.pros || review.cons) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-3">
                    {review.pros && (
                        <div className="bg-green-50 rounded-lg p-2">
                            <p className="text-xs font-semibold text-green-700">Pros</p>
                            <p className="text-sm text-gray-600">{review.pros}</p>
                        </div>
                    )}
                    {review.cons && (
                        <div className="bg-red-50 rounded-lg p-2">
                            <p className="text-xs font-semibold text-red-700">Cons</p>
                            <p className="text-sm text-gray-600">{review.cons}</p>
                        </div>
                    )}
                </div>
            )}

            {/* Images */}
            {review.images && review.images.length > 0 && (
                <div className="flex space-x-2 mt-3 overflow-x-auto">
                    {review.images.map((img, idx) => (
                        <img
                            key={idx}
                            src={img}
                            alt={`Review ${idx + 1}`}
                            className="w-16 h-16 object-cover rounded-lg cursor-pointer hover:opacity-80"
                            onClick={() => window.open(img, '_blank')}
                        />
                    ))}
                </div>
            )}

            {/* Admin Reply */}
            {review.adminReply?.reply && (
                <div className="mt-3 bg-gray-50 rounded-lg p-3 border-l-4 border-blue-500">
                    <p className="text-xs font-semibold text-gray-500">
                        Admin Response • {formatDate(review.adminReply.repliedAt)}
                    </p>
                    <p className="text-sm text-gray-600 mt-1">{review.adminReply.reply}</p>
                </div>
            )}

            {/* Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <div className="flex items-center space-x-4">
                    <button
                        onClick={handleHelpful}
                        className="flex items-center space-x-1 text-sm text-gray-500 hover:text-blue-600 transition-colors"
                    >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                        </svg>
                        <span>{review.helpful?.count || 0} Helpful</span>
                    </button>

                    {!showActions && (
                        <button
                            onClick={() => setIsReporting(true)}
                            className="text-sm text-gray-500 hover:text-red-600 transition-colors"
                        >
                            Report
                        </button>
                    )}
                </div>

                {showActions && (
                    <div className="flex items-center space-x-3">
                        <button
                            onClick={() => onDelete?.(review._id)}
                            className="text-sm text-red-600 hover:text-red-700"
                        >
                            Delete
                        </button>
                    </div>
                )}
            </div>

            {/* Report Modal */}
            {isReporting && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-md w-full p-6">
                        <h3 className="text-lg font-semibold mb-4">Report Review</h3>
                        <textarea
                            value={reportReason}
                            onChange={(e) => setReportReason(e.target.value)}
                            placeholder="Please tell us why you're reporting this review..."
                            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={4}
                        />
                        <div className="flex justify-end space-x-3 mt-4">
                            <button
                                onClick={() => {
                                    setIsReporting(false);
                                    setReportReason('');
                                }}
                                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleReport}
                                disabled={!reportReason.trim()}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                            >
                                Submit Report
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default ReviewCard;