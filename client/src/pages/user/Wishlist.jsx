import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Wishlist = () => {
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();
    const [wishlist, setWishlist] = useState([]);
    const [loading, setLoading] = useState(false);

    // Load wishlist from localStorage
    useEffect(() => {
        if (isAuthenticated) {
            const savedWishlist = localStorage.getItem('wishlist');
            if (savedWishlist) {
                try {
                    setWishlist(JSON.parse(savedWishlist));
                } catch (error) {
                    console.error('Failed to load wishlist:', error);
                }
            }
        }
    }, [isAuthenticated]);

    // Save wishlist to localStorage
    useEffect(() => {
        if (isAuthenticated) {
            localStorage.setItem('wishlist', JSON.stringify(wishlist));
        }
    }, [wishlist, isAuthenticated]);

    const removeFromWishlist = (serviceId) => {
        setWishlist(prev => prev.filter(item => item.serviceId !== serviceId));
        toast.info('Removed from wishlist');
    };

    const addToCartHandler = (service) => {
        addToCart(service, 1);
        toast.success(`${service.name} added to cart!`);
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <svg
                        className="w-32 h-32 mx-auto text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Login to view wishlist</h2>
                    <p className="text-gray-500 mb-6">Please login to see your saved items</p>
                    <Link
                        to="/login"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Login Now
                    </Link>
                </div>
            </div>
        );
    }

    if (wishlist.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4 text-center">
                    <svg
                        className="w-32 h-32 mx-auto text-gray-300 mb-4"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={1}
                            d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                        />
                    </svg>
                    <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your wishlist is empty</h2>
                    <p className="text-gray-500 mb-6">Save your favorite services here</p>
                    <Link
                        to="/services"
                        className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Browse Services
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="mb-6">
                    <h1 className="text-2xl font-bold text-gray-800 mb-1">My Wishlist</h1>
                    <p className="text-gray-600">{wishlist.length} saved {wishlist.length === 1 ? 'item' : 'items'}</p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlist.map((item) => {
                        const actualPrice = item.discountedPrice || item.price;
                        const isOnDiscount = item.discountedPrice !== null && item.discountedPrice < item.price;
                        const discountPercent = isOnDiscount
                            ? Math.round(((item.price - item.discountedPrice) / item.price) * 100)
                            : 0;

                        return (
                            <div key={item.serviceId} className="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-lg transition-all duration-300 group">
                                <Link to={`/services/${item.serviceId}`} className="block">
                                    <div className="relative h-48 overflow-hidden">
                                        <img
                                            src={item.image || 'https://via.placeholder.com/300x200?text=Service'}
                                            alt={item.name}
                                            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                                        />
                                        {isOnDiscount && (
                                            <div className="absolute top-2 right-2 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                                                {discountPercent}% OFF
                                            </div>
                                        )}
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                removeFromWishlist(item.serviceId);
                                            }}
                                            className="absolute top-2 left-2 bg-white rounded-full p-1.5 shadow-md hover:bg-red-50 transition-colors"
                                        >
                                            <svg className="w-5 h-5 text-red-500" fill="currentColor" viewBox="0 0 20 20">
                                                <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
                                            </svg>
                                        </button>
                                    </div>
                                </Link>
                                <div className="p-4">
                                    <Link to={`/services/${item.serviceId}`}>
                                        <h3 className="text-lg font-semibold text-gray-800 mb-1 line-clamp-1 hover:text-blue-600">
                                            {item.name}
                                        </h3>
                                    </Link>
                                    <p className="text-gray-500 text-sm mb-3 line-clamp-2">
                                        {item.description?.substring(0, 80)}
                                    </p>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <span className="text-xl font-bold text-blue-600">
                                                {formatCurrency(actualPrice)}
                                            </span>
                                            {isOnDiscount && (
                                                <span className="ml-2 text-sm text-gray-400 line-through">
                                                    {formatCurrency(item.price)}
                                                </span>
                                            )}
                                        </div>
                                        <Button
                                            variant="primary"
                                            size="sm"
                                            onClick={() => addToCartHandler(item)}
                                        >
                                            Add to Cart
                                        </Button>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default Wishlist;