import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaUser,
    FaSignOutAlt,
    FaBell,
    FaSearch,
    FaBars,
    FaTimes,
} from "react-icons/fa";
import { useAuth } from "../../context/AuthContext.jsx";
import NavLogo from "../../assets/NavLogo.png";

const AdminNavbar = ({ toggleSidebar, sidebarOpen }) => {
    const { admin, logout } = useAuth();
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const [notificationOpen, setNotificationOpen] = useState(false);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <nav className="bg-admin-navbar border-b border-admin-border fixed w-full top-0 z-50">
            <div className="px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between items-center h-16">
                    {/* Left side */}
                    <div className="flex items-center space-x-4">
                        {/* Mobile hamburger button - only visible on mobile */}
                        <button
                            onClick={toggleSidebar}
                            className="lg:hidden p-2 rounded-lg text-admin-text-secondary hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200"
                            aria-label="Toggle sidebar"
                        >
                            {sidebarOpen ? (
                                <FaTimes className="w-5 h-5" />
                            ) : (
                                <FaBars className="w-5 h-5" />
                            )}
                        </button>

                        <div className="flex items-center space-x-3">
                            <img
                                src={NavLogo}
                                alt="AffordIndia Logo"
                                className="h-8 w-auto"
                            />
                            <span className="text-xl font-semibold text-admin-text font-montserrat">
                                The <i>I-AM-THE-BOSS</i> Panel
                            </span>
                        </div>
                    </div>

                    {/* Center - Search */}
                    <div className="hidden md:flex items-center flex-1 max-w-md mx-8">
                        <div className="relative w-full">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent bg-admin-card text-admin-text placeholder:text-admin-text-muted"
                            />
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                        </div>
                    </div>

                    {/* Right side */}
                    <div className="flex items-center space-x-4">
                        {/* Notifications */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setNotificationOpen(!notificationOpen)
                                }
                                className="p-2 rounded-lg text-admin-text-secondary hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 relative"
                            >
                                <FaBell className="w-5 h-5" />
                                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">
                                    3
                                </span>
                            </button>

                            {/* Notification Dropdown */}
                            {notificationOpen && (
                                <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-4 border-b border-gray-200">
                                        <h3 className="text-sm font-semibold text-gray-900">
                                            Notifications
                                        </h3>
                                    </div>
                                    <div className="max-h-64 overflow-y-auto">
                                        <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                                            <p className="text-sm text-gray-800">
                                                New order received
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                2 minutes ago
                                            </p>
                                        </div>
                                        <div className="p-4 hover:bg-gray-50 border-b border-gray-100">
                                            <p className="text-sm text-gray-800">
                                                Low stock alert: Product ABC
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                1 hour ago
                                            </p>
                                        </div>
                                        <div className="p-4 hover:bg-gray-50">
                                            <p className="text-sm text-gray-800">
                                                New review submitted
                                            </p>
                                            <p className="text-xs text-gray-500 mt-1">
                                                3 hours ago
                                            </p>
                                        </div>
                                    </div>
                                    <div className="p-3 border-t border-gray-200">
                                        <button className="text-sm text-admin-primary hover:text-admin-primary-dark font-medium transition-colors">
                                            View all notifications
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Profile Dropdown */}
                        <div className="relative">
                            <button
                                onClick={() =>
                                    setProfileDropdownOpen(!profileDropdownOpen)
                                }
                                className="flex items-center space-x-2 p-2 rounded-lg text-admin-text-secondary hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200"
                            >
                                <div className="w-8 h-8 bg-admin-primary rounded-full flex items-center justify-center">
                                    <FaUser className="w-4 h-4 text-white" />
                                </div>
                                <span className="hidden md:block text-sm font-medium">
                                    {admin?.name || "Admin"}
                                </span>
                            </button>

                            {/* Profile Dropdown Menu */}
                            {profileDropdownOpen && (
                                <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
                                    <div className="p-3 border-b border-gray-200">
                                        <p className="text-sm font-medium text-gray-900">
                                            {admin?.name || "Admin User"}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                            {admin?.email ||
                                                "admin@affordindia.com"}
                                        </p>
                                    </div>
                                    <div className="py-1">
                                        <Link
                                            to="/profile"
                                            className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                                            onClick={() =>
                                                setProfileDropdownOpen(false)
                                            }
                                        >
                                            <FaUser className="mr-3 w-4 h-4" />
                                            Profile Settings
                                        </Link>
                                        <button
                                            onClick={handleLogout}
                                            className="flex items-center w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                                        >
                                            <FaSignOutAlt className="mr-3 w-4 h-4" />
                                            Sign Out
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavbar;
