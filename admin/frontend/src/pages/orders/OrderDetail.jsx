import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    FaArrowLeft,
    FaEdit,
    FaTrash,
    FaBox,
    FaTruck,
    FaCheckCircle,
    FaClock,
    FaTimesCircle,
    FaUser,
    FaMapMarkerAlt,
    FaCreditCard,
    FaShoppingCart,
    FaFileInvoice,
    FaPlus,
    FaEye,
} from "react-icons/fa";
import {
    getOrderById,
    updateOrderStatus,
    deleteOrder,
} from "../../api/orders.api.js";
import {
    checkInvoiceByOrderId,
    generateInvoice,
    getInvoiceDetailsByOrderId,
} from "../../api/invoice.api.js";
import Loader from "../../components/common/Loader.jsx";
import OrderStatusBadge from "../../components/orders/OrderStatusBadge.jsx";
import PaymentStatusBadge from "../../components/orders/PaymentStatusBadge.jsx";
import ProtectedComponent from "../../components/common/ProtectedComponent.jsx";
import InvoiceModal from "../../components/orders/InvoiceModal.jsx";

const OrderDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [updating, setUpdating] = useState(false);
    const [showStatusModal, setShowStatusModal] = useState(false);
    const [showPaymentModal, setShowPaymentModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [newStatus, setNewStatus] = useState("");
    const [newPaymentStatus, setNewPaymentStatus] = useState("");

    // Invoice related state
    const [invoice, setInvoice] = useState(null);
    const [invoiceLoading, setInvoiceLoading] = useState(false);
    const [showInvoiceModal, setShowInvoiceModal] = useState(false);
    const [generatingInvoice, setGeneratingInvoice] = useState(false);

    const orderStatusOptions = [
        "pending",
        "processing",
        "shipped",
        "delivered",
        "cancelled",
        "returned",
    ];

    const paymentStatusOptions = ["pending", "paid", "failed"];

    useEffect(() => {
        fetchOrder();
    }, [id]);

    const fetchOrder = async () => {
        try {
            setLoading(true);
            setError(null);
            const response = await getOrderById(id);
            if (response.success) {
                setOrder(response.order);
                // Also check for invoice existence
                checkInvoiceExists(id);
            } else {
                setError(response.error || "Order not found");
            }
        } catch (error) {
            console.error("Error fetching order:", error);
            setError("Failed to load order details");
        } finally {
            setLoading(false);
        }
    };

    const checkInvoiceExists = async (orderId) => {
        try {
            setInvoiceLoading(true);
            const response = await checkInvoiceByOrderId(orderId);
            if (response.success && response.invoice) {
                setInvoice(response.invoice);
            } else {
                setInvoice(null);
            }
        } catch (err) {
            console.error("Error checking invoice:", err);
            setInvoice(null);
        } finally {
            setInvoiceLoading(false);
        }
    };

    const handleStatusUpdate = async () => {
        if (!newStatus) return;

        try {
            setUpdating(true);
            const response = await updateOrderStatus(id, { status: newStatus });
            if (response.success) {
                setOrder((prev) => ({ ...prev, status: newStatus }));
                setShowStatusModal(false);
                setNewStatus("");
            } else {
                setError(response.error || "Failed to update status");
            }
        } catch (error) {
            console.error("Error updating status:", error);
            setError("Failed to update order status");
        } finally {
            setUpdating(false);
        }
    };

    const handlePaymentStatusUpdate = async () => {
        if (!newPaymentStatus) return;

        try {
            setUpdating(true);
            const response = await updateOrderStatus(id, {
                paymentStatus: newPaymentStatus,
            });
            if (response.success) {
                setOrder((prev) => ({
                    ...prev,
                    paymentStatus: newPaymentStatus,
                }));
                setShowPaymentModal(false);
                setNewPaymentStatus("");
            } else {
                setError(response.error || "Failed to update payment status");
            }
        } catch (error) {
            console.error("Error updating payment status:", error);
            setError("Failed to update payment status");
        } finally {
            setUpdating(false);
        }
    };

    const handleDeleteOrder = async () => {
        try {
            setUpdating(true);
            const response = await deleteOrder(id);
            if (response.success) {
                navigate("/orders");
            } else {
                setError(response.error || "Failed to delete order");
            }
        } catch (error) {
            console.error("Error deleting order:", error);
            setError("Failed to delete order");
        } finally {
            setUpdating(false);
            setShowDeleteModal(false);
        }
    };

    // Invoice handling functions
    const handleGenerateInvoice = async () => {
        try {
            setGeneratingInvoice(true);
            const response = await generateInvoice(id);
            if (response.success) {
                setInvoice(response.invoice);
            } else {
                alert(response.error || "Failed to generate invoice");
            }
        } catch (error) {
            console.error("Error generating invoice:", error);
            alert("Failed to generate invoice. Please try again.");
        } finally {
            setGeneratingInvoice(false);
        }
    };

    const handleViewInvoice = async () => {
        if (!invoice) return;

        try {
            setInvoiceLoading(true);
            const response = await getInvoiceDetailsByOrderId(id);
            if (response.success) {
                setInvoice(response.invoice);
                setShowInvoiceModal(true);
            } else {
                alert(response.error || "Failed to load invoice details");
            }
        } catch (error) {
            console.error("Error loading invoice details:", error);
            alert("Failed to load invoice details. Please try again.");
        } finally {
            setInvoiceLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        const numAmount = Number(amount) || 0;
        return `₹${numAmount.toLocaleString("en-IN")}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString("en-IN", {
            day: "2-digit",
            month: "short",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const getStatusIcon = (status) => {
        switch (status?.toLowerCase()) {
            case "pending":
                return <FaClock className="text-admin-warning" />;
            case "processing":
                return <FaBox className="text-admin-info" />;
            case "shipped":
                return <FaTruck className="text-admin-primary" />;
            case "delivered":
                return <FaCheckCircle className="text-admin-success" />;
            case "cancelled":
            case "returned":
                return <FaTimesCircle className="text-admin-error" />;
            default:
                return <FaClock className="text-admin-text-secondary" />;
        }
    };

    // Helper functions for display data
    const getDisplayName = (order) => {
        return (
            order.receiverName ||
            order.userDetails?.name ||
            order.user?.name ||
            "N/A"
        );
    };

    const getDisplayEmail = (order) => {
        return order.userDetails?.email || order.user?.email || "N/A";
    };

    const getDisplayPhone = (order) => {
        return (
            order.receiverPhone ||
            order.userDetails?.phone ||
            order.user?.phone ||
            "N/A"
        );
    };

    // Helper function to get order ID display
    const getOrderId = (order) => {
        return order._id?.toString().slice(-8).toUpperCase() || "N/A";
    };

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (!order) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ Order not found
                    </div>
                    <div className="flex gap-3 justify-center">
                        <button
                            onClick={() => navigate(-1)}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark mr-4 transition-colors"
                        >
                            Go Back
                        </button>
                        <button
                            onClick={() => navigate("/orders")}
                            className="px-4 py-2 text-admin-text-secondary bg-admin-card border border-admin-border rounded-lg hover:bg-admin-bg hover:text-admin-text focus:outline-none focus:ring-2 focus:ring-admin-primary transition-all duration-200 disabled:opacity-50"
                        >
                            All Orders
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="fixed inset-0 bg-blur-xs bg-opacity-40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                <div className="bg-admin-card rounded-lg p-6 max-w-md w-full border border-admin-border shadow-xl text-center">
                    <div className="text-admin-error text-lg mb-4">
                        ⚠️ {error}
                    </div>
                    <button
                        onClick={() => setError(null)}
                        className="mt-4 px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors font-semibold"
                    >
                        OK
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate(-1)}
                            className="p-2 text-admin-text-secondary hover:text-admin-text hover:bg-admin-bg rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-6">
                            <div>
                                <h1 className="text-2xl font-bold text-admin-text">
                                    Order #{getOrderId(order)}
                                </h1>
                                <p className="text-admin-text-secondary">
                                    Placed on {formatDate(order.createdAt)}
                                </p>
                            </div>
                            {/* Compact Order Status */}
                            <div className="flex items-center gap-3 pl-6 border-l border-admin-border">
                                <div className="flex items-center gap-2">
                                    <FaShoppingCart className="text-admin-primary w-4 h-4" />
                                    <OrderStatusBadge status={order.status} />
                                </div>
                                <ProtectedComponent permission="orders.update">
                                    <button
                                        onClick={() => {
                                            setNewStatus(order.status);
                                            setShowStatusModal(true);
                                        }}
                                        className="text-admin-primary hover:text-admin-primary-dark text-sm flex items-center gap-1"
                                    >
                                        <FaEdit className="w-3 h-3" />
                                        Update
                                    </button>
                                </ProtectedComponent>
                            </div>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        <ProtectedComponent
                            permission="orders.cancel"
                            view={true}
                        >
                            <button
                                onClick={() => setShowDeleteModal(true)}
                                className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                            >
                                <FaTrash className="w-4 h-4" />
                                Delete Order
                            </button>
                        </ProtectedComponent>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column - Order Items, Account & Delivery Info */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Order Items */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaBox className="text-admin-primary" />
                            Order Items ({order.items?.length || 0})
                        </h2>
                        <div className="space-y-4">
                            {order.items?.map((item, index) => (
                                <div
                                    key={index}
                                    className="flex items-center gap-4 p-4 bg-admin-bg rounded-lg"
                                >
                                    <div className="w-16 h-16 bg-white rounded-lg flex items-center justify-center overflow-hidden">
                                        {item.product?.images?.[0] ? (
                                            <img
                                                src={item.product.images[0]}
                                                alt={item.product.name}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <FaBox className="text-admin-text-secondary w-6 h-6" />
                                        )}
                                    </div>
                                    <div className="flex-1">
                                        <h3 className="font-medium text-admin-text">
                                            {item.product?.name ||
                                                `Product ID: ${item.product}`}
                                        </h3>
                                        <div className="flex items-center gap-4 text-sm text-admin-text-secondary mt-1">
                                            <span>Qty: {item.quantity}</span>
                                            <span>
                                                Price:{" "}
                                                {formatCurrency(item.price)}
                                            </span>
                                            {item.discountedPrice &&
                                                item.discountedPrice !==
                                                    item.price && (
                                                    <span className="text-admin-success">
                                                        Discounted:{" "}
                                                        {formatCurrency(
                                                            item.discountedPrice
                                                        )}
                                                    </span>
                                                )}
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-semibold text-admin-text">
                                            {formatCurrency(
                                                item.quantity *
                                                    (item.discountedPrice ||
                                                        item.price)
                                            )}
                                        </div>
                                        {item.discountedPrice &&
                                            item.discountedPrice !==
                                                item.price && (
                                                <div className="text-sm text-admin-text-secondary line-through">
                                                    {formatCurrency(
                                                        item.quantity *
                                                            item.price
                                                    )}
                                                </div>
                                            )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Account & Delivery Info Row */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        {/* Customer Information */}
                        <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                            <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                                <FaUser className="text-admin-primary" />
                                User Account Details
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Name
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.userDetails?.name ||
                                            order.user?.name ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Email
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.userDetails?.email ||
                                            order.user?.email ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Phone
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.userDetails?.phone ||
                                            order.user?.phone ||
                                            "N/A"}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Receiver Information */}
                        <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                            <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                                <FaMapMarkerAlt className="text-admin-warning" />
                                Delivery Information
                            </h2>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Receiver Name
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.receiverName ||
                                            "Same as account"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Receiver Phone
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.receiverPhone ||
                                            "Same as account"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Shipping Address
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {(order.shippingAddress?.street && (
                                            <>
                                                {order.shippingAddress
                                                    .houseNumber &&
                                                    `${order.shippingAddress.houseNumber}, `}
                                                {order.shippingAddress.street}
                                                <br />
                                                {order.shippingAddress.area &&
                                                    `${order.shippingAddress.area}, `}
                                                {order.shippingAddress.city},{" "}
                                                {order.shippingAddress.state}{" "}
                                                {order.shippingAddress.pincode}
                                                <br />
                                                {order.shippingAddress
                                                    .country || "India"}
                                            </>
                                        )) ||
                                            "N/A"}
                                    </div>
                                </div>
                                <div>
                                    <div className="text-sm text-admin-text-secondary">
                                        Billing Address
                                    </div>
                                    <div className="font-medium text-admin-text">
                                        {order.billingAddressSameAsShipping ? (
                                            <span className="italic text-admin-text-secondary">
                                                Same as shipping address
                                            </span>
                                        ) : (
                                            (order.billingAddress?.street && (
                                                <>
                                                    {order.billingAddress
                                                        .houseNumber &&
                                                        `${order.billingAddress.houseNumber}, `}
                                                    {
                                                        order.billingAddress
                                                            .street
                                                    }
                                                    <br />
                                                    {order.billingAddress
                                                        .area &&
                                                        `${order.billingAddress.area}, `}
                                                    {order.billingAddress.city},{" "}
                                                    {order.billingAddress.state}{" "}
                                                    {
                                                        order.billingAddress
                                                            .pincode
                                                    }
                                                    <br />
                                                    {order.billingAddress
                                                        .country || "India"}
                                                </>
                                            )) ||
                                            "N/A"
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Right Column - Payment & Timeline */}
                <div className="space-y-6">
                    {/* Payment Summary */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaCreditCard className="text-admin-success" />
                            Payment Summary
                        </h2>
                        <div className="space-y-3">
                            <div className="flex justify-between">
                                <span className="text-admin-text-secondary">
                                    Subtotal
                                </span>
                                <span className="text-admin-text">
                                    {formatCurrency(order.subtotal || 0)}
                                </span>
                            </div>
                            {order.shippingFee > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        Shipping Fee
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(order.shippingFee)}
                                    </span>
                                </div>
                            )}
                            {order.totalDiscount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        Product Discount
                                    </span>
                                    <span className="text-admin-success">
                                        -{formatCurrency(order.totalDiscount)}
                                    </span>
                                </div>
                            )}
                            {order.couponDiscount > 0 && (
                                <div className="flex justify-between">
                                    <span className="text-admin-text-secondary">
                                        Coupon Discount
                                    </span>
                                    <span className="text-admin-success">
                                        -{formatCurrency(order.couponDiscount)}
                                    </span>
                                </div>
                            )}
                            <div className="border-t border-admin-border pt-3">
                                <div className="flex justify-between font-semibold text-lg">
                                    <span className="text-admin-text">
                                        Total Amount
                                    </span>
                                    <span className="text-admin-text">
                                        {formatCurrency(order.total || 0)}
                                    </span>
                                </div>
                            </div>

                            {/* Payment Status under Payment Summary */}
                            <div className="mt-4 pt-4 border-t border-admin-border">
                                <div className="flex items-center justify-between mb-2">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-admin-text">
                                            Payment Method
                                        </span>
                                    </div>
                                    <span className="text-sm text-admin-text">
                                        {order.paymentMethod || "N/A"}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-admin-text">
                                            Payment Status
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <PaymentStatusBadge
                                            paymentStatus={order.paymentStatus}
                                        />
                                        <ProtectedComponent permission="orders.update">
                                            <button
                                                onClick={() => {
                                                    setNewPaymentStatus(
                                                        order.paymentStatus
                                                    );
                                                    setShowPaymentModal(true);
                                                }}
                                                className="text-admin-primary hover:text-admin-primary-dark text-xs flex items-center gap-1"
                                            >
                                                <FaEdit className="w-3 h-3" />
                                                Update
                                            </button>
                                        </ProtectedComponent>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Invoice Section */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaFileInvoice className="text-admin-primary" />
                            Invoice
                        </h2>
                        {invoiceLoading ? (
                            <div className="flex items-center justify-center py-4">
                                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-admin-primary"></div>
                                <span className="ml-2 text-sm text-admin-text-secondary">
                                    Loading invoice...
                                </span>
                            </div>
                        ) : invoice ? (
                            <div className="space-y-4">
                                <div className="bg-admin-bg rounded-lg p-4">
                                    <div className="flex items-center justify-between mb-3">
                                        <div>
                                            <p className="text-sm text-admin-text-secondary">
                                                Invoice Number
                                            </p>
                                            <p className="font-semibold text-admin-text">
                                                {invoice.invoiceNumber}
                                            </p>
                                        </div>
                                        <div className="w-8 h-8 bg-admin-success text-white rounded-full flex items-center justify-center">
                                            <FaFileInvoice className="w-4 h-4" />
                                        </div>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-sm text-admin-text-secondary">
                                                Generated On
                                            </p>
                                            <p className="text-sm text-admin-text">
                                                {formatDate(
                                                    invoice.generatedAt
                                                )}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                                <ProtectedComponent permission="invoices.view">
                                    <button
                                        onClick={handleViewInvoice}
                                        disabled={invoiceLoading}
                                        className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50"
                                    >
                                        <FaEye className="w-4 h-4" />
                                        {invoiceLoading
                                            ? "Loading..."
                                            : "View Invoice Details"}
                                    </button>
                                </ProtectedComponent>
                            </div>
                        ) : (
                            <div className="text-center py-6">
                                <FaFileInvoice className="w-12 h-12 text-admin-text-secondary mx-auto mb-3" />
                                <p className="text-admin-text-secondary mb-4">
                                    No invoice generated for this order
                                </p>
                                <ProtectedComponent permission="invoices.generate">
                                    <button
                                        onClick={handleGenerateInvoice}
                                        disabled={generatingInvoice}
                                        className="flex items-center gap-2 px-4 py-2 bg-admin-success text-white rounded-lg hover:bg-admin-success-dark transition-colors disabled:opacity-50 mx-auto"
                                    >
                                        <FaPlus className="w-4 h-4" />
                                        {generatingInvoice
                                            ? "Generating..."
                                            : "Generate Invoice"}
                                    </button>
                                </ProtectedComponent>
                            </div>
                        )}
                    </div>

                    {/* Coupon Information */}
                    {(order.coupon?.code ||
                        order.couponCode ||
                        order.appliedCoupon?.code ||
                        order.couponDiscount > 0) && (
                        <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                            <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                                <div className="w-5 h-5 bg-admin-success text-white rounded flex items-center justify-center text-xs font-bold">
                                    %
                                </div>
                                Coupon Applied
                            </h2>
                            <div className="space-y-3">
                                <div className="space-y-3">
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-admin-text">
                                            Coupon Code
                                        </span>
                                        <span className="text-sm font-bold text-admin-text">
                                            {order.coupon?.code ||
                                                order.couponCode ||
                                                order.appliedCoupon?.code ||
                                                order.couponDetails?.code ||
                                                "COUPON_APPLIED"}
                                        </span>
                                    </div>
                                    <div className="flex items-center justify-between">
                                        <span className="text-sm font-medium text-admin-text">
                                            Discount Type
                                        </span>
                                        <span className="text-sm text-admin-text">
                                            {(() => {
                                                const discountType =
                                                    order.coupon
                                                        ?.discountType ||
                                                    order.couponType ||
                                                    order.appliedCoupon?.type;
                                                switch (discountType) {
                                                    case "percentage":
                                                        return "Percentage";
                                                    case "percentage_upto":
                                                        return "Percentage (Up To)";
                                                    case "fixed":
                                                        return "Fixed Amount";
                                                    default:
                                                        return "Unknown";
                                                }
                                            })()}
                                        </span>
                                    </div>
                                    {((order.coupon?.discountType ||
                                        order.couponType ||
                                        order.appliedCoupon?.type) ===
                                        "percentage" ||
                                        (order.coupon?.discountType ||
                                            order.couponType ||
                                            order.appliedCoupon?.type) ===
                                            "percentage_upto") &&
                                        (order.coupon?.discountValue ||
                                            order.couponValue ||
                                            order.appliedCoupon?.value) && (
                                            <div className="flex items-center justify-between">
                                                <span className="text-sm font-medium text-admin-text">
                                                    {(order.coupon
                                                        ?.discountType ||
                                                        order.couponType ||
                                                        order.appliedCoupon
                                                            ?.type) ===
                                                    "percentage_upto"
                                                        ? "Discount Rate (Max Cap)"
                                                        : "Discount Rate"}
                                                </span>
                                                <span className="text-sm text-admin-text">
                                                    {order.coupon
                                                        ?.discountValue ||
                                                        order.couponValue ||
                                                        order.appliedCoupon
                                                            ?.value}
                                                    %
                                                    {(order.coupon
                                                        ?.discountType ||
                                                        order.couponType ||
                                                        order.appliedCoupon
                                                            ?.type) ===
                                                        "percentage_upto" &&
                                                        (order.coupon
                                                            ?.maxDiscount ||
                                                            order.maxDiscount ||
                                                            order.appliedCoupon
                                                                ?.maxDiscount) && (
                                                            <span className="text-xs text-admin-text-secondary ml-1">
                                                                (up to{" "}
                                                                {formatCurrency(
                                                                    order.coupon
                                                                        ?.maxDiscount ||
                                                                        order.maxDiscount ||
                                                                        order
                                                                            .appliedCoupon
                                                                            ?.maxDiscount
                                                                )}
                                                                )
                                                            </span>
                                                        )}
                                                </span>
                                            </div>
                                        )}
                                    <div className="flex items-center justify-between pt-2 border-t border-admin-border">
                                        <span className="text-sm font-medium text-admin-text">
                                            Total Savings
                                        </span>
                                        <span className="text-lg font-semibold text-admin-success">
                                            -
                                            {formatCurrency(
                                                order.couponDiscount || 0
                                            )}
                                        </span>
                                    </div>
                                </div>
                                {(order.coupon?.description ||
                                    order.couponDescription ||
                                    order.appliedCoupon?.description) && (
                                    <div className="text-xs text-admin-text-secondary mt-3 p-3 bg-admin-bg rounded">
                                        <strong>Coupon Details:</strong>{" "}
                                        {order.coupon?.description ||
                                            order.couponDescription ||
                                            order.appliedCoupon?.description}
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Order Timeline */}
                    <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                        <h2 className="text-lg font-semibold text-admin-text mb-4 flex items-center gap-2">
                            <FaClock className="text-admin-info" />
                            Order Timeline
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-3 h-3 bg-admin-success rounded-full"></div>
                                <div>
                                    <div className="font-medium text-admin-text">
                                        Order Placed
                                    </div>
                                    <div className="text-sm text-admin-text-secondary">
                                        {formatDate(order.createdAt)}
                                    </div>
                                </div>
                            </div>
                            {order.status !== "pending" && (
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-admin-info rounded-full"></div>
                                    <div>
                                        <div className="font-medium text-admin-text">
                                            Status Updated
                                        </div>
                                        <div className="text-sm text-admin-text-secondary">
                                            Current status: {order.status}
                                        </div>
                                    </div>
                                </div>
                            )}
                            {order.trackingNumber && (
                                <div className="flex items-center gap-3">
                                    <div className="w-3 h-3 bg-admin-primary rounded-full"></div>
                                    <div>
                                        <div className="font-medium text-admin-text">
                                            Tracking Available
                                        </div>
                                        <div className="text-sm text-admin-text-secondary">
                                            Tracking: {order.trackingNumber}
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Status Update Modal */}
            {showStatusModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 w-full max-w-md mx-4 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Update Order Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Select Order Status
                                </label>
                                <select
                                    value={newStatus}
                                    onChange={(e) =>
                                        setNewStatus(e.target.value)
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                >
                                    {orderStatusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handleStatusUpdate}
                                    disabled={updating}
                                    className="flex-1 bg-admin-primary text-white py-2 px-4 rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {updating ? "Updating..." : "Update Status"}
                                </button>
                                <button
                                    onClick={() => setShowStatusModal(false)}
                                    className="flex-1 border border-admin-border text-admin-text py-2 px-4 rounded-lg hover:bg-admin-bg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Payment Status Update Modal */}
            {showPaymentModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 w-full max-w-md mx-4 border border-admin-border">
                        <h3 className="text-lg font-semibold text-admin-text mb-4">
                            Update Payment Status
                        </h3>
                        <div className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-admin-text mb-2">
                                    Select Payment Status
                                </label>
                                <select
                                    value={newPaymentStatus}
                                    onChange={(e) =>
                                        setNewPaymentStatus(e.target.value)
                                    }
                                    className="w-full border border-admin-border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                                >
                                    {paymentStatusOptions.map((status) => (
                                        <option key={status} value={status}>
                                            {status.charAt(0).toUpperCase() +
                                                status.slice(1)}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            <div className="flex gap-3">
                                <button
                                    onClick={handlePaymentStatusUpdate}
                                    disabled={updating}
                                    className="flex-1 bg-admin-primary text-white py-2 px-4 rounded-lg hover:bg-admin-primary-dark transition-colors disabled:opacity-50"
                                >
                                    {updating ? "Updating..." : "Update Status"}
                                </button>
                                <button
                                    onClick={() => setShowPaymentModal(false)}
                                    className="flex-1 border border-admin-border text-admin-text py-2 px-4 rounded-lg hover:bg-admin-bg transition-colors"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 backdrop-blur-sm bg-opacity-50 flex items-center justify-center z-50">
                    <div className="bg-admin-card rounded-lg p-6 w-full max-w-md mx-4 border border-admin-border">
                        <h3 className="text-lg font-semibold text-red-600 mb-4">
                            Delete Order
                        </h3>
                        <p className="text-admin-text-secondary mb-6">
                            Are you sure you want to delete order #
                            {getOrderId(order)}? This action cannot be undone.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={handleDeleteOrder}
                                disabled={updating}
                                className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50"
                            >
                                {updating ? "Deleting..." : "Delete Order"}
                            </button>
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 border border-admin-border text-admin-text py-2 px-4 rounded-lg hover:bg-admin-bg transition-colors"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Invoice Modal */}
            <InvoiceModal
                invoice={invoice}
                orderId={id}
                isOpen={showInvoiceModal}
                onClose={() => setShowInvoiceModal(false)}
            />
        </div>
    );
};

export default OrderDetail;
