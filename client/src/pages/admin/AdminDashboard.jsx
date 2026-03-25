import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import StatsCard from '../../components/admin/StatsCard';
import Chart from '../../components/admin/Chart';
import Loader from '../../components/common/Loader';
import { Link } from 'react-router-dom';

const AdminDashboard = () => {
    const { getDashboardStats, formatCurrency, formatDate } = useAdmin();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [recentOrders, setRecentOrders] = useState([]);
    const [topServices, setTopServices] = useState([]);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        const result = await getDashboardStats();
        if (result.success) {
            setStats(result.data);
            setRecentOrders(result.data.recentOrders || []);
            setTopServices(result.data.topServices || []);
        }
        setLoading(false);
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            confirmed: 'bg-blue-100 text-blue-800',
            pickup_assigned: 'bg-purple-100 text-purple-800',
            collected: 'bg-indigo-100 text-indigo-800',
            processing: 'bg-orange-100 text-orange-800',
            quality_check: 'bg-pink-100 text-pink-800',
            out_for_delivery: 'bg-cyan-100 text-cyan-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusLabel = (status) => {
        const labels = {
            pending: 'Pending',
            confirmed: 'Confirmed',
            pickup_assigned: 'Pickup Assigned',
            collected: 'Collected',
            processing: 'Processing',
            quality_check: 'Quality Check',
            out_for_delivery: 'Out for Delivery',
            delivered: 'Delivered',
            cancelled: 'Cancelled'
        };
        return labels[status] || status;
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    const statCards = [
        {
            title: 'Total Revenue',
            value: formatCurrency(stats?.revenue?.totalRevenue || 0),
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'green',
            change: 12.5
        },
        {
            title: 'Total Orders',
            value: stats?.totalOrders || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
            ),
            color: 'blue',
            change: 8.2
        },
        {
            title: 'Total Customers',
            value: stats?.totalUsers || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
            ),
            color: 'purple',
            change: 5.3
        },
        {
            title: 'Pending Orders',
            value: stats?.pendingOrders || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
            ),
            color: 'orange',
            change: -3.5
        },
        {
            title: 'Today Orders',
            value: stats?.todayOrders || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
            ),
            color: 'teal',
            change: 15.2
        },
        {
            title: 'Services',
            value: stats?.totalServices || 0,
            icon: (
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
            ),
            color: 'indigo',
            change: 2.1
        }
    ];

    // Sample chart data
    const revenueData = [
        { date: 'Mon', revenue: 12000, orders: 45 },
        { date: 'Tue', revenue: 15000, orders: 52 },
        { date: 'Wed', revenue: 18000, orders: 61 },
        { date: 'Thu', revenue: 14000, orders: 48 },
        { date: 'Fri', revenue: 22000, orders: 78 },
        { date: 'Sat', revenue: 28000, orders: 95 },
        { date: 'Sun', revenue: 25000, orders: 82 }
    ];

    const statusData = [
        { name: 'Delivered', value: 156, color: '#10B981' },
        { name: 'Processing', value: 45, color: '#F59E0B' },
        { name: 'Pending', value: 32, color: '#EF4444' },
        { name: 'Out for Delivery', value: 28, color: '#3B82F6' }
    ];

    return (
        <div className="p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
                <p className="text-gray-500">Welcome back! Here's what's happening with your business today.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4 mb-8">
                {statCards.map((stat, index) => (
                    <StatsCard
                        key={index}
                        title={stat.title}
                        value={stat.value}
                        icon={stat.icon}
                        color={stat.color}
                        change={stat.change}
                    />
                ))}
            </div>

            {/* Charts Row */}
            <div className="grid lg:grid-cols-2 gap-6 mb-8">
                <Chart
                    type="area"
                    data={revenueData}
                    xKey="date"
                    yKey="revenue"
                    title="Revenue Overview"
                    height={300}
                />
                <Chart
                    type="pie"
                    data={statusData}
                    title="Order Status Distribution"
                    height={300}
                />
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden mb-8">
                <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <Link to="/admin/orders" className="text-sm text-blue-600 hover:text-blue-700">
                        View All →
                    </Link>
                </div>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Customer</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Total</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {recentOrders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-blue-600">
                                        #{order.orderNumber}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                        {order.customerDetails?.name || order.user?.name}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {formatDate(order.createdAt)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-800">
                                        {formatCurrency(order.totalAmount)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(order.orderStatus)}`}>
                                            {getStatusLabel(order.orderStatus)}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                                        <Link to={`/admin/orders/${order._id}`} className="text-blue-600 hover:text-blue-700">
                                            View
                                        </Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Top Services */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="px-6 py-4 border-b border-gray-200">
                    <h2 className="text-lg font-semibold text-gray-800">Top Services</h2>
                </div>
                <div className="p-6">
                    {topServices.length > 0 ? (
                        <div className="space-y-4">
                            {topServices.map((service, index) => (
                                <div key={index} className="flex items-center justify-between">
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg font-bold text-gray-400">#{index + 1}</span>
                                        <div>
                                            <p className="font-medium text-gray-800">{service._id}</p>
                                            <p className="text-xs text-gray-500">{service.totalQuantity} items ordered</p>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <p className="font-semibold text-gray-800">{formatCurrency(service.totalRevenue)}</p>
                                        <p className="text-xs text-gray-500">revenue</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    ) : (
                        <p className="text-gray-500 text-center py-4">No service data available</p>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;