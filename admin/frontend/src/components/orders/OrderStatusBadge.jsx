import React from "react";

const OrderStatusBadge = ({ status, size = "lg" }) => {
    const getStatusConfig = (status) => {
        const configs = {
            pending: {
                bgColor: "bg-yellow-100",
                textColor: "text-yellow-800",
                label: "Pending",
            },
            processing: {
                bgColor: "bg-blue-100",
                textColor: "text-blue-800",
                label: "Processing",
            },
            shipped: {
                bgColor: "bg-purple-100",
                textColor: "text-purple-800",
                label: "Shipped",
            },
            delivered: {
                bgColor: "bg-green-100",
                textColor: "text-green-800",
                label: "Delivered",
            },
            cancelled: {
                bgColor: "bg-red-100",
                textColor: "text-red-800",
                label: "Cancelled",
            },
            returned: {
                bgColor: "bg-orange-100",
                textColor: "text-orange-800",
                label: "Returned",
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

    const config = getStatusConfig(status);
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

export default OrderStatusBadge;
