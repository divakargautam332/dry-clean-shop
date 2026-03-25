import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import ServiceForm from '../../components/admin/ServiceForm';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const EditService = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getServiceById, updateService } = useService();
    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        loadService();
    }, [id]);

    const loadService = async () => {
        setLoading(true);
        const data = await getServiceById(id);
        if (data) {
            setService(data);
        } else {
            toast.error('Service not found');
            navigate('/admin/services');
        }
        setLoading(false);
    };

    const handleSubmit = async (formData) => {
        setSubmitting(true);
        const result = await updateService(id, formData);
        if (result.success) {
            toast.success('Service updated successfully');
            navigate('/admin/services');
        } else {
            toast.error(result.message);
        }
        setSubmitting(false);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <div className="mb-6">
                <Link to="/admin/services" className="text-blue-600 hover:text-blue-700 mb-4 inline-block">
                    ← Back to Services
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Edit Service</h1>
                <p className="text-gray-500">Update service details</p>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6">
                <ServiceForm
                    initialData={service}
                    onSubmit={handleSubmit}
                    onCancel={() => navigate('/admin/services')}
                    isSubmitting={submitting}
                />
            </div>
        </div>
    );
};

export default EditService;