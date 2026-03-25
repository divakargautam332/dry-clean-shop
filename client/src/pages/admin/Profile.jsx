import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useAdmin } from '../../hooks/useAdmin';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const AdminProfile = () => {
    const { user, updateProfile, changePassword } = useAuth();
    const { formatDate } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('profile');
    const [profileData, setProfileData] = useState({
        name: '',
        email: '',
        phone: '',
        profileImage: ''
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
                phone: user.phone || '',
                profileImage: user.profileImage || ''
            });
        }
    }, [user]);

    const validateProfile = () => {
        const newErrors = {};
        if (!profileData.name.trim()) newErrors.name = 'Name is required';
        if (!profileData.email) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(profileData.email)) newErrors.email = 'Invalid email';
        if (!profileData.phone) newErrors.phone = 'Phone is required';
        else if (!/^[6-9]\d{9}$/.test(profileData.phone)) newErrors.phone = 'Invalid phone number';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const validatePassword = () => {
        const newErrors = {};
        if (!passwordData.currentPassword) newErrors.currentPassword = 'Current password is required';
        if (!passwordData.newPassword) newErrors.newPassword = 'New password is required';
        else if (passwordData.newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
        if (passwordData.newPassword !== passwordData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleProfileUpdate = async (e) => {
        e.preventDefault();
        if (!validateProfile()) return;

        setLoading(true);
        const result = await updateProfile(profileData);
        if (result.success) {
            toast.success('Profile updated successfully');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        if (!validatePassword()) return;

        setLoading(true);
        const result = await changePassword(passwordData.currentPassword, passwordData.newPassword);
        if (result.success) {
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        }
        setLoading(false);
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setProfileData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handlePasswordChangeInput = (e) => {
        const { name, value } = e.target;
        setPasswordData(prev => ({ ...prev, [name]: value }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Admin Profile</h1>
                <p className="text-gray-500">Manage your account settings</p>
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
                            <p className="text-sm text-gray-500">{user?.role === 'admin' ? 'Administrator' : 'Staff'}</p>
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
                                onClick={() => setActiveTab('activity')}
                                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${activeTab === 'activity'
                                        ? 'bg-blue-50 text-blue-600'
                                        : 'text-gray-600 hover:bg-gray-50'
                                    }`}
                            >
                                Activity Log
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
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Profile Picture URL</label>
                                    <input
                                        type="text"
                                        name="profileImage"
                                        value={profileData.profileImage}
                                        onChange={handleChange}
                                        placeholder="https://example.com/image.jpg"
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <p className="text-xs text-gray-500 mt-1">Enter a URL for your profile picture</p>
                                </div>
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

                    {/* Activity Log */}
                    {activeTab === 'activity' && (
                        <div className="bg-white rounded-lg shadow-md p-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h2>
                            <div className="space-y-3">
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600">
                                        🔑
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Login</p>
                                        <p className="text-xs text-gray-500">You logged in from Mumbai, India</p>
                                        <p className="text-xs text-gray-400 mt-1">{formatDate(new Date())}</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center text-green-600">
                                        📝
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Order Updated</p>
                                        <p className="text-xs text-gray-500">Order #DRY202412010001 status changed to Delivered</p>
                                        <p className="text-xs text-gray-400 mt-1">Yesterday, 3:45 PM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center text-purple-600">
                                        🛒
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">New Order</p>
                                        <p className="text-xs text-gray-500">New order #DRY202412010045 received from Rajesh Sharma</p>
                                        <p className="text-xs text-gray-400 mt-1">Yesterday, 11:20 AM</p>
                                    </div>
                                </div>
                                <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center text-yellow-600">
                                        ✏️
                                    </div>
                                    <div>
                                        <p className="text-sm font-medium text-gray-800">Service Updated</p>
                                        <p className="text-xs text-gray-500">Service "Premium Dry Clean" price updated to ₹249</p>
                                        <p className="text-xs text-gray-400 mt-1">2 days ago, 9:30 AM</p>
                                    </div>
                                </div>
                            </div>
                            <div className="mt-4 text-center">
                                <button className="text-blue-600 hover:text-blue-700 text-sm">
                                    View Full Activity Log →
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminProfile;