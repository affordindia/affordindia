import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    FaUsers,
    FaBox,
    FaShoppingCart,
    FaRupeeSign,
    FaEye,
    FaSpinner,
    FaStar,
    FaImage,
    FaGift,
    FaExclamationTriangle,
} from "react-icons/fa";
import { getDashboardStats } from "../../api/dashboard.api";
import StatCard from "../../components/dashboard/StatCard";
import TodaysPerformance from "../../components/dashboard/TodaysPerformance";
import RecentOrders from "../../components/dashboard/RecentOrders";
import LowStockProducts from "../../components/dashboard/LowStockProducts";

const Dashboard = () => {
    const navigate = useNavigate();
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Fetch dashboard data
    const fetchDashboardData = async () => {
        setLoading(true);
        setError(null);

        try {
            const response = await getDashboardStats();

            if (response.success && response.data) {
                setStats(response.data);
            } else {
                setError(response.error || "Failed to fetch dashboard data");
            }
        } catch (err) {
            setError("Failed to load dashboard data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Format currency
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    // Loading state
    if (loading) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-admin-text font-montserrat">
                            Dashboard Overview
                        </h1>
                        <p className="mt-1 text-admin-text-secondary">
                            Loading dashboard data...
                        </p>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border"
                        >
                            <div className="animate-pulse">
                                <div className="h-4 bg-admin-border rounded w-24 mb-2"></div>
                                <div className="h-8 bg-admin-border rounded w-16 mb-2"></div>
                                <div className="h-4 bg-admin-border rounded w-20"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-admin-text font-montserrat">
                            Dashboard Overview
                        </h1>
                        <p className="mt-1 text-admin-text-secondary">
                            Unable to load dashboard data
                        </p>
                    </div>
                </div>

                <div className="bg-admin-card rounded-xl p-8 border border-admin-error text-center">
                    <FaExclamationTriangle className="w-12 h-12 text-admin-error mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-admin-text mb-2">
                        Error Loading Data
                    </h3>
                    <p className="text-admin-text-secondary mb-4">{error}</p>
                    <button
                        onClick={fetchDashboardData}
                        className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

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
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-admin-text-secondary bg-admin-card border border-admin-border rounded-lg hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-50"
                    >
                        <FaEye className="w-4 h-4 mr-2" />
                        View Report
                    </button>
                    <button
                        onClick={fetchDashboardData}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-admin-primary rounded-lg hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? (
                            <>
                                <FaSpinner className="w-4 h-4 mr-2 animate-spin" />
                                Loading...
                            </>
                        ) : (
                            "Refresh Data"
                        )}
                    </button>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Total Users"
                    value={stats?.overview?.totalUsers?.toLocaleString() || "0"}
                    icon={FaUsers}
                    color="bg-blue-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/users")}
                />
                <StatCard
                    title="Total Products"
                    value={
                        stats?.overview?.totalProducts?.toLocaleString() || "0"
                    }
                    icon={FaBox}
                    color="bg-green-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/products")}
                />
                <StatCard
                    title="Total Orders"
                    value={
                        stats?.overview?.totalOrders?.toLocaleString() || "0"
                    }
                    icon={FaShoppingCart}
                    growth={stats?.thisMonth?.orderGrowthPercent}
                    color="bg-purple-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/orders")}
                />
                <StatCard
                    title="Total Revenue"
                    value={formatCurrency(stats?.overview?.totalRevenue || 0)}
                    icon={FaRupeeSign}
                    color="bg-indigo-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/orders")}
                />
            </div>

            {/* Secondary Stats Row */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    title="Customer Reviews"
                    value={
                        stats?.overview?.totalReviews?.toLocaleString() || "0"
                    }
                    icon={FaStar}
                    color="bg-yellow-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/reviews")}
                />
                <StatCard
                    title="Active Banners"
                    value={
                        stats?.overview?.activeBanners?.toLocaleString() || "0"
                    }
                    icon={FaImage}
                    color="bg-pink-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/banners")}
                />
                <StatCard
                    title="Active Coupons"
                    value={
                        stats?.overview?.activeCoupons?.toLocaleString() || "0"
                    }
                    icon={FaGift}
                    color="bg-teal-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/coupons")}
                />
                <StatCard
                    title="Low Stock Alert"
                    value={
                        stats?.overview?.lowStockCount?.toLocaleString() || "0"
                    }
                    icon={FaExclamationTriangle}
                    color="bg-red-500"
                    loading={loading}
                    clickable={true}
                    onClick={() => navigate("/products?filter=lowStock")}
                />
            </div>

            {/* Today's Performance */}
            <TodaysPerformance stats={stats} formatCurrency={formatCurrency} />

            {/* Recent Activity */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <RecentOrders stats={stats} formatCurrency={formatCurrency} />
                <LowStockProducts stats={stats} />
            </div>
        </div>
    );
};

export default Dashboard;
