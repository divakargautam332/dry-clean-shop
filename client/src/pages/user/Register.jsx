import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: {
            name: '',
            address: '',
            city: '',
            state: '',
            pincode: '',
            landmark: ''
        }
    });
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const { register } = useAuth();
    const navigate = useNavigate();

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Full name is required';
        } else if (formData.name.length < 2) {
            newErrors.name = 'Name must be at least 2 characters';
        }

        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Please enter a valid email';
        }

        if (!formData.phone) {
            newErrors.phone = 'Phone number is required';
        } else if (!/^[6-9]\d{9}$/.test(formData.phone)) {
            newErrors.phone = 'Please enter a valid 10-digit phone number';
        }

        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('address.')) {
            const addressField = name.split('.')[1];
            setFormData(prev => ({
                ...prev,
                address: { ...prev.address, [addressField]: value }
            }));
        } else {
            setFormData(prev => ({ ...prev, [name]: value }));
        }
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const userData = {
            name: formData.name,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            address: formData.address.name ? formData.address : undefined
        };

        const result = await register(userData);
        setLoading(false);

        if (result.success) {
            navigate('/dashboard');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl w-full space-y-8">
                <div>
                    <div className="flex justify-center">
                        <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                            <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                            </svg>
                        </div>
                    </div>
                    <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
                        Create your account
                    </h2>
                    <p className="mt-2 text-center text-sm text-gray-600">
                        Or{' '}
                        <Link to="/login" className="font-medium text-blue-600 hover:text-blue-500">
                            sign in to existing account
                        </Link>
                    </p>
                </div>

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        {/* Personal Information */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Personal Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    placeholder="John Doe"
                                    error={errors.name}
                                    required
                                />

                                <Input
                                    label="Email Address"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="you@example.com"
                                    error={errors.email}
                                    required
                                />

                                <Input
                                    label="Phone Number"
                                    name="phone"
                                    type="tel"
                                    value={formData.phone}
                                    onChange={handleChange}
                                    placeholder="9876543210"
                                    error={errors.phone}
                                    required
                                />

                                <Input
                                    label="Password"
                                    name="password"
                                    type="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="••••••"
                                    error={errors.password}
                                    required
                                />

                                <Input
                                    label="Confirm Password"
                                    name="confirmPassword"
                                    type="password"
                                    value={formData.confirmPassword}
                                    onChange={handleChange}
                                    placeholder="••••••"
                                    error={errors.confirmPassword}
                                    required
                                />
                            </div>
                        </div>

                        {/* Address Information (Optional) */}
                        <div className="bg-gray-50 p-4 rounded-lg">
                            <h3 className="text-lg font-medium text-gray-800 mb-3">Address Information (Optional)</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Recipient Name"
                                    name="address.name"
                                    value={formData.address.name}
                                    onChange={handleChange}
                                    placeholder="Full name"
                                />

                                <Input
                                    label="Address"
                                    name="address.address"
                                    value={formData.address.address}
                                    onChange={handleChange}
                                    placeholder="House/Flat No., Building, Street"
                                />

                                <Input
                                    label="City"
                                    name="address.city"
                                    value={formData.address.city}
                                    onChange={handleChange}
                                    placeholder="City"
                                />

                                <Input
                                    label="State"
                                    name="address.state"
                                    value={formData.address.state}
                                    onChange={handleChange}
                                    placeholder="State"
                                />

                                <Input
                                    label="Pincode"
                                    name="address.pincode"
                                    value={formData.address.pincode}
                                    onChange={handleChange}
                                    placeholder="6-digit pincode"
                                    maxLength={6}
                                />

                                <Input
                                    label="Landmark (Optional)"
                                    name="address.landmark"
                                    value={formData.address.landmark}
                                    onChange={handleChange}
                                    placeholder="Near by landmark"
                                />
                            </div>
                        </div>
                    </div>

                    <div className="flex items-center">
                        <input
                            id="terms"
                            name="terms"
                            type="checkbox"
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            required
                        />
                        <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                            I agree to the{' '}
                            <Link to="/terms" className="text-blue-600 hover:text-blue-500">
                                Terms of Service
                            </Link>
                            {' '}and{' '}
                            <Link to="/privacy" className="text-blue-600 hover:text-blue-500">
                                Privacy Policy
                            </Link>
                        </label>
                    </div>

                    <Button
                        type="submit"
                        variant="primary"
                        fullWidth
                        loading={loading}
                        className="py-3"
                    >
                        Create Account
                    </Button>

                    <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                            <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                            <span className="px-2 bg-gray-50 text-gray-500">Or sign up with</span>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5" viewBox="0 0 24 24">
                                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                            </svg>
                        </button>
                        <button
                            type="button"
                            className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879v-6.99h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.99C18.343 21.128 22 16.991 22 12z" />
                            </svg>
                        </button>
                    </div>
                </form>

                <p className="text-xs text-gray-500 text-center">
                    By creating an account, you agree to receive promotional emails and SMS from DryCleanPro.
                    You can opt out anytime.
                </p>
            </div>
        </div>
    );
};

export default Register;