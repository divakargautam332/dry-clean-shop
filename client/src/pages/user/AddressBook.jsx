import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import AddressForm from '../../components/user/AddressForm';
import Button from '../../components/common/Button';
import { ConfirmModal } from '../../components/common/Modal';
import { toast } from 'react-toastify';

const AddressBook = () => {
    const { user, addAddress, updateAddress, deleteAddress } = useAuth();
    const [addresses, setAddresses] = useState(user?.addresses || []);
    const [showForm, setShowForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [loading, setLoading] = useState(false);

    const handleAddAddress = async (addressData) => {
        setLoading(true);
        const result = await addAddress(addressData);
        if (result.success) {
            setAddresses(result.data);
            setShowForm(false);
            toast.success('Address added successfully');
        }
        setLoading(false);
    };

    const handleUpdateAddress = async (addressData) => {
        setLoading(true);
        const result = await updateAddress(editingAddress._id, addressData);
        if (result.success) {
            setAddresses(result.data);
            setEditingAddress(null);
            setShowForm(false);
            toast.success('Address updated successfully');
        }
        setLoading(false);
    };

    const handleDeleteAddress = async () => {
        if (!deletingAddress) return;

        setLoading(true);
        const result = await deleteAddress(deletingAddress._id);
        if (result.success) {
            setAddresses(result.data);
            toast.success('Address deleted successfully');
        }
        setDeletingAddress(null);
        setLoading(false);
    };

    const setDefaultAddress = async (addressId) => {
        const address = addresses.find(a => a._id === addressId);
        if (address && !address.isDefault) {
            await handleUpdateAddress({ ...address, isDefault: true });
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4 max-w-4xl">
                <div className="flex justify-between items-center mb-6">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-800 mb-1">Address Book</h1>
                        <p className="text-gray-600">Manage your delivery addresses</p>
                    </div>
                    {!showForm && !editingAddress && (
                        <Button
                            variant="primary"
                            onClick={() => setShowForm(true)}
                            icon={
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            }
                        >
                            Add New Address
                        </Button>
                    )}
                </div>

                {/* Address Form */}
                {(showForm || editingAddress) && (
                    <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                        <h2 className="text-lg font-semibold text-gray-800 mb-4">
                            {editingAddress ? 'Edit Address' : 'Add New Address'}
                        </h2>
                        <AddressForm
                            initialData={editingAddress}
                            onSubmit={editingAddress ? handleUpdateAddress : handleAddAddress}
                            onCancel={() => {
                                setShowForm(false);
                                setEditingAddress(null);
                            }}
                            isSubmitting={loading}
                        />
                    </div>
                )}

                {/* Address List */}
                {addresses.length > 0 ? (
                    <div className="space-y-4">
                        {addresses.map((address) => (
                            <div
                                key={address._id}
                                className={`bg-white rounded-lg shadow-md p-5 border-l-4 ${address.isDefault ? 'border-l-green-500' : 'border-l-transparent'
                                    }`}
                            >
                                <div className="flex flex-wrap justify-between items-start gap-4">
                                    <div className="flex-1">
                                        <div className="flex items-center gap-2 mb-2">
                                            <h3 className="font-semibold text-gray-800">{address.name}</h3>
                                            {address.isDefault && (
                                                <span className="px-2 py-0.5 bg-green-100 text-green-700 text-xs rounded-full">
                                                    Default
                                                </span>
                                            )}
                                        </div>
                                        <p className="text-gray-600 text-sm">{address.address}</p>
                                        <p className="text-gray-600 text-sm">
                                            {address.city}, {address.state} - {address.pincode}
                                        </p>
                                        {address.landmark && (
                                            <p className="text-gray-400 text-xs mt-1">Landmark: {address.landmark}</p>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {!address.isDefault && (
                                            <button
                                                onClick={() => setDefaultAddress(address._id)}
                                                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-700"
                                            >
                                                Set as Default
                                            </button>
                                        )}
                                        <button
                                            onClick={() => {
                                                setEditingAddress(address);
                                                setShowForm(false);
                                            }}
                                            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                                        >
                                            Edit
                                        </button>
                                        <button
                                            onClick={() => setDeletingAddress(address)}
                                            className="px-3 py-1 text-sm text-red-600 hover:text-red-700"
                                        >
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    !showForm && (
                        <div className="bg-white rounded-lg shadow-md p-12 text-center">
                            <svg
                                className="w-24 h-24 mx-auto text-gray-300 mb-4"
                                fill="none"
                                stroke="currentColor"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={1}
                                    d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                            </svg>
                            <h3 className="text-lg font-semibold text-gray-700 mb-2">No addresses saved</h3>
                            <p className="text-gray-500 mb-4">Add your first address to make checkout faster</p>
                            <Button variant="primary" onClick={() => setShowForm(true)}>
                                Add New Address
                            </Button>
                        </div>
                    )
                )}
            </div>

            {/* Delete Confirmation Modal */}
            <ConfirmModal
                isOpen={!!deletingAddress}
                onClose={() => setDeletingAddress(null)}
                onConfirm={handleDeleteAddress}
                title="Delete Address"
                message={`Are you sure you want to delete the address for "${deletingAddress?.name}"?`}
                confirmText={loading ? 'Deleting...' : 'Yes, Delete'}
                cancelText="Cancel"
                confirmVariant="danger"
                loading={loading}
            />
        </div>
    );
};

export default AddressBook;