import mongoose from "mongoose";
import { generateOrderId } from "../utils/orderId.util.js";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            default: generateOrderId,
            index: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                discountedPrice: { type: Number, required: true }, // price after discount
            },
        ],
        shippingAddress: {
            houseNumber: { type: String },
            street: { type: String },
            landmark: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },
        billingAddress: {
            houseNumber: { type: String },
            street: { type: String },
            landmark: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },
        billingAddressSameAsShipping: { type: Boolean, default: true },
        receiverName: { type: String },
        receiverPhone: { type: String },
        paymentMethod: { type: String },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed", "cod"],
            default: "pending",
        },
        paymentInfo: { type: Object },

        // =================== PAYMENT PROVIDER SUPPORT ===================
        // Migration: Added support for multiple payment providers
        // Date: October 15, 2025
        paymentProvider: {
            type: String,
            enum: ["HDFC", "RAZORPAY", "COD"],
            default: "RAZORPAY", // New orders use Razorpay by default
        },

        // =================== HDFC PAYMENT FIELDS (LEGACY) ===================
        // PRESERVED FOR BACKWARD COMPATIBILITY - DO NOT REMOVE
        // These fields support existing HDFC orders and rollback scenarios
        paymentGateway: { type: String }, // 'HDFC', 'COD' - kept for legacy compatibility
        paymentSessionId: { type: String }, // HDFC session ID from session API
        paymentResponse: { type: Object }, // Full HDFC response from status API
        paymentSessionData: { type: Object }, // Original HDFC session creation response for verification
        paymentUrl: { type: String }, // Payment URL for frontend redirect
        paymentVerifiedAt: { type: Date }, // When payment was confirmed

        // =================== RAZORPAY PAYMENT FIELDS (NEW) ===================
        // New fields for Razorpay payment integration
        razorpayOrderId: { type: String }, // Razorpay order ID (order_xxxxx)
        razorpayPaymentId: { type: String }, // Razorpay payment ID (pay_xxxxx)
        razorpaySignature: { type: String }, // Razorpay signature for verification
        razorpayOrderData: { type: Object }, // Full Razorpay order creation response
        razorpayPaymentData: { type: Object }, // Full Razorpay payment response
        razorpayWebhookData: { type: Object }, // Razorpay webhook data for reconciliation

        // Payment retry and attempt tracking (Razorpay specific)
        paymentAttempts: {
            type: Number,
            default: 0,
        },
        maxPaymentAttempts: {
            type: Number,
            default: 3,
        },
        lastPaymentAttemptAt: { type: Date },
        paymentTimeoutAt: { type: Date }, // When payment window expires

        // Stock reservation fields (for both HDFC and Razorpay)
        stockReserved: {
            type: Boolean,
            default: false,
        },
        stockReservedAt: { type: Date },
        stockReservationExpiry: { type: Date },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
                "failed",
            ],
            default: "pending",
        },
        subtotal: { type: Number },
        totalDiscount: { type: Number, default: 0 }, // sum of all product discounts
        couponDiscount: { type: Number, default: 0 }, // coupon discount amount
        shippingFee: { type: Number },
        total: { type: Number },
        trackingNumber: { type: String },
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
        returnedAt: { type: Date },
        coupon: {
            couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
            code: String,
            discountAmount: Number,
            discountType: String,
            discountValue: Number,
        },
        notes: { type: String },
        paymentFailureReason: { type: String }, // Simple field to track why payment failed
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });

// =================== PAYMENT PROVIDER METHODS ===================

/**
 * Check if order uses HDFC payment gateway (legacy)
 */
orderSchema.methods.isHDFCPayment = function () {
    return (
        this.paymentProvider === "HDFC" ||
        this.paymentGateway === "HDFC" ||
        (this.paymentSessionId && !this.razorpayOrderId)
    );
};

/**
 * Check if order uses Razorpay payment gateway (new)
 */
orderSchema.methods.isRazorpayPayment = function () {
    return this.paymentProvider === "RAZORPAY" || this.razorpayOrderId;
};

