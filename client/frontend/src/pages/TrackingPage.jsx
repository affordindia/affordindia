import React, { useState } from "react";
import { trackByAWB, trackByShipmentId } from "../api/shiprocket.js";
import {
    FaSearch,
    FaTruck,
    FaBox,
    FaMapMarkerAlt,
    FaClock,
    FaCheckCircle,
    FaExclamationTriangle,
    FaRoute,
    FaShippingFast,
    FaPlane,
    FaWarehouse
} from "react-icons/fa";

const TrackingPage = () => {
    const [trackingInput, setTrackingInput] = useState("");
    const [trackingType, setTrackingType] = useState("awb"); // 'awb' or 'shipment'
    const [trackingData, setTrackingData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleTrack = async (e) => {
        e.preventDefault();
        
        if (!trackingInput.trim()) {
            setError("Please enter a tracking number");
            return;
        }

        try {
            setLoading(true);
            setError("");
            setTrackingData(null);

            let response;
            if (trackingType === "awb") {
                response = await trackByAWB(trackingInput.trim());
            } else {
                response = await trackByShipmentId(trackingInput.trim());
            }

            setTrackingData(response);

        } catch (error) {
            console.error("Tracking failed:", error);
            setError("Could not find tracking information. Please check your tracking number and try again.");
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "shipped":
            case "6":
                return <FaTruck className="text-blue-500 text-xl" />;
            case "delivered":
            case "7":
                return <FaCheckCircle className="text-green-500 text-xl" />;
            case "in transit":
            case "18":
                return <FaShippingFast className="text-purple-500 text-xl" />;
            case "out for delivery":
            case "17":
                return <FaTruck className="text-orange-500 text-xl" />;
            case "picked up":
            case "42":
                return <FaBox className="text-blue-400 text-xl" />;
            case "reached warehouse":
            case "48":
                return <FaWarehouse className="text-indigo-500 text-xl" />;
            case "in flight":
            case "50":
                return <FaPlane className="text-sky-500 text-xl" />;
            default:
                return <FaClock className="text-gray-500 text-xl" />;
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

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="flex items-center justify-center gap-3 mb-4">
                        <FaRoute className="text-blue-500 text-3xl" />
                        <h1 className="text-3xl font-bold text-gray-800">Track Your Order</h1>
                    </div>
                    <p className="text-gray-600 max-w-2xl mx-auto">
                        Enter your tracking number below to get real-time updates on your order's journey
                    </p>
                </div>

                {/* Tracking Form */}
                <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
                    <form onSubmit={handleTrack} className="space-y-4">
                        <div className="flex flex-col sm:flex-row gap-4">
                            <div className="flex-1">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Tracking Number
                                </label>
                                <input
                                    type="text"
                                    value={trackingInput}
                                    onChange={(e) => setTrackingInput(e.target.value)}
                                    placeholder="Enter AWB code or Shipment ID"
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                />
                            </div>
                            <div className="sm:w-40">
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Type
                                </label>
                                <select
                                    value={trackingType}
                                    onChange={(e) => setTrackingType(e.target.value)}
                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                                >
                                    <option value="awb">AWB Code</option>
                                    <option value="shipment">Shipment ID</option>
                                </select>
                            </div>
                        </div>
                        
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {loading ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Tracking...
                                </>
                            ) : (
                                <>
                                    <FaSearch />
                                    Track Order
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Error State */}
                {error && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-8">
                        <div className="flex items-center gap-2 text-red-700">
                            <FaExclamationTriangle />
                            <span className="font-medium">Error</span>
                        </div>
                        <p className="text-red-600 mt-1">{error}</p>
                    </div>
                )}

                {/* Tracking Results */}
                {trackingData && !loading && (
                    <div className="space-y-6">
                        {/* Current Status */}
                        {trackingData.data && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Current Status</h2>
                                
                                {trackingData.data.status ? (
                                    <div className="flex items-center gap-4 p-4 rounded-lg bg-gray-50 border">
                                        {getStatusIcon(trackingData.data.status)}
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <span className="font-semibold text-lg text-gray-800">
                                                    {trackingData.data.status}
                                                </span>
                                                <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(trackingData.data.status)}`}>
                                                    {trackingData.data.status}
                                                </span>
                                            </div>
                                            {trackingData.data.currentLocation && (
                                                <div className="flex items-center gap-1 text-gray-600">
                                                    <FaMapMarkerAlt className="text-sm" />
                                                    <span>{trackingData.data.currentLocation}</span>
                                                </div>
                                            )}
                                            {trackingData.data.expectedDelivery && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Expected delivery: {formatDate(trackingData.data.expectedDelivery)}
                                                </div>
                                            )}
                                            {trackingData.data.courierPartner && (
                                                <div className="text-sm text-gray-600 mt-1">
                                                    Courier: {trackingData.data.courierPartner}
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center py-8 text-gray-600">
                                        <FaClock className="mx-auto text-3xl mb-2" />
                                        <p>Tracking information is being updated. Please check back later.</p>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Tracking History */}
                        {trackingData.data?.trackingHistory?.length > 0 && (
                            <div className="bg-white rounded-lg shadow-lg p-6">
                                <h2 className="text-xl font-semibold text-gray-800 mb-4">Tracking History</h2>
                                <div className="space-y-4">
                                    {trackingData.data.trackingHistory.map((event, index) => (
                                        <div key={index} className="flex gap-4 p-4 rounded-lg border">
                                            <div className="flex-shrink-0">
                                                {getStatusIcon(event.status)}
                                            </div>
                                            <div className="flex-1">
                                                <div className="font-medium text-gray-800">
                                                    {event.activity || event.status}
                                                </div>
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
                            </div>
                        )}

                        {/* Raw data for debugging */}
                        {trackingData.rawData && (
                            <details className="bg-white rounded-lg shadow-lg p-6">
                                <summary className="cursor-pointer font-medium text-gray-700 hover:text-gray-900">
                                    View Raw Tracking Data (Debug)
                                </summary>
                                <pre className="mt-4 text-xs bg-gray-100 p-4 rounded overflow-auto">
                                    {JSON.stringify(trackingData.rawData, null, 2)}
                                </pre>
                            </details>
                        )}
                    </div>
                )}

                {/* Help Text */}
                <div className="mt-12 text-center text-gray-600">
                    <p className="text-sm">
                        Need help? Contact our support team with your order number.
                    </p>
                    <p className="text-xs mt-1">
                        Tracking information is updated in real-time from our courier partners.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;