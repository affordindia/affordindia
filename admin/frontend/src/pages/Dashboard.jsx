import React from "react";
import {
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaRupeeSign,
    FaEye,
} from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const Dashboard = () => {
    // Mock data for demonstration
    const stats = {
        totalUsers: 1234,
        totalProducts: 567,
        totalOrders: 890,
        totalRevenue: 123456,
        userGrowth: 12.5,
        productGrowth: 8.3,
        orderGrowth: 15.7,
        revenueGrowth: -2.1,
    };

    const StatCard = ({ title, value, icon: Icon, growth, color }) => (
        <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border hover:shadow-admin-md transition-all duration-200">
            <div className="flex items-center justify-between">
                <div>
                    <p className="text-sm font-medium text-admin-text-secondary mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-admin-text">
                        {value}
                    </p>
                    {growth !== undefined && (
                        <div className="flex items-center mt-2">
                            {growth >= 0 ? (
                                <FaArrowTrendUp className="w-4 h-4 text-admin-success mr-1" />
                            ) : (
                                <FaArrowTrendDown className="w-4 h-4 text-admin-error mr-1" />
                            )}
                            <span
                                className={`text-sm font-medium ${
                                    growth >= 0
                                        ? "text-admin-success"
                                        : "text-admin-error"
                                }`}
                            >
                                {Math.abs(growth)}%
                            </span>
                            <span className="text-sm text-admin-text-muted ml-1">
                                vs last month
                            </span>
                        </div>
                    )}
                </div>
                <div className={`p-3 rounded-full ${color}`}>
                    <Icon className="w-6 h-6 text-white" />
                </div>
            </div>
        </div>
    );

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                <div>
                    <h1 className="text-3xl font-bold text-admin-text font-montserrat">
                        Dashboard Overview
                    </h1>
                    <p className="mt-1 text-admin-text-secondary">
                        Welcome back! Here's what's happening with your store.
                    </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    <button className="flex items-center px-4 py-2 text-sm font-medium text-admin-text-secondary bg-admin-card border border-admin-border rounded-lg hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200">
                        <FaEye className="w-4 h-4 mr-2" />
                        View Report
                    </button>
                    <button className="px-4 py-2 text-sm font-medium text-white bg-admin-primary rounded-lg hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200">
                        Refresh Data
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers.toLocaleString()}
                    icon={FaUsers}
                    growth={stats.userGrowth}
                    color="bg-blue-500"
                />
                <StatCard
                    title="Total Products"
                    value={stats.totalProducts.toLocaleString()}
                    icon={FaBox}
                    growth={stats.productGrowth}
                    color="bg-green-500"
                />
                <StatCard
                    title="Total Orders"
                    value={stats.totalOrders.toLocaleString()}
                    icon={FaShoppingCart}
                    growth={stats.orderGrowth}
                    color="bg-purple-500"
                />
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.totalRevenue.toLocaleString()}`}
                    icon={FaRupeeSign}
                    growth={stats.revenueGrowth}
                    color="bg-admin-primary"
                />
            </div>

            {/* Placeholder for Charts and Tables */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Recent Orders */}
                <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-admin-text">
                            Recent Orders
                        </h2>
                        <button className="text-sm text-admin-primary hover:text-admin-primary-dark font-medium transition-colors">
                            View All
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                            <div>
                                <p className="font-medium text-admin-text">
                                    #ORD-001
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    John Doe - ₹2,499
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-success-light text-admin-success">
                                Completed
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                            <div>
                                <p className="font-medium text-admin-text">
                                    #ORD-002
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Jane Smith - ₹1,799
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-warning-light text-admin-warning">
                                Processing
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                            <div>
                                <p className="font-medium text-admin-text">
                                    #ORD-003
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Mike Johnson - ₹3,299
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-info-light text-admin-info">
                                Shipped
                            </span>
                        </div>
                    </div>
                </div>

                {/* Low Stock Products */}
                <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold text-admin-text">
                            Low Stock Alert
                        </h2>
                        <button className="text-sm text-admin-primary hover:text-admin-primary-dark font-medium transition-colors">
                            Manage Inventory
                        </button>
                    </div>
                    <div className="space-y-3">
                        <div className="flex items-center justify-between p-3 bg-admin-error-light rounded-lg border border-admin-error">
                            <div>
                                <p className="font-medium text-admin-text">
                                    Silver Bracelet
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Only 3 left in stock
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-error-light text-admin-error">
                                Low Stock
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-admin-warning-light rounded-lg border border-admin-warning">
                            <div>
                                <p className="font-medium text-admin-text">
                                    Gold Necklace
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    Only 5 left in stock
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-warning-light text-admin-warning">
                                Low Stock
                            </span>
                        </div>
                        <div className="flex items-center justify-between p-3 bg-admin-bg rounded-lg">
                            <div>
                                <p className="font-medium text-admin-text">
                                    Diamond Ring
                                </p>
                                <p className="text-sm text-admin-text-secondary">
                                    2 left in stock
                                </p>
                            </div>
                            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-admin-error-light text-admin-error">
                                Critical
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Coming Soon Section */}
            <div className="bg-admin-card rounded-xl p-8 shadow-admin-sm border border-admin-border text-center">
                <h3 className="text-xl font-semibold text-admin-text mb-2">
                    Advanced Analytics Coming Soon
                </h3>
                <p className="text-admin-text-secondary mb-4">
                    We're working on detailed charts, reports, and insights to
                    help you make better business decisions.
                </p>
                <div className="flex justify-center space-x-4">
                    <div className="text-center">
                        <div className="w-16 h-16 bg-admin-info-light rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">📊</span>
                        </div>
                        <p className="text-sm text-admin-text-secondary">
                            Sales Charts
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-admin-success-light rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">📈</span>
                        </div>
                        <p className="text-sm text-admin-text-secondary">
                            Growth Reports
                        </p>
                    </div>
                    <div className="text-center">
                        <div className="w-16 h-16 bg-admin-primary-light rounded-full flex items-center justify-center mx-auto mb-2">
                            <span className="text-2xl">🎯</span>
                        </div>
                        <p className="text-sm text-admin-text-secondary">
                            Customer Insights
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
