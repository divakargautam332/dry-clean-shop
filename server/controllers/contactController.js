const nodemailer = require('nodemailer');

const sendContactEmail = async (req, res) => {
    try {
        const { name, email, phone, subject, message } = req.body;

        // Configure email transporter
        const transporter = nodemailer.createTransport({
            host: process.env.EMAIL_HOST,
            port: process.env.EMAIL_PORT,
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS
            }
        });

        // Email content
        const mailOptions = {
            from: `"${name}" <${email}>`,
            to: process.env.ADMIN_EMAIL,
            subject: subject || `Contact Form: ${name}`,
            html: `
                <h2>New Contact Form Submission</h2>
                <p><strong>Name:</strong> ${name}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone:</strong> ${phone || 'Not provided'}</p>
                <p><strong>Message:</strong></p>
                <p>${message}</p>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({
            success: true,
            message: 'Message sent successfully!'
        });
    } catch (error) {
        console.error('Contact email error:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to send message'
        });
    }
};

module.exports = { sendContactEmail };