import React from "react";
import { NavLink, useLocation } from "react-router-dom";
import {
    FaHome,
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaStar,
    FaTags,
    FaImage,
    FaTicketAlt,
    FaCog,
    FaChartLine,
    FaLock,
} from "react-icons/fa";
import { useRBAC } from "../../context/RBACContext";

const AdminSidebar = ({ sidebarOpen, closeSidebar }) => {
    // RBAC permission mapping for each tab
    // Add required permission keys for each tab as needed
    const { hasPermission } = useRBAC();

    const menuPermissions = {
        Users: "users.view",
        Products: "products.view",
        Orders: "orders.view",
        Reviews: "reviews.view",
        Categories: "categories.view",
        Banners: "banners.view",
        Coupons: "coupons.view",
        Analytics: "analytics.view",
        Settings: "settings.view",
        Dashboard: null, // always allowed
    };
    const location = useLocation();

    const menuItems = [
        {
            label: "Dashboard",
            path: "/dashboard",
            icon: FaHome,
        },
        {
            label: "Analytics",
            path: "/analytics",
            icon: FaChartLine,
        },
        {
            label: "Users",
            path: "/users",
            icon: FaUsers,
        },
        {
            label: "Products",
            path: "/products",
            icon: FaBox,
        },
        {
            label: "Orders",
            path: "/orders",
            icon: FaShoppingCart,
        },
        {
            label: "Reviews",
            path: "/reviews",
            icon: FaStar,
        },
        {
            label: "Categories",
            path: "/categories",
            icon: FaTags,
        },
        {
            label: "Banners",
            path: "/banners",
            icon: FaImage,
        },
        {
            label: "Coupons",
            path: "/coupons",
            icon: FaTicketAlt,
        },
        {
            label: "Settings",
            path: "/settings",
            icon: FaCog,
        },
    ];

    const getLinkClasses = (path) => {
        const isActive =
            location.pathname === path ||
            (path === "/dashboard" && location.pathname === "/");

        return `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
            isActive
                ? "bg-admin-primary text-white shadow-admin-md"
                : "text-admin-text-secondary hover:bg-admin-primary-bg hover:text-admin-primary"
        }`;
    };

    return (
        <>
            {/* Overlay for mobile - starts below navbar */}
            {sidebarOpen && (
                <div
                    className="fixed inset-0 top-16 bg-black bg-opacity-50 z-30 lg:hidden"
                    onClick={closeSidebar}
                ></div>
            )}

            {/* Sidebar - Positioned below navbar */}
            <aside
                className={`fixed left-0 top-16 z-40 w-64 h-[calc(100vh-4rem)] transition-transform duration-300 ease-in-out bg-white border-r border-admin-border shadow-lg ${
                    sidebarOpen ? "translate-x-0" : "-translate-x-full"
                } lg:translate-x-0`}
            >
                <div className="h-full flex flex-col">
                    {/* Navigation Menu */}
                    <nav className="flex-1 px-4 pt-6 pb-6 space-y-1 overflow-y-auto">
                        {menuItems.map((item) => {
                            const Icon = item.icon;
                            const requiredPerm = menuPermissions[item.label];
                            const isAllowed =
                                !requiredPerm || hasPermission(requiredPerm);
                            return (
                                <div key={item.path}>
                                    {isAllowed ? (
                                        <NavLink
                                            to={item.path}
                                            className={getLinkClasses(
                                                item.path
                                            )}
                                            onClick={() => {
                                                if (window.innerWidth < 1024) {
                                                    closeSidebar();
                                                }
                                            }}
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.label}
                                        </NavLink>
                                    ) : (
                                        <div
                                            className="flex items-center px-4 py-3 text-sm font-medium rounded-lg bg-admin-bg text-admin-text cursor-not-allowed opacity-60"
                                            title="Access Denied"
                                        >
                                            <Icon className="w-5 h-5 mr-3" />
                                            {item.label}
                                            <FaLock className="ml-auto w-4 h-4 text-admin-text" />
                                        </div>
                                    )}
                                </div>
                            );
                        })}
                    </nav>

                    {/* Footer */}
                    {/* <div className="p-4 border-t border-admin-border">
                        <div className="bg-gradient-to-r from-admin-primary to-admin-primary-light rounded-lg p-4 text-white">
                            <h3 className="text-sm font-semibold mb-2">
                                Need Help?
                            </h3>
                            <p className="text-xs opacity-90 mb-3">
                                Check our documentation or contact support.
                            </p>
                            <button className="bg-white text-admin-primary text-xs px-3 py-1 rounded-md font-medium hover:bg-gray-100 transition-colors duration-200">
                                Get Help
                            </button>
                        </div>
                    </div> */}
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
