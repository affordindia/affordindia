import React from "react";

const UserStatusBadge = ({ isActive, isVerified, size = "sm" }) => {
    const sizeClasses = {
        xs: "px-2 py-0.5 text-xs",
        sm: "px-2.5 py-0.5 text-xs",
        md: "px-3 py-1 text-sm",
        lg: "px-4 py-1.5 text-sm",
    };

    const getStatusClasses = (status, verified) => {
        if (!status) {
            return "bg-red-100 text-red-800";
        }
        if (verified) {
            return "bg-green-100 text-green-800";
        }
        return "bg-yellow-100 text-yellow-800";
    };

    const getStatusText = (status, verified) => {
        if (!status) return "Blocked";
        if (verified) return "Active & Verified";
        return "Active";
    };

    return (
        <span
            className={`inline-flex items-center rounded-full font-medium ${
                sizeClasses[size]
            } ${getStatusClasses(isActive, isVerified)}`}
        >
            {getStatusText(isActive, isVerified)}
        </span>
    );
};

export default UserStatusBadge;
