import React from 'react';

const Loader = ({
    size = 'md',
    color = 'blue',
    fullScreen = false,
    text = '',
    className = ''
}) => {
    const sizes = {
        sm: 'w-5 h-5 border-2',
        md: 'w-8 h-8 border-3',
        lg: 'w-12 h-12 border-4',
        xl: 'w-16 h-16 border-4',
    };

    const colors = {
        blue: 'border-blue-600',
        gray: 'border-gray-600',
        white: 'border-white',
        red: 'border-red-600',
        green: 'border-green-600',
        yellow: 'border-yellow-500',
    };

    const spinner = (
        <div className={`inline-block ${sizes[size]} rounded-full border-t-transparent animate-spin ${colors[color]} ${className}`} />
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-90 z-50 flex items-center justify-center">
                <div className="text-center">
                    {spinner}
                    {text && <p className="mt-4 text-gray-600 text-sm">{text}</p>}
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center p-4">
            {spinner}
            {text && <p className="mt-2 text-gray-500 text-sm">{text}</p>}
        </div>
    );
};

// Skeleton Loader for cards
export const SkeletonCard = ({ lines = 3 }) => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-gray-200 rounded-full"></div>
                <div className="flex-1">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-1/2 mt-2"></div>
                </div>
            </div>
            <div className="space-y-2">
                {[...Array(lines)].map((_, i) => (
                    <div key={i} className="h-3 bg-gray-200 rounded w-full"></div>
                ))}
            </div>
            <div className="mt-4 flex justify-between">
                <div className="h-8 bg-gray-200 rounded w-20"></div>
                <div className="h-8 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );
};

// Page Loader
export const PageLoader = () => {
    return (
        <div className="min-h-screen flex items-center justify-center">
            <Loader size="lg" text="Loading..." />
        </div>
    );
};

// Button Loader
export const ButtonLoader = ({ size = 'sm' }) => {
    const sizes = {
        sm: 'w-4 h-4',
        md: 'w-5 h-5',
        lg: 'w-6 h-6',
    };
    return (
        <div className={`${sizes[size]} border-2 border-white border-t-transparent rounded-full animate-spin`} />
    );
};

// Overlay Loader
export const OverlayLoader = ({ text = 'Loading...' }) => {
    return (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-10">
            <div className="text-center">
                <Loader size="md" />
                <p className="mt-2 text-gray-600 text-sm">{text}</p>
            </div>
        </div>
    );
};

// Skeleton for Service Card
export const ServiceCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden animate-pulse">
            <div className="h-48 bg-gray-200"></div>
            <div className="p-4">
                <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mb-3"></div>
                <div className="flex justify-between items-center">
                    <div className="h-6 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                </div>
            </div>
        </div>
    );
};

// Skeleton for Order Card
export const OrderCardSkeleton = () => {
    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4 animate-pulse">
            <div className="flex justify-between items-start mb-3">
                <div>
                    <div className="h-5 bg-gray-200 rounded w-32 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-24"></div>
                </div>
                <div className="h-6 bg-gray-200 rounded w-20"></div>
            </div>
            <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded w-full"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </div>
            <div className="mt-3 pt-3 border-t border-gray-100 flex justify-between">
                <div className="h-5 bg-gray-200 rounded w-16"></div>
                <div className="h-5 bg-gray-200 rounded w-20"></div>
            </div>
        </div>
    );
};

export default Loader;