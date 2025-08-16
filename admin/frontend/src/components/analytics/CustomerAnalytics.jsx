import React from "react";
import { useNavigate } from "react-router-dom";
import AnalyticsCard from "./AnalyticsCard";

const CustomerAnalytics = ({ data, loading = false }) => {
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <AnalyticsCard title="Customer Analytics">
                <div className="animate-pulse space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                        {[1, 2, 3, 4].map((i) => (
                            <div
                                key={i}
                                className="h-16 bg-admin-border rounded"
                            ></div>
                        ))}
                    </div>
                </div>
            </AnalyticsCard>
        );
    }

    return (
        <AnalyticsCard title="Customer Analytics">
            <div className="space-y-6">
                {/* Customer Metrics */}
                <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-4 bg-admin-bg rounded-lg">
                        <div className="text-2xl font-bold text-admin-text">
                            {data?.totalCustomers || 0}
                        </div>
                        <div className="text-sm text-admin-text-secondary">
                            Total Customers
                        </div>
                    </div>
                    <div className="text-center p-4 bg-admin-bg rounded-lg">
                        <div className="text-2xl font-bold text-admin-text">
                            {data?.newCustomers || 0}
                        </div>
                        <div className="text-sm text-admin-text-secondary">
                            New This Period
                        </div>
                    </div>
                    <div className="text-center p-4 bg-admin-bg rounded-lg">
                        <div className="text-2xl font-bold text-admin-text">
                            {data?.returningCustomers || 0}
                        </div>
                        <div className="text-sm text-admin-text-secondary">
                            Returning Customers
                        </div>
                    </div>
                    <div className="text-center p-4 bg-admin-bg rounded-lg">
                        <div className="text-2xl font-bold text-admin-text">
                            {formatCurrency(data?.avgCustomerValue || 0)}
                        </div>
                        <div className="text-sm text-admin-text-secondary">
                            Avg Customer Value
                        </div>
                    </div>
                </div>

                {/* Customer Acquisition Chart */}
                {data?.acquisitionData && (
                    <div>
                        <h4 className="text-sm font-medium text-admin-text-secondary mb-3">
                            Customer Acquisition
                        </h4>
                        <div className="h-32 flex items-end justify-between space-x-1">
                            {data.acquisitionData.map((item, index) => {
                                const maxValue = Math.max(
                                    ...data.acquisitionData.map(
                                        (d) => d.customers
                                    )
                                );
                                const height =
                                    maxValue > 0
                                        ? (item.customers / maxValue) * 120
                                        : 0;
                                return (
                                    <div
                                        key={index}
                                        className="flex flex-col items-center flex-1"
                                    >
                                        <div
                                            className="bg-gradient-to-t from-blue-500 to-blue-300 rounded-t w-full min-h-1"
                                            style={{ height: `${height}px` }}
                                            title={`${item.period}: ${item.customers} customers`}
                                        ></div>
                                        <span className="text-xs text-admin-text-secondary mt-1">
                                            {item.period}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Top Customers */}
                {data?.topCustomers && (
                    <div>
                        <h4 className="text-sm font-medium text-admin-text-secondary mb-3">
                            Top Customers
                        </h4>
                        <div className="space-y-3">
                            {data.topCustomers
                                .slice(0, 5)
                                .map((customer, index) => (
                                    <div
                                        key={customer.id}
                                        className="flex items-center justify-between p-3 bg-admin-bg rounded-lg border border-admin-border hover:border-admin-primary cursor-pointer transition-all duration-200"
                                        onClick={() =>
                                            navigate(`/users/${customer.id}`)
                                        }
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div className="w-8 h-8 bg-admin-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                {index + 1}
                                            </div>
                                            <div>
                                                <div className="font-medium text-admin-text">
                                                    {customer.name}
                                                </div>
                                                <div className="text-sm text-admin-text-secondary">
                                                    {customer.email}
                                                </div>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <div className="font-semibold text-admin-text">
                                                {formatCurrency(
                                                    customer.totalSpent
                                                )}
                                            </div>
                                            <div className="text-sm text-admin-text-secondary">
                                                {customer.orders} orders
                                            </div>
                                        </div>
                                    </div>
                                ))}
                        </div>
                        <div className="pt-4 border-t border-admin-border">
                            <button
                                onClick={() => navigate("/users")}
                                className="w-full text-center text-admin-primary hover:text-admin-primary-dark transition-colors font-medium"
                            >
                                View All Customers →
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </AnalyticsCard>
    );
};

export default CustomerAnalytics;
