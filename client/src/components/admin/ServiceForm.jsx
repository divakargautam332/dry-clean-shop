import React, { useState, useEffect } from 'react';
import Input from '../common/Input';
import Button from '../common/Button';

const ServiceForm = ({ initialData, onSubmit, onCancel, isSubmitting }) => {
    const [formData, setFormData] = useState({
        name: '',
        category: 'shirts',
        price: '',
        discountedPrice: '',
        processingTime: '24 hours',
        description: '',
        shortDescription: '',
        image: '',
        icon: 'fa-shirt',
        isActive: true,
        isPopular: false,
        isNew: false,
        tags: [],
        minOrderQuantity: 1,
        maxOrderQuantity: 50
    });

    const [errors, setErrors] = useState({});
    const [tagInput, setTagInput] = useState('');

    const categories = [
        { value: 'shirts', label: 'Shirts & Tops', icon: 'fa-shirt' },
        { value: 'pants', label: 'Pants & Trousers', icon: 'fa-pants' },
        { value: 'suits', label: 'Suits & Blazers', icon: 'fa-user-tie' },
        { value: 'ethnic', label: 'Ethnic Wear', icon: 'fa-sari' },
        { value: 'winter', label: 'Winter Wear', icon: 'fa-snowflake' },
        { value: 'home', label: 'Home Furnishings', icon: 'fa-home' },
        { value: 'other', label: 'Other Services', icon: 'fa-tshirt' }
    ];

    const processingTimes = [
        { value: 'Same day', label: 'Same Day' },
        { value: 'Express', label: 'Express (12 hours)' },
        { value: '24 hours', label: '24 Hours' },
        { value: '48 hours', label: '48 Hours' },
        { value: '72 hours', label: '72 Hours' }
    ];

    const tagOptions = [
        { value: 'dry-clean', label: 'Dry Clean' },
        { value: 'ironing', label: 'Ironing' },
        { value: 'wash-fold', label: 'Wash & Fold' },
        { value: 'stain-removal', label: 'Stain Removal' },
        { value: 'express', label: 'Express' }
    ];

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name || '',
                category: initialData.category || 'shirts',
                price: initialData.price || '',
                discountedPrice: initialData.discountedPrice || '',
                processingTime: initialData.processingTime || '24 hours',
                description: initialData.description || '',
                shortDescription: initialData.shortDescription || '',
                image: initialData.image || '',
                icon: initialData.icon || 'fa-shirt',
                isActive: initialData.isActive !== undefined ? initialData.isActive : true,
                isPopular: initialData.isPopular || false,
                isNew: initialData.isNew || false,
                tags: initialData.tags || [],
                minOrderQuantity: initialData.minOrderQuantity || 1,
                maxOrderQuantity: initialData.maxOrderQuantity || 50
            });
        }
    }, [initialData]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Service name is required';
        }

        if (!formData.price) {
            newErrors.price = 'Price is required';
        } else if (parseFloat(formData.price) <= 0) {
            newErrors.price = 'Price must be greater than 0';
        }

        if (formData.discountedPrice && parseFloat(formData.discountedPrice) >= parseFloat(formData.price)) {
            newErrors.discountedPrice = 'Discounted price must be less than original price';
        }

        if (!formData.description.trim()) {
            newErrors.description = 'Description is required';
        }

        if (formData.minOrderQuantity < 1) {
            newErrors.minOrderQuantity = 'Minimum quantity must be at least 1';
        }

        if (formData.maxOrderQuantity < formData.minOrderQuantity) {
            newErrors.maxOrderQuantity = 'Maximum quantity must be greater than minimum quantity';
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
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: '' }));
        }
    };

    const handleNumberChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value === '' ? '' : parseFloat(value)
        }));
    };

    const handleTagToggle = (tagValue) => {
        setFormData(prev => ({
            ...prev,
            tags: prev.tags.includes(tagValue)
                ? prev.tags.filter(t => t !== tagValue)
                : [...prev.tags, tagValue]
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validateForm()) {
            onSubmit(formData);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Service Name */}
                <Input
                    label="Service Name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="e.g., Premium Dry Clean"
                    error={errors.name}
                    required
                />

                {/* Category */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Category *
                    </label>
                    <select
                        name="category"
                        value={formData.category}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {categories.map(cat => (
                            <option key={cat.value} value={cat.value}>
                                {cat.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price */}
                <Input
                    label="Price (₹)"
                    name="price"
                    type="number"
                    value={formData.price}
                    onChange={handleNumberChange}
                    placeholder="e.g., 199"
                    error={errors.price}
                    required
                />

                {/* Discounted Price */}
                <Input
                    label="Discounted Price (₹) - Optional"
                    name="discountedPrice"
                    type="number"
                    value={formData.discountedPrice}
                    onChange={handleNumberChange}
                    placeholder="e.g., 149"
                    error={errors.discountedPrice}
                />

                {/* Processing Time */}
                <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                        Processing Time *
                    </label>
                    <select
                        name="processingTime"
                        value={formData.processingTime}
                        onChange={handleChange}
                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        {processingTimes.map(time => (
                            <option key={time.value} value={time.value}>
                                {time.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Quantity Limits */}
                <Input
                    label="Minimum Order Quantity"
                    name="minOrderQuantity"
                    type="number"
                    value={formData.minOrderQuantity}
                    onChange={handleNumberChange}
                    error={errors.minOrderQuantity}
                />

                <Input
                    label="Maximum Order Quantity"
                    name="maxOrderQuantity"
                    type="number"
                    value={formData.maxOrderQuantity}
                    onChange={handleNumberChange}
                    error={errors.maxOrderQuantity}
                />

                {/* Image URL */}
                <Input
                    label="Image URL"
                    name="image"
                    value={formData.image}
                    onChange={handleChange}
                    placeholder="https://example.com/image.jpg"
                />

                {/* Icon Class */}
                <Input
                    label="Icon Class"
                    name="icon"
                    value={formData.icon}
                    onChange={handleChange}
                    placeholder="fa-shirt"
                />
            </div>

            {/* Short Description */}
            <Input
                label="Short Description"
                name="shortDescription"
                value={formData.shortDescription}
                onChange={handleChange}
                placeholder="Brief description (max 100 chars)"
                maxLength={100}
            />

            {/* Full Description */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Description *
                </label>
                <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    rows={4}
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Detailed description of the service..."
                />
                {errors.description && (
                    <p className="mt-1 text-sm text-red-500">{errors.description}</p>
                )}
            </div>

            {/* Tags */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Service Tags
                </label>
                <div className="flex flex-wrap gap-2">
                    {tagOptions.map(tag => (
                        <button
                            key={tag.value}
                            type="button"
                            onClick={() => handleTagToggle(tag.value)}
                            className={`px-3 py-1 rounded-full text-sm transition-colors ${formData.tags.includes(tag.value)
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                        >
                            {tag.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Status Toggles */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isActive"
                        checked={formData.isActive}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Active</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isPopular"
                        checked={formData.isPopular}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">Popular</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                    <input
                        type="checkbox"
                        name="isNew"
                        checked={formData.isNew}
                        onChange={handleChange}
                        className="w-4 h-4 text-blue-600 rounded focus:ring-blue-500"
                    />
                    <span className="text-sm text-gray-700">New Arrival</span>
                </label>
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
                {onCancel && (
                    <Button
                        type="button"
                        variant="secondary"
                        onClick={onCancel}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                )}
                <Button
                    type="submit"
                    variant="primary"
                    loading={isSubmitting}
                >
                    {initialData ? 'Update Service' : 'Create Service'}
                </Button>
            </div>
        </form>
    );
};

export default ServiceForm;