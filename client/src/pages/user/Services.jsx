import React, { useState, useEffect } from 'react';
import { useService } from '../../context/ServiceContext';
import ServiceCard from '../../components/user/ServiceCard';
import Loader from '../../components/common/Loader';

const Services = () => {
    const {
        services,
        categories,
        loading,
        searchTerm,
        setSearchTerm,
        selectedCategory,
        setSelectedCategory,
        sortBy,
        setSortBy,
        priceRange,
        setPriceRange,
        resetFilters
    } = useService();

    const [showFilters, setShowFilters] = useState(false);
    const [tempPriceRange, setTempPriceRange] = useState({ min: 0, max: 1000 });

    const sortOptions = [
        { value: 'popular', label: 'Most Popular' },
        { value: 'newest', label: 'Newest First' },
        { value: 'price_low', label: 'Price: Low to High' },
        { value: 'price_high', label: 'Price: High to Low' }
    ];

    const handlePriceFilter = () => {
        setPriceRange(tempPriceRange);
    };

    const clearPriceFilter = () => {
        setTempPriceRange({ min: 0, max: 1000 });
        setPriceRange({ min: 0, max: 1000 });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="container mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-8">
                    <h1 className="text-3xl font-bold text-gray-800 mb-2">Our Services</h1>
                    <p className="text-gray-600">Professional dry cleaning and laundry services for all your needs</p>
                </div>

                {/* Search and Filter Bar */}
                <div className="bg-white rounded-lg shadow-sm p-4 mb-6">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Search Input */}
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <input
                                    type="text"
                                    placeholder="Search services..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <svg
                                    className="absolute left-3 top-2.5 w-5 h-5 text-gray-400"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                >
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                </svg>
                            </div>
                        </div>

                        {/* Filter Toggle Button (Mobile) */}
                        <button
                            onClick={() => setShowFilters(!showFilters)}
                            className="md:hidden flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
                            </svg>
                            <span>Filters</span>
                        </button>

                        {/* Sort Dropdown */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            {sortOptions.map(option => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Filters Panel */}
                    <div className={`mt-4 ${showFilters ? 'block' : 'hidden md:block'}`}>
                        <div className="flex flex-wrap items-center gap-4">
                            {/* Category Filters */}
                            <div className="flex flex-wrap gap-2">
                                <button
                                    onClick={() => setSelectedCategory('all')}
                                    className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === 'all'
                                            ? 'bg-blue-600 text-white'
                                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                >
                                    All
                                </button>
                                {categories.map((category) => (
                                    <button
                                        key={category.value}
                                        onClick={() => setSelectedCategory(category.value)}
                                        className={`px-3 py-1 rounded-full text-sm transition-colors ${selectedCategory === category.value
                                                ? 'bg-blue-600 text-white'
                                                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            }`}
                                    >
                                        {category.label}
                                    </button>
                                ))}
                            </div>

                            {/* Price Range Filter */}
                            <div className="flex items-center space-x-3">
                                <span className="text-sm text-gray-600">Price:</span>
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={tempPriceRange.min}
                                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, min: parseInt(e.target.value) || 0 })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <span>-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={tempPriceRange.max}
                                    onChange={(e) => setTempPriceRange({ ...tempPriceRange, max: parseInt(e.target.value) || 1000 })}
                                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                                />
                                <button
                                    onClick={handlePriceFilter}
                                    className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700"
                                >
                                    Apply
                                </button>
                                <button
                                    onClick={clearPriceFilter}
                                    className="px-3 py-1 text-gray-500 text-sm hover:text-gray-700"
                                >
                                    Clear
                                </button>
                            </div>

                            {/* Reset All Filters */}
                            <button
                                onClick={resetFilters}
                                className="text-sm text-red-500 hover:text-red-600"
                            >
                                Reset All
                            </button>
                        </div>
                    </div>
                </div>

                {/* Results Count */}
                <div className="mb-4">
                    <p className="text-gray-600">
                        Showing {services.length} {services.length === 1 ? 'service' : 'services'}
                    </p>
                </div>

                {/* Services Grid */}
                {loading ? (
                    <div className="flex justify-center py-12">
                        <Loader size="lg" />
                    </div>
                ) : services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {services.map((service) => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12">
                        <svg
                            className="w-24 h-24 mx-auto text-gray-300 mb-4"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                            />
                        </svg>
                        <h3 className="text-xl font-semibold text-gray-700 mb-2">No services found</h3>
                        <p className="text-gray-500">
                            Try adjusting your search or filter criteria
                        </p>
                        <button
                            onClick={resetFilters}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                        >
                            Reset Filters
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Services;