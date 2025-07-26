import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/order.js";
import Loader from "../components/common/Loader.jsx";
import {
    FaArrowLeft,
    FaBox,
    FaTruck,
    FaMapMarkerAlt,
    FaCreditCard,
    FaReceipt,
    FaCheckCircle,
    FaTimesCircle,
    FaClock,
} from "react-icons/fa";

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                setLoading(true);
                const orderData = await getOrderById(orderId);
                setOrder(orderData);
            } catch (error) {
                console.error("Failed to fetch order:", error);
                setError("Failed to load order details");
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
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
        switch (status?.toLowerCase()) {
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

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 mb-4">
                        {error || "Order not found"}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition-colors"
                        >
                            Go Back
                        </button>
                        <Link
                            to="/orders"
                            className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                        >
                            View All Orders
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 px-4 py-6">
            <div className="max-w-6xl mx-auto">
                {/* Header with Back Button */}
                <div className="mb-6">
                    <button
                        onClick={() => navigate(-1)}
                        className="flex items-center gap-2 text-gray-600 hover:text-black transition-colors mb-4"
                    >
                        <FaArrowLeft />
                        Back
                    </button>
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                        <div>
                            <h1 className="text-2xl font-bold text-[#404040]">
                                Order Details
                            </h1>
                            <p className="text-gray-600">
                                Order #{order._id.slice(-8)} • Placed on{" "}
                                {new Date(order.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        day: "numeric",
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </p>
                        </div>
                        <div className="flex items-center gap-2">
                            {getStatusIcon(order.status)}
                            <span
                                className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                                    order.status
                                )}`}
                            >
                                {order.status?.charAt(0).toUpperCase() +
                                    order.status?.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-4">
                        {/* User & Receiver Info */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    Contact Information
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-1 text-sm">
                                    <div>
                                        <span className="font-medium">
                                            Your Name:
                                        </span>{" "}
                                        {order.userName || order.user?.name}
                                    </div>
                                    <div>
                                        <span className="font-medium">
                                            Your Phone:
                                        </span>{" "}
                                        {order.userPhone || order.user?.phone}
                                    </div>
                                    {order.receiverName && (
                                        <div>
                                            <span className="font-medium">
                                                Receiver Name:
                                            </span>{" "}
                                            {order.receiverName}
                                        </div>
                                    )}
                                    {order.receiverPhone && (
                                        <div>
                                            <span className="font-medium">
                                                Receiver Phone:
                                            </span>{" "}
                                            {order.receiverPhone}
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaBox />
                                    Items Ordered ({order.items?.length || 0})
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3">
                                    {order.items?.map((item, index) => (
                                        <div
                                            key={index}
                                            className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                        >
                                            <img
                                                src={
                                                    item.product?.images?.[0] ||
                                                    "/placeholder.png"
                                                }
                                                alt={
                                                    item.product?.name ||
                                                    "Product"
                                                }
                                                className="w-14 h-14 object-cover rounded border"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium text-[#404040] text-sm truncate">
                                                    {item.product?.name ||
                                                        "Product"}
                                                </h3>
                                                <div className="flex flex-wrap gap-2 mt-1">
                                                    <p className="text-xs text-gray-600">
                                                        Qty: {item.quantity}
                                                    </p>
                                                    <p className="text-xs text-gray-600">
                                                        ₹
                                                        {item.price?.toLocaleString()}{" "}
                                                        each
                                                    </p>
                                                </div>
                                            </div>
                                            <div className="text-right">
                                                <p className="font-semibold text-[#404040] text-sm">
                                                    ₹
                                                    {(
                                                        item.price *
                                                        item.quantity
                                                    )?.toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Shipping Address */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaMapMarkerAlt />
                                    Shipping Address
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    <p className="text-[#404040] text-sm leading-relaxed">
                                        {order.shippingAddress?.houseNumber}," "
                                        {order.shippingAddress?.street}
                                        {order.shippingAddress?.landmark &&
                                            `, ${order.shippingAddress.landmark}`}
                                        <br />
                                        {order.shippingAddress?.area}," "
                                        {order.shippingAddress?.city}
                                        <br />
                                        {order.shippingAddress?.state} -" "
                                        {order.shippingAddress?.pincode}
                                        <br />
                                        {order.shippingAddress?.country}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Order Status Timeline */}
                        {order.status === "shipped" && (
                            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
                                <h3 className="font-semibold text-purple-900 mb-2 flex items-center gap-2 text-sm">
                                    <FaTruck />
                                    Tracking Information
                                </h3>
                                <div className="space-y-1 text-purple-800">
                                    <p className="text-xs">
                                        • Your order has been shipped
                                    </p>
                                    <p className="text-xs">
                                        • Expected delivery: 3-5 business days
                                    </p>
                                    <p className="text-xs">
                                        • Keep cash ready for COD payment
                                    </p>
                                </div>
                            </div>
                        )}

                        {order.status === "delivered" && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <h3 className="font-semibold text-green-900 mb-2 flex items-center gap-2 text-sm">
                                    <FaCheckCircle />
                                    Order Delivered
                                </h3>
                                <p className="text-xs text-green-800">
                                    Your order has been successfully delivered.
                                    Thank you for shopping with us!
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Sidebar */}
                    <div className="space-y-4">
                        {/* Order Summary */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaReceipt />
                                    Order Summary
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-2">
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Subtotal:
                                        </span>
                                        <span className="text-[#404040]">
                                            ₹{order.subtotal?.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                        <span className="text-gray-600">
                                            Shipping:
                                        </span>
                                        <span className="text-[#404040]">
                                            {order.shippingFee === 0
                                                ? "Free"
                                                : `₹${order.shippingFee}`}
                                        </span>
                                    </div>
                                    <div className="border-t pt-2">
                                        <div className="flex justify-between font-semibold">
                                            <span className="text-[#404040]">
                                                Total:
                                            </span>
                                            <span className="text-lg text-[#404040]">
                                                ₹{order.total?.toLocaleString()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaCreditCard />
                                    Payment Method
                                </h2>
                            </div>
                            <div className="p-4">
                                <p className="text-[#404040] text-sm">
                                    {order.paymentMethod === "COD"
                                        ? "Cash on Delivery"
                                        : order.paymentMethod}
                                </p>
                            </div>
                        </div>

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            <Link
                                to="/orders"
                                className="w-full bg-black text-white px-4 py-2.5 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center block text-sm"
                            >
                                View All Orders
                            </Link>
                            <Link
                                to="/products"
                                className="w-full bg-white border border-gray-300 text-[#404040] px-4 py-2.5 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block text-sm"
                            >
                                Continue Shopping
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderDetail;
