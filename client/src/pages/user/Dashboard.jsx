import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useOrder } from '../../context/OrderContext';
import { useCart } from '../../context/CartContext';
import Loader from '../../components/common/Loader';
import OrderSummary from '../../components/user/OrderSummary';

const Dashboard = () => {
    const { user, getLoyaltyPoints } = useAuth();
    const { orders, loading, loadUserOrders, getRecentOrders, getStatusColor, getStatusLabel } = useOrder();
    const { getCartItemCount } = useCart();
    const [stats, setStats] = useState({
        totalOrders: 0,
        completedOrders: 0,
        pendingOrders: 0,
        totalSpent: 0
    });

    useEffect(() => {
        loadUserOrders();
    }, []);

    useEffect(() => {
        if (orders.length > 0) {
            const completed = orders.filter(o => o.orderStatus === 'delivered').length;
            const pending = orders.filter(o => !['delivered', 'cancelled'].includes(o.orderStatus)).length;
            const totalSpent = orders
                .filter(o => o.orderStatus === 'delivered' && o.paymentStatus === 'paid')
                .reduce((sum, o) => sum + o.totalAmount, 0);

            setStats({
                totalOrders: orders.length,
                completedOrders: completed,
                pendingOrders: pending,
                totalSpent: totalSpent
            });
        }
    }, [orders]);

    const recentOrders = getRecentOrders();
    const cartItemCount = getCartItemCount();
    const loyaltyPoints = getLoyaltyPoints();

    const statCards = [
        {
            title: 'Total Orders',
            value: stats.totalOrders,
            icon: '📦',
            color: 'blue',
            link: '/my-orders'
        },
        {
            title: 'Completed',
            value: stats.completedOrders,
            icon: '✅',
            color: 'green',
            link: '/my-orders?status=delivered'
        },
        {
            title: 'Pending',
            value: stats.pendingOrders,
            icon: '⏳',
            color: 'yellow',
            link: '/my-orders?status=pending'
        },
        {
            title: 'Loyalty Points',
            value: loyaltyPoints,
            icon: '⭐',
            color: 'purple',
            link: '/profile'
        },
        {
            title: 'Cart Items',
            value: cartItemCount,
            icon: '🛒',
            color: 'orange',
            link: '/cart'
        },
        {
            title: 'Total Spent',
            value: `₹${stats.totalSpent.toLocaleString()}`,
            icon: '💰',
            color: 'indigo',
            link: '/my-orders'
        }
    ];

    const quickActions = [
        { title: 'Book New Service', icon: '🧺', link: '/services', color: 'bg-blue-600' },
        { title: 'Track Order', icon: '📍', link: '/track-order', color: 'bg-green-600' },
        { title: 'My Profile', icon: '👤', link: '/profile', color: 'bg-purple-600' },
        { title: 'Address Book', icon: '📮', link: '/address-book', color: 'bg-orange-600' },
        { title: 'View All Orders', icon: '📋', link: '/my-orders', color: 'bg-indigo-600' },
        { title: 'Contact Support', icon: '💬', link: '/contact', color: 'bg-red-600' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Welcome Section */}
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl p-6 mb-8 text-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
                        <div>
                            <h1 className="text-2xl md:text-3xl font-bold mb-2">
                                Welcome back, {user?.name?.split(' ')[0]}!
                            </h1>
                            <p className="text-blue-100">
                                {user?.email} • Member since {new Date(user?.createdAt).toLocaleDateString()}
                            </p>
                        </div>
                        <div className="mt-4 md:mt-0">
                            <Link
                                to="/services"
                                className="inline-block bg-white text-blue-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                            >
                                + Book New Service
                            </Link>
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    {statCards.map((stat, index) => (
                        <Link
                            key={index}
                            to={stat.link}
                            className="bg-white rounded-lg shadow-sm p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="text-2xl mb-2">{stat.icon}</div>
                            <p className="text-xs text-gray-500">{stat.title}</p>
                            <p className="text-xl font-bold text-gray-800">{stat.value}</p>
                        </Link>
                    ))}
                </div>

                <div className="grid lg:grid-cols-3 gap-6">
                    {/* Recent Orders */}
                    <div className="lg:col-span-2">
                        <div className="bg-white rounded-lg shadow-md p-5">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                                <Link to="/my-orders" className="text-blue-600 hover:text-blue-700 text-sm">
                                    View All →
                                </Link>
                            </div>

                            {recentOrders.length > 0 ? (
                                <div className="space-y-3">
                                    {recentOrders.map((order) => (
                                        <div key={order._id} className="border border-gray-100 rounded-lg p-3 hover:shadow-sm transition-shadow">
                                            <div className="flex justify-between items-start mb-2">
                                                <Link to={`/orders/${order._id}`}>
                                                    <p className="font-medium text-blue-600 hover:underline">
                                                        #{order.orderNumber}
                                                    </p>
                                                </Link>
                                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${getStatusColor(order.orderStatus)}`}>
                                                    {getStatusLabel(order.orderStatus)}
                                                </span>
                                            </div>
                                            <div className="flex justify-between text-sm">
                                                <span className="text-gray-500">
                                                    {new Date(order.createdAt).toLocaleDateString()}
                                                </span>
                                                <span className="font-medium">₹{order.totalAmount}</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-1">
                                                {order.items.length} item{order.items.length !== 1 ? 's' : ''}
                                            </p>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="text-center py-8">
                                    <p className="text-gray-500 mb-3">No orders yet</p>
                                    <Link to="/services" className="text-blue-600 hover:text-blue-700 text-sm">
                                        Start Shopping →
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Quick Actions */}
                    <div>
                        <div className="bg-white rounded-lg shadow-md p-5 mb-6">
                            <h2 className="text-lg font-semibold text-gray-800 mb-4">Quick Actions</h2>
                            <div className="grid grid-cols-2 gap-3">
                                {quickActions.map((action, index) => (
                                    <Link
                                        key={index}
                                        to={action.link}
                                        className={`${action.color} text-white rounded-lg p-3 text-center hover:opacity-90 transition-opacity`}
                                    >
                                        <div className="text-xl mb-1">{action.icon}</div>
                                        <p className="text-xs font-medium">{action.title}</p>
                                    </Link>
                                ))}
                            </div>
                        </div>

                        {/* Loyalty Points Info */}
                        <div className="bg-gradient-to-r from-yellow-500 to-orange-500 rounded-lg p-5 text-white">
                            <div className="flex items-center justify-between mb-3">
                                <span className="text-2xl">⭐</span>
                                <span className="text-sm opacity-90">Rewards</span>
                            </div>
                            <h3 className="text-xl font-bold mb-1">{loyaltyPoints} Points</h3>
                            <p className="text-sm opacity-90 mb-3">Earn points on every order</p>
                            <div className="w-full bg-white/30 rounded-full h-2 mb-3">
                                <div
                                    className="bg-white rounded-full h-2 transition-all"
                                    style={{ width: `${Math.min((loyaltyPoints % 100) * 100 / 100, 100)}%` }}
                                />
                            </div>
                            <p className="text-xs opacity-90">
                                {100 - (loyaltyPoints % 100)} more points for ₹50 reward
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;