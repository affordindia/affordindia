import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getOrders } from "../api/order.js";
import Loader from "../components/common/Loader.jsx";
import {
    FaBox,
    FaTruck,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
    FaEye,
    FaShoppingBag,
} from "react-icons/fa";

const Orders = () => {
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchOrders();
    }, []);

    const fetchOrders = async () => {
        try {
            setLoading(true);
            const response = await getOrders();
            console.log("Orders API response:", response);

            // Handle the API response format: { count: number, orders: array }
            if (response && Array.isArray(response.orders)) {
                setOrders(response.orders);
            } else if (Array.isArray(response)) {
                // Fallback for direct array response
                setOrders(response);
            } else {
                // Handle unexpected response format
                console.warn("Unexpected orders data format:", response);
                setOrders([]);
            }
        } catch (error) {
            console.error("Failed to fetch orders:", error);
            setError("Failed to load orders");
            setOrders([]); // Ensure orders is always an array
        } finally {
            setLoading(false);
        }
    };

    const getStatusIcon = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return <FaClock className="text-yellow-500" />;
            case "processing":
                return <FaBox className="text-blue-500" />;
            case "shipped":
                return <FaTruck className="text-purple-500" />;
            case "delivered":
                return <FaCheckCircle className="text-green-500" />;
            case "cancelled":
            case "canceled":
                return <FaTimesCircle className="text-red-500" />;
            default:
                return <FaClock className="text-gray-500" />;
        }
    };

    const getStatusColor = (status) => {
        switch (status.toLowerCase()) {
            case "pending":
                return "bg-yellow-100 text-yellow-800";
            case "processing":
                return "bg-blue-100 text-blue-800";
            case "shipped":
                return "bg-purple-100 text-purple-800";
            case "delivered":
                return "bg-green-100 text-green-800";
            case "cancelled":
            case "canceled":
                return "bg-red-100 text-red-800";
            default:
                return "bg-gray-100 text-gray-800";
        }
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (error) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 mb-4">{error}</p>
                    <button
                        onClick={fetchOrders}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    if (orders.length === 0) {
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
                    <FaShoppingBag className="text-gray-400 text-4xl mx-auto mb-4" />
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        No Orders Yet
                    </h2>
                    <p className="text-gray-600 mb-6">
                        You haven't placed any orders yet. Start shopping to see
                        your orders here!
                    </p>
                    <Link
                        to="/products"
                        className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors inline-block"
                    >
                        Start Shopping
                    </Link>
                </div>
            </div>
        );
    }

    // Additional safety check to ensure orders is an array before rendering
    if (!Array.isArray(orders)) {
        console.error("Orders is not an array:", orders);
        return (
            <div className="max-w-6xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 mb-4">
                        Error loading orders data
                    </p>
                    <button
                        onClick={fetchOrders}
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-2xl font-bold text-[#404040] mb-2">
                    My Orders
                </h1>
                <p className="text-gray-600">Track and manage your orders</p>
            </div>

            {/* Orders List */}
            <div className="space-y-4">
                {orders.map((order) => (
                    <div
                        key={order._id}
                        className="bg-white border border-gray-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                    >
                        {/* Order Header */}
                        <div className="bg-[#F7F4EF] px-6 py-4 border-b">
                            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                                <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                                    <div>
                                        <h3 className="font-semibold text-[#404040]">
                                            Order #{order._id.slice(-8)}
                                        </h3>
                                        <p className="text-sm text-gray-600">
                                            Placed on{" "}
                                            {new Date(
                                                order.createdAt
                                            ).toLocaleDateString("en-IN", {
                                                day: "numeric",
                                                month: "long",
                                                year: "numeric",
                                            })}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        {getStatusIcon(order.status)}
                                        <span
                                            className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                                order.status
                                            )}`}
                                        >
                                            {order.status
                                                .charAt(0)
                                                .toUpperCase() +
                                                order.status.slice(1)}
                                        </span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <div className="text-right">
                                        <p className="font-semibold text-[#404040]">
                                            ₹{order.total?.toLocaleString?.()}
                                        </p>
                                        <p className="text-sm text-gray-600">
                                            {order.items?.length || 0} item
                                            {(order.items?.length || 0) !== 1
                                                ? "s"
                                                : ""}
                                        </p>
                                    </div>
                                    <Link
                                        to={`/orders/${order._id}`}
                                        className="bg-white border border-gray-300 text-[#404040] px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors flex items-center gap-2"
                                    >
                                        <FaEye />
                                        View Details
                                    </Link>
                                </div>
                            </div>
                        </div>

                        {/* Order Items Preview */}
                        <div className="px-6 py-4">
                            <div className="flex flex-wrap gap-4">
                                {order.items?.slice(0, 3).map((item, index) => (
                                    <div
                                        key={index}
                                        className="flex items-center gap-3"
                                    >
                                        <Link to={`/products/id/${item.product?._id}`}> 
                                            <img
                                                src={
                                                    item.product?.images?.[0] ||
                                                    "/placeholder.png"
                                                }
                                                alt={item.product?.name || "Product"}
                                                className="w-12 h-12 object-cover rounded border cursor-pointer hover:opacity-90 transition"
                                            />
                                        </Link>
                                        <div>
                                            <p className="font-medium text-sm text-[#404040] line-clamp-1">
                                                {item.product?.name ||
                                                    "Product"}
                                            </p>
                                            <p className="text-xs text-gray-600">
                                                Qty: {item.quantity}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                                {order.items?.length > 3 && (
                                    <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded border text-xs text-gray-600">
                                        +{order.items.length - 3}
                                    </div>
                                )}
                            </div>

                            {/* Delivery Info */}
                            {order.status === "shipped" && (
                                <div className="mt-4 p-3 bg-purple-50 border border-purple-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-purple-700">
                                        <FaTruck />
                                        <span className="text-sm font-medium">
                                            Your order is on the way!
                                        </span>
                                    </div>
                                    <p className="text-xs text-purple-600 mt-1">
                                        Expected delivery: 3-5 business days
                                    </p>
                                </div>
                            )}

                            {order.status === "delivered" && (
                                <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                                    <div className="flex items-center gap-2 text-green-700">
                                        <FaCheckCircle />
                                        <span className="text-sm font-medium">
                                            Order delivered successfully!
                                        </span>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Orders;
