const User = require('../models/User');

const checkAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no user found'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin only.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const checkAdminOrStaff = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no user found'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin' && user.role !== 'staff') {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Admin or staff only.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

const checkSuperAdmin = async (req, res, next) => {
    try {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Not authorized, no user found'
            });
        }

        const user = await User.findById(req.user._id);

        if (!user) {
            return res.status(401).json({
                success: false,
                message: 'User not found'
            });
        }

        if (user.role !== 'admin' || !user.isSuperAdmin) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Super admin only.'
            });
        }

        next();
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    checkAdmin,
    checkAdminOrStaff,
    checkSuperAdmin
};