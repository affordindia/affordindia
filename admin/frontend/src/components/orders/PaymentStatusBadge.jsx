import React from "react";

const PaymentStatusBadge = ({ paymentStatus, status, size = "lg" }) => {
    // Support both 'paymentStatus' and 'status' props for flexibility
    const statusValue = paymentStatus || status;

    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
                label: "Pending",
            },
            paid: {
                bgColor: "bg-green-100",
                textColor: "text-green-800",
                label: "Paid",
            },
            failed: {
                bgColor: "bg-red-100",
                textColor: "text-red-800",
                label: "Failed",
            },
        };
        return (
            configs[status] || {
                bgColor: "bg-gray-100",
                textColor: "text-gray-800",
                label:
                    status?.charAt(0).toUpperCase() + status?.slice(1) ||
                    "Unknown",
            }
        );
    };

    const config = getStatusConfig(statusValue);
    const sizeClasses =
        size === "lg" ? "px-3 py-1 text-sm" : "px-2 py-1 text-xs";

    return (
        <span
            className={`${config.bgColor} ${config.textColor} ${sizeClasses} font-medium rounded-full`}
        >
            {config.label}
        </span>
    );
};

export default PaymentStatusBadge;
