import React, { useState, useEffect } from "react";
import {
    FaChartLine,
    FaRupeeSign,
    FaShoppingCart,
    FaUsers,
    FaBox,
    FaCalendarAlt,
    FaDownload,
    FaSync,
} from "react-icons/fa";
import {
    getAnalyticsData,
    getRevenueAnalytics,
    getSalesAnalytics,
    getTopPerformingProducts,
    getCustomerAnalytics,
    getOrderAnalytics,
} from "../../api/analytics.api";
import MetricCard from "../../components/analytics/MetricCard";
import AnalyticsCard from "../../components/analytics/AnalyticsCard";
import RevenueChart from "../../components/analytics/RevenueChart";
import SalesBreakdown from "../../components/analytics/SalesBreakdown";
import TopProducts from "../../components/analytics/TopProducts";
import CustomerAnalytics from "../../components/analytics/CustomerAnalytics";
import AnalyticsLoader from "../../components/analytics/AnalyticsLoader";
import { exportToCSV, formatAnalyticsForExport } from "../../utils/exportUtils";

const Analytics = () => {
    const [timeframe, setTimeframe] = useState("month");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Data states
    const [overviewData, setOverviewData] = useState(null);
    const [revenueData, setRevenueData] = useState(null);
    const [salesData, setSalesData] = useState(null);
    const [topProductsData, setTopProductsData] = useState(null);
    const [customerData, setCustomerData] = useState(null);
    const [orderData, setOrderData] = useState(null);

    const timeframeOptions = [
        { value: "day", label: "Last 7 Days" },
        { value: "week", label: "Last 4 Weeks" },
        { value: "month", label: "Last 12 Months" },
        { value: "year", label: "Last 3 Years" },
    ];

    const fetchAnalyticsData = async () => {
        setLoading(true);
        setError(null);

        try {
            const [
                overviewResult,
                revenueResult,
                salesResult,
                topProductsResult,
                customerResult,
                orderResult,
            ] = await Promise.all([
                getAnalyticsData(timeframe),
                getRevenueAnalytics(timeframe),
                getSalesAnalytics(timeframe),
                getTopPerformingProducts(10, timeframe),
                getCustomerAnalytics(timeframe),
                getOrderAnalytics(timeframe),
            ]);

            if (overviewResult.success) setOverviewData(overviewResult.data);
            if (revenueResult.success) setRevenueData(revenueResult.data);
            if (salesResult.success) setSalesData(salesResult.data);
            if (topProductsResult.success)
                setTopProductsData(topProductsResult.data);
            if (customerResult.success) setCustomerData(customerResult.data);
            if (orderResult.success) setOrderData(orderResult.data);

            // If any critical requests failed, show error
            if (!overviewResult.success && !revenueResult.success) {
                setError("Failed to load analytics data");
            }
        } catch (err) {
            setError("Failed to load analytics data");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalyticsData();
    }, [timeframe]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const exportData = () => {
        const analyticsData = {
            overview: overviewData,
            revenue: revenueData,
            topProducts: topProductsData,
            customers: customerData,
        };

        const exportFormats = formatAnalyticsForExport(
            analyticsData,
            timeframe
        );

        // Export overview data
        if (exportFormats.overview.data.length > 0) {
            exportToCSV(
                exportFormats.overview.data,
                exportFormats.overview.filename
            );
        }

        // You can add more export options here
        // exportToCSV(exportFormats.revenue.data, exportFormats.revenue.filename);
        // exportToCSV(exportFormats.topProducts.data, exportFormats.topProducts.filename);
    };

    if (loading) {
        return <AnalyticsLoader />;
    }

    if (error) {
        return (
            <div className="space-y-6">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
                    <div>
                        <h1 className="text-3xl font-bold text-admin-text font-montserrat">
                            Analytics Dashboard
                        </h1>
                        <p className="mt-1 text-admin-text-secondary">
                            Unable to load analytics data
                        </p>
                    </div>
                </div>
                <div className="bg-admin-card rounded-xl p-8 border border-admin-error text-center">
                    <h3 className="text-lg font-semibold text-admin-text mb-2">
                        Error Loading Data
                    </h3>
                    <p className="text-admin-text-secondary mb-4">{error}</p>
                    <button
                        onClick={fetchAnalyticsData}
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
                        Analytics Dashboard
                    </h1>
                    <p className="mt-1 text-admin-text-secondary">
                        Comprehensive business analytics and insights
                    </p>
                </div>
                <div className="flex items-center space-x-3 mt-4 sm:mt-0">
                    {/* Timeframe Selector */}
                    <select
                        value={timeframe}
                        onChange={(e) => setTimeframe(e.target.value)}
                        className="px-4 py-2 text-sm border border-admin-border rounded-lg bg-admin-card text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary"
                    >
                        {timeframeOptions.map((option) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </select>

                    <button
                        onClick={exportData}
                        className="flex items-center px-4 py-2 text-sm font-medium text-admin-text-secondary bg-admin-card border border-admin-border rounded-lg hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200"
                    >
                        <FaDownload className="w-4 h-4 mr-2" />
                        Export
                    </button>

                    <button
                        onClick={fetchAnalyticsData}
                        disabled={loading}
                        className="flex items-center px-4 py-2 text-sm font-medium text-white bg-admin-primary rounded-lg hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <FaSync
                            className={`w-4 h-4 mr-2 ${
                                loading ? "animate-spin" : ""
                            }`}
                        />
                        Refresh
                    </button>
                </div>
            </div>

            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricCard
                    title="Total Revenue"
                    value={overviewData?.totalRevenue || 0}
                    change={overviewData?.revenueGrowth}
                    icon={FaRupeeSign}
                    iconColor="bg-green-500"
                    loading={loading}
                />
                <MetricCard
                    title="Total Orders"
                    value={overviewData?.totalOrders || 0}
                    change={overviewData?.ordersGrowth}
                    icon={FaShoppingCart}
                    iconColor="bg-blue-500"
                    loading={loading}
                />
                <MetricCard
                    title="Total Customers"
                    value={overviewData?.totalCustomers || 0}
                    change={overviewData?.customersGrowth}
                    icon={FaUsers}
                    iconColor="bg-purple-500"
                    loading={loading}
                />
                <MetricCard
                    title="Products Sold"
                    value={overviewData?.productsSold || 0}
                    change={overviewData?.productsSoldGrowth}
                    icon={FaBox}
                    iconColor="bg-orange-500"
                    loading={loading}
                />
            </div>

            {/* Revenue Section */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2">
                    <RevenueChart
                        data={revenueData}
                        loading={loading}
                        timeframe={timeframe}
                    />
                </div>
                <div>
                    <SalesBreakdown data={salesData} loading={loading} />
                </div>
            </div>

            {/* Products and Customers Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <TopProducts data={topProductsData} loading={loading} />
                <CustomerAnalytics data={customerData} loading={loading} />
            </div>

            {/* Additional Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <AnalyticsCard title="Conversion Metrics">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Conversion Rate
                            </span>
                            <span className="font-semibold text-admin-text">
                                {(
                                    (overviewData?.conversionRate || 0) * 100
                                ).toFixed(1)}
                                %
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Avg Order Value
                            </span>
                            <span className="font-semibold text-admin-text">
                                {formatCurrency(
                                    overviewData?.avgOrderValue || 0
                                )}
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Customer Lifetime Value
                            </span>
                            <span className="font-semibold text-admin-text">
                                {formatCurrency(
                                    overviewData?.customerLifetimeValue || 0
                                )}
                            </span>
                        </div>
                    </div>
                </AnalyticsCard>

                <AnalyticsCard title="Order Status Distribution">
                    <div className="space-y-3">
                        {orderData?.statusDistribution?.map((status, index) => {
                            const total = orderData.statusDistribution.reduce(
                                (sum, s) => sum + s.count,
                                0
                            );
                            const percentage =
                                total > 0 ? (status.count / total) * 100 : 0;
                            return (
                                <div
                                    key={index}
                                    className="flex justify-between items-center"
                                >
                                    <span className="text-admin-text-secondary capitalize">
                                        {status.status}
                                    </span>
                                    <div className="text-right">
                                        <span className="font-semibold text-admin-text">
                                            {status.count}
                                        </span>
                                        <span className="text-xs text-admin-text-secondary ml-2">
                                            ({percentage.toFixed(1)}%)
                                        </span>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </AnalyticsCard>

                <AnalyticsCard title="Growth Indicators">
                    <div className="space-y-4">
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Revenue Growth
                            </span>
                            <span
                                className={`font-semibold ${
                                    (overviewData?.revenueGrowth || 0) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {(overviewData?.revenueGrowth || 0) >= 0
                                    ? "+"
                                    : ""}
                                {(overviewData?.revenueGrowth || 0).toFixed(1)}%
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Customer Growth
                            </span>
                            <span
                                className={`font-semibold ${
                                    (overviewData?.customersGrowth || 0) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {(overviewData?.customersGrowth || 0) >= 0
                                    ? "+"
                                    : ""}
                                {(overviewData?.customersGrowth || 0).toFixed(
                                    1
                                )}
                                %
                            </span>
                        </div>
                        <div className="flex justify-between items-center">
                            <span className="text-admin-text-secondary">
                                Order Growth
                            </span>
                            <span
                                className={`font-semibold ${
                                    (overviewData?.ordersGrowth || 0) >= 0
                                        ? "text-green-600"
                                        : "text-red-600"
                                }`}
                            >
                                {(overviewData?.ordersGrowth || 0) >= 0
                                    ? "+"
                                    : ""}
                                {(overviewData?.ordersGrowth || 0).toFixed(1)}%
                            </span>
                        </div>
                    </div>
                </AnalyticsCard>
            </div>
        </div>
    );
};

export default Analytics;
