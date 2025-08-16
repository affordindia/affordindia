import React from "react";
import { FaArrowUp, FaArrowDown, FaMinus } from "react-icons/fa";

const MetricCard = ({
    title,
    value,
    change,
    changeType = "percentage",
    icon: Icon,
    iconColor = "bg-blue-500",
    previousValue,
    loading = false,
}) => {
    const formatValue = (val) => {
        if (typeof val === "number") {
            if (val >= 1000000) {
                return `${(val / 1000000).toFixed(1)}M`;
            } else if (val >= 1000) {
                return `${(val / 1000).toFixed(1)}K`;
            }
            return val.toLocaleString();
        }
        return val;
    };

    const formatChange = (change) => {
        if (change === 0) return "0%";
        const sign = change > 0 ? "+" : "";
        if (changeType === "percentage") {
            return `${sign}${change.toFixed(1)}%`;
        }
        return `${sign}${formatValue(change)}`;
    };

    const getChangeIcon = () => {
        if (change > 0) return FaArrowUp;
        if (change < 0) return FaArrowDown;
        return FaMinus;
    };

    const getChangeColor = () => {
        if (change > 0) return "text-green-600";
        if (change < 0) return "text-red-600";
        return "text-gray-500";
    };

    const ChangeIcon = getChangeIcon();

    if (loading) {
        return (
            <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
                <div className="animate-pulse">
                    <div className="h-4 bg-admin-border rounded w-24 mb-2"></div>
                    <div className="h-8 bg-admin-border rounded w-16 mb-2"></div>
                    <div className="h-4 bg-admin-border rounded w-20"></div>
                </div>
            </div>
        );
    }

    return (
        <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
            <div className="flex items-center justify-between">
                <div className="flex-1">
                    <p className="text-sm font-medium text-admin-text-secondary mb-1">
                        {title}
                    </p>
                    <p className="text-2xl font-bold text-admin-text font-montserrat">
                        {formatValue(value)}
                    </p>
                    {change !== undefined && (
                        <div className="flex items-center mt-2">
                            <ChangeIcon
                                className={`w-3 h-3 mr-1 ${getChangeColor()}`}
                            />
                            <span
                                className={`text-sm font-medium ${getChangeColor()}`}
                            >
                                {formatChange(change)}
                            </span>
                            <span className="text-sm text-admin-text-secondary ml-1">
                                vs last period
                            </span>
                        </div>
                    )}
                </div>
                {Icon && (
                    <div
                        className={`w-12 h-12 ${iconColor} rounded-lg flex items-center justify-center`}
                    >
                        <Icon className="w-6 h-6 text-white" />
                    </div>
                )}
            </div>
        </div>
    );
};

export default MetricCard;
