import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import Loader from '../components/common/Loader';

const AdminRoute = ({ children }) => {
    const { isAuthenticated, loading, isAdmin, isStaff } = useAuth();
    const location = useLocation();

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!isAuthenticated) {
        // Redirect to login page
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // Check if user has admin or staff privileges
    if (!isAdmin() && !isStaff()) {
        // Redirect to home page if not authorized
        return <Navigate to="/" replace />;
    }

    return children;
};

export default AdminRoute;