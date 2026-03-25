import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const CouponsManage = () => {
    const { getCoupons, deleteCoupon, toggleCouponStatus, formatCurrency, formatDate } = useAdmin();
    const [coupons, setCoupons] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [statusFilter, setStatusFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadCoupons();
    }, []);

    const loadCoupons = async () => {
        setLoading(true);
        const result = await getCoupons();
        if (result.success) {
            setCoupons(result.data);
        }
        setLoading(false);
    };

    const handleDelete = async () => {
        if (!deleteModal) return;

        setActionLoading(true);
        const result = await deleteCoupon(deleteModal);
        if (result.success) {
            toast.success('Coupon deleted successfully');
            loadCoupons();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setDeleteModal(null);
    };

    const handleToggleStatus = async (couponId, currentStatus) => {
        setActionLoading(true);
        const result = await toggleCouponStatus(couponId);
        if (result.success) {
            toast.success(`Coupon ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            loadCoupons();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const filteredCoupons = coupons.filter(coupon => {
        const matchesSearch = coupon.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
            coupon.name.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesStatus = statusFilter === 'all' ||
            (statusFilter === 'active' && coupon.isActive) ||
            (statusFilter === 'inactive' && !coupon.isActive);
        return matchesSearch && matchesStatus;
    });

    const isExpired = (validTill) => {
        return new Date(validTill) < new Date();
    };

    const getStatusBadge = (coupon) => {
        if (!coupon.isActive) {
            return <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Inactive</span>;
        }
        if (isExpired(coupon.validTill)) {
            return <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Expired</span>;
        }
        return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Active</span>;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Coupon Management</h1>
                    <p className="text-gray-500">Create and manage discount coupons</p>
                </div>
                <Link
                    to="/admin/coupons/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Coupon
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <input
                            type="text"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            placeholder="Search by code or name..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            value={statusFilter}
                            onChange={(e) => setStatusFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Coupons Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredCoupons.map((coupon) => (
                    <div key={coupon._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-5">
                            <div className="flex justify-between items-start mb-3">
                                <div>
                                    <span className="text-2xl font-bold text-blue-600">{coupon.code}</span>
                                    <p className="text-sm text-gray-500 mt-1">{coupon.name}</p>
                                </div>
                                {getStatusBadge(coupon)}
                            </div>

                            <p className="text-gray-600 text-sm mb-4">{coupon.description}</p>

                            <div className="space-y-2 mb-4">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Discount</span>
                                    <span className="font-semibold text-green-600">
                                        {coupon.discountType === 'percentage'
                                            ? `${coupon.discountValue}% OFF`
                                            : `₹${coupon.discountValue} OFF`}
                                    </span>
                                </div>
                                {coupon.minOrderAmount > 0 && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Min. Order</span>
                                        <span>{formatCurrency(coupon.minOrderAmount)}</span>
                                    </div>
                                )}
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-500">Valid Till</span>
                                    <span className={isExpired(coupon.validTill) ? 'text-red-500' : ''}>
                                        {formatDate(coupon.validTill)}
                                    </span>
                                </div>
                                {coupon.usageLimit && (
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-500">Used</span>
                                        <span>{coupon.usedCount} / {coupon.usageLimit}</span>
                                    </div>
                                )}
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => handleToggleStatus(coupon._id, coupon.isActive)}
                                    disabled={actionLoading}
                                    className={`px-3 py-1 text-sm rounded-lg ${coupon.isActive && !isExpired(coupon.validTill)
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                                        }`}
                                >
                                    {coupon.isActive && !isExpired(coupon.validTill) ? 'Deactivate' : 'Activate'}
                                </button>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/coupons/edit/${coupon._id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal(coupon._id)}
                                        className="text-red-600 hover:text-red-800 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filteredCoupons.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z" />
                    </svg>
                    <p className="text-gray-500">No coupons found</p>
                    <Link to="/admin/coupons/add" className="inline-block mt-4 text-blue-600 hover:text-blue-700">
                        Create your first coupon →
                    </Link>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                onConfirm={handleDelete}
                title="Delete Coupon"
                message="Are you sure you want to delete this coupon? This action cannot be undone."
                confirmText={actionLoading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={actionLoading}
            />
        </div>
    );
};

export default CouponsManage;