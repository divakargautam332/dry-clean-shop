const Order = require('../models/Order');
const Service = require('../models/Service');
const Coupon = require('../models/Coupon');
const User = require('../models/User');
const Notification = require('../models/Notification');
const { sendOrderConfirmationSMS, sendOrderStatusSMS } = require('../utils/sendSMS');
const { sendOrderConfirmation, sendOrderStatusUpdate } = require('../utils/sendEmail');

// @desc    Create new order
// @route   POST /api/orders
// @access  Private
const createOrder = async (req, res, next) => {
    try {
        const {
            items,
            pickupAddress,
            deliveryAddress,
            pickupDate,
            pickupTimeSlot,
            deliveryDate,
            paymentMethod,
            couponCode,
            specialInstructions,
            isExpress
        } = req.body;

        // Calculate order totals
        let subtotal = 0;
        let orderItems = [];
        console.log('calculate order total');

        for (const item of items) {
            const service = await Service.findById(item.service);

            if (!service || !service.isActive) {
                res.status(400);
                throw new Error(`Service ${item.service} not available`);
            }

            const price = service.discountedPrice || service.price;
            const totalPrice = price * item.quantity;

            subtotal += totalPrice;

            orderItems.push({
                service: service._id,
                serviceName: service.name,
                quantity: item.quantity,
                price: price,
                totalPrice: totalPrice,
                specialInstructions: item.specialInstructions || ''
            });
        }
        console.log('calculate charges');

        // Calculate charges
        const gst = subtotal * 0.18;
        let deliveryCharge = 50;
        let expressCharge = isExpress ? 100 : 0;
        let discount = 0;
        let appliedCoupon = null;

        // Apply coupon if provided
        if (couponCode) {
            const coupon = await Coupon.findOne({ code: couponCode.toUpperCase() });

            if (coupon) {
                const validation = coupon.isValid(req.user._id, subtotal);

                if (validation.valid) {
                    discount = coupon.calculateDiscount(subtotal);
                    appliedCoupon = coupon.code;

                    coupon.usedCount += 1;
                    coupon.usedBy.push({
                        user: req.user._id,
                        orderId: null
                    });
                    await coupon.save();
                }
            }
        }

        const totalAmount = subtotal + gst + deliveryCharge + expressCharge - discount;


        console.log('create order');

        // Create order
        const order = await Order.create({
            user: req.user._id,
            customerDetails: {
                name: req.user.name,
                email: req.user.email,
                phone: req.user.phone
            },
            items: orderItems,
            subtotal,
            gst,
            deliveryCharge,
            expressCharge,
            discount,
            couponCode: appliedCoupon,
            totalAmount,
            paymentMethod,
            pickupAddress,
            deliveryAddress,
            pickupDate,
            pickupTimeSlot,
            deliveryDate,
            specialInstructions,
            isExpress: isExpress || false,
            orderStatus: 'pending',
            paymentStatus: paymentMethod === 'online' ? 'pending' : 'pending'
        });
        console.log('after create order');

        // Update coupon with order ID
        if (appliedCoupon) {
            await Coupon.findOneAndUpdate(
                { code: appliedCoupon, 'usedBy.user': req.user._id, 'usedBy.orderId': null },
                { 'usedBy.$.orderId': order._id }
            );
        }

        // Add status history
        order.statusHistory.push({
            status: 'pending',
            note: 'Order placed successfully',
            updatedBy: req.user._id
        });
        await order.save();
        console.log('send notification');
        // Send notifications
        sendOrderConfirmation(order, req.user).catch(console.error);
        sendOrderConfirmationSMS(req.user, order).catch(console.error);
        console.log('after send notification');
        // Create notification in DB
        await Notification.create({
            user: req.user._id,
            title: 'Order Confirmed',
            message: `Your order ${order.orderNumber} has been confirmed successfully.`,
            type: 'order',
            actionType: 'order',
            actionId: order._id,
            metadata: { orderId: order._id }
        });

        res.status(201).json({
            success: true,
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

// @desc    Get my orders
// @route   GET /api/orders/myorders
// @access  Private
const getMyOrders = async (req, res) => {
    try {
        const orders = await Order.find({ user: req.user._id })
            .sort({ createdAt: -1 });

        res.json({
            success: true,
            count: orders.length,
            data: orders
        });
    } catch (error) {
        res.status(500);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by ID
// @route   GET /api/orders/:id
// @access  Private
const getOrderById = async (req, res) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('user', 'name email phone')
            .populate('items.service', 'name image');

        if (order) {
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json({
                    success: true,
                    data: order
                });
            } else {
                res.status(403);
                throw new Error('Not authorized to view this order');
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update order status
// @route   PUT /api/orders/:id/status
// @access  Private/Admin
const updateOrderStatus = async (req, res) => {
    try {
        const { status, note } = req.body;

        const order = await Order.findById(req.params.id).populate('user', 'name email phone');

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.orderStatus = status;
        order.statusHistory.push({
            status,
            note: note || `Order status updated to ${status}`,
            updatedBy: req.user._id
        });

        // If order is delivered, update user loyalty points
        if (status === 'delivered' && order.paymentStatus === 'paid') {
            const user = await User.findById(order.user);
            const pointsEarned = Math.floor(order.totalAmount / 100);
            user.loyaltyPoints += pointsEarned;
            user.totalOrders += 1;
            await user.save();
        }

        const updatedOrder = await order.save();

        // Send notifications
        sendOrderStatusUpdate(order, order.user, status).catch(console.error);
        sendOrderStatusSMS(order.user, order, status).catch(console.error);

        await Notification.create({
            user: order.user._id,
            title: 'Order Status Update',
            message: `Your order ${order.orderNumber} status has been updated to: ${status}`,
            type: 'order',
            actionType: 'order',
            actionId: order._id,
            metadata: { orderId: order._id, status }
        });

        res.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update payment status
// @route   PUT /api/orders/:id/payment
// @access  Private/Admin
const updatePaymentStatus = async (req, res) => {
    try {
        const { paymentStatus, paymentDetails } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        order.paymentStatus = paymentStatus;
        if (paymentDetails) {
            order.paymentDetails = paymentDetails;
        }

        const updatedOrder = await order.save();

        await Notification.create({
            user: order.user,
            title: 'Payment Update',
            message: `Payment for order ${order.orderNumber} is ${paymentStatus}`,
            type: 'payment',
            actionType: 'order',
            actionId: order._id
        });

        res.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Cancel order
// @route   PUT /api/orders/:id/cancel
// @access  Private
const cancelOrder = async (req, res) => {
    try {
        const { reason } = req.body;

        const order = await Order.findById(req.params.id);

        if (!order) {
            res.status(404);
            throw new Error('Order not found');
        }

        if (order.orderStatus !== 'pending' && order.orderStatus !== 'confirmed') {
            res.status(400);
            throw new Error('Order cannot be cancelled at this stage');
        }

        order.orderStatus = 'cancelled';
        order.statusHistory.push({
            status: 'cancelled',
            note: reason || 'Order cancelled by user',
            updatedBy: req.user._id
        });

        const updatedOrder = await order.save();

        await Notification.create({
            user: order.user,
            title: 'Order Cancelled',
            message: `Your order ${order.orderNumber} has been cancelled. ${reason ? 'Reason: ' + reason : ''}`,
            type: 'order',
            actionType: 'order',
            actionId: order._id
        });

        res.json({
            success: true,
            data: updatedOrder
        });
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Track order
// @route   GET /api/orders/track/:orderNumber
// @access  Public
const trackOrder = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber });

        if (order) {
            res.json({
                success: true,
                data: {
                    orderNumber: order.orderNumber,
                    status: order.orderStatus,
                    statusHistory: order.statusHistory,
                    estimatedDelivery: order.deliveryDate,
                    items: order.items.map(item => ({
                        name: item.serviceName,
                        quantity: item.quantity
                    }))
                }
            });
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get order by order number
// @route   GET /api/orders/number/:orderNumber
// @access  Private
const getOrderByNumber = async (req, res) => {
    try {
        const order = await Order.findOne({ orderNumber: req.params.orderNumber })
            .populate('user', 'name email phone')
            .populate('items.service', 'name image');

        if (order) {
            if (order.user._id.toString() === req.user._id.toString() || req.user.role === 'admin') {
                res.json({
                    success: true,
                    data: order
                });
            } else {
                res.status(403);
                throw new Error('Not authorized');
            }
        } else {
            res.status(404);
            throw new Error('Order not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    createOrder,
    getMyOrders,
    getOrderById,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder,
    trackOrder,
    getOrderByNumber
};