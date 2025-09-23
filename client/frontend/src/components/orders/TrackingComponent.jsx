import React, { useState, useEffect, useCallback } from "react";
import { trackOrder } from "../../api/shiprocket.js";
import {
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaSyncAlt,
    FaRoute,
    FaPlane,
    FaWarehouse,
    FaShippingFast
} from "react-icons/fa";

const TrackingComponent = ({ order, onTrackingUpdate = null }) => {
    // Debug: Log the order prop to verify it has _id and shiprocket fields
    console.log("[TrackingComponent] order prop:", order);
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [expanded, setExpanded] = useState(false);

    const fetchTracking = useCallback(async () => {
        if (!order?._id) return;

        try {
            setLoading(true);
            setError("");

            // Try tracking by our order ID first
            const response = await trackOrder(order._id);
            setTrackingData(response);

            // Notify parent component about tracking data
            if (onTrackingUpdate) {
                onTrackingUpdate(response);
            }

        } catch (error) {
            console.error("Tracking failed:", error);
            setError("Could not fetch tracking information");
        } finally {
            setLoading(false);
        }
    }, [order?._id, onTrackingUpdate]);

    useEffect(() => {
        // Auto-fetch tracking for shipped orders
        if (order?.status === "shipped" || order?.shiprocket?.awbCode) {
            fetchTracking();
        }
    }, [order, fetchTracking]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "shipped":
            case "6":
                return <FaTruck className="text-blue-500" />;
            case "delivered":
            case "7":
                return <FaCheckCircle className="text-green-500" />;
            case "in transit":
            case "18":
                return <FaShippingFast className="text-purple-500" />;
            case "out for delivery":
            case "17":
                return <FaTruck className="text-orange-500" />;
            case "picked up":
            case "42":
                return <FaBox className="text-blue-400" />;
            case "reached warehouse":
            case "48":
                return <FaWarehouse className="text-indigo-500" />;
            case "in flight":
            case "50":
                return <FaPlane className="text-sky-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status?.toLowerCase()) {
            case "delivered":
            case "7":
                return "bg-green-100 text-green-800 border-green-200";
            case "shipped":
            case "6":
                return "bg-blue-100 text-blue-800 border-blue-200";
            case "in transit":
            case "18":
                return "bg-purple-100 text-purple-800 border-purple-200";
            case "out for delivery":
            case "17":
                return "bg-orange-100 text-orange-800 border-orange-200";
            case "cancelled":
            case "8":
                return "bg-red-100 text-red-800 border-red-200";
            default:
                return "bg-gray-100 text-gray-800 border-gray-200";
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit"
        });
    };

    // Don't show tracking for orders that haven't been shipped
    if (!order?.shiprocket?.shipmentId && order?.status !== "shipped") {
        return null;
    }

    return (
        <div className="border border-gray-200 rounded-lg p-4 bg-gray-50">
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <FaRoute className="text-blue-500" />
                    <h3 className="font-semibold text-gray-800">Order Tracking</h3>
                </div>
                <button
                    onClick={fetchTracking}
                    disabled={loading}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors disabled:opacity-50"
                >
                    <FaSyncAlt className={loading ? "animate-spin" : ""} />
                    {loading ? "Refreshing..." : "Refresh"}
                </button>
            </div>

            {/* Shiprocket Info */}
            {order?.shiprocket && (
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 text-sm">
                    {order.shiprocket.shipmentId && (
                        <div>
                            <span className="text-gray-600">Shipment ID:</span>
                            <span className="font-mono ml-1">{order.shiprocket.shipmentId}</span>
                        </div>
                    )}
                    {order.shiprocket.awbCode && (
                        <div>
                            <span className="text-gray-600">AWB Code:</span>
                            <span className="font-mono ml-1">{order.shiprocket.awbCode}</span>
                        </div>
                    )}
                    {order.shiprocket.courierName && (
                        <div>
                            <span className="text-gray-600">Courier:</span>
                            <span className="ml-1">{order.shiprocket.courierName}</span>
                        </div>
                    )}
                </div>
            )}

            {/* Error State */}
            {error && (
                <div className="flex items-center gap-2 text-red-600 bg-red-50 p-3 rounded border border-red-200 mb-4">
                    <FaExclamationTriangle />
                    <span>{error}</span>
                </div>
            )}

            {/* Loading State */}
            {loading && (
                <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    <span className="ml-2 text-gray-600">Loading tracking information...</span>
                </div>
            )}

            {/* Tracking Data */}
            {trackingData && !loading && (
                <div>
                    {/* Current Status */}
                    {trackingData.detailedTracking && (
                        <div className="mb-4">
                            <div className="flex items-center gap-3 p-3 rounded-lg bg-white border">
                                {getStatusIcon(trackingData.detailedTracking.status)}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-1">
                                        <span className="font-semibold text-gray-800">
                                            {trackingData.detailedTracking.status || "Unknown Status"}
                                        </span>
                                        <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(trackingData.detailedTracking.status)}`}>
                                            {trackingData.detailedTracking.status}
                                        </span>
                                    </div>
                                    {trackingData.detailedTracking.currentLocation && (
                                        <div className="flex items-center gap-1 text-sm text-gray-600">
                                            <FaMapMarkerAlt className="text-xs" />
                                            <span>{trackingData.detailedTracking.currentLocation}</span>
                                        </div>
                                    )}
                                    {trackingData.detailedTracking.expectedDelivery && (
                                        <div className="text-sm text-gray-600 mt-1">
                                            Expected delivery: {formatDate(trackingData.detailedTracking.expectedDelivery)}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    )}

                    {/* Basic tracking info fallback */}
                    {!trackingData.detailedTracking && trackingData.orderInfo && (
                        <div className="mb-4 p-3 bg-white rounded border">
                            <div className="text-sm text-gray-600">
                                <div>Order Status: <span className="font-medium">{order.status}</span></div>
                                {trackingData.orderInfo.awbCode && (
                                    <div>Tracking Code: <span className="font-mono">{trackingData.orderInfo.awbCode}</span></div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Tracking History */}
                    {trackingData.detailedTracking?.trackingHistory?.length > 0 && (
                        <div>
                            <button
                                onClick={() => setExpanded(!expanded)}
                                className="flex items-center gap-2 text-blue-600 hover:text-blue-800 transition-colors mb-3"
                            >
                                <span>{expanded ? "Hide" : "Show"} Tracking History</span>
                                <span className={`transform transition-transform ${expanded ? "rotate-180" : ""}`}>
                                    ▼
                                </span>
                            </button>

                            {expanded && (
                                <div className="space-y-3">
                                    {trackingData.detailedTracking.trackingHistory.map((event, index) => (
                                        <div key={index} className="flex gap-4 p-3 bg-white rounded border">
                                            <div className="flex-shrink-0">
                                                {getStatusIcon(event.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">{event.activity || event.status}</div>
                                                {event.location && (
                                                    <div className="text-sm text-gray-600 flex items-center gap-1 mt-1">
                                                        <FaMapMarkerAlt className="text-xs" />
                                                        {event.location}
                                                    </div>
                                                )}
                                                <div className="text-xs text-gray-500 mt-1">
                                                    {formatDate(event.date)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    )}

                    {/* No tracking data message */}
                    {trackingData && !trackingData.detailedTracking && !trackingData.orderInfo?.awbCode && (
                        <div className="text-center py-4 text-gray-600">
                            <FaClock className="mx-auto text-2xl mb-2" />
                            <p>Tracking information will be available once the order is picked up by the courier.</p>
                        </div>
                    )}
                </div>
            )}

            {/* No tracking data and not loading */}
            {!trackingData && !loading && !error && (
                <div className="text-center py-4">
                    <button
                        onClick={fetchTracking}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    >
                        Load Tracking Information
                    </button>
                </div>
            )}
        </div>
    );
};

export default TrackingComponent;