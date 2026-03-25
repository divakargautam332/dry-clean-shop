import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const CustomerDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getUserById, updateUser, deleteUser, formatCurrency, formatDate } = useAdmin();
    const [customer, setCustomer] = useState(null);
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(false);
    const [statusModal, setStatusModal] = useState(false);
    const [deleteModal, setDeleteModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        isActive: true,
        loyaltyPoints: 0
    });

    useEffect(() => {
        loadCustomer();
    }, [id]);

    const loadCustomer = async () => {
        setLoading(true);
        const result = await getUserById(id);
        if (result.success) {
            const data = result.data;
            setCustomer(data.user);
            setOrders(data.orders || []);
            setFormData({
                name: data.user.name || '',
                email: data.user.email || '',
                phone: data.user.phone || '',
                role: data.user.role || 'customer',
                isActive: data.user.isActive !== false,
                loyaltyPoints: data.user.loyaltyPoints || 0
            });
        } else {
            toast.error('Customer not found');
            navigate('/admin/customers');
        }
        setLoading(false);
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleUpdate = async () => {
        setActionLoading(true);
        const result = await updateUser(id, formData);
        if (result.success) {
            setCustomer(result.data);
            toast.success('Customer updated successfully');
            setEditing(false);
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const handleStatusToggle = async () => {
        setActionLoading(true);
        const result = await updateUser(id, { isActive: !formData.isActive });
        if (result.success) {
            setCustomer(result.data);
            setFormData(prev => ({ ...prev, isActive: result.data.isActive }));
            toast.success(`Customer ${result.data.isActive ? 'activated' : 'deactivated'} successfully`);
            setStatusModal(false);
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const handleDelete = async () => {
        setActionLoading(true);
        const result = await deleteUser(id);
        if (result.success) {
            toast.success('Customer deleted successfully');
            navigate('/admin/customers');
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setDeleteModal(false);
    };

    const getOrderStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-6xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/customers" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Customers
                </Link>
                <div className="flex flex-wrap justify-between items-start gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800">Customer Details</h1>
                        <p className="text-gray-500">View and manage customer information</p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => setStatusModal(true)}
                            className={`px-4 py-2 rounded-lg ${formData.isActive ? 'bg-red-600 hover:bg-red-700' : 'bg-green-600 hover:bg-green-700'} text-white`}
                        >
                            {formData.isActive ? 'Deactivate Account' : 'Activate Account'}
                        </button>
                        <button
                            onClick={() => setDeleteModal(true)}
                            className="px-4 py-2 border border-red-500 text-red-500 rounded-lg hover:bg-red-50"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
                {/* Customer Info */}
                <div className="lg:col-span-2">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold text-gray-800">Profile Information</h2>
                            {!editing ? (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-blue-600 hover:text-blue-700 text-sm"
                                >
                                    Edit Profile
                                </button>
                            ) : (
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            setEditing(false);
                                            setFormData({
                                                name: customer.name,
                                                email: customer.email,
                                                phone: customer.phone,
                                                role: customer.role,
                                                isActive: customer.isActive,
                                                loyaltyPoints: customer.loyaltyPoints
                                            });
                                        }}
                                        className="text-gray-500 hover:text-gray-700 text-sm"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={handleUpdate}
                                        disabled={actionLoading}
                                        className="text-blue-600 hover:text-blue-700 text-sm disabled:opacity-50"
                                    >
                                        {actionLoading ? 'Saving...' : 'Save Changes'}
                                    </button>
                                </div>
                            )}
                        </div>

                        {editing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                                    <input
                                        type="text"
                                        name="name"
                                        value={formData.name}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                                    <input
                                        type="tel"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Loyalty Points</label>
                                    <input
                                        type="number"
                                        name="loyaltyPoints"
                                        value={formData.loyaltyPoints}
                                        onChange={handleInputChange}
                                        className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-2xl font-bold">
                                        {customer?.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-semibold text-gray-800">{customer?.name}</h3>
                                        <p className="text-gray-500">Customer since {formatDate(customer?.createdAt)}</p>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-4 pt-4">
                                    <div>
                                        <p className="text-sm text-gray-500">Email</p>
                                        <p className="font-medium">{customer?.email}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Phone</p>
                                        <p className="font-medium">{customer?.phone}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">User ID</p>
                                        <p className="font-mono text-sm">{customer?._id}</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Status</p>
                                        <span className={`px-2 py-1 text-xs rounded-full ${customer?.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                                            {customer?.isActive ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Loyalty Points</p>
                                        <p className="font-medium">{customer?.loyaltyPoints || 0} pts</p>
                                    </div>
                                    <div>
                                        <p className="text-sm text-gray-500">Total Orders</p>
                                        <p className="font-medium">{customer?.totalOrders || 0}</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Addresses */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Saved Addresses</h2>
                        {customer?.addresses && customer.addresses.length > 0 ? (
                            <div className="space-y-3">
                                {customer.addresses.map((addr, idx) => (
                                    <div key={idx} className="border border-gray-100 rounded-lg p-3">
                                        <div className="flex items-center gap-2 mb-1">
                                            <p className="font-medium">{addr.name}</p>
                                            {addr.isDefault && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">Default</span>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600">{addr.address}</p>
                                        <p className="text-sm text-gray-600">{addr.city}, {addr.state} - {addr.pincode}</p>
                                        {addr.landmark && <p className="text-xs text-gray-400 mt-1">Landmark: {addr.landmark}</p>}
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No saved addresses</p>
                        )}
                    </div>
                </div>

                {/* Order History */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Recent Orders</h2>
                        {orders.length > 0 ? (
                            <div className="space-y-3">
                                {orders.map((order) => (
                                    <Link
                                        key={order._id}
                                        to={`/admin/orders/${order._id}`}
                                        className="block border border-gray-100 rounded-lg p-3 hover:shadow-md transition-shadow"
                                    >
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-sm font-medium text-blue-600">#{order.orderNumber}</span>
                                            <span className={`px-2 py-0.5 text-xs rounded-full ${getOrderStatusColor(order.orderStatus)}`}>
                                                {order.orderStatus}
                                            </span>
                                        </div>
                                        <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                                        <p className="text-sm font-semibold text-gray-800 mt-2">{formatCurrency(order.totalAmount)}</p>
                                        <p className="text-xs text-gray-500">{order.items?.length} items</p>
                                    </Link>
                                ))}
                            </div>
                        ) : (
                            <p className="text-gray-500 text-center py-4">No orders yet</p>
                        )}
                        {orders.length >= 5 && (
                            <Link
                                to={`/admin/orders?search=${customer?._id}`}
                                className="block text-center text-blue-600 hover:text-blue-700 text-sm mt-4"
                            >
                                View All Orders →
                            </Link>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="bg-white rounded-lg shadow-md p-6 mt-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">Statistics</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Orders</span>
                                <span className="font-semibold">{customer?.totalOrders || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Total Spent</span>
                                <span className="font-semibold">{formatCurrency(customer?.totalSpent || 0)}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Loyalty Points</span>
                                <span className="font-semibold">{customer?.loyaltyPoints || 0}</span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-gray-600">Completed Orders</span>
                                <span className="font-semibold">{orders.filter(o => o.orderStatus === 'delivered').length}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Toggle Modal */}
            <ConfirmModal
                isOpen={statusModal}
                onClose={() => setStatusModal(false)}
                onConfirm={handleStatusToggle}
                title={`${formData.isActive ? 'Deactivate' : 'Activate'} Account`}
                message={`Are you sure you want to ${formData.isActive ? 'deactivate' : 'activate'} this customer account?`}
                confirmText={actionLoading ? 'Updating...' : 'Confirm'}
                cancelText="Cancel"
                confirmVariant="primary"
                loading={actionLoading}
            />

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={deleteModal}
                onClose={() => setDeleteModal(false)}
                onConfirm={handleDelete}
                title="Delete Customer"
                message="Are you sure you want to delete this customer? All their data including orders will be permanently removed. This action cannot be undone."
                confirmText={actionLoading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={actionLoading}
            />
        </div>
    );
};

export default CustomerDetail;