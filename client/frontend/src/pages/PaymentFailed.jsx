import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getOrderById } from "../api/order";
import { retryRazorpayPayment, verifyRazorpayPayment } from "../api/razorpay";
import { toast } from "react-hot-toast";
import {
    FaTimesCircle,
    FaExclamationTriangle,
    FaSpinner,
    FaRedo,
    FaShoppingCart,
} from "react-icons/fa";
import { GiPhone } from "react-icons/gi";
import ScrollToTop from "../components/common/ScrollToTop";
import "../index.css";

const PaymentFailed = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [retryLoading, setRetryLoading] = useState(false);
    const [error, setError] = useState(null);
    const [retryMessage, setRetryMessage] = useState(null);

    const { error: paymentError, canRetry = true } = location.state || {};

    useEffect(() => {
        const fetchOrderDetails = async () => {
            try {
                if (!user) {
                    navigate("/login");
                    return;
                }
                if (!orderId) {
                    setError("Order ID is missing");
                    return;
                }

                const orderData = await getOrderById(orderId);
                if (!orderData) {
                    setError("Order not found");
                    return;
                }
                setOrder(orderData);
            } catch (err) {
                console.error("Error fetching order:", err);
                setError("Failed to load order details");
            } finally {
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchOrderDetails();
    }, [orderId, user, navigate]);

    const handleRetryPayment = async () => {
        if (!order || retryLoading) return;

        try {
            setRetryLoading(true);
            setError("");
            setRetryMessage("");
            toast.loading("Initiating payment retry...");

            const { razorpayOrderId, razorpayKeyId } =
                await retryRazorpayPayment(orderId);

            const options = {
                key: razorpayKeyId || import.meta.env.VITE_RAZORPAY_KEY_ID,
                amount: order.totalAmount * 100,
                currency: "INR",
                name: "AffordIndia",
                description: `Retry Payment - Order #${order.orderNumber}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        toast.dismiss();
                        toast.loading("Verifying payment...");

                        const verification = await verifyRazorpayPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId,
                        });

                        toast.dismiss();
                        if (verification.success) {
                            toast.success("Payment successful!");
                            navigate(`/order-confirmation/${orderId}`, {
                                replace: true,
                                state: {
                                    paymentSuccess: true,
                                    paymentData: verification,
                                },
                            });
                        } else {
                            toast.error("Payment verification failed");
                            setRetryMessage(
                                "Payment verification failed. Please contact support."
                            );
                        }
                    } catch (error) {
                        toast.dismiss();
                        console.error("Payment verification failed:", error);
                        toast.error("Payment verification failed");
                        setRetryMessage(
                            error.message || "Payment verification failed"
                        );
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.dismiss();
                        console.log("Payment modal closed by user");
                    },
                },
                prefill: {
                    name:
                        order.userName || order.user?.name || user?.name || "",
                    email:
                        order.userEmail ||
                        order.user?.email ||
                        user?.email ||
                        "",
                    contact:
                        order.userPhone ||
                        order.user?.phone ||
                        user?.phone ||
                        "",
                },
                theme: { color: "#B76E79" },
            };

            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                document.body.appendChild(script);
                await new Promise((resolve) => (script.onload = resolve));
            }

            toast.dismiss();
            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Retry payment failed:", err);
            toast.dismiss();
            toast.error(err.message || "Failed to retry payment");
            setRetryMessage(
                err.message || "Failed to retry payment. Please try again."
            );
        } finally {
            setRetryLoading(false);
        }
    };

    const handleViewOrders = () => navigate("/orders");
    const handleContinueShopping = () => navigate("/");

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <ScrollToTop />
                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSpinner className="text-orange-500 text-2xl animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#404040] mb-2">
                        Checking payment status...
                    </h1>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <ScrollToTop />
                <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaExclamationTriangle className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#404040] mb-4">
                        Error Loading Order
                    </h1>
                    <p className="text-gray-600 mb-6">{error}</p>
                    <div className="flex gap-4 justify-center">
                        <button
                            onClick={handleViewOrders}
                            className="bg-[#C1B086] text-white px-6 py-3 rounded-lg hover:bg-[#B8A474] transition-colors font-medium"
                        >
                            View Orders
                        </button>
                        <button
                            onClick={handleContinueShopping}
                            className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-6 py-3 rounded-lg hover:bg-[#B76E79] hover:text-white transition-colors font-medium"
                        >
                            Continue Shopping
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-3xl mx-auto px-4 py-16">
            <ScrollToTop />
            <div className="bg-white border border-gray-300 rounded-lg p-8">
                {/* Failed Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimesCircle className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#404040] mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-lg text-[#404040] mb-2">
                        {paymentError ||
                            "Your payment could not be processed at this time."}
                    </p>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-[#404040]">Order Number:</p>
                                <p className="font-medium text-[#404040]">
                                    {order.orderId}
                                </p>
                            </div>
                            <div>
                                <p className="text-[#404040]">Amount:</p>
                                <p className="font-medium text-[#404040]">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                            <div>
                                <p className="text-[#404040]">
                                    Payment Method:
                                </p>
                                <p className="font-medium capitalize text-[#404040]">
                                    {order.paymentMethod
                                        ? order.paymentMethod
                                              .toLowerCase()
                                              .replace(/_/g, " ")
                                              .replace(/\b\w/g, (char) =>
                                                  char.toUpperCase()
                                              )
                                        : "N/A"}
                                </p>
                            </div>
                            <div>
                                <p className="text-[#404040]">Status:</p>
                                <span className="text-[#DC2626] font-medium capitalize">
                                    Payment Pending
                                </span>
                            </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                            <div className="mt-4">
                                <p className="text-[#404040] text-sm mb-2">
                                    Items ({order.items.length}):
                                </p>
                                <div className="space-y-2">
                                    {order.items
                                        .slice(0, 3)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between items-start text-sm gap-3"
                                            >
                                                <div className="w-3/4 overflow-hidden">
                                                    <p className="product-name font-medium text-[#404040]">
                                                        {item.quantity}×{" "}
                                                        {item.product.name ||
                                                            item.name}
                                                    </p>
                                                </div>
                                                <div className="w-1/4 text-right">
                                                    <span className="font-medium text-[#404040]">
                                                        {formatCurrency(
                                                            item.discountedPrice *
                                                                item.quantity
                                                        )}
                                                    </span>
                                                </div>
                                            </div>
                                        ))}
                                    {order.items.length > 3 && (
                                        <p className="text-xs text-gray-500">
                                            ... and {order.items.length - 3}{" "}
                                            more items
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                )}

                {/* Retry Payment + View My Orders Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6 pl-10 pr-10">
                    {canRetry &&
                        (order.paymentStatus === "failed" ||
                            order.paymentStatus === "pending") &&
                        order.status === "pending" && (
                            <button
                                onClick={handleRetryPayment}
                                disabled={retryLoading}
                                className="flex-[2] bg-[#B76E79] text-white px-6 py-2 rounded-lg transition-transform transform hover:scale-105 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                {retryLoading ? (
                                    <FaSpinner className="animate-spin" />
                                ) : (
                                    <FaRedo />
                                )}
                                {retryLoading
                                    ? "Processing..."
                                    : "Retry Payment"}
                            </button>
                        )}
                    <button
                        onClick={handleViewOrders}
                        className="flex-[1] border-2 border-[#B76E79] text-[#B76E79] bg-white px-4 py-2 rounded-lg transition-transform transform hover:scale-105 shadow-sm hover:shadow-md font-medium flex items-center justify-center gap-2"
                    >
                        <FaShoppingCart />
                        View My Orders
                    </button>
                </div>

                {/* Common Reasons */}
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-[#404040]">
                        <p className="font-medium mb-2">
                            Common reasons for payment failure:
                        </p>
                        <ul className="text-left space-y-1 ml-4">
                            <li>• Network connectivity issues</li>
                            <li>• Daily transaction limit exceeded</li>
                            <li>• Incorrect card details or expired card</li>
                            <li>• Payment gateway timeout</li>
                        </ul>
                    </div>
                </div>

                {/* Continue Shopping Button */}
                <div className="flex justify-start mb-6">
                    <button
                        onClick={handleContinueShopping}
                        className="text-[#404040] font-medium flex items-center gap-1 underline hover:text-[#B76E79] transition-colors"
                    >
                        Continue Shopping <span>→</span>
                    </button>
                </div>

                {/* Retry Message Display */}
                {retryMessage && (
                    <div className="mb-6">
                        <div className="p-3 bg-red-50 border border-red-200 rounded-lg">
                            <p className="text-sm text-red-700">
                                {retryMessage}
                            </p>
                        </div>
                    </div>
                )}

                {/* Help Section */}
                <div className="border border-gray-200 pt-6 text-center bg-gray-50">
                    <div className="rounded-lg p-4">
                        <div className="flex items-center justify-center gap-2 mb-2 text-lg">
                            <GiPhone className="text-[#404040] text-2xl" />
                            <p className="font-semibold text-[#404040]">
                                Need Help?
                            </p>
                        </div>
                        <div className="text-sm text-[#404040] space-y-1">
                            <p>Contact our support team for assistance:</p>
                            <p className="font-medium">
                                Email: contact@affordindia.com
                            </p>
                            <p className="font-medium">Phone: +91-9211501006</p>
                            <p className="text-xs mt-2">
                                Available Mon-Sat, 10:00 AM - 5:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
