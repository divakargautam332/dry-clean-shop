import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../../context/CartContext';

const CartItem = ({ item }) => {
    const { updateQuantity, removeFromCart, updateInstructions } = useCart();
    const [showInstructions, setShowInstructions] = useState(false);
    const [instructions, setInstructions] = useState(item.specialInstructions || '');

    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        updateQuantity(item.serviceId, newQuantity);
    };

    const handleIncrement = () => {
        updateQuantity(item.serviceId, item.quantity + 1);
    };

    const handleDecrement = () => {
        if (item.quantity > 1) {
            updateQuantity(item.serviceId, item.quantity - 1);
        }
    };

    const handleSaveInstructions = () => {
        updateInstructions(item.serviceId, instructions);
        setShowInstructions(false);
    };

    const totalPrice = item.price * item.quantity;

    return (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 hover:shadow-md transition-shadow">
            <div className="flex flex-col sm:flex-row gap-4">
                {/* Image */}
                <Link to={`/services/${item.serviceId}`} className="sm:w-24 h-24 flex-shrink-0">
                    <img
                        src={item.image || 'https://via.placeholder.com/100x100?text=Service'}
                        alt={item.serviceName}
                        className="w-full h-full object-cover rounded-lg"
                    />
                </Link>

                {/* Details */}
                <div className="flex-1">
                    <div className="flex flex-wrap justify-between items-start gap-2">
                        <div>
                            <Link to={`/services/${item.serviceId}`}>
                                <h3 className="text-lg font-semibold text-gray-800 hover:text-blue-600 transition-colors">
                                    {item.serviceName}
                                </h3>
                            </Link>
                            <p className="text-sm text-gray-500">{item.category}</p>
                            {item.processingTime && (
                                <span className="text-xs text-gray-400 inline-block mt-1">
                                    Processing: {item.processingTime}
                                </span>
                            )}
                        </div>
                        <button
                            onClick={() => removeFromCart(item.serviceId)}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                        </button>
                    </div>

                    {/* Price */}
                    <div className="flex flex-wrap items-center justify-between mt-2">
                        <div className="flex items-center space-x-2">
                            <span className="text-xl font-bold text-blue-600">
                                ₹{totalPrice}
                            </span>
                            <span className="text-sm text-gray-500">
                                (₹{item.price} per item)
                            </span>
                            {item.isOnDiscount && (
                                <span className="text-xs text-green-600 bg-green-50 px-2 py-0.5 rounded">
                                    {item.discountPercentage}% off
                                </span>
                            )}
                        </div>

                        {/* Quantity Selector */}
                        <div className="flex items-center space-x-2">
                            <button
                                onClick={handleDecrement}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                                disabled={item.quantity <= 1}
                            >
                                -
                            </button>
                            <input
                                type="number"
                                value={item.quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max="50"
                                className="w-14 text-center border border-gray-300 rounded-lg py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <button
                                onClick={handleIncrement}
                                className="w-8 h-8 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100 transition-colors"
                            >
                                +
                            </button>
                        </div>
                    </div>

                    {/* Special Instructions */}
                    <div className="mt-3">
                        {showInstructions ? (
                            <div className="flex flex-col space-y-2">
                                <textarea
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    placeholder="Special instructions (e.g., no starch, delicate fabric, stain on collar)"
                                    className="w-full p-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={2}
                                />
                                <div className="flex space-x-2">
                                    <button
                                        onClick={handleSaveInstructions}
                                        className="px-3 py-1 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={() => {
                                            setShowInstructions(false);
                                            setInstructions(item.specialInstructions || '');
                                        }}
                                        className="px-3 py-1 text-gray-600 text-sm hover:bg-gray-100 rounded-lg transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <button
                                onClick={() => setShowInstructions(true)}
                                className="text-sm text-gray-500 hover:text-blue-600 transition-colors flex items-center space-x-1"
                            >
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                                </svg>
                                <span>
                                    {item.specialInstructions ? 'Edit Instructions' : 'Add Special Instructions'}
                                </span>
                            </button>
                        )}
                        {item.specialInstructions && !showInstructions && (
                            <p className="text-xs text-gray-500 mt-1 bg-gray-50 p-2 rounded">
                                <span className="font-medium">Instructions:</span> {item.specialInstructions}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartItem;