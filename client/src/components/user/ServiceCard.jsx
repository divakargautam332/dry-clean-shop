import React from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { toast } from 'react-toastify';

const ServiceCard = ({ service }) => {
    const { addToCart } = useCart();

    const actualPrice = service.discountedPrice || service.price;
    const isOnDiscount = service.discountedPrice !== null && service.discountedPrice < service.price;
    const discountPercent = isOnDiscount
        ? Math.round(((service.price - service.discountedPrice) / service.price) * 100)
        : 0;

    const handleAddToCart = (e) => {
        e.preventDefault();
        e.stopPropagation();
        addToCart(service, 1);
        toast.success(`${service.name} added to cart!`);
    };

    const getCategoryColor = () => {
        const colors = {
            shirts: 'bg-blue-100 text-blue-800',
            pants: 'bg-green-100 text-green-800',
            suits: 'bg-purple-100 text-purple-800',
            ethnic: 'bg-orange-100 text-orange-800',
            winter: 'bg-cyan-100 text-cyan-800',
            home: 'bg-red-100 text-red-800',
            other: 'bg-gray-100 text-gray-800',
        };
        return colors[service.category] || colors.other;
    };

    const getCategoryLabel = () => {
        const labels = {
            shirts: 'Shirts & Tops',
            pants: 'Pants & Trousers',
            suits: 'Suits & Blazers',
            ethnic: 'Ethnic Wear',
            winter: 'Winter Wear',
            home: 'Home Furnishings',
            other: 'Other Services',
        };
        return labels[service.category] || service.category;
    };

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1 group">
            <Link to={`/services/${service._id}`} className="block">
                {/* Image Section */}
                <div className="relative h-48 overflow-hidden">
                    <img
                        src={service.image || 'https://via.placeholder.com/300x200?text=Service'}
                        alt={service.name}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {isOnDiscount && (
                        <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            {discountPercent}% OFF
                        </div>
                    )}
                    {service.isNew && (
                        <div className="absolute top-2 left-2 bg-green-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            NEW
                        </div>
                    )}
                    {service.isPopular && (
                        <div className="absolute bottom-2 left-2 bg-yellow-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                            🔥 Popular
                        </div>
                    )}
                </div>

                {/* Content Section */}
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor()}`}>
                            {getCategoryLabel()}
                        </span>
                        <span className="text-xs text-gray-500">{service.processingTime}</span>
                    </div>

                    <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1">
                        {service.name}
                    </h3>

                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                        {service.shortDescription || service.description?.substring(0, 80)}
                    </p>

                    <div className="flex items-center justify-between">
                        <div className="flex items-baseline space-x-2">
                            <span className="text-2xl font-bold text-blue-600">
                                ₹{actualPrice}
                            </span>
                            {isOnDiscount && (
                                <span className="text-sm text-gray-400 line-through">
                                    ₹{service.price}
                                </span>
                            )}
                        </div>

                        <button
                            onClick={handleAddToCart}
                            className="bg-blue-600 text-white px-3 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center space-x-1"
                        >
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                            </svg>
                            <span>Add to Cart</span>
                        </button>
                    </div>

                    {/* Tags */}
                    {service.tags && service.tags.length > 0 && (
                        <div className="flex flex-wrap gap-1 mt-3">
                            {service.tags.slice(0, 3).map((tag, index) => (
                                <span key={index} className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded">
                                    {tag.replace('-', ' ')}
                                </span>
                            ))}
                        </div>
                    )}
                </div>
            </Link>
        </div>
    );
};

export default ServiceCard;