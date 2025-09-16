import React, { useState, useEffect } from "react";
import { useParams, useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { verifyPaymentStatus } from "../api/payment";
import { getOrderById } from "../api/order";

const PaymentStatus = () => {
    const { orderId } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { user } = useAuth();

    const [status, setStatus] = useState("loading");
    const [orderData, setOrderData] = useState(null);
    const [error, setError] = useState(null);
    const [isValidating, setIsValidating] = useState(true);
    const [countdown, setCountdown] = useState(null);
    const [autoRedirectCancelled, setAutoRedirectCancelled] = useState(false);

    useEffect(() => {
        const validatePaymentStatus = async () => {
            try {
                // Redirect to login if not authenticated
                if (!user) {
                    navigate("/login");
                    return;
                }

                // Check if this is an error redirect from backend
                const errorType = searchParams.get("error");
                const errorDetails = searchParams.get("details");

                if (errorType) {
                    // Handle backend error redirects with specific status types
                    let errorMessage =
                        "Something went wrong with your payment. Please try again.";
                    let specificStatus = "error";

                    switch (errorType) {
                        case "invalid_signature":
                            errorMessage =
                                "There was a security issue with your payment. Please try again.";
                            specificStatus = "signature_error";
                            break;
                        case "missing_order_id":
                            errorMessage =
                                "Payment information is incomplete. Please try placing your order again.";
                            specificStatus = "missing_data_error";
                            break;
                        case "order_not_found":
                            errorMessage =
                                "We couldn't find your order. Please check your order history or try again.";
                            specificStatus = "order_error";
                            break;
                        case "verification_failed":
                            errorMessage =
                                "Payment verification failed for security reasons. Please try again or contact support.";
                            specificStatus = "verification_error";
                            break;
                        case "processing_failed":
                            errorMessage =
                                "Something went wrong while processing your payment. Please try again.";
                            specificStatus = "processing_error";
                            break;
                        default:
                            errorMessage =
                                "Something went wrong with your payment. Please try again.";
                            specificStatus = "error";
                    }

                    setError(errorMessage);
                    setStatus(specificStatus);
                    setIsValidating(false);
                    return;
                }

                // Get order ID from URL params or search params
                const orderIdToCheck = orderId || searchParams.get("orderId");

                if (!orderIdToCheck) {
                    setError("No order ID provided");
                    setStatus("error");
                    setIsValidating(false);
                    return;
                }

                // First, get the order details to check payment method
                const orderDetails = await getOrderById(orderIdToCheck);

                if (!orderDetails) {
                    setError("Order not found");
                    setStatus("error");
                    setIsValidating(false);
                    return;
                }

                // Handle based on payment method
                if (orderDetails.paymentMethod === "COD") {
                    // For COD orders, just show the order status - no payment verification needed

                    setOrderData({
                        success: true,
                        paymentStatus: "cod", // Special status for COD
                        orderStatus: orderDetails.status,
                        orderId: orderDetails._id,
                        customOrderId: orderDetails.orderId,
                        order: orderDetails,
                    });
                    setStatus("cod");
                } else {
                    // For online payments, verify payment status

                    const result = await verifyPaymentStatus(orderIdToCheck);

                    if (result.success) {
                        setOrderData(result);
                        setStatus(result.paymentStatus || "unknown");
                    } else {
                        setError(result.message || "Failed to verify payment");
                        setStatus("error");
                    }
                }
            } catch (err) {
                console.error("Payment verification failed:", err);
                setError(err.message || "Failed to verify payment status");
                setStatus("error");
            } finally {
                setIsValidating(false);
            }
        };

        validatePaymentStatus();
    }, [orderId, searchParams, user, navigate]);

    // Auto-refresh for pending payments (only for online payments, not COD)
    useEffect(() => {
        if (
            status === "pending" &&
            orderData &&
            orderData.paymentMethod !== "COD"
        ) {
            const interval = setInterval(async () => {
                try {
                    const result = await verifyPaymentStatus(orderData.orderId);
                    if (result.success && result.paymentStatus !== "pending") {
                        setOrderData(result);
                        setStatus(result.paymentStatus);
                    }
                } catch (err) {
                    console.error("Auto-refresh failed:", err);
                }
            }, 5000); // Check every 5 seconds

            return () => clearInterval(interval);
        }
    }, [status, orderData]);

    // Auto-redirect to order confirmation for successful payments
    useEffect(() => {
        if (
            (status === "paid" || status === "cod") &&
            orderData &&
            !autoRedirectCancelled &&
            !isValidating
        ) {
            setCountdown(5);

            const countdownInterval = setInterval(() => {
                setCountdown((prev) => {
                    if (prev <= 1) {
                        clearInterval(countdownInterval);
                        // Redirect to order confirmation page
                        navigate(`/order-confirmation/${orderData.orderId}`, {
                            replace: true,
                        });
                        return 0;
                    }
                    return prev - 1;
                });
            }, 1000);

            return () => clearInterval(countdownInterval);
        }
    }, [status, orderData, autoRedirectCancelled, isValidating, navigate]);

    const cancelAutoRedirect = () => {
        setAutoRedirectCancelled(true);
        setCountdown(null);
    };

    const getStatusConfig = () => {
        switch (status) {
            case "cod":
                return {
                    title: "Order Confirmed!",
                    message:
                        "Your cash on delivery order has been placed successfully. Pay when you receive your order.",
                    icon: "💰",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    actions: [
                        {
                            text: "View Order Details",
                            action: () =>
                                navigate(`/orders/${orderData.orderId}`),
                        },
                        {
                            text: "Continue Shopping",
                            action: () => navigate("/"),
                        },
                    ],
                };
            case "paid":
                return {
                    title: "Payment Successful!",
                    message: "Your payment has been processed successfully.",
                    icon: "✅",
                    color: "text-green-600",
                    bgColor: "bg-green-50",
                    borderColor: "border-green-200",
                    actions: [
                        {
                            text: "View Order Details",
                            action: () =>
                                navigate(`/orders/${orderData.orderId}`),
                        },
                        {
                            text: "Continue Shopping",
                            action: () => navigate("/"),
                        },
                    ],
                };
            case "failed":
                return {
                    title: "Payment Failed",
                    message:
                        "We couldn't process your payment. Don't worry - your order hasn't been placed and you haven't been charged.",
                    icon: "❌",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    actions: [
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                        { text: "Go to Cart", action: () => navigate("/cart") },
                    ],
                };
            case "cancelled":
                return {
                    title: "Payment Cancelled",
                    message: "You cancelled the payment process.",
                    icon: "🚫",
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    actions: [
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                        { text: "Go to Cart", action: () => navigate("/cart") },
                    ],
                };
            case "pending":
                return {
                    title: "Payment Processing",
                    message: "Your payment is being processed. Please wait...",
                    icon: "⏳",
                    color: "text-blue-600",
                    bgColor: "bg-blue-50",
                    borderColor: "border-blue-200",
                    actions: [
                        {
                            text: "Refresh Status",
                            action: () => window.location.reload(),
                        },
                    ],
                };
            case "signature_error":
                return {
                    title: "Security Check Failed",
                    message:
                        "For your protection, we couldn't verify this payment. Please try again with a new payment.",
                    icon: "🔒",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    actions: [
                        {
                            text: "Try Payment Again",
                            action: () => navigate("/checkout"),
                        },
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                    ],
                };
            case "verification_error":
                return {
                    title: "Payment Verification Issue",
                    message:
                        "We couldn't verify your payment details for security reasons. Please try again or use a different payment method.",
                    icon: "🛡️",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    actions: [
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                    ],
                };
            case "order_error":
                return {
                    title: "Order Not Found",
                    message:
                        "We couldn't find your order details. You can check your order history or contact us for help.",
                    icon: "📋",
                    color: "text-orange-600",
                    bgColor: "bg-orange-50",
                    borderColor: "border-orange-200",
                    actions: [
                        {
                            text: "View My Orders",
                            action: () => navigate("/orders"),
                        },
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                        { text: "Go Home", action: () => navigate("/") },
                    ],
                };
            case "missing_data_error":
                return {
                    title: "Payment Information Incomplete",
                    message:
                        "Some payment information is missing. Please try placing your order again.",
                    icon: "📄",
                    color: "text-yellow-600",
                    bgColor: "bg-yellow-50",
                    borderColor: "border-yellow-200",
                    actions: [
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                    ],
                };
            case "processing_error":
                return {
                    title: "Payment Processing Issue",
                    message:
                        "Something went wrong while processing your payment. Don't worry - our team has been notified and will help resolve this.",
                    icon: "⚡",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    actions: [
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                    ],
                };
            case "error":
                return {
                    title: "Payment Issue",
                    message:
                        "Something went wrong with your payment. Don't worry - you haven't been charged if the payment failed.",
                    icon: "⚠️",
                    color: "text-red-600",
                    bgColor: "bg-red-50",
                    borderColor: "border-red-200",
                    actions: [
                        {
                            text: "Try Again",
                            action: () => navigate("/checkout"),
                        },
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                        { text: "Go Home", action: () => navigate("/") },
                    ],
                };
            default:
                return {
                    title: "Unable to Check Payment Status",
                    message:
                        "We're having trouble checking your payment status. Please contact support for assistance.",
                    icon: "❓",
                    color: "text-gray-600",
                    bgColor: "bg-gray-50",
                    borderColor: "border-gray-200",
                    actions: [
                        {
                            text: "Contact Support",
                            action: () => navigate("/contact"),
                        },
                        { text: "Go Home", action: () => navigate("/") },
                    ],
                };
        }
    };

    if (isValidating) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="bg-white rounded-lg p-8 shadow-lg text-center max-w-md w-full mx-4">
                    <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-200 border-t-blue-600 mx-auto mb-6"></div>
                    <h2 className="text-xl font-semibold text-gray-700 mb-2">
                        Verifying Payment Status...
                    </h2>
                    <p className="text-gray-500 text-sm">
                        Please wait while we check your payment and order
                        details.
                    </p>
                    <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-blue-600 h-2 rounded-full animate-pulse w-2/3"></div>
                    </div>
                </div>
            </div>
        );
    }

    const config = getStatusConfig();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-8">
            <div className="max-w-lg w-full">
                <div
                    className={`${config.bgColor} ${config.borderColor} border rounded-xl p-6 text-center shadow-xl`}
                >
                    <div className="text-6xl mb-6">{config.icon}</div>

                    <h1 className={`text-2xl font-bold ${config.color} mb-4`}>
                        {config.title}
                    </h1>

                    <p className="text-gray-600 mb-6">{config.message}</p>

                    {orderData && (
                        <div className="bg-white rounded-lg p-4 mb-6 text-left border">
                            <h3 className="font-semibold text-gray-700 mb-3">
                                Payment Summary
                            </h3>
                            <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Order ID:
                                    </span>
                                    <span className="font-medium">
                                        {orderData.customOrderId ||
                                            orderData.orderId}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Payment Method:
                                    </span>
                                    <span className="font-medium">
                                        {orderData.order?.paymentMethod ===
                                        "COD"
                                            ? "Cash on Delivery"
                                            : "Online Payment"}
                                    </span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-500">
                                        Payment Status:
                                    </span>
                                    <span
                                        className={`font-medium capitalize ${config.color}`}
                                    >
                                        {orderData.paymentStatus === "cod"
                                            ? "COD"
                                            : orderData.paymentStatus}
                                    </span>
                                </div>
                                <div className="border-t pt-2 mt-3">
                                    <div className="flex justify-between font-semibold text-lg">
                                        <span className="text-gray-700">
                                            Amount:
                                        </span>
                                        <span className="text-green-600">
                                            ₹
                                            {orderData.order?.total?.toLocaleString(
                                                "en-IN"
                                            ) ||
                                                orderData.total?.toLocaleString(
                                                    "en-IN"
                                                ) ||
                                                "N/A"}
                                        </span>
                                    </div>
                                </div>
                                {orderData.verifiedAt && (
                                    <div className="flex justify-between pt-2">
                                        <span className="text-gray-500">
                                            Verified At:
                                        </span>
                                        <span className="font-medium">
                                            {new Date(
                                                orderData.verifiedAt
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Auto-redirect countdown for successful payments */}
                    {countdown !== null &&
                        (status === "paid" || status === "cod") && (
                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-2">
                                        <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                                        <span className="text-blue-700 font-medium">
                                            Redirecting to order details in{" "}
                                            {countdown} seconds...
                                        </span>
                                    </div>
                                    <button
                                        onClick={cancelAutoRedirect}
                                        className="text-blue-600 hover:text-blue-800 font-medium text-sm underline"
                                    >
                                        Stay Here
                                    </button>
                                </div>
                            </div>
                        )}

                    <div className="space-y-3">
                        {config.actions.map((action, index) => {
                            // Define proper button colors based on status
                            let buttonClasses = "";

                            if (index === 0) {
                                // Primary button - use status-specific colors
                                switch (status) {
                                    case "cod":
                                    case "paid":
                                        buttonClasses =
                                            "bg-green-600 hover:bg-green-700 text-white";
                                        break;
                                    case "failed":
                                    case "error":
                                    case "signature_error":
                                    case "verification_error":
                                    case "processing_error":
                                        buttonClasses =
                                            "bg-red-600 hover:bg-red-700 text-white";
                                        break;
                                    case "cancelled":
                                    case "missing_data_error":
                                        buttonClasses =
                                            "bg-yellow-600 hover:bg-yellow-700 text-white";
                                        break;
                                    case "pending":
                                        buttonClasses =
                                            "bg-blue-600 hover:bg-blue-700 text-white";
                                        break;
                                    case "order_error":
                                        buttonClasses =
                                            "bg-orange-600 hover:bg-orange-700 text-white";
                                        break;
                                    default:
                                        buttonClasses =
                                            "bg-gray-600 hover:bg-gray-700 text-white";
                                }
                            } else {
                                // Secondary button - neutral colors
                                buttonClasses =
                                    "bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300";
                            }

                            return (
                                <button
                                    key={index}
                                    onClick={action.action}
                                    className={`w-full py-3 px-4 rounded-lg font-medium transition-colors ${buttonClasses}`}
                                >
                                    {action.text}
                                </button>
                            );
                        })}
                    </div>

                    {status === "pending" && (
                        <div className="mt-4 text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                <span>Auto-refreshing status...</span>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentStatus;
