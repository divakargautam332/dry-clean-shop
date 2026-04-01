import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Profile = () => {
    const { user, updateProfile, changePassword, getLoyaltyPoints } = useAuth();

    const [activeTab, setActiveTab] = useState('profile');
    const [loading, setLoading] = useState(false);

    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            setProfileData({
                name: user.name || '',
                email: user.email || '',
                phone: user.phone || ''
            });
        }
    }, [user]);

    const validateProfile = () => {
        const newErrors = {};
        if (!profileData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!profileData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(profileData.email)) {
            newErrors.email = 'Please enter a valid email';
        }
        if (!profileData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(profileData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!passwordData.currentPassword) {
            newErrors.currentPassword = 'Current password is required';
        }
        if (!passwordData.newPassword) {
            newErrors.newPassword = 'New password is required';
        } else if (passwordData.newPassword.length < 6) {
            newErrors.newPassword = 'Password must be at least 6 characters';
        }
        if (passwordData.newPassword !== passwordData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        setLoading(true);
        const result = await updateProfile(profileData);
        setLoading(false);

        if (result.success) {
            toast.success('Profile updated successfully');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        setLoading(false);

        if (result.success) {
            setPasswordData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handlePasswordChangeInput = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const loyaltyPoints = getLoyaltyPoints();
    const pointsValue = Math.floor(loyaltyPoints * 0.5);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="mb-6">
                    <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                        ← Back to Dashboard
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800 mb-2">My Profile</h1>
                    <p className="text-gray-600">Manage your account information</p>
                </div>

                <div className="grid md:grid-cols-4 gap-6">
                    {/* Sidebar */}
                    <div className="md:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-4">
                            <div className="text-center mb-4">
                                <div className="w-20 h-20 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-3">
                                    {user?.name?.charAt(0).toUpperCase()}
                                </div>
                                <h3 className="font-semibold text-gray-800">{user?.name}</h3>
                                <p className="text-sm text-gray-500">{user?.email}</p>
                            </div>

                            <div className="border-t border-gray-100 pt-4">
                                <button
                                    onClick={() => setActiveTab('profile')}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'profile'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Profile Information
                                </button>
                                <button
                                    onClick={() => setActiveTab('password')}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'password'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={() => setActiveTab('loyalty')}
                                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'loyalty'
                                            ? 'bg-blue-50 text-blue-600'
                                            : 'text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    Loyalty Points
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="md:col-span-3">
                        {/* Profile Information */}
                        {activeTab === 'profile' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Profile Information</h2>
                                <form onSubmit={handleProfileUpdate} className="space-y-4">
                                    <Input
                                        label="Full Name"
                                        name="name"
                                        value={profileData.name}
                                        onChange={handleChange}
                                        error={errors.name}
                                        required
                                    />
                                    <Input
                                        label="Email Address"
                                        name="email"
                                        type="email"
                                        value={profileData.email}
                                        onChange={handleChange}
                                        error={errors.email}
                                        required
                                    />
                                    <Input
                                        label="Phone Number"
                                        name="phone"
                                        type="tel"
                                        value={profileData.phone}
                                        onChange={handleChange}
                                        error={errors.phone}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="primary" loading={loading}>
                                            Update Profile
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Change Password */}
                        {activeTab === 'password' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Change Password</h2>
                                <form onSubmit={handlePasswordChange} className="space-y-4">
                                    <Input
                                        label="Current Password"
                                        name="currentPassword"
                                        type="password"
                                        value={passwordData.currentPassword}
                                        onChange={handlePasswordChangeInput}
                                        error={errors.currentPassword}
                                        required
                                    />
                                    <Input
                                        label="New Password"
                                        name="newPassword"
                                        type="password"
                                        value={passwordData.newPassword}
                                        onChange={handlePasswordChangeInput}
                                        error={errors.newPassword}
                                        helperText="Password must be at least 6 characters"
                                        required
                                    />
                                    <Input
                                        label="Confirm New Password"
                                        name="confirmPassword"
                                        type="password"
                                        value={passwordData.confirmPassword}
                                        onChange={handlePasswordChangeInput}
                                        error={errors.confirmPassword}
                                        required
                                    />
                                    <div className="flex justify-end">
                                        <Button type="submit" variant="primary" loading={loading}>
                                            Change Password
                                        </Button>
                                    </div>
                                </form>
                            </div>
                        )}

                        {/* Loyalty Points */}
                        {activeTab === 'loyalty' && (
                            <div className="bg-white rounded-lg shadow-md p-6">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Loyalty Points</h2>

                                <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-xl p-6 text-white mb-6">
                                    <div className="flex items-center justify-between mb-4">
                                        <span className="text-4xl">⭐</span>
                                        <span className="text-sm opacity-90">Rewards Program</span>
                                    </div>
                                    <p className="text-3xl font-bold mb-2">{loyaltyPoints}</p>
                                    <p className="text-sm opacity-90 mb-3">Total Loyalty Points</p>
                                    <div className="w-full bg-white/30 rounded-full h-2 mb-3">
                                        <div
                                            className="bg-white rounded-full h-2 transition-all"
                                            style={{ width: `${Math.min((loyaltyPoints % 100) * 100 / 100, 100)}%` }}
                                        />
                                    </div>
                                    <p className="text-xs opacity-90">
                                        {100 - (loyaltyPoints % 100)} more points for ₹50 reward
                                    </p>
                                </div>

                                <div className="grid grid-cols-2 gap-4 mb-6">
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{pointsValue}</p>
                                        <p className="text-xs text-gray-500">Reward Value (₹)</p>
                                    </div>
                                    <div className="bg-gray-50 rounded-lg p-3 text-center">
                                        <p className="text-2xl font-bold text-blue-600">{Math.floor(loyaltyPoints / 100)}</p>
                                        <p className="text-xs text-gray-500">Available Rewards</p>
                                    </div>
                                </div>

                                <div className="bg-gray-50 rounded-lg p-4">
                                    <h3 className="font-semibold text-gray-800 mb-2">How to Earn Points?</h3>
                                    <ul className="space-y-2 text-sm text-gray-600">
                                        <li>✓ Earn 1 point for every ₹100 spent</li>
                                        <li>✓ 100 points = ₹50 discount on next order</li>
                                        <li>✓ Bonus points on special occasions</li>
                                        <li>✓ Refer friends to earn extra points</li>
                                    </ul>
                                </div>

                                <div className="mt-6">
                                    <Link
                                        to="/services"
                                        className="block w-full text-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Shop to Earn More Points
                                    </Link>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;