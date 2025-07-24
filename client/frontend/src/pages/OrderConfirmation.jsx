import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/order.js";
import Loader from "../components/common/Loader.jsx";
import { FaCheckCircle, FaTruck, FaBox, FaMapMarkerAlt } from "react-icons/fa";

const OrderConfirmation = () => {
    const { orderId } = useParams();
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

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (error || !order) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 mb-4">
                        {error || "Order not found"}
                    </p>
                    <Link
                        to="/orders"
                        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors"
                    >
                        View All Orders
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            {/* Success Header */}
            <div className="text-center mb-8">
                <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <FaCheckCircle className="text-green-500 text-2xl" />
                </div>
                <h1 className="text-2xl font-bold text-[#404040] mb-2">
                    Order Placed Successfully!
                </h1>
                <p className="text-gray-600">
                    Thank you for your order. We'll send you updates on your
                    email.
                </p>
            </div>

            {/* Order Summary Card */}
            <div className="bg-white border border-gray-300 rounded-lg overflow-hidden mb-6">
                {/* Order Header */}
                <div className="bg-[#F7F4EF] px-6 py-4 border-b">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                        <div>
                            <h2 className="text-lg font-semibold text-[#404040]">
                                Order #{order._id.slice(-8)}
                            </h2>
                            <p className="text-sm text-gray-600">
                                Placed on{" "}
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
                        <div className="text-sm">
                            <span
                                className={`px-3 py-1 rounded-full text-xs font-medium ${
                                    order.status === "pending"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-green-100 text-green-800"
                                }`}
                            >
                                {order.status.charAt(0).toUpperCase() +
                                    order.status.slice(1)}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Order Items */}
                <div className="px-6 py-4">
                    <h3 className="font-semibold text-[#404040] mb-3 flex items-center gap-2">
                        <FaBox />
                        Items Ordered
                    </h3>
                    <div className="space-y-3">
                        {order.items?.map((item, index) => (
                            <div
                                key={index}
                                className="flex items-center gap-4 p-3 bg-gray-50 rounded"
                            >
                                <img
                                    src={
                                        item.product?.images?.[0] ||
                                        "/placeholder.png"
                                    }
                                    alt={item.product?.name || "Product"}
                                    className="w-12 h-12 object-cover rounded"
                                />
                                <div className="flex-1">
                                    <p className="font-medium text-[#404040]">
                                        {item.product?.name || "Product"}
                                    </p>
                                    <p className="text-sm text-gray-600">
                                        Quantity: {item.quantity}
                                    </p>
                                </div>
                                <span className="font-medium text-[#404040]">
                                    ₹
                                    {(
                                        item.price * item.quantity
                                    ).toLocaleString()}
                                </span>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Shipping Address */}
                <div className="px-6 py-4 border-t">
                    <h3 className="font-semibold text-[#404040] mb-3 flex items-center gap-2">
                        <FaMapMarkerAlt />
                        Shipping Address
                    </h3>
                    <div className="bg-gray-50 p-3 rounded">
                        <p className="text-sm text-[#404040]">
                            {order.shippingAddress?.houseNumber},{" "}
                            {order.shippingAddress?.street}
                            {order.shippingAddress?.landmark &&
                                `, ${order.shippingAddress.landmark}`}
                            <br />
                            {order.shippingAddress?.area},{" "}
                            {order.shippingAddress?.city}
                            <br />
                            {order.shippingAddress?.state} -{" "}
                            {order.shippingAddress?.pincode}
                            <br />
                            {order.shippingAddress?.country}
                        </p>
                    </div>
                </div>

                {/* Payment & Total */}
                <div className="px-6 py-4 border-t bg-gray-50">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">
                            Payment Method:
                        </span>
                        <span className="text-sm font-medium text-[#404040]">
                            {order.paymentMethod === "COD"
                                ? "Cash on Delivery"
                                : order.paymentMethod}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Subtotal:</span>
                        <span className="text-sm text-[#404040]">
                            ₹{order.subtotal?.toLocaleString()}
                        </span>
                    </div>
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-gray-600">Shipping:</span>
                        <span className="text-sm text-[#404040]">
                            {order.shippingFee === 0
                                ? "Free"
                                : `₹${order.shippingFee}`}
                        </span>
                    </div>
                    <div className="flex justify-between items-center pt-2 border-t">
                        <span className="font-semibold text-[#404040]">
                            Total:
                        </span>
                        <span className="font-semibold text-lg text-[#404040]">
                            ₹{order.total?.toLocaleString()}
                        </span>
                    </div>
                </div>
            </div>

            {/* Next Steps */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                    <FaTruck />
                    What's Next?
                </h3>
                <ul className="text-sm text-blue-800 space-y-1">
                    <li>• We'll process your order within 1-2 business days</li>
                    <li>
                        • You'll receive an email confirmation with tracking
                        details
                    </li>
                    <li>• Estimated delivery: 3-7 business days</li>
                    <li>• Keep cash ready for COD payment</li>
                </ul>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                    to="/orders"
                    className="bg-black text-white px-6 py-3 rounded-lg font-medium hover:bg-gray-800 transition-colors text-center"
                >
                    View All Orders
                </Link>
                <Link
                    to="/products"
                    className="bg-white border border-gray-300 text-[#404040] px-6 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center"
                >
                    Continue Shopping
                </Link>
            </div>
        </div>
    );
};

export default OrderConfirmation;
