import React, { createContext, useState, useContext, useEffect } from 'react';
import serviceService from '../services/serviceService';
import { toast } from 'react-toastify';

const ServiceContext = createContext();

export const useService = () => {
    const context = useContext(ServiceContext);
    if (!context) {
        throw new Error('useService must be used within ServiceProvider');
    }
    return context;
};

export const ServiceProvider = ({ children }) => {
    const [services, setServices] = useState([]);
    const [filteredServices, setFilteredServices] = useState([]);
    const [categories, setCategories] = useState([]);
    const [popularServices, setPopularServices] = useState([]);
    const [newServices, setNewServices] = useState([]);
    const [currentService, setCurrentService] = useState(null);
    const [loading, setLoading] = useState(false);

    // Filter states
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [sortBy, setSortBy] = useState('popular');
    const [priceRange, setPriceRange] = useState({ min: 0, max: 1000 });

    // Load all services on mount
    useEffect(() => {
        loadAllServices();
        loadCategories();
        loadPopularServices();
        loadNewServices();
    }, []);

    // Apply filters whenever filter states change
    useEffect(() => {
        applyFilters();
    }, [services, searchTerm, selectedCategory, sortBy, priceRange]);

    // Load all services
    const loadAllServices = async () => {
        setLoading(true);
        const response = await serviceService.getAllServices({ isActive: true });
        if (response.success) {
            setServices(response.data);
            setFilteredServices(response.data);
        } else {
            toast.error(response.message);
        }
        setLoading(false);
    };

    // Load categories
    const loadCategories = async () => {
        const response = await serviceService.getCategories();
        if (response.success) {
            setCategories(response.data);
        }
    };

    // Load popular services
    const loadPopularServices = async () => {
        const response = await serviceService.getPopularServices();
        if (response.success) {
            setPopularServices(response.data);
        }
    };

    // Load new services
    const loadNewServices = async () => {
        const response = await serviceService.getNewServices();
        if (response.success) {
            setNewServices(response.data);
        }
    };

    // Get service by ID
    const getServiceById = async (id) => {
        setLoading(true);
        try {
            const response = await serviceService.getServiceById(id);
            if (response.success) {
                setCurrentService(response.data);
                setLoading(false);
                return response.data;
            } else {
                toast.error(response.message);
                setLoading(false);
                return null;
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
            return null;
        }
    };

    // Apply filters to services
    const applyFilters = () => {
        let filtered = [...services];
        filtered = serviceService.searchServices(filtered, searchTerm);
        filtered = serviceService.filterByCategory(filtered, selectedCategory);
        filtered = serviceService.filterByPriceRange(filtered, priceRange.min, priceRange.max);
        filtered = serviceService.sortServices(filtered, sortBy);
        setFilteredServices(filtered);
    };

    // Reset all filters
    const resetFilters = () => {
        setSearchTerm('');
        setSelectedCategory('all');
        setSortBy('popular');
        setPriceRange({ min: 0, max: 1000 });
    };

    // Get services by category
    const getServicesByCategory = async (category) => {
        const response = await serviceService.getServicesByCategory(category);
        if (response.success) {
            return response.data;
        }
        return [];
    };

    // Get actual price (with discount)
    const getActualPrice = (service) => {
        return serviceService.getActualPrice(service);
    };

    // Check if service is on discount
    const isOnDiscount = (service) => {
        return serviceService.isOnDiscount(service);
    };

    // Get discount percentage
    const getDiscountPercentage = (service) => {
        return serviceService.getDiscountPercentage(service);
    };

    // Format price
    const formatPrice = (price) => {
        return serviceService.formatPrice(price);
    };

    // Get category options
    const getCategoryOptions = () => {
        return serviceService.getCategoryOptions();
    };

    // Get processing time options
    const getProcessingTimeOptions = () => {
        return serviceService.getProcessingTimeOptions();
    };

    // Get service tags
    const getServiceTags = () => {
        return serviceService.getServiceTags();
    };

    // Admin: Create service
    const createService = async (serviceData) => {
        setLoading(true);
        try {
            const response = await serviceService.createService(serviceData);
            if (response.success) {
                toast.success(response.message);
                await loadAllServices();
                setLoading(false);
                return { success: true, data: response.data };
            } else {
                toast.error(response.message);
                setLoading(false);
                return { success: false, message: response.message };
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
            return { success: false, message: error.message };
        }
    };

    // Admin: Update service
    const updateService = async (id, serviceData) => {
        setLoading(true);
        try {
            const response = await serviceService.updateService(id, serviceData);
            if (response.success) {
                toast.success(response.message);
                await loadAllServices();
                if (currentService && currentService._id === id) {
                    setCurrentService(response.data);
                }
                setLoading(false);
                return { success: true, data: response.data };
            } else {
                toast.error(response.message);
                setLoading(false);
                return { success: false, message: response.message };
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
            return { success: false, message: error.message };
        }
    };

    // Admin: Delete service
    const deleteService = async (id) => {
        setLoading(true);
        try {
            const response = await serviceService.deleteService(id);
            if (response.success) {
                toast.success(response.message);
                await loadAllServices();
                setLoading(false);
                return { success: true };
            } else {
                toast.error(response.message);
                setLoading(false);
                return { success: false, message: response.message };
            }
        } catch (error) {
            toast.error(error.message);
            setLoading(false);
            return { success: false, message: error.message };
        }
    };

    // Admin: Toggle service status
    const toggleServiceStatus = async (id) => {
        const response = await serviceService.toggleServiceStatus(id);
        if (response.success) {
            toast.success(response.message);
            await loadAllServices();
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            return { success: false, message: response.message };
        }
    };

    const value = {
        services: filteredServices,
        allServices: services,
        categories,
        popularServices,
        newServices,
        currentService,
        loading,
        searchTerm,
        selectedCategory,
        sortBy,
        priceRange,
        setSearchTerm,
        setSelectedCategory,
        setSortBy,
        setPriceRange,
        resetFilters,
        loadAllServices,
        getServiceById,
        getServicesByCategory,
        getActualPrice,
        isOnDiscount,
        getDiscountPercentage,
        formatPrice,
        getCategoryOptions,
        getProcessingTimeOptions,
        getServiceTags,
        createService,
        updateService,
        deleteService,
        toggleServiceStatus,
        setCurrentService
    };

    return (
        <ServiceContext.Provider value={value}>
            {children}
        </ServiceContext.Provider>
    );
};

export default ServiceContext;