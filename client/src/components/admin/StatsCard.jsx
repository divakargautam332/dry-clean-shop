import React from 'react';
import { Link } from 'react-router-dom';

const StatsCard = ({ title, value, icon, color, change, linkTo, onClick }) => {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        red: 'bg-red-500',
        yellow: 'bg-yellow-500',
        purple: 'bg-purple-500',
        indigo: 'bg-indigo-500',
        pink: 'bg-pink-500',
        orange: 'bg-orange-500',
        teal: 'bg-teal-500',
        cyan: 'bg-cyan-500',
    };

    const bgColors = {
        blue: 'bg-blue-50',
        green: 'bg-green-50',
        red: 'bg-red-50',
        yellow: 'bg-yellow-50',
        purple: 'bg-purple-50',
        indigo: 'bg-indigo-50',
        pink: 'bg-pink-50',
        orange: 'bg-orange-50',
        teal: 'bg-teal-50',
        cyan: 'bg-cyan-50',
    };

    const textColors = {
        blue: 'text-blue-600',
        green: 'text-green-600',
        red: 'text-red-600',
        yellow: 'text-yellow-600',
        purple: 'text-purple-600',
        indigo: 'text-indigo-600',
        pink: 'text-pink-600',
        orange: 'text-orange-600',
        teal: 'text-teal-600',
        cyan: 'text-cyan-600',
    };

    const CardContent = () => (
        <div className={`bg-white rounded-xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition-shadow ${onClick || linkTo ? 'cursor-pointer' : ''}`}>
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm text-gray-500 font-medium">{title}</p>
                    <p className="text-2xl font-bold text-gray-800 mt-1">{value}</p>
                    {change && (
                        <div className="flex items-center mt-2">
                            <span className={`text-xs font-medium ${change >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                {change >= 0 ? '+' : ''}{change}%
                            </span>
                            <span className="text-xs text-gray-400 ml-1">vs last month</span>
                        </div>
                    )}
                </div>
                <div className={`w-12 h-12 ${bgColors[color]} rounded-xl flex items-center justify-center`}>
                    <div className={`w-6 h-6 ${textColors[color]}`}>
                        {icon}
                    </div>
                </div>
            </div>
        </div>
    );

    if (linkTo) {
        return (
            <Link to={linkTo}>
                <CardContent />
            </Link>
        );
    }

    if (onClick) {
        return (
            <div onClick={onClick}>
                <CardContent />
            </div>
        );
    }

    return <CardContent />;
};

export default StatsCard;