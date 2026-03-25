import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const AddCoupon = () => {
    const navigate = useNavigate();
    const { createCoupon } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        code: '',
        name: '',
        description: '',
        discountType: 'percentage',
        discountValue: '',
        maxDiscount: '',
        minOrderAmount: '',
        validFrom: '',
        validTill: '',
        usageLimit: '',
        perUserLimit: 1,
        applicableFor: 'all',
        isActive: true,
        isFeatured: false
    });
    const [errors, setErrors] = useState({});

    const validateForm = () => {
        const newErrors = {};

        if (!formData.code.trim()) {
            newErrors.code = 'Coupon code is required';
        } else if (formData.code.length < 3) {
            newErrors.code = 'Code must be at least 3 characters';
        }

        if (!formData.name.trim()) {
            newErrors.name = 'Coupon name is required';
        }

        if (!formData.discountValue) {
            newErrors.discountValue = 'Discount value is required';
        } else if (formData.discountType === 'percentage' && (formData.discountValue <= 0 || formData.discountValue > 100)) {
            newErrors.discountValue = 'Percentage must be between 1 and 100';
        } else if (formData.discountType === 'fixed' && formData.discountValue <= 0) {
            newErrors.discountValue = 'Discount amount must be greater than 0';
        }

        if (formData.maxDiscount && formData.discountType === 'percentage' && formData.maxDiscount <= 0) {
            newErrors.maxDiscount = 'Maximum discount must be greater than 0';
        }

        if (formData.minOrderAmount && formData.minOrderAmount < 0) {
            newErrors.minOrderAmount = 'Minimum order amount cannot be negative';
        }

        if (!formData.validFrom) {
            newErrors.validFrom = 'Valid from date is required';
        }

        if (!formData.validTill) {
            newErrors.validTill = 'Valid till date is required';
        } else if (formData.validFrom && new Date(formData.validTill) <= new Date(formData.validFrom)) {
            newErrors.validTill = 'Valid till must be after valid from';
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

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        setLoading(true);
        const result = await createCoupon(formData);
        if (result.success) {
            toast.success('Coupon created successfully');
            navigate('/admin/coupons');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/coupons" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Coupons
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Coupon</h1>
                <p className="text-gray-500">Create a new discount coupon for customers</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <Input
                            label="Coupon Code"
                            name="code"
                            value={formData.code}
                            onChange={handleChange}
                            placeholder="e.g., WELCOME10"
                            error={errors.code}
                            helperText="Customers will enter this code at checkout"
                            required
                        />

                        <Input
                            label="Coupon Name"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g., Welcome Offer"
                            error={errors.name}
                            required
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Discount Type *
                            </label>
                            <select
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="percentage">Percentage (%)</option>
                                <option value="fixed">Fixed Amount (₹)</option>
                            </select>
                        </div>

                        <Input
                            label={formData.discountType === 'percentage' ? 'Discount Percentage (%)' : 'Discount Amount (₹)'}
                            name="discountValue"
                            type="number"
                            value={formData.discountValue}
                            onChange={handleNumberChange}
                            placeholder={formData.discountType === 'percentage' ? 'e.g., 10' : 'e.g., 100'}
                            error={errors.discountValue}
                            required
                        />

                        {formData.discountType === 'percentage' && (
                            <Input
                                label="Maximum Discount (₹) - Optional"
                                name="maxDiscount"
                                type="number"
                                value={formData.maxDiscount}
                                onChange={handleNumberChange}
                                placeholder="e.g., 500"
                                error={errors.maxDiscount}
                                helperText="Maximum discount amount for percentage coupons"
                            />
                        )}

                        <Input
                            label="Minimum Order Amount (₹) - Optional"
                            name="minOrderAmount"
                            type="number"
                            value={formData.minOrderAmount}
                            onChange={handleNumberChange}
                            placeholder="e.g., 500"
                            error={errors.minOrderAmount}
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valid From *
                            </label>
                            <input
                                type="datetime-local"
                                name="validFrom"
                                value={formData.validFrom}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.validFrom && <p className="mt-1 text-sm text-red-500">{errors.validFrom}</p>}
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Valid Till *
                            </label>
                            <input
                                type="datetime-local"
                                name="validTill"
                                value={formData.validTill}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            {errors.validTill && <p className="mt-1 text-sm text-red-500">{errors.validTill}</p>}
                        </div>

                        <Input
                            label="Usage Limit - Optional"
                            name="usageLimit"
                            type="number"
                            value={formData.usageLimit}
                            onChange={handleNumberChange}
                            placeholder="e.g., 100"
                            helperText="Total number of times this coupon can be used"
                        />

                        <Input
                            label="Per User Limit"
                            name="perUserLimit"
                            type="number"
                            value={formData.perUserLimit}
                            onChange={handleNumberChange}
                            placeholder="e.g., 1"
                            error={errors.perUserLimit}
                            helperText="How many times each user can use this coupon"
                        />

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Applicable For
                            </label>
                            <select
                                name="applicableFor"
                                value={formData.applicableFor}
                                onChange={handleChange}
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="all">All Customers</option>
                                <option value="new_users">New Users Only</option>
                                <option value="existing_users">Existing Users Only</option>
                                <option value="first_order">First Order Only</option>
                            </select>
                        </div>
                    </div>

                    <Input
                        label="Description"
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        placeholder="Describe the coupon offer"
                        helperText="Optional - will be shown to customers"
                    />

                    <div className="flex items-center gap-6">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isActive"
                                checked={formData.isActive}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Active</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="checkbox"
                                name="isFeatured"
                                checked={formData.isFeatured}
                                onChange={handleChange}
                                className="w-4 h-4 text-blue-600 rounded"
                            />
                            <span className="text-sm text-gray-700">Featured (show on homepage)</span>
                        </label>
                    </div>

                    <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
                        <Button
                            type="button"
                            variant="secondary"
                            onClick={() => navigate('/admin/coupons')}
                            disabled={loading}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            variant="primary"
                            loading={loading}
                        >
                            Create Coupon
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddCoupon;