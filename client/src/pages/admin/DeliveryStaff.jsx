import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAdmin } from '../../hooks/useAdmin';
import Loader from '../../components/common/Loader';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const DeliveryStaff = () => {
    const { getDeliveryStaff, updateDeliveryStaff, deleteDeliveryStaff, formatDate } = useAdmin();
    const [staff, setStaff] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [availabilityFilter, setAvailabilityFilter] = useState('all');
    const [deleteModal, setDeleteModal] = useState(null);
    const [statusModal, setStatusModal] = useState(null);
    const [actionLoading, setActionLoading] = useState(false);

    useEffect(() => {
        loadStaff();
    }, []);

    const loadStaff = async () => {
        setLoading(true);
        const result = await getDeliveryStaff();
        if (result.success) {
            setStaff(result.data);
        }
        setLoading(false);
    };

    const handleToggleAvailability = async (staffId, currentStatus) => {
        setActionLoading(true);
        const result = await updateDeliveryStaff(staffId, { isAvailable: !currentStatus });
        if (result.success) {
            toast.success(`Staff ${!currentStatus ? 'marked available' : 'marked unavailable'}`);
            loadStaff();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setStatusModal(null);
    };

    const handleDelete = async () => {
        if (!deleteModal) return;

        setActionLoading(true);
        const result = await deleteDeliveryStaff(deleteModal);
        if (result.success) {
            toast.success('Staff member deleted successfully');
            loadStaff();
        } else {
            toast.error(result.message);
        }
        setActionLoading(false);
        setDeleteModal(null);
    };

    const filteredStaff = staff.filter(member => {
        const matchesSearch = member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            member.phone.includes(searchTerm);
        const matchesAvailability = availabilityFilter === 'all' ||
            (availabilityFilter === 'available' && member.isAvailable) ||
            (availabilityFilter === 'unavailable' && !member.isAvailable);
        return matchesSearch && matchesAvailability;
    });

    const getAvailabilityBadge = (isAvailable) => {
        return isAvailable
            ? <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">Available</span>
            : <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">Unavailable</span>;
    };

    const getVehicleIcon = (type) => {
        const icons = {
            bike: '🏍️',
            scooter: '🛵',
            car: '🚗',
            bicycle: '🚲'
        };
        return icons[type] || '🚚';
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
                    <h1 className="text-2xl font-bold text-gray-800">Delivery Staff</h1>
                    <p className="text-gray-500">Manage delivery personnel</p>
                </div>
                <Link
                    to="/admin/delivery-staff/add"
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                    </svg>
                    Add New Staff
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
                            placeholder="Search by name, email or phone..."
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Availability</label>
                        <select
                            value={availabilityFilter}
                            onChange={(e) => setAvailabilityFilter(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <option value="all">All</option>
                            <option value="available">Available</option>
                            <option value="unavailable">Unavailable</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Staff Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredStaff.map((member) => (
                    <div key={member._id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                        <div className="p-5">
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xl">
                                        {member.name?.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-800">{member.name}</h3>
                                        <p className="text-sm text-gray-500">{member.email}</p>
                                    </div>
                                </div>
                                {getAvailabilityBadge(member.isAvailable)}
                            </div>

                            <div className="space-y-2 mb-4">
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">📞</span>
                                    <span>{member.phone}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">{getVehicleIcon(member.vehicleType)}</span>
                                    <span className="capitalize">{member.vehicleType}</span>
                                    {member.vehicleNumber && <span className="text-gray-500">({member.vehicleNumber})</span>}
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">📍</span>
                                    <span>{member.city}, {member.pincode}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">📦</span>
                                    <span>{member.completedOrders || 0} deliveries completed</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <span className="text-gray-500">⭐</span>
                                    <span>{member.rating?.toFixed(1) || 0} / 5 ({member.totalRatings || 0} ratings)</span>
                                </div>
                            </div>

                            <div className="flex justify-between items-center pt-3 border-t border-gray-100">
                                <button
                                    onClick={() => setStatusModal({ id: member._id, isAvailable: member.isAvailable })}
                                    className={`px-3 py-1 text-sm rounded-lg ${member.isAvailable
                                            ? 'bg-red-100 text-red-600 hover:bg-red-200'
                                            : 'bg-green-100 text-green-600 hover:bg-green-200'
                                        }`}
                                >
                                    {member.isAvailable ? 'Mark Unavailable' : 'Mark Available'}
                                </button>
                                <div className="flex gap-2">
                                    <Link
                                        to={`/admin/delivery-staff/edit/${member._id}`}
                                        className="text-blue-600 hover:text-blue-800 text-sm"
                                    >
                                        Edit
                                    </Link>
                                    <button
                                        onClick={() => setDeleteModal(member._id)}
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

            {filteredStaff.length === 0 && (
                <div className="text-center py-12 bg-white rounded-lg shadow-md">
                    <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500">No delivery staff found</p>
                    <Link to="/admin/delivery-staff/add" className="inline-block mt-4 text-blue-600 hover:text-blue-700">
                        Add your first delivery staff →
                    </Link>
                </div>
            )}

            {/* Status Toggle Modal */}
            <ConfirmModal
                isOpen={!!statusModal}
                onClose={() => setStatusModal(null)}
                onConfirm={() => handleToggleAvailability(statusModal.id, statusModal.isAvailable)}
                title={`${statusModal?.isAvailable ? 'Mark Unavailable' : 'Mark Available'}`}
                message={`Are you sure you want to mark this staff member as ${statusModal?.isAvailable ? 'unavailable' : 'available'}?`}
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
                title="Delete Staff Member"
                message="Are you sure you want to delete this staff member? This action cannot be undone."
                confirmText={actionLoading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={actionLoading}
            />
        </div>
    );
};

export default DeliveryStaff;