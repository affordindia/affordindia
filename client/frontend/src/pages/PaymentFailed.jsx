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
    FaPhone,
} from "react-icons/fa";

const PaymentFailed = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { user } = useAuth();

    const [loading, setLoading] = useState(true);
    const [order, setOrder] = useState(null);
    const [retryLoading, setRetryLoading] = useState(false);
    const [error, setError] = useState(null);

    // Get error details from navigation state
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
                // Brief loading for better UX
                setTimeout(() => setLoading(false), 1000);
            }
        };

        fetchOrderDetails();
    }, [orderId, user, navigate]);

    const handleRetryPayment = async () => {
        if (!order || retryLoading) return;

        try {
            setRetryLoading(true);
            toast.loading("Initiating payment retry...");

            // Retry payment for the order
            const { razorpayOrderId } = await retryRazorpayPayment(orderId);

            // Initialize Razorpay payment
            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID,
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
                            navigate(`/order-confirmation/${orderId}`);
                        } else {
                            toast.error("Payment verification failed");
                            setError(
                                "Payment verification failed. Please try again."
                            );
                        }
                    } catch (error) {
                        toast.dismiss();
                        toast.error("Payment verification failed");
                        setError(
                            error.message || "Payment verification failed"
                        );
                    }
                },
                modal: {
                    ondismiss: () => {
                        toast.dismiss();
                        toast.error("Payment cancelled");
                    },
                },
                prefill: {
                    name: user?.name || "",
                    email: user?.email || "",
                    contact: user?.phone || "",
                },
                theme: {
                    color: "#3B82F6",
                },
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (err) {
            console.error("Payment retry error:", err);
            toast.dismiss();
            toast.error(err.message || "Failed to retry payment");
            setError(
                err.message || "Failed to retry payment. Please try again."
            );
        } finally {
            setRetryLoading(false);
        }
    };

    const handleViewCart = () => {
        navigate("/cart");
    };

    const handleContinueShopping = () => {
        navigate("/");
    };

    const handleViewOrders = () => {
        navigate("/orders");
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
        }).format(amount);
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
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
            <div className="bg-white border border-gray-300 rounded-lg p-8">
                {/* Failed Icon */}
                <div className="text-center mb-8">
                    <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaTimesCircle className="text-red-500 text-3xl" />
                    </div>
                    <h1 className="text-3xl font-bold text-[#404040] mb-4">
                        Payment Failed
                    </h1>
                    <p className="text-lg text-gray-600 mb-2">
                        {paymentError ||
                            "Your payment could not be processed at this time."}
                    </p>
                </div>

                {/* Order Details */}
                {order && (
                    <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 mb-6">
                        <h3 className="text-lg font-semibold text-[#404040] mb-4">
                            Order Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-gray-600">Order Number:</p>
                                <p className="font-medium">{order.orderId}</p>
                            </div>
                            <div>
                                <p className="text-gray-600">Amount:</p>
                                <p className="font-medium text-lg ">
                                    {formatCurrency(order.total)}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Payment Method:</p>
                                <p className="font-medium">
                                    {order.paymentMethod}
                                </p>
                            </div>
                            <div>
                                <p className="text-gray-600">Status:</p>
                                <span className="inline-block bg-red-100 text-red-700 text-xs px-2 py-1 rounded">
                                    Payment Pending
                                </span>
                            </div>
                        </div>

                        {order.items && order.items.length > 0 && (
                            <div className="mt-4">
                                <p className="text-gray-600 text-sm mb-2">
                                    Items ({order.items.length}):
                                </p>
                                <div className="space-y-2">
                                    {order.items
                                        .slice(0, 3)
                                        .map((item, index) => (
                                            <div
                                                key={index}
                                                className="flex justify-between text-sm"
                                            >
                                                <span>
                                                    {item.product.name ||
                                                        item.name}{" "}
                                                    × {item.quantity}
                                                </span>
                                                <span className="font-medium">
                                                    {formatCurrency(
                                                        item.discountedPrice *
                                                            item.quantity
                                                    )}
                                                </span>
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

                {/* Failure Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-red-700">
                        <p className="font-medium mb-2 flex items-center justify-center gap-2">
                            <FaExclamationTriangle />
                            Payment was not completed
                        </p>
                        <div className="text-center space-y-1">
                            <p>• Your order is on hold pending payment</p>
                            <p>• No amount has been charged to your account</p>
                            <p>
                                • Stock is reserved temporarily (will be
                                released if not paid within 24 hours)
                            </p>
                            <p>
                                • You can retry payment or choose a different
                                payment method
                            </p>
                        </div>
                    </div>
                </div>

                {/* Possible Reasons */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-yellow-700">
                        <p className="font-medium mb-2">
                            Common reasons for payment failure:
                        </p>
                        <ul className="text-left space-y-1 ml-4">
                            <li>• Insufficient funds in your account</li>
                            <li>• Network connectivity issues</li>
                            <li>• Daily transaction limit exceeded</li>
                            <li>• Incorrect card details or expired card</li>
                            <li>• Payment gateway timeout</li>
                            <li>• International transactions blocked</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-6">
                    {canRetry && order && (
                        <button
                            onClick={handleRetryPayment}
                            disabled={retryLoading}
                            className="bg-[#B76E79] text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#B76E79] hover:border-2 hover:border-[#B76E79] transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                        >
                            {retryLoading ? (
                                <FaSpinner className="animate-spin" />
                            ) : (
                                <FaRedo />
                            )}
                            {retryLoading ? "Processing..." : "Retry Payment"}
                        </button>
                    )}

                    <button
                        onClick={handleViewOrders}
                        className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-6 py-3 rounded-lg hover:bg-[#B76E79] hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FaShoppingCart />
                        View My Orders
                    </button>

                    <button
                        onClick={handleContinueShopping}
                        className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-6 py-3 rounded-lg hover:bg-[#B76E79] hover:text-white transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Help Section */}
                <div className="border-t border-gray-200 pt-6 text-center">
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex items-center justify-center gap-2 mb-2">
                            <FaPhone className="text-blue-600" />
                            <p className="font-medium text-blue-800">
                                Need Help?
                            </p>
                        </div>
                        <div className="text-sm text-blue-700 space-y-1">
                            <p>Contact our support team for assistance:</p>
                            <p className="font-medium">
                                Email: contact@affordindia.com
                            </p>
                            <p className="font-medium">Phone: +91-9899927002</p>
                            <p className="text-xs mt-2">
                                Available Mon-Sat, 10:00 AM - 6:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
