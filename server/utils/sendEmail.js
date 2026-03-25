const nodemailer = require('nodemailer');

const sendEmail = async (options) => {
    try {
        // Create transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            secure: false, // true for 465, false for other ports
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        // Email options
        const mailOptions = {
            from: `"Dry Clean Shop" <${process.env.EMAIL_USER}>`,
            to: options.email,
            subject: options.subject,
            html: options.html,
        };

        // Send email
        const info = await transporter.sendMail(mailOptions);
        console.log(`Email sent: ${info.messageId}`);
        return true;
    } catch (error) {
        console.error(`Email error: ${error.message}`);
        return false;
    }
};

// Order confirmation email template
const sendOrderConfirmation = async (order, user) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Order Confirmation</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for your order! Your order has been confirmed.</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Order Details</h3>
                <p><strong>Order Number:</strong> ${order.orderNumber}</p>
                <p><strong>Total Amount:</strong> ₹${order.totalAmount}</p>
                <p><strong>Payment Method:</strong> ${order.paymentMethod === 'cod' ? 'Cash on Delivery' : 'Online Payment'}</p>
                <p><strong>Pickup Date:</strong> ${new Date(order.pickupDate).toLocaleDateString()}</p>
            </div>
            
            <h3>Items Ordered:</h3>
            <table style="width: 100%; border-collapse: collapse;">
                <tr style="background-color: #f2f2f2;">
                    <th style="padding: 8px; text-align: left;">Item</th>
                    <th style="padding: 8px; text-align: left;">Quantity</th>
                    <th style="padding: 8px; text-align: left;">Price</th>
                </tr>
                ${order.items.map(item => `
                    <tr>
                        <td style="padding: 8px;">${item.serviceName}</td>
                        <td style="padding: 8px;">${item.quantity}</td>
                        <td style="padding: 8px;">₹${item.price}</td>
                    </tr>
                `).join('')}
            </table>
            
            <p style="margin-top: 20px;">You can track your order using this link:</p>
            <a href="${process.env.CLIENT_URL}/track-order/${order.orderNumber}" style="background-color: #2c3e50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Order</a>
            
            <p style="margin-top: 30px;">Thank you for choosing Dry Clean Shop!</p>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Order Confirmed - ${order.orderNumber}`,
        html: html
    });
};

// Order status update email template
const sendOrderStatusUpdate = async (order, user, status) => {
    const statusMessages = {
        'confirmed': 'Your order has been confirmed and will be picked up soon.',
        'collected': 'Your items have been collected for cleaning.',
        'processing': 'Your items are being processed.',
        'quality_check': 'Your items are under quality check.',
        'out_for_delivery': 'Your order is out for delivery!',
        'delivered': 'Your order has been delivered. Thank you for choosing us!'
    };

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Order Status Update</h2>
            <p>Dear ${user.name},</p>
            <p>Your order <strong>${order.orderNumber}</strong> status has been updated to: <strong style="color: #27ae60;">${status}</strong></p>
            <p>${statusMessages[status] || 'Your order status has been updated.'}</p>
            
            <div style="background-color: #f8f9fa; padding: 15px; border-radius: 5px; margin: 20px 0;">
                <a href="${process.env.CLIENT_URL}/track-order/${order.orderNumber}" style="background-color: #2c3e50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Track Your Order</a>
            </div>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: `Order Update - ${order.orderNumber}`,
        html: html
    });
};

// Password reset email template
const sendPasswordResetEmail = async (user, resetToken) => {
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Reset Your Password</h2>
            <p>Dear ${user.name},</p>
            <p>You requested to reset your password. Click the button below to reset it:</p>
            
            <div style="margin: 20px 0;">
                <a href="${resetUrl}" style="background-color: #2c3e50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: 'Password Reset Request',
        html: html
    });
};

// Welcome email template
const sendWelcomeEmail = async (user) => {
    const html = `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2c3e50;">Welcome to Dry Clean Shop!</h2>
            <p>Dear ${user.name},</p>
            <p>Thank you for registering with us! We're excited to have you on board.</p>
            
            <p>Here's what you can do:</p>
            <ul>
                <li>Book your first dry cleaning service</li>
                <li>Schedule pickup and delivery</li>
                <li>Track your orders in real-time</li>
                <li>Earn loyalty points on every order</li>
            </ul>
            
            <div style="margin: 20px 0;">
                <a href="${process.env.CLIENT_URL}/services" style="background-color: #2c3e50; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Book Your First Service</a>
            </div>
            
            <p>Use code <strong>WELCOME10</strong> to get 10% off on your first order!</p>
        </div>
    `;

    return sendEmail({
        email: user.email,
        subject: 'Welcome to Dry Clean Shop!',
        html: html
    });
};

module.exports = {
    sendEmail,
    sendOrderConfirmation,
    sendOrderStatusUpdate,
    sendPasswordResetEmail,
    sendWelcomeEmail
};