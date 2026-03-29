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

    // Handle scroll effect
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/');
        setIsMobileMenuOpen(false);
    };

    const navLinks = [
        { name: 'Home', path: '/' },
        { name: 'Services', path: '/services' },
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
        return location.pathname.startsWith(path);
    };

    return (
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
                                        {/* User Info */}
                                        <div className="px-4 py-2 border-b border-gray-100">
                                            <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                            <p className="text-xs text-gray-500">{user?.email}</p>
                                        </div>

                                        {/* User Links */}
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

                                        {/* Admin Links */}
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
                                <Link
                                    to="/login"
                                    className="px-4 py-2 text-gray-600 hover:text-blue-600 transition-colors"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}

                        {/* Mobile Menu Button */}
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
                        {/* Mobile Navigation Links */}
                        {navLinks.map((link) => (
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
                                <button
                                    onClick={handleLogout}
                                    className="block w-full text-left py-2 px-2 text-red-600 hover:bg-red-50 rounded"
                                >
                                    Logout
                                </button>
                            </>
                        ) : (
                            <div className="flex flex-col space-y-2 mt-2">
                                <Link
                                    to="/login"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2 text-center text-gray-600 hover:text-blue-600"
                                >
                                    Login
                                </Link>
                                <Link
                                    to="/register"
                                    onClick={() => setIsMobileMenuOpen(false)}
                                    className="px-4 py-2 text-center bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                                >
                                    Sign Up
                                </Link>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </nav>
    );
};

export default Navbar;