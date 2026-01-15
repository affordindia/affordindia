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

        paymentProvider: {
            type: String,
            enum: ["HDFC", "RAZORPAY", "COD"],
            default: "RAZORPAY", // New orders use Razorpay by default
        },

        // =================== HDFC PAYMENT FIELDS (LEGACY) ===================
        // COMMENTED OUT - NO ONLINE ORDERS YET, PRESERVED FOR FUTURE ROLLBACK
        // These fields support existing HDFC orders and rollback scenarios
        // paymentGateway: { type: String }, // 'HDFC', 'COD' - kept for legacy compatibility
        // paymentSessionId: { type: String }, // HDFC session ID from session API
        // paymentResponse: { type: Object }, // Full HDFC response from status API
        // paymentSessionData: { type: Object }, // Original HDFC session creation response for verification
        // paymentUrl: { type: String }, // Payment URL for frontend redirect
        // paymentVerifiedAt: { type: Date }, // When payment was confirmed

        // =================== RAZORPAY PAYMENT FIELDS (NEW) ===================
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
        
        // =================== SHIPROCKET INTEGRATION FIELDS ===================
        shiprocket: {
            orderId: { type: String }, // Shiprocket order ID
            shipmentId: { type: String }, // Shiprocket shipment ID
            awbCode: { type: String }, // AWB (Air Waybill) tracking code
            courierId: { type: String },
            courierName: { type: String },
            status: { type: String }, // Current Shiprocket status
            statusId: { type: Number },
            shipmentStatus: { type: String },
            shipmentStatusId: { type: Number },
            etd: { type: String }, // Estimated delivery date
            pickupScheduledDate: { type: String },
            awbAssignedDate: { type: String },
            lastUpdated: { type: Date },
            scans: [{ type: Object }], // Tracking scan history
            webhookEvents: [{
                status: String,
                receivedAt: Date,
                data: Object
            }],
            createdAt: { type: Date }
        },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ 'shiprocket.awbCode': 1 });
orderSchema.index({ 'shiprocket.orderId': 1 });

/**
 * Check if payment can be retried
 */
orderSchema.methods.canRetryPayment = function () {
    if (this.paymentStatus === "paid") {
        return false;
    }

    return (
        this.paymentAttempts < this.maxPaymentAttempts &&
        this.status === "pending" &&
        (!this.paymentTimeoutAt || new Date() < this.paymentTimeoutAt)
    );
};

/**
 * Update payment attempts counter
 */
orderSchema.methods.incrementPaymentAttempt = function () {
    this.paymentAttempts = (this.paymentAttempts || 0) + 1;
    this.lastPaymentAttemptAt = new Date();
    return this.save();
};

const Order = mongoose.model("Order", orderSchema);
export default Order;
