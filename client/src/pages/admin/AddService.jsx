import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import ServiceForm from '../../components/admin/ServiceForm';
import { toast } from 'react-toastify';

const AddService = () => {
    const navigate = useNavigate();
    const { createService } = useService();
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (formData) => {
        setLoading(true);
        const result = await createService(formData);
        if (result.success) {
            toast.success('Service created successfully');
            navigate('/admin/services');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/services" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Services
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Service</h1>
                <p className="text-gray-500">Create a new laundry service</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <ServiceForm
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/admin/services')}
                    isSubmitting={loading}
                />
            </div>
        </div>
    );
};

export default AddService;