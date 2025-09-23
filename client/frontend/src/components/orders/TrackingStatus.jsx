import React from "react";
import {
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle,
    FaShippingFast,
    FaRoute
} from "react-icons/fa";

const TrackingStatus = ({ order }) => {
    // Don't show for orders without Shiprocket data
    if (!order?.shiprocket?.shipmentId) {
        return null;
    }

    const getTrackingIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "shipped":
                return <FaTruck className="text-blue-500" />;
            case "delivered":
                return <FaCheckCircle className="text-green-500" />;
            case "processing":
                return <FaBox className="text-purple-500" />;
            default:
                return <FaRoute className="text-gray-500" />;
        }
    };

    const getTrackingMessage = () => {
        if (order.shiprocket?.awbCode) {
            return (
                <div className="flex items-center gap-2 text-sm">
                    {getTrackingIcon(order.status)}
                    <span className="text-gray-700">
                        Tracking: <span className="font-mono text-blue-600">{order.shiprocket.awbCode}</span>
                    </span>
                </div>
            );
        }

        if (order.shiprocket?.shipmentId && order.status === "processing") {
            return (
                <div className="flex items-center gap-2 text-sm text-blue-600">
                    <FaShippingFast />
                    <span>Ready for shipment</span>
                </div>
            );
        }

        return null;
    };

    return (
        <div className="mt-2 p-2 bg-blue-50 border border-blue-200 rounded">
            {getTrackingMessage()}
            {order.shiprocket?.courierName && (
                <div className="text-xs text-gray-600 mt-1">
                    Courier: {order.shiprocket.courierName}
                </div>
            )}
        </div>
    );
};

export default TrackingStatus;