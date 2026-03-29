import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';

const Navbar = () => {
    const { user, isAuthenticated, logout, isAdmin, isStaff } = useAuth();
    const { itemCount } = useCart();
    const navigate = useNavigate();
    const location = useLocation();
    const [isScrolled, setIsScrolled] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [showPriceList, setShowPriceList] = useState(false);
    const [services, setServices] = useState([]);
    const [loading, setLoading] = useState(false);

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    // Fetch services for price list
    useEffect(() => {
        const fetchServices = async () => {
            setLoading(true);
            try {
                const response = await fetch('https://dry-clean-shop-1.onrender.com/api/services');
                const data = await response.json();
                if (data.success) {
                    setServices(data.data);
                }
            } catch (error) {
                console.error('Error fetching services:', error);
            }
            setLoading(false);
        };

        if (showPriceList) {
            fetchServices();
        }
    }, [showPriceList]);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
        { name: 'Price List', path: '#', action: () => setShowPriceList(true) },
        { name: 'Track Order', path: '/track-order' },
        { name: 'Contact', path: '/contact' },
    ];

    const userLinks = [
        { name: 'Dashboard', path: '/dashboard' },
        { name: 'My Orders', path: '/my-orders' },
        { name: 'Profile', path: '/profile' },
        { name: 'Address Book', path: '/address-book' },
    ];

    const adminLinks = [
        { name: 'Admin Dashboard', path: '/admin' },
        { name: 'Manage Orders', path: '/admin/orders' },
        { name: 'Manage Services', path: '/admin/services' },
        { name: 'Customers', path: '/admin/customers' },
        { name: 'Coupons', path: '/admin/coupons' },
        { name: 'Delivery Staff', path: '/admin/delivery-staff' },
        { name: 'Reviews', path: '/admin/reviews' },
        { name: 'Reports', path: '/admin/reports' },
        { name: 'Settings', path: '/admin/settings' },
    ];

    const isActive = (path) => {
        if (path === '/') {
            return location.pathname === path;
        }
        return path !== '#' && location.pathname.startsWith(path);
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            minimumFractionDigits: 0
        }).format(price);
    };

    const getCategoryLabel = (category) => {
        const labels = {
            shirts: 'Shirts & Tops',
            pants: 'Pants & Trousers',
            suits: 'Suits & Blazers',
            ethnic: 'Ethnic Wear',
            winter: 'Winter Wear',
            home: 'Home Furnishings',
            other: 'Other Services'
        };
        return labels[category] || category;
    };

    // Group services by category
    const groupedServices = services.reduce((acc, service) => {
        if (!acc[service.category]) {
            acc[service.category] = [];
        }
        acc[service.category].push(service);
        return acc;
    }, {});

    return (
        <>
            <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white shadow-lg' : 'bg-white/95 shadow-md'
                }`}>
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center h-16">
                        {/* Logo */}
                        <Link to="/" className="flex items-center space-x-2">
                            <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center">
                                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                </svg>
                            </div>
                            <span className="text-xl font-bold text-gray-800">Deep <span className="text-blue-600">DryCleaners</span></span>
                        </Link>

                        {/* Desktop Navigation Links */}
                        <div className="hidden md:flex items-center space-x-6">
                            {navLinks.map((link) => (
                                link.action ? (
                                    <button
                                        key={link.name}
                                        onClick={link.action}
                                        className="text-gray-600 hover:text-blue-600 transition-colors duration-200"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        className={`transition-colors duration-200 ${isActive(link.path)
                                            ? 'text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}
                        </div>

                        {/* Right Side Icons */}
                        <div className="flex items-center space-x-4">
                            {/* Cart Icon */}
                            <Link
                                to="/cart"
                                className="relative p-2 text-gray-600 hover:text-blue-600 transition-colors"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
                                </svg>
                                {itemCount > 0 && (
                                    <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                                        {itemCount > 9 ? '9+' : itemCount}
                                    </span>
                                )}
                            </Link>

                            {/* User Menu */}
                            {isAuthenticated ? (
                                <Menu as="div" className="relative">
                                    <Menu.Button className="flex items-center space-x-2 focus:outline-none">
                                        <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                            {user?.name?.charAt(0).toUpperCase()}
                                        </div>
                                        <span className="hidden lg:block text-gray-700">{user?.name?.split(' ')[0]}</span>
                                        <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                        </svg>
                                    </Menu.Button>
                                    <Transition
                                        as={Fragment}
                                        enter="transition ease-out duration-100"
                                        enterFrom="transform opacity-0 scale-95"
                                        enterTo="transform opacity-100 scale-100"
                                        leave="transition ease-in duration-75"
                                        leaveFrom="transform opacity-100 scale-100"
                                        leaveTo="transform opacity-0 scale-95"
                                    >
                                        <Menu.Items className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-100 z-50">
                                            <div className="px-4 py-2 border-b border-gray-100">
                                                <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                                <p className="text-xs text-gray-500">{user?.email}</p>
                                            </div>

                                            {userLinks.map((link) => (
                                                <Menu.Item key={link.path}>
                                                    {({ active }) => (
                                                        <Link
                                                            to={link.path}
                                                            className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                                                                }`}
                                                        >
                                                            {link.name}
                                                        </Link>
                                                    )}
                                                </Menu.Item>
                                            ))}

                                            {(isAdmin() || isStaff()) && (
                                                <>
                                                    <div className="border-t border-gray-100 my-1"></div>
                                                    {adminLinks.map((link) => (
                                                        <Menu.Item key={link.path}>
                                                            {({ active }) => (
                                                                <Link
                                                                    to={link.path}
                                                                    className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 text-blue-600' : 'text-gray-700'
                                                                        }`}
                                                                >
                                                                    {link.name}
                                                                </Link>
                                                            )}
                                                        </Menu.Item>
                                                    ))}
                                                </>
                                            )}

                                            <div className="border-t border-gray-100 my-1"></div>
                                            <Menu.Item>
                                                {({ active }) => (
                                                    <button
                                                        onClick={handleLogout}
                                                        className={`block w-full text-left px-4 py-2 text-sm ${active ? 'bg-gray-100 text-red-600' : 'text-red-600'
                                                            }`}
                                                    >
                                                        Logout
                                                    </button>
                                                )}
                                            </Menu.Item>
                                        </Menu.Items>
                                    </Transition>
                                </Menu>
                            ) : (
                                <div className="hidden md:flex items-center space-x-3">
                                    <Link to="/login" className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors">Login</Link>
                                    <Link to="/register" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">Sign Up</Link>
                                </div>
                            )}

                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="md:hidden p-2 text-gray-600 hover:text-blue-600 focus:outline-none"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    {isMobileMenuOpen ? (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                    ) : (
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                                    )}
                                </svg>
                            </button>
                        </div>
                    </div>

                    {/* Mobile Menu */}
                    {isMobileMenuOpen && (
                        <div className="md:hidden py-4 border-t border-gray-100">
                            {navLinks.map((link) => (
                                link.action ? (
                                    <button
                                        key={link.name}
                                        onClick={() => {
                                            link.action();
                                            setIsMobileMenuOpen(false);
                                        }}
                                        className="block py-2 px-2 text-gray-600 hover:text-blue-600 w-full text-left"
                                    >
                                        {link.name}
                                    </button>
                                ) : (
                                    <Link
                                        key={link.path}
                                        to={link.path}
                                        onClick={() => setIsMobileMenuOpen(false)}
                                        className={`block py-2 px-2 ${isActive(link.path)
                                            ? 'text-blue-600 font-semibold'
                                            : 'text-gray-600 hover:text-blue-600'
                                            }`}
                                    >
                                        {link.name}
                                    </Link>
                                )
                            ))}

                            {isAuthenticated ? (
                                <>
                                    <div className="border-t border-gray-100 my-2"></div>
                                    {userLinks.map((link) => (
                                        <Link
                                            key={link.path}
                                            to={link.path}
                                            onClick={() => setIsMobileMenuOpen(false)}
                                            className="block py-2 px-2 text-gray-600 hover:text-blue-600"
                                        >
                                            {link.name}
                                        </Link>
                                    ))}
                                    {(isAdmin() || isStaff()) && (
                                        <>
                                            <div className="border-t border-gray-100 my-2"></div>
                                            {adminLinks.map((link) => (
                                                <Link
                                                    key={link.path}
                                                    to={link.path}
                                                    onClick={() => setIsMobileMenuOpen(false)}
                                                    className="block py-2 px-2 text-gray-600 hover:text-blue-600"
                                                >
                                                    {link.name}
                                                </Link>
                                            ))}
                                        </>
                                    )}
                                    <div className="border-t border-gray-100 my-2"></div>
                                    <button onClick={handleLogout} className="block w-full text-left py-2 px-2 text-red-600 hover:bg-red-50 rounded">
                                        Logout
                                    </button>
                                </>
                            ) : (
                                <div className="flex flex-col space-y-2 mt-2">
                                    <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-center text-gray-600 hover:text-blue-600">Login</Link>
                                    <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700">Sign Up</Link>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </nav>

            {/* Price List Modal */}
            {showPriceList && (
                <div className="fixed inset-0 z-50 overflow-y-auto">
                    <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
                        <div className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" onClick={() => setShowPriceList(false)}></div>

                        <div className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
                            <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                                <div className="flex justify-between items-center mb-4">
                                    <h3 className="text-lg leading-6 font-medium text-gray-900">Service Price List</h3>
                                    <button
                                        onClick={() => setShowPriceList(false)}
                                        className="text-gray-400 hover:text-gray-500"
                                    >
                                        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                        </svg>
                                    </button>
                                </div>

                                {loading ? (
                                    <div className="flex justify-center py-12">
                                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                                    </div>
                                ) : (
                                    <div className="space-y-6 max-h-96 overflow-y-auto">
                                        {Object.keys(groupedServices).map((category) => (
                                            <div key={category}>
                                                <h4 className="text-md font-semibold text-blue-600 mb-2">{getCategoryLabel(category)}</h4>
                                                <div className="space-y-2">
                                                    {groupedServices[category].map((service) => (
                                                        <div key={service._id} className="flex justify-between items-center py-2 border-b border-gray-100">
                                                            <div>
                                                                <p className="font-medium text-gray-800">{service.name}</p>
                                                                <p className="text-xs text-gray-500">{service.processingTime}</p>
                                                            </div>
                                                            <div className="text-right">
                                                                {service.discountedPrice ? (
                                                                    <>
                                                                        <p className="text-lg font-bold text-blue-600">{formatPrice(service.discountedPrice)}</p>
                                                                        <p className="text-xs text-gray-400 line-through">{formatPrice(service.price)}</p>
                                                                    </>
                                                                ) : (
                                                                    <p className="text-lg font-bold text-blue-600">{formatPrice(service.price)}</p>
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                                <button
                                    type="button"
                                    onClick={() => setShowPriceList(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Close
                                </button>
                                <Link
                                    to="/services"
                                    onClick={() => setShowPriceList(false)}
                                    className="mt-3 w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none sm:ml-3 sm:w-auto sm:text-sm"
                                >
                                    Book Now
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};

export default Navbar;