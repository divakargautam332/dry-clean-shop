import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const AdminHeader = ({ toggleSidebar }) => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const [showUserMenu, setShowUserMenu] = useState(false);
    const [showNotifications, setShowNotifications] = useState(false);
    const menuRef = useRef(null);
    const notificationRef = useRef(null);

    const notifications = [
        { id: 1, title: 'New Order', message: 'Order #DRY202412010001 has been placed', time: '5 min ago', read: false },
        { id: 2, title: 'Payment Received', message: 'Payment of ₹499 received for order #DRY202411300045', time: '1 hour ago', read: false },
        { id: 3, title: 'Order Delivered', message: 'Order #DRY202411290123 was delivered successfully', time: '2 hours ago', read: true },
        { id: 4, title: 'New Review', message: 'Customer left a 5-star review for Dry Clean Service', time: '5 hours ago', read: true },
    ];

    const unreadCount = notifications.filter(n => !n.read).length;

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setShowUserMenu(false);
            }
            if (notificationRef.current && !notificationRef.current.contains(event.target)) {
                setShowNotifications(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name?.charAt(0).toUpperCase() || 'A';
    };

    return (
        <header className="bg-white border-b border-gray-200 sticky top-0 z-30">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex items-center justify-between h-16">
                    {/* Left side - Menu button */}
                    <div className="flex items-center">
                        <button
                            onClick={toggleSidebar}
                            className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            </svg>
                        </button>

                        {/* Page Title */}
                        <div className="ml-4">
                            <h1 className="text-xl font-semibold text-gray-800 hidden sm:block">
                                Admin Dashboard
                            </h1>
                        </div>
                    </div>

                    {/* Right side - Actions */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative" ref={notificationRef}>
                            <button
                                onClick={() => setShowNotifications(!showNotifications)}
                                className="p-2 rounded-lg text-gray-500 hover:bg-gray-100 hover:text-gray-600 focus:outline-none relative"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                </svg>
                                {unreadCount > 0 && (
                                    <span className="absolute top-1 right-1 w-4 h-4 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                                        {unreadCount}
                                    </span>
                                )}
                            </button>

                            {/* Notifications Dropdown */}
                            {showNotifications && (
                                <div className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-3 border-b border-gray-100">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-semibold text-gray-800">Notifications</h3>
                                            <button className="text-xs text-blue-600 hover:text-blue-700">
                                                Mark all as read
                                            </button>
                                        </div>
                                    </div>
                                    <div className="max-h-96 overflow-y-auto">
                                        {notifications.map((notification) => (
                                            <div
                                                key={notification.id}
                                                className={`p-3 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${!notification.read ? 'bg-blue-50' : ''
                                                    }`}
                                            >
                                                <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                                                <p className="text-xs text-gray-500 mt-1">{notification.message}</p>
                                                <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                                            </div>
                                        ))}
                                    </div>
                                    <div className="p-3 text-center border-t border-gray-100">
                                        <Link to="/admin/notifications" className="text-sm text-blue-600 hover:text-blue-700">
                                            View all notifications
                                        </Link>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* User Menu */}
                        <div className="relative" ref={menuRef}>
                            <button
                                onClick={() => setShowUserMenu(!showUserMenu)}
                                className="flex items-center space-x-3 focus:outline-none"
                            >
                                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                                    {getInitials(user?.name)}
                                </div>
                                <span className="hidden md:block text-sm font-medium text-gray-700">
                                    {user?.name}
                                </span>
                                <svg className="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </button>

                            {/* User Dropdown */}
                            {showUserMenu && (
                                <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
                                    <div className="p-3 border-b border-gray-100">
                                        <p className="text-sm font-semibold text-gray-800">{user?.name}</p>
                                        <p className="text-xs text-gray-500">{user?.email}</p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/admin/profile"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            Profile Settings
                                        </Link>
                                        <Link
                                            to="/"
                                            className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                            onClick={() => setShowUserMenu(false)}
                                        >
                                            View Website
                                        </Link>
                                        <hr className="my-1" />
                                        <button
                                            onClick={handleLogout}
                                            className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-gray-100"
                                        >
                                            Logout
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default AdminHeader;