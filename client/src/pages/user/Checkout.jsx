import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../../context/CartContext';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import { toast } from 'react-toastify';

const Checkout = () => {
    const navigate = useNavigate();
    const { cartItems, getCartSubtotal, getDeliveryCharge, getGST, getFinalTotal, clearCart } = useCart();
    const { user, isAuthenticated } = useAuth();
    const { createOrder } = useOrder();

    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('cod');
    const [couponCode, setCouponCode] = useState('');
    const [couponDiscount, setCouponDiscount] = useState(0);
    const [appliedCoupon, setAppliedCoupon] = useState(null);

    const [pickupAddress, setPickupAddress] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    const [deliveryAddress, setDeliveryAddress] = useState({
        name: '',
        address: '',
        city: '',
        state: '',
        pincode: '',
        landmark: ''
    });

    const [useDifferentAddress, setUseDifferentAddress] = useState(false);
    const [pickupDate, setPickupDate] = useState('');
    const [pickupTimeSlot, setPickupTimeSlot] = useState('');
    const [specialInstructions, setSpecialInstructions] = useState('');
    const [isExpress, setIsExpress] = useState(false);

    const [errors, setErrors] = useState({});

    const timeSlots = [
        '09:00 AM - 11:00 AM',
        '11:00 AM - 01:00 PM',
        '01:00 PM - 03:00 PM',
        '03:00 PM - 05:00 PM',
        '05:00 PM - 07:00 PM'
    ];

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { state: { from: '/checkout' } });
        }

        if (cartItems.length === 0) {
            navigate('/cart');
        }

        // Set default dates
        const tomorrow = new Date();
        tomorrow.setDate(tomorrow.getDate() + 1);
        setPickupDate(tomorrow.toISOString().split('T')[0]);

        // Pre-fill user address if available
        if (user?.addresses && user.addresses.length > 0) {
            const defaultAddress = user.addresses.find(addr => addr.isDefault) || user.addresses[0];
            if (defaultAddress) {
                setPickupAddress({
                    name: defaultAddress.name || user.name,
                    address: defaultAddress.address,
                    city: defaultAddress.city,
                    state: defaultAddress.state,
                    pincode: defaultAddress.pincode,
                    landmark: defaultAddress.landmark || ''
                });
                setDeliveryAddress({
                    name: defaultAddress.name || user.name,
                    address: defaultAddress.address,
                    city: defaultAddress.city,
                    state: defaultAddress.state,
                    pincode: defaultAddress.pincode,
                    landmark: defaultAddress.landmark || ''
                });
            } else {
                setPickupAddress(prev => ({ ...prev, name: user.name }));
                setDeliveryAddress(prev => ({ ...prev, name: user.name }));
            }
        } else {
            setPickupAddress(prev => ({ ...prev, name: user?.name || '' }));
            setDeliveryAddress(prev => ({ ...prev, name: user?.name || '' }));
        }
    }, [isAuthenticated, cartItems, navigate, user]);

    const validateAddress = (address) => {
        const newErrors = {};
        if (!address.name.trim()) newErrors.name = 'Name is required';
        if (!address.address.trim()) newErrors.address = 'Address is required';
        if (!address.city.trim()) newErrors.city = 'City is required';
        if (!address.state.trim()) newErrors.state = 'State is required';
        if (!address.pincode.trim()) newErrors.pincode = 'Pincode is required';
        else if (!/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Invalid pincode';
        return newErrors;
    };

    const validateForm = () => {
        const newErrors = {};

        const pickupErrors = validateAddress(pickupAddress);
        if (Object.keys(pickupErrors).length > 0) {
            newErrors.pickupAddress = pickupErrors;
        }

        if (useDifferentAddress) {
            const deliveryErrors = validateAddress(deliveryAddress);
            if (Object.keys(deliveryErrors).length > 0) {
                newErrors.deliveryAddress = deliveryErrors;
            }
        }

        if (!pickupDate) newErrors.pickupDate = 'Pickup date is required';
        if (!pickupTimeSlot) newErrors.pickupTimeSlot = 'Pickup time slot is required';

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleApplyCoupon = () => {
        // Mock coupon validation
        if (couponCode.toUpperCase() === 'WELCOME10') {
            setCouponDiscount(50);
            setAppliedCoupon({ code: 'WELCOME10', discount: 50 });
            toast.success('Coupon applied successfully!');
        } else if (couponCode.toUpperCase() === 'SAVE20') {
            setCouponDiscount(100);
            setAppliedCoupon({ code: 'SAVE20', discount: 100 });
            toast.success('Coupon applied successfully!');
        } else {
            toast.error('Invalid coupon code');
        }
    };

    const handlePlaceOrder = async () => {
        if (!validateForm()) return;

        setLoading(true);

        const subtotal = getCartSubtotal();
        const deliveryCharge = isExpress ? 150 : getDeliveryCharge();
        const gst = getGST();
        const total = subtotal + deliveryCharge + gst - couponDiscount;

        const orderData = {
            items: cartItems.map(item => ({
                service: item.serviceId,
                quantity: item.quantity,
                specialInstructions: item.specialInstructions
            })),
            pickupAddress,
            deliveryAddress: useDifferentAddress ? deliveryAddress : pickupAddress,
            pickupDate,
            pickupTimeSlot,
            deliveryDate: new Date(new Date(pickupDate).getTime() + 2 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            paymentMethod,
            couponCode: appliedCoupon?.code,
            specialInstructions,
            isExpress
        };

        const result = await createOrder(orderData);

        if (result.success) {
            clearCart();
            navigate(`/orders/${result.data._id}`);
            toast.success(`Order placed successfully! Order #${result.data.orderNumber}`);
        }

        setLoading(false);
    };

    const subtotal = getCartSubtotal();
    const deliveryCharge = isExpress ? 150 : getDeliveryCharge();
    const gst = getGST();
    const total = subtotal + deliveryCharge + gst - couponDiscount;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                <h1 className="text-2xl font-bold text-gray-800 mb-6">Checkout</h1>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Checkout Form */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Pickup Address */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup Address</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <Input
                                    label="Full Name"
                                    value={pickupAddress.name}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, name: e.target.value })}
                                    error={errors.pickupAddress?.name}
                                    required
                                />
                                <Input
                                    label="Address"
                                    value={pickupAddress.address}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, address: e.target.value })}
                                    error={errors.pickupAddress?.address}
                                    required
                                />
                                <Input
                                    label="City"
                                    value={pickupAddress.city}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, city: e.target.value })}
                                    error={errors.pickupAddress?.city}
                                    required
                                />
                                <Input
                                    label="State"
                                    value={pickupAddress.state}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, state: e.target.value })}
                                    error={errors.pickupAddress?.state}
                                    required
                                />
                                <Input
                                    label="Pincode"
                                    value={pickupAddress.pincode}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, pincode: e.target.value })}
                                    error={errors.pickupAddress?.pincode}
                                    required
                                />
                                <Input
                                    label="Landmark (Optional)"
                                    value={pickupAddress.landmark}
                                    onChange={(e) => setPickupAddress({ ...pickupAddress, landmark: e.target.value })}
                                />
                            </div>
                        </div>

                        {/* Delivery Address Toggle */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <label className="flex items-center space-x-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={useDifferentAddress}
                                    onChange={(e) => setUseDifferentAddress(e.target.checked)}
                                    className="w-4 h-4 text-blue-600 rounded"
                                />
                                <span className="text-gray-700">Deliver to a different address</span>
                            </label>
                        </div>

                        {/* Delivery Address */}
                        {useDifferentAddress && (
                            <div className="bg-white rounded-lg shadow-md p-5">
                                <h2 className="text-lg font-semibold text-gray-800 mb-4">Delivery Address</h2>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                    <Input
                                        label="Full Name"
                                        value={deliveryAddress.name}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, name: e.target.value })}
                                        error={errors.deliveryAddress?.name}
                                        required
                                    />
                                    <Input
                                        label="Address"
                                        value={deliveryAddress.address}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, address: e.target.value })}
                                        error={errors.deliveryAddress?.address}
                                        required
                                    />
                                    <Input
                                        label="City"
                                        value={deliveryAddress.city}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, city: e.target.value })}
                                        error={errors.deliveryAddress?.city}
                                        required
                                    />
                                    <Input
                                        label="State"
                                        value={deliveryAddress.state}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, state: e.target.value })}
                                        error={errors.deliveryAddress?.state}
                                        required
                                    />
                                    <Input
                                        label="Pincode"
                                        value={deliveryAddress.pincode}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, pincode: e.target.value })}
                                        error={errors.deliveryAddress?.pincode}
                                        required
                                    />
                                    <Input
                                        label="Landmark (Optional)"
                                        value={deliveryAddress.landmark}
                                        onChange={(e) => setDeliveryAddress({ ...deliveryAddress, landmark: e.target.value })}
                                    />
                                </div>
                            </div>
                        )}

                        {/* Pickup Schedule */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Pickup Schedule</h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Date *</label>
                                    <input
                                        type="date"
                                        value={pickupDate}
                                        onChange={(e) => setPickupDate(e.target.value)}
                                        min={new Date().toISOString().split('T')[0]}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    {errors.pickupDate && <p className="mt-1 text-sm text-red-500">{errors.pickupDate}</p>}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Pickup Time Slot *</label>
                                    <select
                                        value={pickupTimeSlot}
                                        onChange={(e) => setPickupTimeSlot(e.target.value)}
                                        className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    >
                                        <option value="">Select time slot</option>
                                        {timeSlots.map(slot => (
                                            <option key={slot} value={slot}>{slot}</option>
                                        ))}
                                    </select>
                                    {errors.pickupTimeSlot && <p className="mt-1 text-sm text-red-500">{errors.pickupTimeSlot}</p>}
                                </div>
                            </div>
                        </div>

                        {/* Special Instructions */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Special Instructions (Optional)</h2>
                            <textarea
                                value={specialInstructions}
                                onChange={(e) => setSpecialInstructions(e.target.value)}
                                placeholder="Any special requests or instructions for the order..."
                                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                rows={3}
                            />
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Method</h2>
                            <div className="space-y-3">
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="cod"
                                        checked={paymentMethod === 'cod'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-gray-700">Cash on Delivery</span>
                                </label>
                                <label className="flex items-center space-x-3 cursor-pointer">
                                    <input
                                        type="radio"
                                        value="online"
                                        checked={paymentMethod === 'online'}
                                        onChange={(e) => setPaymentMethod(e.target.value)}
                                        className="w-4 h-4 text-blue-600"
                                    />
                                    <span className="text-gray-700">Online Payment (UPI, Card, NetBanking)</span>
                                </label>
                            </div>
                        </div>

                        {/* Express Delivery */}
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <label className="flex items-center justify-between cursor-pointer">
                                <div>
                                    <span className="font-medium text-gray-800">Express Service</span>
                                    <p className="text-sm text-gray-500">Get your order delivered faster (within 12 hours)</p>
                                </div>
                                <div className="flex items-center space-x-3">
                                    <span className="text-orange-600 font-medium">+₹100</span>
                                    <input
                                        type="checkbox"
                                        checked={isExpress}
                                        onChange={(e) => setIsExpress(e.target.checked)}
                                        className="w-5 h-5 text-blue-600 rounded"
                                    />
                                </div>
                            </label>
                        </div>
                    </div>

                    {/* Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white rounded-lg shadow-md p-5 sticky top-20">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Summary</h2>

                            <div className="space-y-2 mb-4">
                                {cartItems.map((item, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <span className="text-gray-600">{item.quantity}x {item.serviceName}</span>
                                        <span className="font-medium">₹{item.price * item.quantity}</span>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-gray-200 pt-3 space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>₹{subtotal.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">Delivery Charge</span>
                                    <span className={deliveryCharge === 0 ? 'text-green-600' : ''}>
                                        {deliveryCharge === 0 ? 'Free' : `₹${deliveryCharge}`}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-600">GST (18%)</span>
                                    <span>₹{Math.round(gst).toLocaleString()}</span>
                                </div>
                                {couponDiscount > 0 && (
                                    <div className="flex justify-between text-green-600">
                                        <span>Coupon Discount</span>
                                        <span>-₹{couponDiscount}</span>
                                    </div>
                                )}
                            </div>

                            {/* Coupon Code */}
                            <div className="mt-4">
                                <div className="flex space-x-2">
                                    <input
                                        type="text"
                                        value={couponCode}
                                        onChange={(e) => setCouponCode(e.target.value)}
                                        placeholder="Enter coupon code"
                                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    />
                                    <Button
                                        variant="outline"
                                        onClick={handleApplyCoupon}
                                        disabled={!couponCode}
                                    >
                                        Apply
                                    </Button>
                                </div>
                                {appliedCoupon && (
                                    <p className="text-xs text-green-600 mt-1">Coupon {appliedCoupon.code} applied!</p>
                                )}
                            </div>

                            <div className="border-t border-gray-200 mt-4 pt-4">
                                <div className="flex justify-between text-lg font-bold">
                                    <span>Total</span>
                                    <span className="text-blue-600">₹{Math.round(total).toLocaleString()}</span>
                                </div>
                                <p className="text-xs text-gray-500 mt-1">Inclusive of all taxes</p>
                            </div>

                            <Button
                                variant="primary"
                                fullWidth
                                size="lg"
                                onClick={handlePlaceOrder}
                                loading={loading}
                                className="mt-6"
                            >
                                Place Order
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;