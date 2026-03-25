import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import CartItem from '../../components/user/CartItem';
import Button from '../../components/common/Button';

const Cart = () => {
    const {
        cartItems,
        cartTotal,
        clearCart,
        isCartEmpty,
        getDeliveryCharge,
        getGST,
        getFinalTotal
    } = useCart();
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();
    const [isClearing, setIsClearing] = useState(false);

    const handleCheckout = () => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout' } });
        } else {
            navigate('/checkout');
        }
    };

    const handleClearCart = async () => {
        if (window.confirm('Are you sure you want to clear your cart?')) {
            setIsClearing(true);
            clearCart();
            setIsClearing(false);
        }
    };

    const deliveryCharge = getDeliveryCharge();
    const gst = getGST();
    const finalTotal = getFinalTotal();

    if (isCartEmpty()) {
        return (
            <div className="min-h-screen bg-gray-50 py-12">
                <div className="container mx-auto px-4">
                    <div className="text-center py-12">
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
                                d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                            />
                        </svg>
                        <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
                        <p className="text-gray-500 mb-6">Looks like you haven't added any items to your cart yet.</p>
                        <Link
                            to="/services"
                            className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                            Browse Services
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <div className="flex items-center justify-between mb-6">
                    <h1 className="text-2xl font-bold text-gray-800">Shopping Cart</h1>
                    <button
                        onClick={handleClearCart}
                        disabled={isClearing}
                        className="text-red-500 hover:text-red-600 text-sm font-medium disabled:opacity-50"
                    >
                        {isClearing ? 'Clearing...' : 'Clear Cart'}
                    </button>
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Cart Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {cartItems.map((item) => (
                            <CartItem key={item.serviceId} item={item} />
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-5 sticky top-20">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

                            <div className="space-y-3 mb-4">
                                <div className="flex justify-between text-gray-600">
                                    <span>Subtotal ({cartItems.reduce((sum, i) => sum + i.quantity, 0)} items)</span>
                                    <span className="font-medium">₹{cartTotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>Delivery Charges</span>
                                    <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                                        {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="flex justify-between text-gray-600">
                                    <span>GST (18%)</span>
                                    <span>₹{Math.round(gst).toLocaleString()}</span>
                                </div>
                            </div>

                            {deliveryCharge === 0 && cartTotal < 500 && (
                                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                                    <p className="text-sm text-green-700">
                                        🎉 Add items worth ₹{(500 - cartTotal).toLocaleString()} more to get free delivery!
                                    </p>
                                </div>
                            )}

                            <div className="border-t border-gray-200 pt-3 mb-5">
                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{Math.round(finalTotal).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    * Inclusive of all taxes
                                </p>
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                onClick={handleCheckout}
                                className="mb-3"
                            >
                                Proceed to Checkout
                            </Button>

                            <Link
                                to="/services"
                                className="block text-center text-blue-600 hover:text-blue-700 text-sm font-medium"
                            >
                                Continue Shopping
                            </Link>

                            {/* Secure Payment Badge */}
                            <div className="mt-4 pt-4 border-t border-gray-100 text-center">
                                <div className="flex items-center justify-center space-x-2 text-xs text-gray-500">
                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6-4h12a2 2 0 012 2v6a2 2 0 01-2 2H6a2 2 0 01-2-2v-6a2 2 0 012-2zm10-4V8a4 4 0 00-8 0v3h8z" />
                                    </svg>
                                    <span>Secure Checkout</span>
                                    <span>•</span>
                                    <span>100% Safe</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;