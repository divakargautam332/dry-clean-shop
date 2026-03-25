import React from 'react';
import {
    LineChart,
    Line,
    BarChart,
    Bar,
    PieChart,
    Pie,
    Cell,
    AreaChart,
    Area,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer
} from 'recharts';

const COLORS = ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6', '#EC4899', '#06B6D4'];

const Chart = ({ type, data, xKey, yKey, title, height = 300, showGrid = true, showLegend = true }) => {
    const renderChart = () => {
        switch (type) {
            case 'line':
                return (
                    <LineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {showLegend && <Legend />}
                        <Line
                            type="monotone"
                            dataKey={yKey}
                            stroke="#3B82F6"
                            strokeWidth={2}
                            dot={{ fill: '#3B82F6', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                );

            case 'area':
                return (
                    <AreaChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {showLegend && <Legend />}
                        <Area
                            type="monotone"
                            dataKey={yKey}
                            stroke="#3B82F6"
                            fill="#3B82F6"
                            fillOpacity={0.2}
                        />
                    </AreaChart>
                );

            case 'bar':
                return (
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {showLegend && <Legend />}
                        <Bar dataKey={yKey} fill="#3B82F6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                );

            case 'pie':
                return (
                    <PieChart>
                        <Pie
                            data={data}
                            dataKey="value"
                            nameKey="name"
                            cx="50%"
                            cy="50%"
                            outerRadius={100}
                            label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Pie>
                        <Tooltip />
                        {showLegend && <Legend />}
                    </PieChart>
                );

            case 'multi-line':
                return (
                    <LineChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {showLegend && <Legend />}
                        {Object.keys(data[0] || {})
                            .filter(key => key !== xKey)
                            .map((key, index) => (
                                <Line
                                    key={key}
                                    type="monotone"
                                    dataKey={key}
                                    stroke={COLORS[index % COLORS.length]}
                                    strokeWidth={2}
                                />
                            ))}
                    </LineChart>
                );

            case 'multi-bar':
                return (
                    <BarChart data={data}>
                        {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />}
                        <XAxis dataKey={xKey} tick={{ fontSize: 12 }} />
                        <YAxis tick={{ fontSize: 12 }} />
                        <Tooltip />
                        {showLegend && <Legend />}
                        {Object.keys(data[0] || {})
                            .filter(key => key !== xKey)
                            .map((key, index) => (
                                <Bar key={key} dataKey={key} fill={COLORS[index % COLORS.length]} />
                            ))}
                    </BarChart>
                );

            default:
                return null;
        }
    };

    return (
        <div className="bg-white rounded-lg border border-gray-200 p-4">
            {title && (
                <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
            )}
            <ResponsiveContainer width="100%" height={height}>
                {renderChart()}
            </ResponsiveContainer>
        </div>
    );
};

// Revenue Chart Component
export const RevenueChart = ({ data, height = 300 }) => {
    return (
        <Chart
            type="area"
            data={data}
            xKey="date"
            yKey="revenue"
            title="Revenue Trend"
            height={height}
        />
    );
};

// Orders Chart Component
export const OrdersChart = ({ data, height = 300 }) => {
    return (
        <Chart
            type="bar"
            data={data}
            xKey="date"
            yKey="orders"
            title="Orders Overview"
            height={height}
        />
    );
};

// Order Status Distribution
export const OrderStatusPieChart = ({ data, height = 300 }) => {
    return (
        <Chart
            type="pie"
            data={data}
            title="Order Status Distribution"
            height={height}
        />
    );
};

// Sales vs Orders Chart
export const SalesOrdersChart = ({ data, height = 300 }) => {
    return (
        <Chart
            type="multi-line"
            data={data}
            xKey="date"
            title="Sales vs Orders"
            height={height}
        />
    );
};

// Category Performance Chart
export const CategoryPerformanceChart = ({ data, height = 300 }) => {
    return (
        <Chart
            type="bar"
            data={data}
            xKey="category"
            yKey="revenue"
            title="Category Performance"
            height={height}
        />
    );
};

export default Chart;