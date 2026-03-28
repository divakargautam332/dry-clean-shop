import React, { createContext, useState, useContext } from 'react';
import reviewService from '../services/reviewService';
import { toast } from 'react-toastify';

const ReviewContext = createContext();

export const useReviews = () => {
    const context = useContext(ReviewContext);
    if (!context) {
        throw new Error('useReviews must be used within ReviewProvider');
    }
    return context;
};

export const ReviewProvider = ({ children }) => {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({ page: 1, pages: 1, total: 0 });

    const loadReviews = async (page = 1, limit = 6) => {
        setLoading(true);
        const result = await reviewService.getAllReviews({ page, limit });
        if (result.success) {
            setReviews(result.data);
            setStats(result.stats);
            setPagination(result.pagination);
        }
        setLoading(false);
    };

    const loadMoreReviews = async () => {
        if (pagination.page >= pagination.pages) return;

        const nextPage = pagination.page + 1;
        setLoading(true);
        const result = await reviewService.getAllReviews({ page: nextPage, limit: 6 });
        if (result.success) {
            setReviews([...reviews, ...result.data]);
            setPagination(result.pagination);
        }
        setLoading(false);
    };

    const markHelpful = async (reviewId) => {
        const result = await reviewService.markHelpful(reviewId);
        if (result.success) {
            setReviews(reviews.map(review =>
                review._id === reviewId
                    ? { ...review, helpful: { ...review.helpful, count: (review.helpful?.count || 0) + 1 } }
                    : review
            ));
            toast.success('Thanks for your feedback!');
        }
    };

    const value = {
        reviews,
        stats,
        loading,
        pagination,
        loadReviews,
        loadMoreReviews,
        markHelpful
    };

    return (
        <ReviewContext.Provider value={value}>
            {children}
        </ReviewContext.Provider>
    );
};

export default ReviewContext;