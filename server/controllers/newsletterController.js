const Newsletter = require('../models/Newsletter');
const nodemailer = require('nodemailer');

// Subscribe to newsletter
const subscribe = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        // Check if already subscribed
        const existing = await Newsletter.findOne({ email });
        if (existing) {
            if (existing.isActive) {
                return res.status(400).json({
                    success: false,
                    message: 'Email already subscribed'
                });
            } else {
                // Re-activate
                existing.isActive = true;
                existing.unsubscribedAt = null;
                await existing.save();

                return res.json({
                    success: true,
                    message: 'Welcome back! You have been resubscribed.'
                });
            }
        }

        // Create new subscription
        await Newsletter.create({ email });

        // Send welcome email
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        const mailOptions = {
            from: `"DryCleanPro" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: 'Welcome to DryCleanPro Newsletter!',
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px;">
                    <h2>Welcome to DryCleanPro Newsletter!</h2>
                    <p>Thank you for subscribing to our newsletter.</p>
                    <p>You'll receive:</p>
                    <ul>
                        <li>🎉 Exclusive discounts and offers</li>
                        <li>🧺 Laundry tips and tricks</li>
                        <li>🚀 New service announcements</li>
                        <li>💰 Special festival deals</li>
                    </ul>
                    <p>Use code <strong>WELCOME10</strong> for 10% off your first order!</p>
                    <br/>
                    <p>Best regards,<br/>DryCleanPro Team</p>
                    <hr/>
                    <p style="font-size: 12px; color: #666;">
                        <a href="${process.env.CLIENT_URL}/unsubscribe?email=${email}">Unsubscribe</a> anytime.
                    </p>
                </div>
            `
        };

        await transporter.sendMail(mailOptions).catch(console.error);

        res.json({
            success: true,
            message: 'Subscribed successfully! Check your email for confirmation.'
        });
    } catch (error) {
        console.error('Newsletter subscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to subscribe. Please try again.'
        });
    }
};

// Unsubscribe from newsletter
const unsubscribe = async (req, res) => {
    try {
        const { email } = req.query;

        if (!email) {
            return res.status(400).json({
                success: false,
                message: 'Email is required'
            });
        }

        const subscription = await Newsletter.findOne({ email });
        if (subscription) {
            subscription.isActive = false;
            subscription.unsubscribedAt = new Date();
            await subscription.save();
        }

        res.json({
            success: true,
            message: 'You have been unsubscribed from our newsletter.'
        });
    } catch (error) {
        console.error('Unsubscribe error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to unsubscribe'
        });
    }
};

// Get all subscribers (admin only)
const getSubscribers = async (req, res) => {
    try {
        const subscribers = await Newsletter.find({ isActive: true })
            .sort({ subscribedAt: -1 });

        res.json({
            success: true,
            count: subscribers.length,
            data: subscribers
        });
    } catch (error) {
        console.error('Get subscribers error:', error);
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// Send bulk email to subscribers (admin only)
const sendBulkEmail = async (req, res) => {
    try {
        const { subject, message } = req.body;

        if (!subject || !message) {
            return res.status(400).json({
                success: false,
                message: 'Subject and message are required'
            });
        }

        const subscribers = await Newsletter.find({ isActive: true });

        if (subscribers.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'No active subscribers'
            });
        }

        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Send emails in batches
        for (const subscriber of subscribers) {
            const mailOptions = {
                from: `"DryCleanPro" <${process.env.EMAIL_USER}>`,
                to: subscriber.email,
                subject: subject,
                html: `
                    <div style="font-family: Arial, sans-serif; max-width: 600px;">
                        <h2>${subject}</h2>
                        <p>${message}</p>
                        <br/>
                        <p>Best regards,<br/>DryCleanPro Team</p>
                        <hr/>
                        <p style="font-size: 12px; color: #666;">
                            <a href="${process.env.CLIENT_URL}/unsubscribe?email=${subscriber.email}">Unsubscribe</a>
                        </p>
                    </div>
                `
            };

            await transporter.sendMail(mailOptions);
        }

        res.json({
            success: true,
            message: `Email sent to ${subscribers.length} subscribers`
        });
    } catch (error) {
        console.error('Bulk email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send emails'
        });
    }
};

module.exports = {
    subscribe,
    unsubscribe,
    getSubscribers,
    sendBulkEmail
};