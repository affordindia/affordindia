import React from "react";
import AnalyticsCard from "./AnalyticsCard";

const RevenueChart = ({ data, loading = false, timeframe = "month" }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const formatTimeLabel = (date, timeframe) => {
        const d = new Date(date);
        if (timeframe === "day") {
            return d.toLocaleDateString("en-IN", {
                month: "short",
                day: "numeric",
            });
        } else if (timeframe === "week") {
            return `Week ${Math.ceil(d.getDate() / 7)}`;
        } else {
            return d.toLocaleDateString("en-IN", { month: "short" });
        }
    };

    const getMaxValue = () => {
        if (!data?.chartData?.length) return 100;
        return Math.max(...data.chartData.map((item) => item.revenue)) * 1.1;
    };

    const maxValue = getMaxValue();

    if (loading) {
        return (
            <AnalyticsCard title="Revenue Trend">
                <div className="animate-pulse">
                    <div className="h-64 bg-admin-border rounded"></div>
                </div>
            </AnalyticsCard>
        );
    }

    if (!data?.chartData?.length) {
        return (
            <AnalyticsCard title="Revenue Trend">
                <div className="flex items-center justify-center h-64 text-admin-text-secondary">
                    No revenue data available
                </div>
            </AnalyticsCard>
        );
    }

    return (
        <AnalyticsCard title="Revenue Trend">
            <div className="space-y-4">
                {/* Summary Stats */}
                <div className="grid grid-cols-3 gap-4">
                    <div className="text-center">
                        <p className="text-2xl font-bold text-admin-text">
                            {formatCurrency(data.totalRevenue || 0)}
                        </p>
                        <p className="text-sm text-admin-text-secondary">
                            Total Revenue
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-admin-text">
                            {formatCurrency(data.averageOrderValue || 0)}
                        </p>
                        <p className="text-sm text-admin-text-secondary">
                            Avg Order Value
                        </p>
                    </div>
                    <div className="text-center">
                        <p className="text-2xl font-bold text-admin-text">
                            {data.totalOrders || 0}
                        </p>
                        <p className="text-sm text-admin-text-secondary">
                            Total Orders
                        </p>
                    </div>
                </div>

                {/* Chart */}
                <div className="h-64 flex items-end justify-between space-x-1 border-b border-admin-border pb-4">
                    {data.chartData.map((item, index) => (
                        <div
                            key={index}
                            className="flex flex-col items-center flex-1"
                        >
                            <div
                                className="bg-gradient-to-t from-admin-primary to-admin-primary-light rounded-t w-full min-h-1 transition-all duration-300 hover:opacity-80"
                                style={{
                                    height: `${
                                        (item.revenue / maxValue) * 240
                                    }px`,
                                    minHeight: "4px",
                                }}
                                title={`${formatTimeLabel(
                                    item.date,
                                    timeframe
                                )}: ${formatCurrency(item.revenue)}`}
                            ></div>
                            <span className="text-xs text-admin-text-secondary mt-2 transform -rotate-45 origin-left">
                                {formatTimeLabel(item.date, timeframe)}
                            </span>
                        </div>
                    ))}
                </div>

                {/* Growth indicator */}
                {data.growthRate !== undefined && (
                    <div className="flex items-center justify-center">
                        <span
                            className={`text-sm font-medium ${
                                data.growthRate >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                            }`}
                        >
                            {data.growthRate >= 0 ? "↗" : "↘"}{" "}
                            {Math.abs(data.growthRate).toFixed(1)}% growth
                        </span>
                    </div>
                )}
            </div>
        </AnalyticsCard>
    );
};

export default RevenueChart;
