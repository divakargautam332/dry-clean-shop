import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useService } from '../../context/ServiceContext';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import Loader from '../../components/common/Loader';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const ServiceDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { getServiceById, getActualPrice, formatPrice, isOnDiscount, getDiscountPercentage } = useService();
    const { addToCart } = useCart();
    const { isAuthenticated } = useAuth();

    const [service, setService] = useState(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [selectedImage, setSelectedImage] = useState(0);

    useEffect(() => {
        loadService();
    }, [id]);

    const loadService = async () => {
        setLoading(true);
        const data = await getServiceById(id);
        if (data) {
            setService(data);
        } else {
            navigate('/services');
        }
        setLoading(false);
    };

    const handleQuantityChange = (newQuantity) => {
        if (newQuantity >= service.minOrderQuantity && newQuantity <= service.maxOrderQuantity) {
            setQuantity(newQuantity);
        } else if (newQuantity < service.minOrderQuantity) {
            toast.warning(`Minimum order quantity is ${service.minOrderQuantity}`);
        } else {
            toast.warning(`Maximum order quantity is ${service.maxOrderQuantity}`);
        }
    };

    const handleAddToCart = () => {
        if (!isAuthenticated) {
            toast.info('Please login to add items to cart');
            navigate('/login', { state: { from: `/services/${id}` } });
            return;
        }

        addToCart(service, quantity, specialInstructions);
        toast.success(`${quantity}x ${service.name} added to cart!`);
    };

    const handleBuyNow = () => {
        if (!isAuthenticated) {
            toast.info('Please login to place order');
            navigate('/login', { state: { from: `/services/${id}` } });
            return;
        }

        addToCart(service, quantity, specialInstructions);
        navigate('/checkout');
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    if (!service) {
        return null;
    }

    const actualPrice = getActualPrice(service);
    const discount = isOnDiscount(service);
    const discountPercent = getDiscountPercentage(service);
    const totalPrice = actualPrice * quantity;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Breadcrumb */}
                <div className="mb-6">
                    <Link to="/services" className="text-blue-600 hover:text-blue-700">
                        ← Back to Services
                    </Link>
                </div>

                <div className="bg-white rounded-xl shadow-md overflow-hidden">
                    <div className="grid md:grid-cols-2 gap-8 p-6">
                        {/* Image Gallery */}
                        <div>
                            <div className="bg-gray-100 rounded-lg h-80 overflow-hidden mb-4">
                                <img
                                    src={service.image || 'https://via.placeholder.com/400x300?text=Service'}
                                    alt={service.name}
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            {service.images && service.images.length > 0 && (
                                <div className="flex space-x-2 overflow-x-auto">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer border-2 border-blue-500">
                                        <img
                                            src={service.image || 'https://via.placeholder.com/400x300?text=Service'}
                                            alt="Main"
                                            className="w-full h-full object-cover"
                                        />
                                    </div>
                                    {service.images.map((img, idx) => (
                                        <div
                                            key={idx}
                                            className="w-16 h-16 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80"
                                            onClick={() => setSelectedImage(idx + 1)}
                                        >
                                            <img src={img} alt={`Service ${idx + 1}`} className="w-full h-full object-cover" />
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        {/* Service Details */}
                        <div>
                            {/* Category Badge */}
                            <div className="mb-4">
                                <span className="inline-block px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                                    {service.categoryDisplay || service.category}
                                </span>
                                {service.isPopular && (
                                    <span className="ml-2 inline-block px-3 py-1 bg-yellow-100 text-yellow-800 text-sm rounded-full">
                                        🔥 Popular
                                    </span>
                                )}
                                {service.isNew && (
                                    <span className="ml-2 inline-block px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                                        New
                                    </span>
                                )}
                            </div>

                            {/* Title */}
                            <h1 className="text-2xl md:text-3xl font-bold text-gray-800 mb-3">
                                {service.name}
                            </h1>

                            {/* Price */}
                            <div className="mb-4">
                                {discount ? (
                                    <div className="flex items-center space-x-3">
                                        <span className="text-3xl font-bold text-blue-600">
                                            {formatPrice(actualPrice)}
                                        </span>
                                        <span className="text-lg text-gray-400 line-through">
                                            {formatPrice(service.price)}
                                        </span>
                                        <span className="px-2 py-1 bg-red-100 text-red-600 text-sm rounded-full">
                                            {discountPercent}% OFF
                                        </span>
                                    </div>
                                ) : (
                                    <span className="text-3xl font-bold text-blue-600">
                                        {formatPrice(actualPrice)}
                                    </span>
                                )}
                                <p className="text-sm text-gray-500 mt-1">per item</p>
                            </div>

                            {/* Description */}
                            <p className="text-gray-600 mb-4">
                                {service.description}
                            </p>

                            {/* Processing Time */}
                            <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                                <div className="flex items-center space-x-2">
                                    <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span className="text-gray-700">
                                        Processing Time: <strong>{service.processingTime}</strong>
                                    </span>
                                </div>
                            </div>

                            {/* Quantity Selector */}
                            <div className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Quantity
                                </label>
                                <div className="flex items-center space-x-3">
                                    <button
                                        onClick={() => handleQuantityChange(quantity - 1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        disabled={quantity <= service.minOrderQuantity}
                                    >
                                        -
                                    </button>
                                    <input
                                        type="number"
                                        value={quantity}
                                        onChange={(e) => handleQuantityChange(parseInt(e.target.value) || 1)}
                                        className="w-20 text-center border border-gray-300 rounded-lg py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        min={service.minOrderQuantity}
                                        max={service.maxOrderQuantity}
                                    />
                                    <button
                                        onClick={() => handleQuantityChange(quantity + 1)}
                                        className="w-10 h-10 rounded-full border border-gray-300 flex items-center justify-center text-gray-600 hover:bg-gray-100"
                                        disabled={quantity >= service.maxOrderQuantity}
                                    >
                                        +
                                    </button>
                                    <span className="text-sm text-gray-500">
                                        {service.minOrderQuantity} - {service.maxOrderQuantity} items
                                    </span>
                                </div>
                            </div>

                            {/* Special Instructions */}
                            <div className="mb-6">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Special Instructions (Optional)
                                </label>
                                <textarea
                                    value={specialInstructions}
                                    onChange={(e) => setSpecialInstructions(e.target.value)}
                                    placeholder="e.g., No starch, delicate fabric, stain on collar, etc."
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    rows={3}
                                />
                            </div>

                            {/* Total Price */}
                            <div className="mb-6 p-3 bg-gray-50 rounded-lg">
                                <div className="flex justify-between items-center">
                                    <span className="text-gray-600">Total Amount:</span>
                                    <span className="text-2xl font-bold text-blue-600">
                                        {formatPrice(totalPrice)}
                                    </span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">
                                    * Delivery charges and GST will be calculated at checkout
                                </p>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex flex-col sm:flex-row gap-3">
                                <Button
                                    variant="primary"
                                    size="lg"
                                    fullWidth
                                    onClick={handleAddToCart}
                                >
                                    Add to Cart
                                </Button>
                                <Button
                                    variant="outline"
                                    size="lg"
                                    fullWidth
                                    onClick={handleBuyNow}
                                >
                                    Buy Now
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Information */}
                <div className="mt-8 grid md:grid-cols-3 gap-6">
                    <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">✨</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Premium Quality</h3>
                        <p className="text-sm text-gray-500">Professional cleaning with premium products</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">🚚</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Free Pickup & Delivery</h3>
                        <p className="text-sm text-gray-500">On orders above ₹500</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                        <div className="text-3xl mb-2">💰</div>
                        <h3 className="font-semibold text-gray-800 mb-1">Best Price Guarantee</h3>
                        <p className="text-sm text-gray-500">Competitive pricing with no hidden charges</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ServiceDetail;