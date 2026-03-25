import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const ServicesManage = () => {
    const { allServices, loading, deleteService, toggleServiceStatus, loadAllServices } = useService();
    const { formatCurrency } = useAdmin();
    const [services, setServices] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [categoryFilter, setCategoryFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    const categories = [
        { value: 'all', label: 'All Categories' },
        { value: 'shirts', label: 'Shirts & Tops' },
        { value: 'pants', label: 'Pants & Trousers' },
        { value: 'suits', label: 'Suits & Blazers' },
        { value: 'ethnic', label: 'Ethnic Wear' },
        { value: 'winter', label: 'Winter Wear' },
        { value: 'home', label: 'Home Furnishings' },
        { value: 'other', label: 'Other Services' }
    ];

    useEffect(() => {
        loadAllServices();
    }, []);

    useEffect(() => {
        let filtered = [...allServices];

        if (searchTerm) {
            filtered = filtered.filter(service =>
                service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                service.description?.toLowerCase().includes(searchTerm.toLowerCase())
            );
        }

        if (categoryFilter !== 'all') {
            filtered = filtered.filter(service => service.category === categoryFilter);
        }

        setServices(filtered);
    }, [allServices, searchTerm, categoryFilter]);

    const handleDelete = async () => {
        if (!deleteModal) return;

        setActionLoading(true);
        const result = await deleteService(deleteModal);
        if (result.success) {
            toast.success('Service deleted successfully');
            await loadAllServices();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setDeleteModal(null);
    };

    const handleToggleStatus = async (serviceId, currentStatus) => {
        setActionLoading(true);
        const result = await toggleServiceStatus(serviceId);
        if (result.success) {
            toast.success(`Service ${currentStatus ? 'deactivated' : 'activated'} successfully`);
            await loadAllServices();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
    };

    const getCategoryLabel = (category) => {
        const labels = {
            shirts: 'Shirts & Tops',
            pants: 'Pants & Trousers',
            suits: 'Suits & Blazers',
            ethnic: 'Ethnic Wear',
            winter: 'Winter Wear',
            home: 'Home Furnishings',
            other: 'Other Services'
        };
        return labels[category] || category;
    };

    const getCategoryColor = (category) => {
        const colors = {
            shirts: 'bg-blue-100 text-blue-800',
            pants: 'bg-green-100 text-green-800',
            suits: 'bg-purple-100 text-purple-800',
            ethnic: 'bg-orange-100 text-orange-800',
            winter: 'bg-cyan-100 text-cyan-800',
            home: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800'
        };
        return colors[category] || 'bg-gray-100 text-gray-800';
    };

    if (loading && services.length === 0) {
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
                    <h1 className="text-2xl font-bold text-gray-800">Service Management</h1>
                    <p className="text-gray-500">Manage your laundry services</p>
                </div>
                <Link
                    to="/admin/services/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Service
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
                            placeholder="Search by name or description..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Category Filter</label>
                        <select
                            value={categoryFilter}
                            onChange={(e) => setCategoryFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {categories.map(cat => (
                                <option key={cat.value} value={cat.value}>{cat.label}</option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            {/* Services Table */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Image</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service Name</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Popular</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {services.map((service) => (
                                <tr key={service._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <img
                                            src={service.image || 'https://via.placeholder.com/40x40?text=Service'}
                                            alt={service.name}
                                            className="w-10 h-10 rounded object-cover"
                                        />
                                    </td>
                                    <td className="px-6 py-4">
                                        <div className="text-sm font-medium text-gray-900">{service.name}</div>
                                        <div className="text-xs text-gray-500 line-clamp-1">{service.shortDescription}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getCategoryColor(service.category)}`}>
                                            {getCategoryLabel(service.category)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="text-sm font-medium text-gray-900">
                                            {formatCurrency(service.discountedPrice || service.price)}
                                        </div>
                                        {service.discountedPrice && (
                                            <div className="text-xs text-gray-400 line-through">
                                                {formatCurrency(service.price)}
                                            </div>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <button
                                            onClick={() => handleToggleStatus(service._id, service.isActive)}
                                            disabled={actionLoading}
                                            className={`px-2 py-1 text-xs rounded-full ${service.isActive
                                                    ? 'bg-green-100 text-green-800 hover:bg-green-200'
                                                    : 'bg-red-100 text-red-800 hover:bg-red-200'
                                                }`}
                                        >
                                            {service.isActive ? 'Active' : 'Inactive'}
                                        </button>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {service.isPopular ? (
                                            <span className="text-yellow-500">⭐ Popular</span>
                                        ) : (
                                            <span className="text-gray-400">-</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right">
                                        <div className="flex justify-end gap-2">
                                            <Link
                                                to={`/admin/services/edit/${service._id}`}
                                                className="text-blue-600 hover:text-blue-800"
                                            >
                                                Edit
                                            </Link>
                                            <button
                                                onClick={() => setDeleteModal(service._id)}
                                                className="text-red-600 hover:text-red-800"
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

                {services.length === 0 && (
                    <div className="text-center py-12">
                        <p className="text-gray-500">No services found</p>
                    </div>
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deleteModal}
                onClose={() => setDeleteModal(null)}
                onConfirm={handleDelete}
                title="Delete Service"
                message="Are you sure you want to delete this service? This action cannot be undone."
                confirmText={actionLoading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={actionLoading}
            />
        </div>
    );
};

export default ServicesManage;