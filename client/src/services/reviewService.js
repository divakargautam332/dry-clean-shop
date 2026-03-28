import api from './api';

const getAllReviews = async () => {
    try {
        const response = await api.get('/reviews');
        return {
            success: true,
            data: response.data.data,
            stats: response.data.stats
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch reviews'
        };
    }
};

export default {
    getAllReviews
};