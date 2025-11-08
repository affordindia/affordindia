import React, { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { getOrderById } from "../api/order.js";
// import { verifyPaymentStatus } from "../api/payment.js"; // Legacy API - commented out
import {
    verifyRazorpayPayment,
    retryRazorpayPayment,
    getRazorpayOrderStatus,
} from "../api/razorpay.js";
import { checkInvoiceExists, downloadInvoice } from "../api/invoice.js";
import Loader from "../components/common/Loader.jsx";
import { toast } from "react-hot-toast";
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
    FaFileInvoice,
    FaRedo,
} from "react-icons/fa";

const OrderDetail = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [verifyingPayment, setVerifyingPayment] = useState(false);
    const [verificationMessage, setVerificationMessage] = useState("");
    const [retryingPayment, setRetryingPayment] = useState(false);
    const [retryError, setRetryError] = useState("");
    const [paymentRedirecting, setPaymentRedirecting] = useState(false);

    // Invoice related state
    const [invoice, setInvoice] = useState(null);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [downloadingInvoice, setDownloadingInvoice] = useState(false);

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

    // Check for invoice when order is loaded
    useEffect(() => {
        const checkInvoice = async () => {
            if (!order?._id) return;

            try {
                setInvoiceLoading(true);
                const response = await checkInvoiceExists(order._id);
                if (response.exists) {
                    setInvoice(response.invoice);
                }
            } catch (error) {
                console.error("Failed to check invoice:", error);
                // Don't show error for invoice check as it's optional
            } finally {
                setInvoiceLoading(false);
            }
        };

        checkInvoice();
    }, [order?._id]);

    const handleVerifyPayment = async () => {
        try {
            setVerifyingPayment(true);
            setVerificationMessage("");

            // Check if order has razorpay order ID to verify against
            if (!order.razorpayOrderId) {
                setVerificationMessage(
                    "No payment information found to verify."
                );
                return;
            }

            // Get the Razorpay order status
            const response = await getRazorpayOrderStatus(
                order.razorpayOrderId
            );

            if (response.success) {
                const razorpayOrder = response.data;

                // Check if payment was successful on Razorpay side
                if (razorpayOrder.status === "paid") {
                    setVerificationMessage(
                        "Payment verified successfully! Updating order status..."
                    );

                    // If Razorpay shows payment as successful, try to update our order
                    // This should trigger our verification process
                    const updatedOrder = await getOrderById(orderId);
                    setOrder(updatedOrder);

                    if (updatedOrder.paymentStatus === "paid") {
                        setVerificationMessage(
                            "Payment verified and order updated successfully!"
                        );
                    } else {
                        setVerificationMessage(
                            "Payment is successful but order update is pending. Please contact support if this persists."
                        );
                    }
                } else if (
                    razorpayOrder.status === "created" ||
                    razorpayOrder.status === "attempted"
                ) {
                    setVerificationMessage(
                        "Payment is still pending. Please complete the payment or try again later."
                    );
                } else {
                    setVerificationMessage(
                        `Payment status: ${razorpayOrder.status}. Please retry payment if needed.`
                    );
                }
            } else {
                setVerificationMessage(
                    response.message || "Failed to verify payment status."
                );
            }
        } catch (error) {
            console.error("Payment verification failed:", error);
            setVerificationMessage(
                error.message || "Failed to verify payment. Please try again."
            );
        } finally {
            setVerifyingPayment(false);
        }
    };

    const handleRetryPayment = async () => {
        try {
            setRetryingPayment(true);
            setRetryError("");

            // Call the retry payment API to get new Razorpay order
            const { razorpayOrderId, razorpayKeyId } =
                await retryRazorpayPayment(orderId);

            // Initialize Razorpay payment
            const options = {
                key: razorpayKeyId,
                amount: order.total * 100,
                currency: "INR",
                name: "AffordIndia",
                description: `Retry Payment - Order #${order.orderId}`,
                order_id: razorpayOrderId,
                handler: async (response) => {
                    try {
                        const verification = await verifyRazorpayPayment({
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_signature: response.razorpay_signature,
                            orderId: orderId,
                        });

                        if (verification.success) {
                            // Set redirecting state to show loader
                            setPaymentRedirecting(true);

                            // Refresh order to show updated status (but don't show it to user)
                            const updatedOrder = await getOrderById(orderId);
                            setOrder(updatedOrder);

                            // Navigate directly to order confirmation page (same as checkout)
                            navigate(`/order-confirmation/${orderId}`, {
                                replace: true,
                                state: {
                                    paymentSuccess: true,
                                    paymentData: verification,
                                },
                            });
                        } else {
                            // Navigate directly to payment failed page (same as checkout)
                            navigate(`/payment-failed/${orderId}`, {
                                replace: true,
                                state: {
                                    error: "Payment verification failed. Please contact support.",
                                    canRetry: true,
                                },
                            });
                        }
                    } catch (error) {
                        console.error("Payment verification failed:", error);
                        // Navigate directly to payment failed page (same as checkout)
                        navigate(`/payment-failed/${orderId}`, {
                            replace: true,
                            state: {
                                error:
                                    error.message ||
                                    "Payment verification failed",
                                canRetry: true,
                            },
                        });
                    }
                },
                modal: {
                    ondismiss: () => {
                        console.log("Payment modal closed by user");
                        // Navigate directly to payment failed page (same as checkout)
                        navigate(`/payment-failed/${orderId}`, {
                            replace: true,
                            state: {
                                error: "Payment was cancelled by user",
                                canRetry: true,
                            },
                        });
                    },
                },
                prefill: {
                    name: order.userName || order.user?.name || "",
                    email: order.userEmail || order.user?.email || "",
                    contact: order.userPhone || order.user?.phone || "",
                },
                theme: {
                    color: "#B76E79",
                },
            };

            // Load Razorpay script if not already loaded (same as checkout flow)
            if (!window.Razorpay) {
                const script = document.createElement("script");
                script.src = "https://checkout.razorpay.com/v1/checkout.js";
                document.body.appendChild(script);
                await new Promise((resolve) => (script.onload = resolve));
            }

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error("Retry payment failed:", error);
            // Navigate directly to payment failed page for setup/connection errors (same as checkout)
            navigate(`/payment-failed/${orderId}`, {
                replace: true,
                state: {
                    error:
                        error.message ||
                        "Failed to retry payment. Please try again.",
                    canRetry: true,
                },
            });
        } finally {
            setRetryingPayment(false);
            setPaymentRedirecting(false);
        }
    };

    const handleDownloadInvoice = async () => {
        if (!order?._id || !invoice) return;

        try {
            setDownloadingInvoice(true);
            const pdfBlob = await downloadInvoice(order._id);

            // Create download link
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `Invoice-${invoice.invoiceNumber}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            console.error("Failed to download invoice:", error);
            setError("Failed to download invoice. Please try again.");
        } finally {
            setDownloadingInvoice(false);
        }
    };

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

    // Show payment redirect loader
    if (paymentRedirecting) {
        return (
            <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm z-50 flex items-center justify-center">
                <div className="bg-white rounded-lg p-8 max-w-sm mx-4 text-center shadow-xl">
                    <div className="mb-4">
                        <Loader />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">
                        Confirming Order
                    </h3>
                    <p className="text-sm text-gray-600">
                        Payment successful! Preparing confirmation...
                    </p>
                    <p className="text-xs text-gray-500 mt-3">
                        Do not refresh or close this page
                    </p>
                </div>
            </div>
        );
    }

    if (error || !order) {
        return (
            <div className="max-w-4xl mx-auto px-4 py-16 text-center">
                <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                    <p className="text-red-700 mb-4">
                        {error || "Order not found"}
                    </p>
                    <div className="flex gap-3 justify-center">
                        <Link
                            to="/orders"
                            className="bg-[#B76E79] text-white px-4 py-2 rounded hover:bg-white hover:text-[#B76E79] hover:border-2 hover:border-[#B76E79] transition-colors"
                        >
                            View All Orders
                        </Link>
                        <button
                            onClick={() => navigate(-1)}
                            className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-4 py-2 rounded hover:bg-[#B76E79] hover:text-white transition-colors"
                        >
                            Go Back
                        </button>
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
                                #{order.orderId} • Placed on{" "}
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
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <span className="text-sm text-[#404040]">
                                    Order:
                                </span>
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

                            {/* Invoice Button */}
                            {invoice && (
                                <button
                                    onClick={handleDownloadInvoice}
                                    disabled={downloadingInvoice}
                                    className="bg-[#B76E79] border-2 border-[#B76E79] text-white px-4 py-2 rounded-lg hover:bg-white  hover:text-[#B76E79] ransition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 text-sm"
                                >
                                    {downloadingInvoice ? (
                                        <>
                                            <FaClock className="animate-spin" />
                                            Downloading...
                                        </>
                                    ) : (
                                        <>
                                            <FaFileInvoice />
                                            Invoice
                                        </>
                                    )}
                                </button>
                            )}

                            {/* Loading state for invoice check */}
                            {invoiceLoading && (
                                <div className="flex items-center gap-2 text-sm text-gray-500">
                                    <FaClock className="animate-spin" />
                                    Checking invoice...
                                </div>
                            )}
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

                        {/* Payment Information */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaCreditCard />
                                    Payment Information
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="space-y-3 text-sm">
                                    <div className="flex justify-between">
                                        <span className="font-medium">
                                            Payment Method:
                                        </span>
                                        <span className="capitalize">
                                            {order.paymentMethod === "COD"
                                                ? "Cash on Delivery"
                                                : "Online Payment"}
                                        </span>
                                    </div>
                                    <div className="flex justify-between">
                                        <span className="font-medium">
                                            Payment Status:
                                        </span>
                                        <span
                                            className={`px-2 py-1 rounded-full font-medium text-[#404040]`}
                                        >
                                            {order.paymentStatus === "paid"
                                                ? "Paid"
                                                : order.paymentStatus ===
                                                  "failed"
                                                ? "Failed"
                                                : "Pending"}
                                        </span>
                                    </div>
                                    {order.paymentVerifiedAt && (
                                        <div className="flex justify-between">
                                            <span className="font-medium">
                                                Payment Verified:
                                            </span>
                                            <span className="text-green-600">
                                                {new Date(
                                                    order.paymentVerifiedAt
                                                ).toLocaleDateString("en-IN")}
                                            </span>
                                        </div>
                                    )}

                                    {/* Payment Action Buttons */}
                                    {(order.paymentMethod === "ONLINE" ||
                                        order.paymentMethod === "Razorpay") &&
                                        order.paymentStatus !== "paid" && (
                                            <div className="mt-4 pt-3 border-t">
                                                {/* Buttons Container - Side by Side */}

                                                {/* Retry Payment Button - Show for failed or pending payments */}
                                                <div className="flex items-center justify-center gap-4 mb-3">
                                                    {(order.paymentStatus ===
                                                        "failed" ||
                                                        order.paymentStatus ===
                                                            "pending") &&
                                                        order.status ===
                                                            "pending" && (
                                                            <button
                                                                onClick={
                                                                    handleRetryPayment
                                                                }
                                                                disabled={
                                                                    retryingPayment
                                                                }
                                                                className="w-full bg-[#B76E79] border-2 border-[#B76E79] text-white px-4 py-2 rounded-lg hover:scale-102 hover:shadow-sm transition-transform duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                            >
                                                                {retryingPayment ? (
                                                                    <>
                                                                        <FaClock className="animate-spin" />
                                                                        Processing...
                                                                    </>
                                                                ) : (
                                                                    <>
                                                                        <FaRedo />
                                                                        Retry
                                                                        Payment
                                                                    </>
                                                                )}
                                                            </button>
                                                        )}

                                                    {/* Verify Payment Button - Available immediately for pending payments */}
                                                    {order.paymentStatus ===
                                                        "pending" && (
                                                        <button
                                                            onClick={
                                                                handleVerifyPayment
                                                            }
                                                            disabled={
                                                                verifyingPayment
                                                            }
                                                            className="w-full border-2 border-[#B76E79] text-[#B76E79] bg-white px-4 py-2 rounded-lg hover:scale-102 hover:shadow-sm transition-transform duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                        >
                                                            {verifyingPayment ? (
                                                                <>
                                                                    <FaClock className="animate-spin" />
                                                                    Verifying...
                                                                </>
                                                            ) : (
                                                                <>
                                                                    <FaCheckCircle />
                                                                    Verify
                                                                    Payment
                                                                </>
                                                            )}
                                                        </button>
                                                    )}
                                                </div>

                                                {/* Messages Container - Below Buttons */}
                                                <div className="space-y-2">
                                                    {/* Verification Message */}
                                                    {verificationMessage && (
                                                        <div
                                                            className={`p-2 rounded text-xs ${
                                                                verificationMessage.includes(
                                                                    "successfully"
                                                                ) ||
                                                                verificationMessage.includes(
                                                                    "already verified"
                                                                )
                                                                    ? "bg-green-50 text-green-700 border border-green-200"
                                                                    : "bg-red-50 text-red-700 border border-red-200"
                                                            }`}
                                                        >
                                                            {
                                                                verificationMessage
                                                            }
                                                        </div>
                                                    )}

                                                    {/* Retry Error Message */}
                                                    {retryError && (
                                                        <div className="p-2 rounded text-xs bg-red-50 text-red-700 border border-red-200">
                                                            {retryError}
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        )}

                                    {/* Payment Status Messages */}
                                    {(order.paymentMethod === "ONLINE" ||
                                        order.paymentMethod === "Razorpay") && (
                                        <>
                                            {/* Pending Payment Warning */}
                                            {order.paymentStatus ===
                                                "pending" && (
                                                <div className="mt-2 p-3 border border-gray-300 shadow-sm rounded">
                                                    <p className="text-xs text-[#404040]">
                                                        ⚠️ Your payment is still
                                                        pending. If you've
                                                        already paid, click
                                                        'Verify Payment' to
                                                        check the status. You
                                                        can also retry payment
                                                        if needed.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Failed Payment Warning */}
                                            {order.paymentStatus ===
                                                "failed" && (
                                                <div className="mt-2 p-3 border border-gray-300 shadow-sm rounded">
                                                    <p className="text-xs text-[#404040]">
                                                        ❌ Payment failed. You
                                                        can retry the payment by
                                                        clicking "Retry Payment"
                                                        button above. No charges
                                                        have been made to your
                                                        account.
                                                    </p>
                                                </div>
                                            )}

                                            {/* Pending Payment Status */}
                                            {order.paymentStatus ===
                                                "pending" && (
                                                <div className="mt-2 p-3 border border-gray-300 shadow-sm rounded">
                                                    <p className="text-xs text-[#404040]">
                                                        🕒 Payment is currently
                                                        pending. You can verify
                                                        or retry the payment, or
                                                        contact support if
                                                        needed.
                                                    </p>
                                                </div>
                                            )}
                                        </>
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
                                    {order.items?.map((item, index) => {
                                        const hasDiscount =
                                            item.product?.discount &&
                                            item.product.discount > 0;
                                        const discountedPrice = hasDiscount
                                            ? Math.round(
                                                  item.product.price *
                                                      (1 -
                                                          item.product
                                                              .discount /
                                                              100)
                                              )
                                            : item.product.price;
                                        return (
                                            <div
                                                key={index}
                                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg"
                                            >
                                                <Link
                                                    to={`/products/id/${item.product?._id}`}
                                                >
                                                    <img
                                                        src={
                                                            item.product
                                                                ?.images?.[0] ||
                                                            "/placeholder.png"
                                                        }
                                                        alt={
                                                            item.product
                                                                ?.name ||
                                                            "Product"
                                                        }
                                                        className="w-14 h-14 object-cover rounded border cursor-pointer hover:opacity-90 transition"
                                                    />
                                                </Link>
                                                <div className="flex-1 min-w-0">
                                                    <h3 className="font-medium text-[#404040] text-sm truncate">
                                                        {item.product?.name ||
                                                            "Product"}
                                                    </h3>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        <p className="text-xs text-gray-600">
                                                            Qty: {item.quantity}
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className="text-right">
                                                    <div className="font-semibold text-[#404040] text-sm">
                                                        {hasDiscount ? (
                                                            <div className="flex flex-col items-center">
                                                                <span className="line-through text-gray-400 text-xs">
                                                                    ₹
                                                                    {item
                                                                        .product
                                                                        .price *
                                                                        item.quantity}
                                                                </span>
                                                                <span className="font-bold">
                                                                    ₹
                                                                    {discountedPrice *
                                                                        item.quantity}
                                                                </span>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                ₹
                                                                {item.price *
                                                                    item.quantity}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        );
                                    })}
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

                        {/* Billing Address */}
                        <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
                            <div className="bg-[#F7F4EF] px-4 py-3 border-b">
                                <h2 className="font-semibold text-[#404040] flex items-center gap-2 text-sm">
                                    <FaBox />
                                    Billing Address
                                </h2>
                            </div>
                            <div className="p-4">
                                <div className="bg-gray-50 p-3 rounded-lg">
                                    {order.billingAddressSameAsShipping ? (
                                        <p className="text-gray-600 text-sm italic">
                                            Same as shipping address
                                        </p>
                                    ) : (
                                        <p className="text-[#404040] text-sm leading-relaxed">
                                            {order.billingAddress?.houseNumber}
                                            ," "{order.billingAddress?.street}
                                            {order.billingAddress?.landmark &&
                                                `, ${order.billingAddress.landmark}`}
                                            <br />
                                            {order.billingAddress?.area}," "
                                            {order.billingAddress?.city}
                                            <br />
                                            {order.billingAddress?.state} -" "
                                            {order.billingAddress?.pincode}
                                            <br />
                                            {order.billingAddress?.country}
                                        </p>
                                    )}
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
                                            ₹
                                            {order.originalSubtotal?.toLocaleString?.() ||
                                                order.subtotal?.toLocaleString?.()}
                                        </span>
                                    </div>

                                    {order.totalDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Product Discount:
                                            </span>
                                            <span className="text-green-600">
                                                -₹
                                                {order.totalDiscount?.toLocaleString?.()}
                                            </span>
                                        </div>
                                    )}

                                    {order.couponDiscount > 0 && (
                                        <div className="flex justify-between text-sm">
                                            <span className="text-gray-600">
                                                Coupon Discount:
                                            </span>
                                            <span className="text-green-600">
                                                -₹
                                                {order.couponDiscount?.toLocaleString?.()}
                                            </span>
                                        </div>
                                    )}

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
                                                Grand Total:
                                            </span>
                                            <span className="text-lg text-[#404040]">
                                                ₹
                                                {order.total?.toLocaleString?.()}
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Payment Method */}
                        {/* <div className="bg-white border border-gray-300 rounded-lg overflow-hidden shadow-sm">
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
                        </div> */}

                        {/* Quick Actions */}
                        <div className="space-y-2">
                            <Link
                                to="/orders"
                                className="w-full bg-[#B76E79] border-2 border-[#B76E79] text-white px-4 py-2.5 rounded-lg font-medium hover:bg-white hover:text-[#B76E79] transition-colors text-center block text-sm"
                            >
                                View All Orders
                            </Link>
                            <Link
                                to="/products"
                                className="w-full bg-white border-2 border-[#B76E79] text-[#B76E79] px-4 py-2.5 rounded-lg font-medium hover:bg-[#B76E79] hover:text-white transition-colors text-center block text-sm"
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
