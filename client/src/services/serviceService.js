import api from './api';

// Get all services
const getAllServices = async (params = {}) => {
    try {
        const response = await api.get('/services', { params });
        return {
            success: true,
            data: response.data.data,
            count: response.data.count
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services'
        };
    }
};

// Get service by ID
const getServiceById = async (id) => {
    try {
        const response = await api.get(`/services/${id}`);
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Service not found'
        };
    }
};

// Get services by category
const getServicesByCategory = async (category) => {
    try {
        const response = await api.get(`/services/category/${category}`);
        return {
            success: true,
            data: response.data.data,
            count: response.data.count
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch services'
        };
    }
};

// Get popular services
const getPopularServices = async () => {
    try {
        const response = await api.get('/services/popular');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch popular services'
        };
    }
};

// Get new services
const getNewServices = async () => {
    try {
        const response = await api.get('/services/new');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch new services'
        };
    }
};

// Get service categories
const getCategories = async () => {
    try {
        const response = await api.get('/services/categories');
        return {
            success: true,
            data: response.data.data
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to fetch categories'
        };
    }
};

// Admin: Create service
const createService = async (serviceData) => {
    try {
        const response = await api.post('/services', serviceData);
        return {
            success: true,
            data: response.data.data,
            message: 'Service created successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to create service'
        };
    }
};

// Admin: Update service
const updateService = async (id, serviceData) => {
    try {
        const response = await api.put(`/services/${id}`, serviceData);
        return {
            success: true,
            data: response.data.data,
            message: 'Service updated successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update service'
        };
    }
};

// Admin: Delete service
const deleteService = async (id) => {
    try {
        const response = await api.delete(`/services/${id}`);
        return {
            success: true,
            message: response.data.message || 'Service deleted successfully'
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete service'
        };
    }
};

// Admin: Toggle service status (active/inactive)
const toggleServiceStatus = async (id) => {
    try {
        const response = await api.put(`/services/${id}/toggle-status`);
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to toggle service status'
        };
    }
};

// Admin: Bulk update services
const bulkUpdateServices = async (serviceIds, updateData) => {
    try {
        const response = await api.put('/services/bulk/update', { serviceIds, updateData });
        return {
            success: true,
            data: response.data.data,
            message: response.data.message
        };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to bulk update services'
        };
    }
};

// Get service categories with display names and icons
const getCategoryOptions = () => {
    return [
        { value: 'shirts', label: 'Shirts & Tops', icon: 'fa-shirt', color: 'blue' },
        { value: 'pants', label: 'Pants & Trousers', icon: 'fa-pants', color: 'green' },
        { value: 'suits', label: 'Suits & Blazers', icon: 'fa-user-tie', color: 'purple' },
        { value: 'ethnic', label: 'Ethnic Wear', icon: 'fa-sari', color: 'orange' },
        { value: 'winter', label: 'Winter Wear', icon: 'fa-snowflake', color: 'cyan' },
        { value: 'home', label: 'Home Furnishings', icon: 'fa-home', color: 'red' },
        { value: 'other', label: 'Other Services', icon: 'fa-tshirt', color: 'gray' }
    ];
};

// Get processing time options
const getProcessingTimeOptions = () => {
    return [
        { value: 'Same day', label: 'Same Day', priceMultiplier: 1.5 },
        { value: 'Express', label: 'Express (12 hours)', priceMultiplier: 1.3 },
        { value: '24 hours', label: '24 Hours', priceMultiplier: 1.0 },
        { value: '48 hours', label: '48 Hours', priceMultiplier: 0.9 },
        { value: '72 hours', label: '72 Hours', priceMultiplier: 0.8 }
    ];
};

// Get service tags
const getServiceTags = () => {
    return [
        { value: 'dry-clean', label: 'Dry Clean', color: 'blue' },
        { value: 'ironing', label: 'Ironing', color: 'green' },
        { value: 'wash-fold', label: 'Wash & Fold', color: 'purple' },
        { value: 'stain-removal', label: 'Stain Removal', color: 'orange' },
        { value: 'express', label: 'Express', color: 'red' }
    ];
};

// Calculate price with discount
const getActualPrice = (service) => {
    return service.discountedPrice || service.price;
};

// Check if service is on discount
const isOnDiscount = (service) => {
    return service.discountedPrice !== null && service.discountedPrice < service.price;
};

// Get discount percentage
const getDiscountPercentage = (service) => {
    if (isOnDiscount(service)) {
        return Math.round(((service.price - service.discountedPrice) / service.price) * 100);
    }
    return 0;
};

// Format price
const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    }).format(price);
};

// Search services
const searchServices = (services, searchTerm) => {
    if (!searchTerm) return services;
    const term = searchTerm.toLowerCase();
    return services.filter(service =>
        service.name.toLowerCase().includes(term) ||
        service.description?.toLowerCase().includes(term) ||
        service.category?.toLowerCase().includes(term)
    );
};

// Filter services by category
const filterByCategory = (services, category) => {
    if (!category || category === 'all') return services;
    return services.filter(service => service.category === category);
};

// Filter services by price range
const filterByPriceRange = (services, minPrice, maxPrice) => {
    return services.filter(service => {
        const price = getActualPrice(service);
        return price >= minPrice && price <= maxPrice;
    });
};

// Sort services
const sortServices = (services, sortBy = 'popular') => {
    const sorted = [...services];
    switch (sortBy) {
        case 'price_low':
            return sorted.sort((a, b) => getActualPrice(a) - getActualPrice(b));
        case 'price_high':
            return sorted.sort((a, b) => getActualPrice(b) - getActualPrice(a));
        case 'newest':
            return sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        case 'popular':
        default:
            return sorted.sort((a, b) => (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0));
    }
};

const serviceService = {
    getAllServices,
    getServiceById,
    getServicesByCategory,
    getPopularServices,
    getNewServices,
    getCategories,
    createService,
    updateService,
    deleteService,
    toggleServiceStatus,
    bulkUpdateServices,
    getCategoryOptions,
    getProcessingTimeOptions,
    getServiceTags,
    getActualPrice,
    isOnDiscount,
    getDiscountPercentage,
    formatPrice,
    searchServices,
    filterByCategory,
    filterByPriceRange,
    sortServices
};

export default serviceService;