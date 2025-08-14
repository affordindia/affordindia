import React from "react";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const TodaysPerformance = ({ stats, formatCurrency }) => (
    <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
        <h2 className="text-xl font-semibold text-admin-text mb-4 font-montserrat">
            Today's Performance
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
                <p className="text-3xl font-bold text-admin-primary">
                    {stats?.today?.orders?.toLocaleString() || "0"}
                </p>
                <p className="text-sm text-admin-text-secondary mt-1">
                    Orders Today
                </p>
                {stats?.today?.orderGrowthPercent !== undefined && (
                    <div className="flex items-center justify-center mt-2">
                        {stats.today.orderGrowthPercent >= 0 ? (
                            <FaArrowTrendUp className="w-4 h-4 text-admin-success mr-1" />
                        ) : (
                            <FaArrowTrendDown className="w-4 h-4 text-admin-error mr-1" />
                        )}
                        <span
                            className={`text-sm font-medium ${
                                stats.today.orderGrowthPercent >= 0
                                    ? "text-admin-success"
                                    : "text-admin-error"
                            }`}
                        >
                            {Math.abs(stats.today.orderGrowthPercent)}%
                        </span>
                        <span className="text-sm text-admin-text-muted ml-1">
                            vs yesterday
                        </span>
                    </div>
                )}
            </div>
            <div className="text-center">
                <p className="text-3xl font-bold text-admin-success">
                    {formatCurrency(stats?.today?.revenue || 0)}
                </p>
                <p className="text-sm text-admin-text-secondary mt-1">
                    Revenue Today
                </p>
            </div>
            <div className="text-center">
                <p className="text-3xl font-bold text-admin-info">
                    {stats?.thisMonth?.orders?.toLocaleString() || "0"}
                </p>
                <p className="text-sm text-admin-text-secondary mt-1">
                    This Month
                </p>
                <p className="text-sm text-admin-text-muted mt-1">
                    Revenue: {formatCurrency(stats?.thisMonth?.revenue || 0)}
                </p>
            </div>
        </div>
    </div>
);

export default TodaysPerformance;
