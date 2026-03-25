import React, { useState, useEffect } from 'react';
import { useAdmin } from '../../hooks/useAdmin';
import Chart from '../../components/admin/Chart';
import Loader from '../../components/common/Loader';
import { toast } from 'react-toastify';

const Reports = () => {
    const { getSalesReport, getOrdersReport, getServicesReport, getCustomersReport, getRevenueReport, formatCurrency, formatDate } = useAdmin();
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('sales');
    const [dateRange, setDateRange] = useState({
        startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        endDate: new Date().toISOString().split('T')[0]
    });
    const [salesData, setSalesData] = useState(null);
    const [ordersData, setOrdersData] = useState(null);
    const [servicesData, setServicesData] = useState(null);
    const [customersData, setCustomersData] = useState(null);
    const [revenueData, setRevenueData] = useState(null);

    useEffect(() => {
        loadReports();
    }, [dateRange, activeTab]);

    const loadReports = async () => {
        setLoading(true);

        if (activeTab === 'sales') {
            const result = await getSalesReport(dateRange);
            if (result.success) setSalesData(result.data);
        } else if (activeTab === 'orders') {
            const result = await getOrdersReport(dateRange);
            if (result.success) setOrdersData(result.data);
        } else if (activeTab === 'services') {
            const result = await getServicesReport(dateRange);
            if (result.success) setServicesData(result.data);
        } else if (activeTab === 'customers') {
            const result = await getCustomersReport(dateRange);
            if (result.success) setCustomersData(result.data);
        } else if (activeTab === 'revenue') {
            const result = await getRevenueReport(dateRange);
            if (result.success) setRevenueData(result.data);
        }

        setLoading(false);
    };

    const handleExportCSV = () => {
        let data = [];
        let filename = '';

        if (activeTab === 'sales' && salesData?.dailyBreakdown) {
            data = salesData.dailyBreakdown;
            filename = `sales_report_${dateRange.startDate}_to_${dateRange.endDate}`;
        } else if (activeTab === 'orders' && ordersData?.dailyTrend) {
            data = ordersData.dailyTrend;
            filename = `orders_report_${dateRange.startDate}_to_${dateRange.endDate}`;
        } else if (activeTab === 'services' && servicesData?.topServices) {
            data = servicesData.topServices;
            filename = `services_report_${dateRange.startDate}_to_${dateRange.endDate}`;
        } else if (activeTab === 'customers' && customersData?.topCustomers) {
            data = customersData.topCustomers;
            filename = `customers_report_${dateRange.startDate}_to_${dateRange.endDate}`;
        } else if (activeTab === 'revenue' && revenueData?.monthlyTrend) {
            data = revenueData.monthlyTrend;
            filename = `revenue_report_${dateRange.startDate}_to_${dateRange.endDate}`;
        }

        if (data.length === 0) {
            toast.error('No data to export');
            return;
        }

        const headers = Object.keys(data[0]);
        const csvRows = [headers.join(',')];

        for (const row of data) {
            const values = headers.map(header => {
                const value = row[header] || '';
                return `"${String(value).replace(/"/g, '""')}"`;
            });
            csvRows.push(values.join(','));
        }

        const blob = new Blob([csvRows.join('\n')], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${filename}.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
        toast.success('Report exported successfully');
    };

    const renderSalesReport = () => {
        if (!salesData) return null;

        const chartData = salesData.dailyBreakdown?.map(item => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.orders
        })) || [];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(salesData.summary?.totalRevenue || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-blue-600">{salesData.summary?.totalOrders || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Average Order Value</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(salesData.summary?.averageOrderValue || 0)}</p>
                    </div>
                </div>

                <Chart
                    type="multi-line"
                    data={chartData}
                    xKey="date"
                    title="Daily Revenue & Orders"
                    height={350}
                />

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Daily Breakdown</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Date</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Orders</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Revenue</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {salesData.dailyBreakdown?.map((day, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{formatDate(day._id)}</td>
                                        <td className="px-6 py-4 text-sm text-gray-900">{day.orders}</td>
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{formatCurrency(day.revenue)}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderOrdersReport = () => {
        if (!ordersData) return null;

        const statusData = ordersData.ordersByStatus?.map(item => ({
            name: item._id,
            value: item.count
        })) || [];

        const trendData = ordersData.dailyTrend?.map(item => ({
            date: item._id,
            orders: item.orders,
            amount: item.amount
        })) || [];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Orders</p>
                        <p className="text-2xl font-bold text-blue-600">{ordersData.totalOrders || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Amount</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(ordersData.totalAmount || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Avg Processing Time</p>
                        <p className="text-2xl font-bold text-purple-600">{ordersData.avgProcessingTime?.toFixed(1) || 0} hrs</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Chart type="pie" data={statusData} title="Orders by Status" height={300} />
                    <Chart type="area" data={trendData} xKey="date" yKey="orders" title="Order Trend" height={300} />
                </div>
            </div>
        );
    };

    const renderServicesReport = () => {
        if (!servicesData) return null;

        const categoryData = servicesData.servicesByCategory?.map(item => ({
            name: item._id,
            value: item.totalRevenue
        })) || [];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Top Services</h3>
                        <div className="space-y-3">
                            {servicesData.topServices?.slice(0, 5).map((service, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{service._id}</p>
                                        <p className="text-xs text-gray-500">{service.totalQuantity} orders</p>
                                    </div>
                                    <p className="font-semibold text-blue-600">{formatCurrency(service.totalRevenue)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                    <Chart type="pie" data={categoryData} title="Revenue by Category" height={300} />
                </div>

                <div className="bg-white rounded-lg shadow-md overflow-hidden">
                    <div className="px-6 py-4 border-b border-gray-200">
                        <h3 className="text-lg font-semibold">Service Ratings</h3>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Service</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rating</th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Reviews</th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {servicesData.serviceRatings?.map((service, idx) => (
                                    <tr key={idx}>
                                        <td className="px-6 py-4 text-sm text-gray-900">{service.serviceDetails?.name}</td>
                                        <td className="px-6 py-4 text-sm text-yellow-600">{service.averageRating?.toFixed(1)} ⭐</td>
                                        <td className="px-6 py-4 text-sm text-gray-500">{service.totalReviews}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        );
    };

    const renderCustomersReport = () => {
        if (!customersData) return null;

        const retentionData = [
            { name: 'One Time', value: customersData.customerRetention?.oneTime || 0 },
            { name: 'Repeat', value: customersData.customerRetention?.repeat || 0 }
        ];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Customers</p>
                        <p className="text-2xl font-bold text-blue-600">{customersData.customerRetention?.totalCustomers || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Repeat Customers</p>
                        <p className="text-2xl font-bold text-green-600">{customersData.customerRetention?.repeat || 0}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Retention Rate</p>
                        <p className="text-2xl font-bold text-purple-600">{customersData.customerRetention?.retentionRate || 0}%</p>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Chart type="pie" data={retentionData} title="Customer Retention" height={300} />
                    <div className="bg-white rounded-lg shadow-md p-6">
                        <h3 className="text-lg font-semibold mb-4">Top Customers</h3>
                        <div className="space-y-3">
                            {customersData.topCustomers?.map((customer, idx) => (
                                <div key={idx} className="flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-gray-800">{customer.userDetails?.name}</p>
                                        <p className="text-xs text-gray-500">{customer.totalOrders} orders</p>
                                    </div>
                                    <p className="font-semibold text-blue-600">{formatCurrency(customer.totalSpent)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    const renderRevenueReport = () => {
        if (!revenueData) return null;

        const chartData = revenueData.monthlyTrend?.map(item => ({
            date: item._id,
            revenue: item.revenue,
            orders: item.orders
        })) || [];

        return (
            <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Total Revenue</p>
                        <p className="text-2xl font-bold text-green-600">{formatCurrency(revenueData.summary?.totalRevenue || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Subtotal</p>
                        <p className="text-2xl font-bold text-blue-600">{formatCurrency(revenueData.summary?.subtotal || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">GST Collected</p>
                        <p className="text-2xl font-bold text-purple-600">{formatCurrency(revenueData.summary?.gst || 0)}</p>
                    </div>
                    <div className="bg-white rounded-lg shadow-md p-4">
                        <p className="text-sm text-gray-500">Discounts Given</p>
                        <p className="text-2xl font-bold text-red-600">{formatCurrency(revenueData.summary?.discounts || 0)}</p>
                    </div>
                </div>

                <Chart
                    type="multi-line"
                    data={chartData}
                    xKey="date"
                    title="Monthly Revenue & Orders"
                    height={350}
                />
            </div>
        );
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <Loader size="lg" />
            </div>
        );
    }

    return (
        <div className="p-6">
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-gray-800">Reports & Analytics</h1>
                    <p className="text-gray-500">View business insights and analytics</p>
                </div>
                <button
                    onClick={handleExportCSV}
                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 flex items-center gap-2"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    Export CSV
                </button>
            </div>

            {/* Date Range Picker */}
            <div className="bg-white rounded-lg shadow-md p-4 mb-6">
                <div className="flex flex-wrap items-center gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                        <input
                            type="date"
                            value={dateRange.startDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, startDate: e.target.value }))}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                        <input
                            type="date"
                            value={dateRange.endDate}
                            onChange={(e) => setDateRange(prev => ({ ...prev, endDate: e.target.value }))}
                            className="p-2 border border-gray-300 rounded-lg"
                        />
                    </div>
                    <button
                        onClick={() => setDateRange({
                            startDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
                            endDate: new Date().toISOString().split('T')[0]
                        })}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700"
                    >
                        Last 30 Days
                    </button>
                    <button
                        onClick={() => setDateRange({
                            startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
                            endDate: new Date().toISOString().split('T')[0]
                        })}
                        className="px-4 py-2 text-blue-600 hover:text-blue-700"
                    >
                        This Month
                    </button>
                </div>
            </div>

            {/* Report Tabs */}
            <div className="bg-white rounded-lg shadow-md p-2 mb-6 overflow-x-auto">
                <div className="flex space-x-1">
                    {['sales', 'orders', 'services', 'customers', 'revenue'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${activeTab === tab
                                    ? 'bg-blue-600 text-white'
                                    : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab} Report
                        </button>
                    ))}
                </div>
            </div>

            {/* Report Content */}
            {activeTab === 'sales' && renderSalesReport()}
            {activeTab === 'orders' && renderOrdersReport()}
            {activeTab === 'services' && renderServicesReport()}
            {activeTab === 'customers' && renderCustomersReport()}
            {activeTab === 'revenue' && renderRevenueReport()}
        </div>
    );
};

export default Reports;