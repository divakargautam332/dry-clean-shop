const User = require('../models/User');
const { generateToken } = require('../utils/generateToken');
const { sendWelcomeEmail } = require('../utils/sendEmail');
const { sendWelcomeSMS } = require('../utils/sendSMS');
const { validateRegistration, validateLogin } = require('../utils/validation');

// @desc    Register a new user
// @route   POST /api/auth/register
// @access  Public
const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validate input
        const validation = validateRegistration(name, email, phone, password);
        if (!validation.isValid) {
            res.status(400);
            throw new Error(validation.errors.join(', '));
        }

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) {
            res.status(400);
            throw new Error('User already exists');
        }

        // Check if phone already registered
        const phoneExists = await User.findOne({ phone });
        if (phoneExists) {
            res.status(400);
            throw new Error('Phone number already registered');
        }

        // Create user
        const user = await User.create({
            name,
            email,
            password,
            phone,
            addresses: address ? [address] : []
        });

        if (user) {
            // Send welcome email and SMS (don't await, let it run in background)
            sendWelcomeEmail(user).catch(console.error);
            sendWelcomeSMS(user).catch(console.error);

            res.status(201).json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    addresses: user.addresses,
                    loyaltyPoints: user.loyaltyPoints,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(400);
            throw new Error('Invalid user data');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        const validation = validateLogin(email, password);
        if (!validation.isValid) {
            res.status(400);
            throw new Error(validation.errors.join(', '));
        }

        // Find user
        const user = await User.findOne({ email }).select('+password');

        if (user && (await user.matchPassword(password))) {
            // Check if account is active
            if (!user.isActive) {
                res.status(401);
                throw new Error('Your account has been deactivated. Please contact support.');
            }

            res.json({
                success: true,
                data: {
                    _id: user._id,
                    name: user.name,
                    email: user.email,
                    phone: user.phone,
                    role: user.role,
                    addresses: user.addresses,
                    profileImage: user.profileImage,
                    loyaltyPoints: user.loyaltyPoints,
                    totalOrders: user.totalOrders,
                    token: generateToken(user._id)
                }
            });
        } else {
            res.status(401);
            throw new Error('Invalid email or password');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Get user profile
// @route   GET /api/auth/profile
// @access  Private
const getUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');

        if (user) {
            res.json({
                success: true,
                data: user
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
const updateUserProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.name = req.body.name || user.name;
            user.email = req.body.email || user.email;
            user.phone = req.body.phone || user.phone;

            if (req.body.profileImage) {
                user.profileImage = req.body.profileImage;
            }

            if (req.body.address) {
                // Check if address already exists
                const addressExists = user.addresses.some(
                    addr => addr.address === req.body.address.address &&
                        addr.city === req.body.address.city
                );

                if (!addressExists) {
                    user.addresses.push(req.body.address);
                }
            }

            if (req.body.password) {
                user.password = req.body.password;
            }

            const updatedUser = await user.save();

            res.json({
                success: true,
                data: {
                    _id: updatedUser._id,
                    name: updatedUser.name,
                    email: updatedUser.email,
                    phone: updatedUser.phone,
                    role: updatedUser.role,
                    addresses: updatedUser.addresses,
                    profileImage: updatedUser.profileImage,
                    loyaltyPoints: updatedUser.loyaltyPoints,
                    token: generateToken(updatedUser._id)
                }
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Add new address
// @route   POST /api/auth/address
// @access  Private
const addAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const { name, address, city, state, pincode, landmark, isDefault } = req.body;

            const newAddress = {
                name,
                address,
                city,
                state,
                pincode,
                landmark,
                isDefault: isDefault || false
            };

            // If this is default, remove default from other addresses
            if (newAddress.isDefault) {
                user.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
            }

            user.addresses.push(newAddress);
            await user.save();

            res.json({
                success: true,
                data: user.addresses
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Update address
// @route   PUT /api/auth/address/:addressId
// @access  Private
const updateAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            const addressIndex = user.addresses.findIndex(
                addr => addr._id.toString() === req.params.addressId
            );

            if (addressIndex === -1) {
                res.status(404);
                throw new Error('Address not found');
            }

            const { name, address, city, state, pincode, landmark, isDefault } = req.body;

            if (name) user.addresses[addressIndex].name = name;
            if (address) user.addresses[addressIndex].address = address;
            if (city) user.addresses[addressIndex].city = city;
            if (state) user.addresses[addressIndex].state = state;
            if (pincode) user.addresses[addressIndex].pincode = pincode;
            if (landmark) user.addresses[addressIndex].landmark = landmark;

            if (isDefault) {
                user.addresses.forEach(addr => {
                    addr.isDefault = false;
                });
                user.addresses[addressIndex].isDefault = true;
            }

            await user.save();

            res.json({
                success: true,
                data: user.addresses
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Delete address
// @route   DELETE /api/auth/address/:addressId
// @access  Private
const deleteAddress = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);

        if (user) {
            user.addresses = user.addresses.filter(
                addr => addr._id.toString() !== req.params.addressId
            );

            await user.save();

            res.json({
                success: true,
                data: user.addresses
            });
        } else {
            res.status(404);
            throw new Error('User not found');
        }
    } catch (error) {
        res.status(res.statusCode === 200 ? 500 : res.statusCode);
        res.json({
            success: false,
            message: error.message
        });
    }
};

// @desc    Change password
// @route   PUT /api/auth/change-password
// @access  Private
const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;

        const user = await User.findById(req.user._id).select('+password');

        if (user && (await user.matchPassword(currentPassword))) {
            user.password = newPassword;
            await user.save();

            res.json({
                success: true,
                message: 'Password changed successfully'
            });
        } else {
            res.status(401);
            throw new Error('Current password is incorrect');
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
    registerUser,
    loginUser,
    getUserProfile,
    updateUserProfile,
    addAddress,
    updateAddress,
    deleteAddress,
    changePassword
};