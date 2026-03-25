import React, { useState, useEffect } from 'react';
import Input from '../common/Input';

const AddressForm = ({
    initialData = null,
    onSubmit,
    onCancel,
    isSubmitting = false
}) => {
    const [formData, setFormData] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: '',
        isDefault: false
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                address: initialData.address || '',
                city: initialData.city || '',
                state: initialData.state || '',
                pincode: initialData.pincode || '',
                landmark: initialData.landmark || '',
                isDefault: initialData.isDefault || false
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Recipient name is required';
        }

        if (!formData.address.trim()) {
            newErrors.address = 'Address is required';
        }

        if (!formData.city.trim()) {
            newErrors.city = 'City is required';
        }

        if (!formData.state.trim()) {
            newErrors.state = 'State is required';
        }

        if (!formData.pincode) {
            newErrors.pincode = 'Pincode is required';
        } else if (!/^[1-9][0-9]{5}$/.test(formData.pincode)) {
            newErrors.pincode = 'Please enter a valid 6-digit pincode';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
        // Clear error for this field
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Input
                label="Recipient Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Full name"
                error={errors.name}
                required
            />

            <Input
                label="Address"
                name="address"
                value={formData.address}
                onChange={handleChange}
                placeholder="House/Flat No., Building, Street"
                error={errors.address}
                required
            />

            <Input
                label="Landmark (Optional)"
                name="landmark"
                value={formData.landmark}
                onChange={handleChange}
                placeholder="Near by landmark"
                error={errors.landmark}
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Input
                    label="City"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    placeholder="City"
                    error={errors.city}
                    required
                />

                <Input
                    label="State"
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    placeholder="State"
                    error={errors.state}
                    required
                />
            </div>

            <Input
                label="Pincode"
                name="pincode"
                type="text"
                value={formData.pincode}
                onChange={handleChange}
                placeholder="6-digit pincode"
                maxLength={6}
                error={errors.pincode}
                required
            />

            <div className="flex items-center">
                <input
                    type="checkbox"
                    name="isDefault"
                    id="isDefault"
                    checked={formData.isDefault}
                    onChange={handleChange}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="isDefault" className="ml-2 text-sm text-gray-700">
                    Set as default address
                </label>
            </div>

            <div className="flex justify-end space-x-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : initialData ? 'Update Address' : 'Add Address'}
                </button>
            </div>
        </form>
    );
};

export default AddressForm;