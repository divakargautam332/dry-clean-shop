const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Simple CORS middleware - Allow all origins in development
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        return res.sendStatus(200);
    }
    next();
});

// Static folder for uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/services', require('./routes/serviceRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/user', require('./routes/userRoutes'));
app.use('/api/coupons', require('./routes/couponRoutes'));
app.use('/api/delivery', require('./routes/deliveryRoutes'));
app.use('/api/reviews', require('./routes/reviewRoutes'));

// Health check route
app.get('/api/health', (req, res) => {
    res.json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        uptime: process.uptime()
    });
});

// Home route
app.get('/', (req, res) => {
    res.json({
        success: true,
        message: 'Dry Clean API is running...',
        version: '1.0.0',
        environment: process.env.NODE_ENV,
        endpoints: {
            auth: '/api/auth',
            services: '/api/services',
            orders: '/api/orders',
            admin: '/api/admin',
            user: '/api/user',
            coupons: '/api/coupons',
            delivery: '/api/delivery',
            reviews: '/api/reviews',
            health: '/api/health'
        }
    });
});

// 404 handler - Must be last
app.use(notFound);

// Error handler - Must be last
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`\n🚀 Server running on port ${PORT}`);
    console.log(`📦 Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`🔗 API URL: http://localhost:${PORT}/api`);
    console.log(`✅ CORS enabled for all origins\n`);
});