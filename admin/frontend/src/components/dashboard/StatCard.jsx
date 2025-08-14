import React from "react";
import { FaSpinner } from "react-icons/fa";
import { FaArrowTrendUp, FaArrowTrendDown } from "react-icons/fa6";

const StatCard = ({
    title,
    value,
    icon: Icon,
    growth,
    color,
    loading = false,
    onClick,
    clickable = false,
}) => (
    <div
        className={`bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border hover:shadow-admin-md transition-all duration-200 ${
            clickable
                ? "cursor-pointer hover:scale-105 hover:border-admin-primary"
                : ""
        }`}
        onClick={clickable ? onClick : undefined}
    >
        <div className="flex items-center justify-between">
            <div className="flex-1">
                <p className="text-sm font-medium text-admin-text-secondary mb-1">
                    {title}
                </p>
                {loading ? (
                    <div className="flex items-center space-x-2">
                        <FaSpinner className="w-5 h-5 text-admin-text-muted animate-spin" />
                        <div className="h-8 w-16 bg-admin-border rounded animate-pulse"></div>
                    </div>
                ) : (
                    <>
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
                    </>
                )}
            </div>
            <div className={`p-3 rounded-full ${color}`}>
                <Icon className="w-6 h-6 text-white" />
            </div>
        </div>
    </div>
);

export default StatCard;
