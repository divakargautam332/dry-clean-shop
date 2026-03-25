import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const CustomersList = () => {
    const { getUsers, updateUser, deleteUser, formatCurrency, formatDate } = useAdmin();
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filters, setFilters] = useState({
        search: '',
        role: 'customer',
        isActive: '',
        page: 1,
        limit: 20
    });
    const [pagination, setPagination] = useState({
        total: 0,
        page: 1,
        pages: 1
    });
    const [deleteModal, setDeleteModal] = useState(null);
    const [statusModal, setStatusModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadCustomers();
    }, [filters]);

    const loadCustomers = async () => {
        setLoading(true);
        const result = await getUsers(filters);
        if (result.success) {
            setCustomers(result.data);
            setPagination(result.pagination);
        }
        setLoading(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setFilters(prev => ({ ...prev, page: 1 }));
        loadCustomers();
    };

    const handleStatusToggle = async (userId, currentStatus) => {
        setActionLoading(true);
        const result = await updateUser(userId, { isActive: !currentStatus });
        if (result.success) {
            toast.success(`User ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            loadCustomers();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setStatusModal(null);
    };

    const handleDelete = async () => {
        if (!deleteModal) return;

        setActionLoading(true);
        const result = await deleteUser(deleteModal);
        if (result.success) {
            toast.success('User deleted successfully');
            loadCustomers();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setDeleteModal(null);
    };

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value, page: 1 }));
    };

    const handlePageChange = (newPage) => {
        setFilters(prev => ({ ...prev, page: newPage }));
    };

    if (loading && customers.length === 0) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Customer Management</h1>
                <p className="text-gray-500">View and manage all registered customers</p>
            </div>

            {/* Filters */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Search</label>
                        <form onSubmit={handleSearch} className="flex gap-2">
                            <input
                                type="text"
                                name="search"
                                value={filters.search}
                                onChange={handleFilterChange}
                                placeholder="Name, Email, Phone"
                                className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                type="submit"
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                Search
                            </button>
                        </form>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                        <select
                            name="isActive"
                            value={filters.isActive}
                            onChange={handleFilterChange}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="">All</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                        </select>
                    </div>
                    <div className="flex items-end">
                        <button
                            onClick={() => setFilters({ search: '', role: 'customer', isActive: '', page: 1, limit: 20 })}
                            className="px-4 py-2 text-gray-600 hover:text-gray-800"
                        >
                            Clear Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Contact</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Joined</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total Spent</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Points</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {customers.map((customer) => (
                                <tr key={customer._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-semibold">
                                                {customer.name?.charAt(0).toUpperCase()}
                                            </div>
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{customer.name}</div>
                                                <div className="text-xs text-gray-500">ID: {customer._id.slice(-6)}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm text-gray-900">{customer.email}</div>
                                        <div className="text-xs text-gray-500">{customer.phone}</div>
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        {formatDate(customer.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {customer.totalOrders || 0}
                                    </td>
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                        {formatCurrency(customer.totalSpent || 0)}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-900">
                                        {customer.loyaltyPoints || 0}
                                    </td>
                                    <td className="px-6 py-4">
                                        <button
                                            onClick={() => setStatusModal({ id: customer._id, isActive: customer.isActive })}
                                            className={`px-2 py-1 text-xs rounded-full ${customer.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {customer.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/customers/${customer._id}`}
                                                className="text-blue-600 hover:text-blue-800 text-sm"
                                            >
                                                View
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(customer._id)}
                                                className="text-red-600 hover:text-red-800 text-sm"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {customers.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No customers found</p>
                    </div>
                )}

                {/* Pagination */}
                {pagination.pages > 1 && (
                    <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
                        <p className="text-sm text-gray-500">
                            Showing {((pagination.page - 1) * filters.limit) + 1} to {Math.min(pagination.page * filters.limit, pagination.total)} of {pagination.total} customers
                        </p>
                        <div className="flex gap-2">
                            <button
                                onClick={() => handlePageChange(pagination.page - 1)}
                                disabled={pagination.page === 1}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Previous
                            </button>
                            <span className="px-3 py-1 bg-blue-600 text-white rounded-lg">
                                {pagination.page}
                            </span>
                            <button
                                onClick={() => handlePageChange(pagination.page + 1)}
                                disabled={pagination.page === pagination.pages}
                                className="px-3 py-1 border border-gray-300 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
                            >
                                Next
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Status Toggle Modal */}
            <ConfirmModal
                isOpen={!!statusModal}
                onClose={() => setStatusModal(null)}
                onConfirm={() => handleStatusToggle(statusModal.id, statusModal.isActive)}
                title="Update User Status"
                message={`Are you sure you want to ${statusModal?.isActive ? 'deactivate' : 'activate'} this user?`}
                confirmText={actionLoading ? 'Updating...' : 'Confirm'}
                cancelText="Cancel"
                confirmVariant="primary"
                loading={actionLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                onConfirm={handleDelete}
                title="Delete User"
                message="Are you sure you want to delete this user? This action cannot be undone."
                confirmText={actionLoading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={actionLoading}
            />
        </div>
    );
};

export default CustomersList;