/**
 * Check if order is Cash on Delivery
 */
orderSchema.methods.isCODPayment = function () {
    return (
        this.paymentProvider === "COD" ||
        this.paymentGateway === "COD" ||
        this.paymentMethod === "cod"
    );
};

/**
 * Check if payment can be retried
 */
orderSchema.methods.canRetryPayment = function () {
    if (this.isCODPayment() || this.paymentStatus === "paid") {
        return false;
    }

    return (
        this.paymentAttempts < this.maxPaymentAttempts &&
        this.status === "pending" &&
        (!this.paymentTimeoutAt || new Date() < this.paymentTimeoutAt)
    );
};

/**
 * Check if stock reservation is active
 */
orderSchema.methods.isStockReserved = function () {
    return (
        this.stockReserved &&
        this.stockReservationExpiry &&
        new Date() < this.stockReservationExpiry
    );
};

/**
 * Check if stock reservation has expired
 */
orderSchema.methods.hasStockReservationExpired = function () {
    return (
        this.stockReserved &&
        this.stockReservationExpiry &&
        new Date() >= this.stockReservationExpiry
    );
};

/**
 * Get payment provider specific data
 */
orderSchema.methods.getPaymentData = function () {
    if (this.isRazorpayPayment()) {
        return {
            provider: "RAZORPAY",
            orderId: this.razorpayOrderId,
            paymentId: this.razorpayPaymentId,
            signature: this.razorpaySignature,
            orderData: this.razorpayOrderData,
            paymentData: this.razorpayPaymentData,
            webhookData: this.razorpayWebhookData,
        };
    } else if (this.isHDFCPayment()) {
        return {
            provider: "HDFC",
            sessionId: this.paymentSessionId,
            response: this.paymentResponse,
            sessionData: this.paymentSessionData,
            url: this.paymentUrl,
            verifiedAt: this.paymentVerifiedAt,
        };
    } else {
        return {
            provider: "COD",
            method: this.paymentMethod,
        };
    }
};

/**
 * Update payment attempts counter
 */
orderSchema.methods.incrementPaymentAttempt = function () {
    this.paymentAttempts = (this.paymentAttempts || 0) + 1;
    this.lastPaymentAttemptAt = new Date();
    return this.save();
};

/**
 * Set payment timeout (for Razorpay orders)
 */
orderSchema.methods.setPaymentTimeout = function (minutes = 15) {
    this.paymentTimeoutAt = new Date(Date.now() + minutes * 60 * 1000);
    return this;
};

/**
 * Reserve stock for this order
 */
orderSchema.methods.reserveStock = function (expiryMinutes = 15) {
    this.stockReserved = true;
    this.stockReservedAt = new Date();
    this.stockReservationExpiry = new Date(
        Date.now() + expiryMinutes * 60 * 1000
    );
    return this;
};

/**
 * Release stock reservation
 */
orderSchema.methods.releaseStock = function () {
    this.stockReserved = false;
    this.stockReservedAt = null;
    this.stockReservationExpiry = null;
    return this;
};

// =================== STATIC METHODS ===================

/**
 * Find orders with expired stock reservations
 */
orderSchema.statics.findExpiredReservations = function () {
    return this.find({
        stockReserved: true,
        stockReservationExpiry: { $lt: new Date() },
        paymentStatus: { $ne: "paid" },
    });
};

/**
 * Find orders by payment provider
 */
orderSchema.statics.findByPaymentProvider = function (provider) {
    return this.find({ paymentProvider: provider });
};

/**
 * Find orders that can be retried
 */
orderSchema.statics.findRetryableOrders = function () {
    return this.find({
        paymentStatus: "failed",
        $expr: { $lt: ["$paymentAttempts", "$maxPaymentAttempts"] },
        status: "pending",
        $or: [
            { paymentTimeoutAt: { $exists: false } },
            { paymentTimeoutAt: { $gt: new Date() } },
        ],
    });
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
