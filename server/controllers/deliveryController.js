const DeliveryStaff = require('../models/DeliveryStaff');
const Order = require('../models/Order');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendStaffAssignmentSMS } = require('../utils/sendSMS');
const bcrypt = require('bcryptjs');

// @desc    Get all delivery staff
// @route   GET /api/delivery/staff
// @access  Private/Admin
const getAllStaff = async (req, res) => {
    try {
        const { isAvailable, isActive, search, page = 1, limit = 20 } = req.query;

        let query = {};

        if (isAvailable !== undefined) {
            query.isAvailable = isAvailable === 'true';
        }

        if (isActive !== undefined) {
            query.isActive = isActive === 'true';
        }

        if (search) {
            query.$or = [
                { name: { $regex: search, $options: 'i' } },
                { email: { $regex: search, $options: 'i' } },
                { phone: { $regex: search, $options: 'i' } }
            ];
        }

        const staff = await DeliveryStaff.find(query)
            .sort({ createdAt: -1 })
            .limit(limit * 1)
            .skip((page - 1) * limit);

        const total = await DeliveryStaff.countDocuments(query);

        res.json({
            success: true,
            data: staff,
            pagination: {
                total,
                page: parseInt(page),
                pages: Math.ceil(total / limit)
            }
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get delivery staff by ID
// @route   GET /api/delivery/staff/:id
// @access  Private/Admin
const getStaffById = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id).select('-password');

        if (!staff) {
            res.status(404);
            throw new Error('Staff not found');
        }

        // Get assigned orders
        const assignedOrders = await Order.find({
            deliveryPartner: staff._id,
            orderStatus: { $in: ['out_for_delivery', 'pickup_assigned'] }
        });

        // Get delivery history
        const deliveryHistory = await Order.find({
            deliveryPartner: staff._id,
            orderStatus: 'delivered'
        }).sort({ createdAt: -1 }).limit(20);

        res.json({
            success: true,
            data: {
                staff,
                assignedOrders,
                deliveryHistory,
                currentWorkload: staff.currentWorkload
            }
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Create delivery staff
// @route   POST /api/delivery/staff
// @access  Private/Admin
const createStaff = async (req, res) => {
    try {
        const {
            name,
            email,
            phone,
            password,
            address,
            city,
            pincode,
            vehicleType,
            vehicleNumber,
            drivingLicense,
            workSchedule,
            preferredArea
        } = req.body;

        // Check if staff already exists
        const staffExists = await DeliveryStaff.findOne({ $or: [{ email }, { phone }] });
        if (staffExists) {
            res.status(400);
            throw new Error('Staff with this email or phone already exists');
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const staff = await DeliveryStaff.create({
            name,
            email,
            phone,
            password: hashedPassword,
            address,
            city,
            pincode,
            vehicleType,
            vehicleNumber,
            drivingLicense,
            workSchedule,
            preferredArea
        });

        res.status(201).json({
            success: true,
            data: staff
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update delivery staff
// @route   PUT /api/delivery/staff/:id
// @access  Private/Admin
const updateStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            res.status(404);
            throw new Error('Staff not found');
        }

        staff.name = req.body.name || staff.name;
        staff.email = req.body.email || staff.email;
        staff.phone = req.body.phone || staff.phone;
        staff.address = req.body.address || staff.address;
        staff.city = req.body.city || staff.city;
        staff.pincode = req.body.pincode || staff.pincode;
        staff.vehicleType = req.body.vehicleType || staff.vehicleType;
        staff.vehicleNumber = req.body.vehicleNumber || staff.vehicleNumber;
        staff.drivingLicense = req.body.drivingLicense || staff.drivingLicense;
        staff.isAvailable = req.body.isAvailable !== undefined ? req.body.isAvailable : staff.isAvailable;
        staff.isActive = req.body.isActive !== undefined ? req.body.isActive : staff.isActive;
        staff.workSchedule = req.body.workSchedule || staff.workSchedule;
        staff.preferredArea = req.body.preferredArea || staff.preferredArea;

        if (req.body.password) {
            const salt = await bcrypt.genSalt(10);
            staff.password = await bcrypt.hash(req.body.password, salt);
        }

        const updatedStaff = await staff.save();

        res.json({
            success: true,
            data: updatedStaff
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete delivery staff
// @route   DELETE /api/delivery/staff/:id
// @access  Private/Admin
const deleteStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.findById(req.params.id);

        if (!staff) {
            res.status(404);
            throw new Error('Staff not found');
        }

        await staff.deleteOne();

        res.json({
            success: true,
            message: 'Staff removed successfully'
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Assign order to delivery staff
// @route   POST /api/delivery/assign
// @access  Private/Admin
const assignOrder = async (req, res) => {
    try {
        const { orderId, staffId } = req.body;

        const order = await Order.findById(orderId).populate('customerDetails');
        const staff = await DeliveryStaff.findById(staffId);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (!staff) {
            res.status(404);
            throw new Error('Staff not found');
        }

        // Check if staff can take more orders
        if (!staff.canTakeMoreOrders) {
            res.status(400);
            throw new Error('Staff cannot take more orders at this time');
        }

        // Assign order to staff
        order.deliveryPartner = staff._id;
        order.orderStatus = 'pickup_assigned';
        order.statusHistory.push({
            status: 'pickup_assigned',
            note: `Assigned to delivery staff: ${staff.name}`,
            updatedBy: req.user._id
        });
        await order.save();

        // Add to staff's assigned orders
        staff.assignedOrders.push({
            order: order._id,
            assignedAt: new Date(),
            status: 'assigned'
        });
        await staff.save();

        // Send SMS notification to staff
        sendStaffAssignmentSMS(staff, order).catch(console.error);

        // Create notification for staff
        await Notification.create({
            user: staff._id,
            title: 'New Order Assigned',
            message: `Order ${order.orderNumber} has been assigned to you for pickup.`,
            type: 'delivery',
            actionType: 'order',
            actionId: order._id
        });

        res.json({
            success: true,
            message: 'Order assigned successfully',
            data: { order, staff }
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update delivery status
// @route   PUT /api/delivery/status/:orderId
// @access  Private/Admin/Staff
const updateDeliveryStatus = async (req, res) => {
    try {
        const { status, note, location } = req.body;
        const orderId = req.params.orderId;

        const order = await Order.findById(orderId).populate('user');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        // Check if staff is assigned to this order
        if (req.user.role === 'staff') {
            const staff = await DeliveryStaff.findOne({ email: req.user.email });
            if (order.deliveryPartner.toString() !== staff._id.toString()) {
                res.status(403);
                throw new Error('Not authorized to update this order');
            }

            // Update staff location if provided
            if (location) {
                staff.currentLocation = {
                    lat: location.lat,
                    lng: location.lng,
                    address: location.address,
                    lastUpdated: new Date()
                };
                await staff.save();
            }
        }

        // Update order status based on delivery status
        if (status === 'picked_up') {
            order.orderStatus = 'collected';
            // Update staff assigned order status
            const staff = await DeliveryStaff.findById(order.deliveryPartner);
            if (staff) {
                const assignedOrder = staff.assignedOrders.find(
                    ao => ao.order.toString() === order._id.toString()
                );
                if (assignedOrder) {
                    assignedOrder.status = 'picked_up';
                    await staff.save();
                }
            }
        } else if (status === 'delivered') {
            order.orderStatus = 'delivered';
            // Update staff stats
            const staff = await DeliveryStaff.findById(order.deliveryPartner);
            if (staff) {
                const assignedOrder = staff.assignedOrders.find(
                    ao => ao.order.toString() === order._id.toString()
                );
                if (assignedOrder) {
                    assignedOrder.status = 'delivered';
                }
                staff.completedOrders += 1;
                await staff.save();
            }
        }

        order.statusHistory.push({
            status: order.orderStatus,
            note: note || `Delivery status: ${status}`,
            updatedBy: req.user._id
        });

        await order.save();

        // Notify user
        await Notification.create({
            user: order.user._id,
            title: 'Delivery Update',
            message: `Your order ${order.orderNumber} has been ${status}.`,
            type: 'delivery',
            actionType: 'order',
            actionId: order._id
        });

        res.json({
            success: true,
            message: 'Delivery status updated successfully',
            data: order
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get available staff for delivery
// @route   GET /api/delivery/available
// @access  Private/Admin
const getAvailableStaff = async (req, res) => {
    try {
        const staff = await DeliveryStaff.find({
            isAvailable: true,
            isActive: true
        }).select('-password');

        // Filter staff who can take more orders
        const availableStaff = staff.filter(s => s.canTakeMoreOrders);

        res.json({
            success: true,
            data: availableStaff
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update staff location
// @route   PUT /api/delivery/location
// @access  Private/Staff
const updateStaffLocation = async (req, res) => {
    try {
        const { lat, lng, address } = req.body;

        const staff = await DeliveryStaff.findOne({ email: req.user.email });

        if (!staff) {
            res.status(404);
            throw new Error('Staff not found');
        }

        staff.currentLocation = {
            lat,
            lng,
            address: address || '',
            lastUpdated: new Date()
        };

        await staff.save();

        res.json({
            success: true,
            message: 'Location updated successfully',
            data: staff.currentLocation
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
    getAllStaff,
    getStaffById,
    createStaff,
    updateStaff,
    deleteStaff,
    assignOrder,
    updateDeliveryStatus,
    getAvailableStaff,
    updateStaffLocation
};