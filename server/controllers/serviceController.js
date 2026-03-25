const Service = require('../models/Service');

// @desc    Get all services
// @route   GET /api/services
// @access  Public
const getServices = async (req, res) => {
    try {
        const { category, isActive, search, isPopular, isNew, limit } = req.query;

        let query = {};

        if (category) {
            query.category = category;
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (isPopular !== undefined) {
            query.isPopular = isPopular === 'true';
        }

        if (isNew !== undefined) {
            query.isNew = isNew === 'true';
        }

        if (search) {
            query.name = { $regex: search, $options: 'i' };
        }

        let servicesQuery = Service.find(query).sort({ createdAt: -1 });

        if (limit) {
            servicesQuery = servicesQuery.limit(parseInt(limit));
        }

        const services = await servicesQuery;

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get single service
// @route   GET /api/services/:id
// @access  Public
const getServiceById = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (service) {
            res.json({
                success: true,
                data: service
            });
        } else {
            res.status(404);
            throw new Error('Service not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create a service
// @route   POST /api/services
// @access  Private/Admin
const createService = async (req, res) => {
    try {
        const {
            name,
            category,
            price,
            discountedPrice,
            processingTime,
            description,
            shortDescription,
            image,
            icon,
            isPopular,
            isNew,
            tags,
            minOrderQuantity,
            maxOrderQuantity
        } = req.body;

        // Check if service already exists
        const serviceExists = await Service.findOne({ name });
        if (serviceExists) {
            res.status(400);
            throw new Error('Service with this name already exists');
        }

        const service = await Service.create({
            name,
            category,
            price,
            discountedPrice,
            processingTime,
            description,
            shortDescription: shortDescription || description.substring(0, 100),
            image,
            icon,
            isPopular: isPopular || false,
            isNew: isNew || false,
            tags,
            minOrderQuantity: minOrderQuantity || 1,
            maxOrderQuantity: maxOrderQuantity || 50
        });

        res.status(201).json({
            success: true,
            data: service
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update a service
// @route   PUT /api/services/:id
// @access  Private/Admin
const updateService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        // Update fields
        service.name = req.body.name || service.name;
        service.category = req.body.category || service.category;
        service.price = req.body.price !== undefined ? req.body.price : service.price;
        service.discountedPrice = req.body.discountedPrice !== undefined ? req.body.discountedPrice : service.discountedPrice;
        service.processingTime = req.body.processingTime || service.processingTime;
        service.description = req.body.description || service.description;
        service.shortDescription = req.body.shortDescription || service.shortDescription;
        service.image = req.body.image || service.image;
        service.icon = req.body.icon || service.icon;
        service.isActive = req.body.isActive !== undefined ? req.body.isActive : service.isActive;
        service.isPopular = req.body.isPopular !== undefined ? req.body.isPopular : service.isPopular;
        service.isNew = req.body.isNew !== undefined ? req.body.isNew : service.isNew;
        service.tags = req.body.tags || service.tags;
        service.minOrderQuantity = req.body.minOrderQuantity !== undefined ? req.body.minOrderQuantity : service.minOrderQuantity;
        service.maxOrderQuantity = req.body.maxOrderQuantity !== undefined ? req.body.maxOrderQuantity : service.maxOrderQuantity;

        const updatedService = await service.save();

        res.json({
            success: true,
            data: updatedService
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete a service
// @route   DELETE /api/services/:id
// @access  Private/Admin
const deleteService = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        await service.deleteOne();

        res.json({
            success: true,
            message: 'Service removed successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get services by category
// @route   GET /api/services/category/:category
// @access  Public
const getServicesByCategory = async (req, res) => {
    try {
        const services = await Service.find({
            category: req.params.category,
            isActive: true
        }).sort({ createdAt: -1 });

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get popular services
// @route   GET /api/services/popular
// @access  Public
const getPopularServices = async (req, res) => {
    try {
        const services = await Service.find({
            isPopular: true,
            isActive: true
        }).limit(6);

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get new services
// @route   GET /api/services/new
// @access  Public
const getNewServices = async (req, res) => {
    try {
        const services = await Service.find({
            isNew: true,
            isActive: true
        }).limit(6);

        res.json({
            success: true,
            count: services.length,
            data: services
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get service categories
// @route   GET /api/services/categories/all
// @access  Public
const getCategories = async (req, res) => {
    try {
        const categories = [
            { value: 'shirts', label: 'Shirts & Tops', icon: 'fa-shirt' },
            { value: 'pants', label: 'Pants & Trousers', icon: 'fa-pants' },
            { value: 'suits', label: 'Suits & Blazers', icon: 'fa-user-tie' },
            { value: 'ethnic', label: 'Ethnic Wear', icon: 'fa-sari' },
            { value: 'winter', label: 'Winter Wear', icon: 'fa-snowflake' },
            { value: 'home', label: 'Home Furnishings', icon: 'fa-home' },
            { value: 'other', label: 'Other Services', icon: 'fa-tshirt' }
        ];

        res.json({
            success: true,
            data: categories
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Toggle service status (active/inactive)
// @route   PUT /api/services/:id/toggle-status
// @access  Private/Admin
const toggleServiceStatus = async (req, res) => {
    try {
        const service = await Service.findById(req.params.id);

        if (!service) {
            res.status(404);
            throw new Error('Service not found');
        }

        service.isActive = !service.isActive;
        await service.save();

        res.json({
            success: true,
            data: service,
            message: `Service ${service.isActive ? 'activated' : 'deactivated'} successfully`
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Bulk update services (for offers/discounts)
// @route   PUT /api/services/bulk/update
// @access  Private/Admin
const bulkUpdateServices = async (req, res) => {
    try {
        const { serviceIds, updateData } = req.body;

        const result = await Service.updateMany(
            { _id: { $in: serviceIds } },
            { $set: updateData },
            { multi: true }
        );

        res.json({
            success: true,
            message: `${result.modifiedCount} services updated successfully`,
            data: result
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getServices,
    getServiceById,
    createService,
    updateService,
    deleteService,
    getServicesByCategory,
    getPopularServices,
    getNewServices,
    getCategories,
    toggleServiceStatus,
    bulkUpdateServices
};