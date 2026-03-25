import React, { createContext, useState, useContext, useEffect } from 'react';
import authService from '../services/authService';
import { toast } from 'react-toastify';

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        loadUser();
    }, []);

    const loadUser = async () => {
        setLoading(true);
        const storedUser = authService.getStoredUser();

        if (storedUser && authService.isAuthenticated()) {
            setUser(storedUser);
            setIsAuthenticated(true);

            const response = await authService.getProfile();
            if (response.success) {
                setUser(response.data);
                setIsAuthenticated(true);
            } else {
                logout();
            }
        }
        setLoading(false);
    };

    const register = async (userData) => {
        setLoading(true);
        const response = await authService.register(userData);

        if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
            toast.success('Registration successful! Welcome to Dry Clean Shop.');
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    const login = async (email, password) => {
        setLoading(true);
        const response = await authService.login(email, password);

        if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
            toast.success(`Welcome back, ${response.data.name}!`);
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        setIsAuthenticated(false);
        toast.info('You have been logged out.');
    };

    const updateProfile = async (userData) => {
        setLoading(true);
        const response = await authService.updateProfile(userData);

        if (response.success) {
            setUser(response.data);
            setIsAuthenticated(true);
            toast.success('Profile updated successfully!');
            setLoading(false);
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    const changePassword = async (currentPassword, newPassword) => {
        setLoading(true);
        const response = await authService.changePassword(currentPassword, newPassword);

        if (response.success) {
            toast.success('Password changed successfully!');
            setLoading(false);
            return { success: true };
        } else {
            toast.error(response.message);
            setLoading(false);
            return { success: false, message: response.message };
        }
    };

    const addAddress = async (address) => {
        const response = await authService.addAddress(address);

        if (response.success) {
            setUser(prev => ({ ...prev, addresses: response.data }));
            toast.success('Address added successfully!');
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            return { success: false, message: response.message };
        }
    };

    const updateAddress = async (addressId, address) => {
        const response = await authService.updateAddress(addressId, address);

        if (response.success) {
            setUser(prev => ({ ...prev, addresses: response.data }));
            toast.success('Address updated successfully!');
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            return { success: false, message: response.message };
        }
    };

    const deleteAddress = async (addressId) => {
        const response = await authService.deleteAddress(addressId);

        if (response.success) {
            setUser(prev => ({ ...prev, addresses: response.data }));
            toast.success('Address deleted successfully!');
            return { success: true, data: response.data };
        } else {
            toast.error(response.message);
            return { success: false, message: response.message };
        }
    };

    const isAdmin = () => {
        return user?.role === 'admin';
    };

    const isStaff = () => {
        return user?.role === 'staff' || user?.role === 'admin';
    };

    const isCustomer = () => {
        return user?.role === 'customer';
    };

    const getLoyaltyPoints = () => {
        return user?.loyaltyPoints || 0;
    };

    const value = {
        user,
        loading,
        isAuthenticated,
        register,
        login,
        logout,
        updateProfile,
        changePassword,
        addAddress,
        updateAddress,
        deleteAddress,
        isAdmin,
        isStaff,
        isCustomer,
        getLoyaltyPoints,
        refreshUser: loadUser
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthContext;