import api from './api';

const TOKEN_KEY = 'token';
const USER_KEY = 'user';

// Get stored token
const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
};

// Get stored user
const getStoredUser = () => {
    const user = localStorage.getItem(USER_KEY);
    return user ? JSON.parse(user) : null;
};

// Set token and user in storage
const setAuthData = (token, user) => {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
};

// Clear auth data from storage
const clearAuthData = () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
};

// Register user
const register = async (userData) => {
    try {
        const response = await api.post('/auth/register', userData);
        const { token, data: user } = response.data;

        if (token && user) {
            setAuthData(token, user);
        }

        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Registration failed'
        };
    }
};

// Login user
const login = async (email, password) => {
    try {
        const response = await api.post('/auth/login', { email, password });
        const { token, data: user } = response.data;

        if (token && user) {
            setAuthData(token, user);
        }

        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Login failed'
        };
    }
};

// Logout user
const logout = () => {
    clearAuthData();
    window.location.href = '/login';
};

// Get current user profile
const getProfile = async () => {
    try {
        const response = await api.get('/auth/profile');
        const user = response.data.data;

        // Update stored user
        const currentUser = getStoredUser();
        if (currentUser) {
            setAuthData(getToken(), { ...currentUser, ...user });
        }

        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to get profile'
        };
    }
};

// Update user profile
const updateProfile = async (userData) => {
    try {
        const response = await api.put('/auth/profile', userData);
        const { data: user } = response.data;

        // Update stored user
        const currentUser = getStoredUser();
        if (currentUser) {
            setAuthData(getToken(), { ...currentUser, ...user });
        }

        return { success: true, data: user };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update profile'
        };
    }
};

// Change password
const changePassword = async (currentPassword, newPassword) => {
    try {
        const response = await api.put('/auth/change-password', {
            currentPassword,
            newPassword
        });

        return { success: true, message: response.data.message };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to change password'
        };
    }
};

// Add new address
const addAddress = async (address) => {
    try {
        const response = await api.post('/auth/address', address);
        const { data: addresses } = response.data;

        // Update stored user with new addresses
        const currentUser = getStoredUser();
        if (currentUser) {
            setAuthData(getToken(), { ...currentUser, addresses });
        }

        return { success: true, data: addresses };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to add address'
        };
    }
};

// Update address
const updateAddress = async (addressId, address) => {
    try {
        const response = await api.put(`/auth/address/${addressId}`, address);
        const { data: addresses } = response.data;

        // Update stored user with updated addresses
        const currentUser = getStoredUser();
        if (currentUser) {
            setAuthData(getToken(), { ...currentUser, addresses });
        }

        return { success: true, data: addresses };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to update address'
        };
    }
};

// Delete address
const deleteAddress = async (addressId) => {
    try {
        const response = await api.delete(`/auth/address/${addressId}`);
        const { data: addresses } = response.data;

        // Update stored user with updated addresses
        const currentUser = getStoredUser();
        if (currentUser) {
            setAuthData(getToken(), { ...currentUser, addresses });
        }

        return { success: true, data: addresses };
    } catch (error) {
        return {
            success: false,
            message: error.response?.data?.message || 'Failed to delete address'
        };
    }
};

// Check if user is authenticated
const isAuthenticated = () => {
    const token = getToken();
    return !!token;
};

// Check if user is admin
const isAdmin = () => {
    const user = getStoredUser();
    return user?.role === 'admin';
};

// Check if user is staff
const isStaff = () => {
    const user = getStoredUser();
    return user?.role === 'staff' || user?.role === 'admin';
};

// Get current user
const getCurrentUser = () => {
    return getStoredUser();
};

// Update user in storage (for cart, etc.)
const updateUser = (updates) => {
    const currentUser = getStoredUser();
    if (currentUser) {
        setAuthData(getToken(), { ...currentUser, ...updates });
    }
};

const authService = {
    getToken,
    getStoredUser,
    setAuthData,
    clearAuthData,
    register,
    login,
    logout,
    getProfile,
    updateProfile,
    changePassword,
    addAddress,
    updateAddress,
    deleteAddress,
    isAuthenticated,
    isAdmin,
    isStaff,
    getCurrentUser,
    updateUser
};

export default authService;