import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const AddStaff = () => {
    const navigate = useNavigate();
    const { createDeliveryStaff } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        address: '',
        city: '',
        pincode: '',
        vehicleType: 'bike',
        vehicleNumber: '',
        drivingLicense: '',
        isAvailable: true,
        isActive: true,
        workSchedule: {
            monday: { start: '09:00', end: '18:00', isWorking: true },
            tuesday: { start: '09:00', end: '18:00', isWorking: true },
            wednesday: { start: '09:00', end: '18:00', isWorking: true },
            thursday: { start: '09:00', end: '18:00', isWorking: true },
            friday: { start: '09:00', end: '18:00', isWorking: true },
            saturday: { start: '09:00', end: '18:00', isWorking: true },
            sunday: { start: '09:00', end: '18:00', isWorking: false }
        }
    });
    const [errors, setErrors] = useState({});

    const vehicleTypes = [
        { value: 'bike', label: 'Bike' },
        { value: 'scooter', label: 'Scooter' },
        { value: 'car', label: 'Car' },
        { value: 'bicycle', label: 'Bicycle' }
    ];

    const weekdays = [
        { key: 'monday', label: 'Monday' },
        { key: 'tuesday', label: 'Tuesday' },
        { key: 'wednesday', label: 'Wednesday' },
        { key: 'thursday', label: 'Thursday' },
        { key: 'friday', label: 'Friday' },
        { key: 'saturday', label: 'Saturday' },
        { key: 'sunday', label: 'Sunday' }
    ];

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) newErrors.name = 'Name is required';
        if (!formData.email.trim()) newErrors.email = 'Email is required';
        else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email';
        if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
        else if (!/^[6-9]\d{9}$/.test(formData.phone)) newErrors.phone = 'Invalid phone number';
        if (!formData.password) newErrors.password = 'Password is required';
        else if (formData.password.length < 6) newErrors.password = 'Password must be at least 6 characters';
        if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
        if (!formData.address.trim()) newErrors.address = 'Address is required';
        if (!formData.city.trim()) newErrors.city = 'City is required';
        if (!formData.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(formData.pincode)) newErrors.pincode = 'Invalid pincode';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
    };

    const handleScheduleChange = (day, field, value) => {
        setFormData(prev => ({
            ...prev,
            workSchedule: {
                ...prev.workSchedule,
                [day]: {
                    ...prev.workSchedule[day],
                    [field]: field === 'isWorking' ? value : value
                }
            }
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const { confirmPassword, ...submitData } = formData;
        const result = await createDeliveryStaff(submitData);
        if (result.success) {
            toast.success('Delivery staff added successfully');
            navigate('/admin/delivery-staff');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/delivery-staff" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Delivery Staff
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add Delivery Staff</h1>
                <p className="text-gray-500">Add a new delivery personnel</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Personal Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Full Name"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                error={errors.name}
                                required
                            />
                            <Input
                                label="Email Address"
                                name="email"
                                type="email"
                                value={formData.email}
                                onChange={handleChange}
                                error={errors.email}
                                required
                            />
                            <Input
                                label="Phone Number"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                onChange={handleChange}
                                error={errors.phone}
                                required
                            />
                            <Input
                                label="Password"
                                name="password"
                                type="password"
                                value={formData.password}
                                onChange={handleChange}
                                error={errors.password}
                                required
                            />
                            <Input
                                label="Confirm Password"
                                name="confirmPassword"
                                type="password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                error={errors.confirmPassword}
                                required
                            />
                        </div>
                    </div>

                    {/* Address Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Address Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <Input
                                label="Address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                error={errors.address}
                                required
                            />
                            <Input
                                label="City"
                                name="city"
                                value={formData.city}
                                onChange={handleChange}
                                error={errors.city}
                                required
                            />
                            <Input
                                label="Pincode"
                                name="pincode"
                                value={formData.pincode}
                                onChange={handleChange}
                                error={errors.pincode}
                                required
                            />
                        </div>
                    </div>

                    {/* Vehicle Information */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Vehicle Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Vehicle Type</label>
                                <select
                                    name="vehicleType"
                                    value={formData.vehicleType}
                                    onChange={handleChange}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                    {vehicleTypes.map(type => (
                                        <option key={type.value} value={type.value}>{type.label}</option>
                                    ))}
                                </select>
                            </div>
                            <Input
                                label="Vehicle Number"
                                name="vehicleNumber"
                                value={formData.vehicleNumber}
                                onChange={handleChange}
                                placeholder="e.g., MH01AB1234"
                            />
                            <Input
                                label="Driving License Number"
                                name="drivingLicense"
                                value={formData.drivingLicense}
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {/* Work Schedule */}
                    <div>
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Work Schedule</h2>
                        <div className="space-y-3">
                            {weekdays.map(day => (
                                <div key={day.key} className="flex flex-wrap items-center gap-4 p-3 bg-gray-50 rounded-lg">
                                    <div className="w-24">
                                        <label className="flex items-center gap-2">
                                            <input
                                                type="checkbox"
                                                checked={formData.workSchedule[day.key].isWorking}
                                                onChange={(e) => handleScheduleChange(day.key, 'isWorking', e.target.checked)}
                                                className="w-4 h-4 text-blue-600 rounded"
                                            />
                                            <span className="text-sm font-medium">{day.label}</span>
                                        </label>
                                    </div>
                                    {formData.workSchedule[day.key].isWorking && (
                                        <>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">Start:</span>
                                                <input
                                                    type="time"
                                                    value={formData.workSchedule[day.key].start}
                                                    onChange={(e) => handleScheduleChange(day.key, 'start', e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <span className="text-sm text-gray-500">End:</span>
                                                <input
                                                    type="time"
                                                    value={formData.workSchedule[day.key].end}
                                                    onChange={(e) => handleScheduleChange(day.key, 'end', e.target.value)}
                                                    className="p-2 border border-gray-300 rounded-lg"
                                                />
                                            </div>
                                        </>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Status */}
                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isAvailable"
                                checked={formData.isAvailable}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Available for deliveries</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Active Account</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/delivery-staff')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Add Staff Member
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddStaff;