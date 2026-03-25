import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import Input from '../../components/common/Input';
import Button from '../../components/common/Button';
import { toast } from 'react-toastify';

const Settings = () => {
    const { updateSettings, getSettings } = useAdmin();
    const [loading, setLoading] = useState(false);
    const [activeTab, setActiveTab] = useState('general');
    const [settings, setSettings] = useState({
        general: {
            shopName: 'DryCleanPro',
            shopEmail: 'info@drycleanpro.com',
            shopPhone: '+91 98765 43210',
            shopAddress: '123 Business Street, Andheri East, Mumbai, Maharashtra 400001',
            gstNumber: '27ABCDE1234F1Z5',
            businessHours: {
                monday: '9:00 AM - 8:00 PM',
                tuesday: '9:00 AM - 8:00 PM',
                wednesday: '9:00 AM - 8:00 PM',
                thursday: '9:00 AM - 8:00 PM',
                friday: '9:00 AM - 8:00 PM',
                saturday: '9:00 AM - 8:00 PM',
                sunday: '10:00 AM - 5:00 PM'
            }
        },
        pricing: {
            deliveryCharge: 50,
            freeDeliveryMinOrder: 500,
            expressCharge: 100,
            gstRate: 18,
            loyaltyPointsRate: 1,
            loyaltyPointsRedemption: 0.5
        },
        notifications: {
            emailNotifications: true,
            smsNotifications: true,
            orderConfirmation: true,
            orderStatusUpdate: true,
            promotionalEmails: true,
            adminAlerts: true
        },
        payment: {
            razorpayKeyId: '',
            razorpayKeySecret: '',
            upiId: 'dryclean@okhdfcbank',
            bankName: 'HDFC Bank',
            accountNumber: 'XXXX1234',
            ifscCode: 'HDFC0001234'
        }
    });

    useEffect(() => {
        loadSettings();
    }, []);

    const loadSettings = async () => {
        const result = await getSettings();
        if (result.success) {
            setSettings(result.data);
        }
    };

    const handleGeneralChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            general: { ...prev.general, [name]: value }
        }));
    };

    const handlePricingChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            pricing: { ...prev.pricing, [name]: parseFloat(value) || 0 }
        }));
    };

    const handleNotificationChange = (e) => {
        const { name, checked } = e.target;
        setSettings(prev => ({
            ...prev,
            notifications: { ...prev.notifications, [name]: checked }
        }));
    };

    const handlePaymentChange = (e) => {
        const { name, value } = e.target;
        setSettings(prev => ({
            ...prev,
            payment: { ...prev.payment, [name]: value }
        }));
    };

    const handleBusinessHoursChange = (day, value) => {
        setSettings(prev => ({
            ...prev,
            general: {
                ...prev.general,
                businessHours: { ...prev.general.businessHours, [day]: value }
            }
        }));
    };

    const handleSave = async () => {
        setLoading(true);
        const result = await updateSettings(settings);
        if (result.success) {
            toast.success('Settings saved successfully');
        } else {
            toast.error(result.message);
        }
        setLoading(false);
    };

    const tabs = [
        { id: 'general', label: 'General Settings', icon: '⚙️' },
        { id: 'pricing', label: 'Pricing & Tax', icon: '💰' },
        { id: 'notifications', label: 'Notifications', icon: '🔔' },
        { id: 'payment', label: 'Payment Settings', icon: '💳' }
    ];

    return (
        <div className="p-6 max-w-5xl mx-auto">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Settings</h1>
                <p className="text-gray-500">Manage your store settings and preferences</p>
            </div>

            {/* Tabs */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-6">
                <div className="flex flex-wrap gap-1">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 ${activeTab === tab.id
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            <span>{tab.icon}</span>
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* General Settings */}
            {activeTab === 'general' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">General Information</h2>
                    <div className="space-y-4">
                        <Input
                            label="Shop Name"
                            name="shopName"
                            value={settings.general.shopName}
                            onChange={handleGeneralChange}
                        />
                        <Input
                            label="Shop Email"
                            name="shopEmail"
                            type="email"
                            value={settings.general.shopEmail}
                            onChange={handleGeneralChange}
                        />
                        <Input
                            label="Shop Phone"
                            name="shopPhone"
                            value={settings.general.shopPhone}
                            onChange={handleGeneralChange}
                        />
                        <Input
                            label="Shop Address"
                            name="shopAddress"
                            value={settings.general.shopAddress}
                            onChange={handleGeneralChange}
                        />
                        <Input
                            label="GST Number"
                            name="gstNumber"
                            value={settings.general.gstNumber}
                            onChange={handleGeneralChange}
                        />

                        <div className="mt-6">
                            <h3 className="text-md font-semibold text-gray-800 mb-3">Business Hours</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {Object.entries(settings.general.businessHours).map(([day, hours]) => (
                                    <div key={day} className="flex items-center gap-2">
                                        <span className="w-24 capitalize text-sm text-gray-600">{day}:</span>
                                        <input
                                            type="text"
                                            value={hours}
                                            onChange={(e) => handleBusinessHoursChange(day, e.target.value)}
                                            className="flex-1 p-2 border border-gray-300 rounded-lg"
                                            placeholder="9:00 AM - 6:00 PM"
                                        />
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Pricing & Tax Settings */}
            {activeTab === 'pricing' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Pricing & Tax Settings</h2>
                    <div className="space-y-4">
                        <Input
                            label="Delivery Charge (₹)"
                            name="deliveryCharge"
                            type="number"
                            value={settings.pricing.deliveryCharge}
                            onChange={handlePricingChange}
                            helperText="Standard delivery charge for orders below free delivery threshold"
                        />
                        <Input
                            label="Free Delivery Minimum Order (₹)"
                            name="freeDeliveryMinOrder"
                            type="number"
                            value={settings.pricing.freeDeliveryMinOrder}
                            onChange={handlePricingChange}
                            helperText="Orders above this amount get free delivery"
                        />
                        <Input
                            label="Express Service Charge (₹)"
                            name="expressCharge"
                            type="number"
                            value={settings.pricing.expressCharge}
                            onChange={handlePricingChange}
                        />
                        <Input
                            label="GST Rate (%)"
                            name="gstRate"
                            type="number"
                            value={settings.pricing.gstRate}
                            onChange={handlePricingChange}
                            helperText="GST percentage applied on all orders"
                        />
                        <Input
                            label="Loyalty Points Rate (points per ₹100)"
                            name="loyaltyPointsRate"
                            type="number"
                            value={settings.pricing.loyaltyPointsRate}
                            onChange={handlePricingChange}
                        />
                        <Input
                            label="Loyalty Points Redemption (₹ per point)"
                            name="loyaltyPointsRedemption"
                            type="number"
                            value={settings.pricing.loyaltyPointsRedemption}
                            onChange={handlePricingChange}
                            step="0.1"
                        />
                    </div>
                </div>
            )}

            {/* Notification Settings */}
            {activeTab === 'notifications' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Notification Preferences</h2>
                    <div className="space-y-3">
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">Email Notifications</span>
                                <p className="text-xs text-gray-500">Receive email notifications for orders and updates</p>
                            </div>
                            <input
                                type="checkbox"
                                name="emailNotifications"
                                checked={settings.notifications.emailNotifications}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">SMS Notifications</span>
                                <p className="text-xs text-gray-500">Receive SMS notifications for order updates</p>
                            </div>
                            <input
                                type="checkbox"
                                name="smsNotifications"
                                checked={settings.notifications.smsNotifications}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">Order Confirmation</span>
                                <p className="text-xs text-gray-500">Send confirmation when orders are placed</p>
                            </div>
                            <input
                                type="checkbox"
                                name="orderConfirmation"
                                checked={settings.notifications.orderConfirmation}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">Order Status Updates</span>
                                <p className="text-xs text-gray-500">Send updates when order status changes</p>
                            </div>
                            <input
                                type="checkbox"
                                name="orderStatusUpdate"
                                checked={settings.notifications.orderStatusUpdate}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">Promotional Emails</span>
                                <p className="text-xs text-gray-500">Send offers and promotions to customers</p>
                            </div>
                            <input
                                type="checkbox"
                                name="promotionalEmails"
                                checked={settings.notifications.promotionalEmails}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                        <label className="flex items-center justify-between p-3 bg-gray-50 rounded-lg cursor-pointer">
                            <div>
                                <span className="font-medium text-gray-800">Admin Alerts</span>
                                <p className="text-xs text-gray-500">Receive alerts for new orders and important events</p>
                            </div>
                            <input
                                type="checkbox"
                                name="adminAlerts"
                                checked={settings.notifications.adminAlerts}
                                onChange={handleNotificationChange}
                                className="w-5 h-5 text-blue-600 rounded"
                            />
                        </label>
                    </div>
                </div>
            )}

            {/* Payment Settings */}
            {activeTab === 'payment' && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <h2 className="text-lg font-semibold text-gray-800 mb-4">Payment Gateway Settings</h2>
                    <div className="space-y-4">
                        <Input
                            label="Razorpay Key ID"
                            name="razorpayKeyId"
                            value={settings.payment.razorpayKeyId}
                            onChange={handlePaymentChange}
                            helperText="Your Razorpay API Key ID"
                        />
                        <Input
                            label="Razorpay Key Secret"
                            name="razorpayKeySecret"
                            type="password"
                            value={settings.payment.razorpayKeySecret}
                            onChange={handlePaymentChange}
                            helperText="Your Razorpay API Key Secret"
                        />
                        <Input
                            label="UPI ID"
                            name="upiId"
                            value={settings.payment.upiId}
                            onChange={handlePaymentChange}
                            helperText="Your UPI ID for payments"
                        />
                        <Input
                            label="Bank Name"
                            name="bankName"
                            value={settings.payment.bankName}
                            onChange={handlePaymentChange}
                        />
                        <Input
                            label="Account Number"
                            name="accountNumber"
                            value={settings.payment.accountNumber}
                            onChange={handlePaymentChange}
                        />
                        <Input
                            label="IFSC Code"
                            name="ifscCode"
                            value={settings.payment.ifscCode}
                            onChange={handlePaymentChange}
                        />
                    </div>
                    <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                        <p className="text-sm text-yellow-800">
                            ⚠️ Warning: Payment gateway credentials are sensitive. Keep them secure and never share publicly.
                        </p>
                    </div>
                </div>
            )}

            {/* Save Button */}
            <div className="mt-6 flex justify-end">
                <Button
                    variant="primary"
                    onClick={handleSave}
                    loading={loading}
                    className="px-6"
                >
                    Save All Settings
                </Button>
            </div>
        </div>
    );
};

export default Settings;