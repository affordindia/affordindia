import React from "react";
import AnalyticsCard from "./AnalyticsCard";

const SalesBreakdown = ({ data, loading = false }) => {
    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const getStatusColor = (status) => {
        const colors = {
            delivered: "bg-green-500",
            processing: "bg-blue-500",
            shipped: "bg-purple-500",
            pending: "bg-yellow-500",
            cancelled: "bg-red-500",
            returned: "bg-orange-500",
        };
        return colors[status] || "bg-gray-500";
    };

    if (loading) {
        return (
            <AnalyticsCard title="Sales Breakdown">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4].map((i) => (
                        <div
                            key={i}
                            className="h-6 bg-admin-border rounded"
                        ></div>
                    ))}
                </div>
            </AnalyticsCard>
        );
    }

    const totalValue =
        data?.byStatus?.reduce((sum, item) => sum + item.value, 0) || 0;

    return (
        <AnalyticsCard title="Sales Breakdown">
            <div className="space-y-6">
                {/* By Status */}
                <div>
                    <h4 className="text-sm font-medium text-admin-text-secondary mb-3">
                        By Order Status
                    </h4>
                    <div className="space-y-3">
                        {data?.byStatus?.map((item, index) => {
                            const percentage =
                                totalValue > 0
                                    ? (item.value / totalValue) * 100
                                    : 0;
                            return (
                                <div
                                    key={index}
                                    className="flex items-center justify-between"
                                >
                                    <div className="flex items-center space-x-3">
                                        <div
                                            className={`w-3 h-3 rounded-full ${getStatusColor(
                                                item.status
                                            )}`}
                                        ></div>
                                        <span className="text-sm text-admin-text capitalize">
                                            {item.status}
                                        </span>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-sm font-medium text-admin-text">
                                            {formatCurrency(item.value)}
                                        </div>
                                        <div className="text-xs text-admin-text-secondary">
                                            {percentage.toFixed(1)}%
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* By Payment Method */}
                {data?.byPaymentMethod && (
                    <div>
                        <h4 className="text-sm font-medium text-admin-text-secondary mb-3">
                            By Payment Method
                        </h4>
                        <div className="space-y-3">
                            {data.byPaymentMethod.map((item, index) => {
                                const percentage =
                                    totalValue > 0
                                        ? (item.value / totalValue) * 100
                                        : 0;
                                return (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm text-admin-text">
                                            {item.method}
                                        </span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-admin-text">
                                                {formatCurrency(item.value)}
                                            </div>
                                            <div className="text-xs text-admin-text-secondary">
                                                {percentage.toFixed(1)}%
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Top Categories */}
                {data?.topCategories && (
                    <div>
                        <h4 className="text-sm font-medium text-admin-text-secondary mb-3">
                            Top Categories
                        </h4>
                        <div className="space-y-3">
                            {data.topCategories
                                .slice(0, 5)
                                .map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center justify-between"
                                    >
                                        <span className="text-sm text-admin-text">
                                            {item.category}
                                        </span>
                                        <div className="text-right">
                                            <div className="text-sm font-medium text-admin-text">
                                                {formatCurrency(item.revenue)}
                                            </div>
                                            <div className="text-xs text-admin-text-secondary">
                                                {item.orders} orders
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                    </div>
                )}
            </div>
        </AnalyticsCard>
    );
};

export default SalesBreakdown;
