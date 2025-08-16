import React from "react";

const AnalyticsCard = ({ title, children, className = "" }) => {
    return (
        <div
            className={`bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border ${className}`}
        >
            <h3 className="text-lg font-semibold text-admin-text mb-4 font-montserrat">
                {title}
            </h3>
            {children}
        </div>
    );
};

export default AnalyticsCard;
