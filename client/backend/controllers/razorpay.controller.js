import {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
    getRazorpayPaymentStatus,
    getRazorpayOrderStatus,
    formatErrorMessage,
    validateStockForRetry,
} from "../services/razorpay.service.js";
import Order from "../models/order.model.js";
import { createShiprocketOrder } from "../../../admin/backend/services/shiprocket.service.js";
import { body, param, validationResult } from "express-validator";

/**
 * Create Razorpay Order
 * POST /api/razorpay/create-order
 */
export const createOrder = async (req, res, next) => {
    try {
        console.log("🔄 Razorpay: Creating order for user:", req.user._id);

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }

        const { orderId } = req.body;

        // Find order in database using MongoDB _id
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        }).populate("user", "name email phone");

        if (!order) {
            console.error("❌ Order not found:", orderId);
            return res.status(404).json({
                success: false,
                message: "Order not found",
                errorCode: "ORDER_NOT_FOUND",
            });
        }

        // Validate order status
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Order already paid",
                errorCode: "ORDER_ALREADY_PAID",
            });
        }

        if (order.paymentMethod !== "ONLINE") {
            return res.status(400).json({
                success: false,
                message: "Order payment method is not online",
                errorCode: "INVALID_PAYMENT_METHOD",
            });
        }

        // Check if order has expired (optional timeout check)
        const orderAge = Date.now() - new Date(order.createdAt).getTime();
        const maxOrderAge = 24 * 60 * 60 * 1000; // 24 hours

        if (orderAge > maxOrderAge) {
            return res.status(400).json({
                success: false,
                message: "Order has expired. Please create a new order.",
                errorCode: "ORDER_EXPIRED",
            });
        }

        // Create Razorpay order
        const razorpayOrder = await createRazorpayOrder({
            orderId: order.orderId,
            amount: order.total,
            user: order.user,
            notes: {
                customer_name: order.user.name || order.userName,
                customer_email: order.user.email,
                order_items: order.items.length,
                order_created_at: order.createdAt,
            },
        });

        // Update order with Razorpay details
        order.paymentProvider = "RAZORPAY";
        order.razorpayOrderId = razorpayOrder.id;
        order.paymentTimeoutAt = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes
        order.paymentAttempts = (order.paymentAttempts || 0) + 1;
        order.lastPaymentAttemptAt = new Date();
        order.canRetryPayment = true;

        await order.save();

        console.log(
            "✅ Razorpay order created successfully:",
            razorpayOrder.id
        );

        res.status(200).json({
            success: true,
            message: "Razorpay order created successfully",
            data: {
                razorpayOrderId: razorpayOrder.id,
                amount: razorpayOrder.amount,
                currency: razorpayOrder.currency,
                orderId: order.orderId,
                orderTimeout: order.paymentTimeoutAt,
                notes: razorpayOrder.notes,
            },
        });
    } catch (error) {
        console.error("❌ Razorpay order creation failed:", error);

        const errorMessage = formatErrorMessage(error.code, error.message);

        res.status(500).json({
            success: false,
            message: errorMessage,
            errorCode: error.code || "ORDER_CREATION_FAILED",
            ...(process.env.NODE_ENV !== "production" && {
                details: error.message,
            }),
        });
    }
};

/**
 * Verify Razorpay Payment
 * POST /api/razorpay/verify-payment
 */
export const verifyPayment = async (req, res, next) => {
    try {
        console.log("🔐 Razorpay: Verifying payment for user:", req.user._id);

        // Check validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                success: false,
                message: "Validation errors",
                errors: errors.array(),
            });
        }

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            orderId,
        } = req.body;

        // Find order in database using MongoDB _id
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
            razorpayOrderId: razorpay_order_id,
        });

        if (!order) {
            console.error("❌ Order not found for verification:", orderId);
            return res.status(404).json({
                success: false,
                message: "Order not found or order ID mismatch",
                errorCode: "ORDER_NOT_FOUND",
            });
        }

        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Payment already verified",
                data: {
                    orderId: order.orderId,
                    paymentStatus: order.paymentStatus,
                    paymentId: order.razorpayPaymentId,
                },
            });
        }

        // Verify payment with Razorpay
        const verificationResult = await verifyRazorpayPayment({
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
        });

        if (!verificationResult.isValid) {
            console.error(
                "❌ Payment verification failed:",
                verificationResult.error
            );

            // Update order with failure info
            order.paymentStatus = "failed";
            order.paymentFailureReason = verificationResult.error;
            order.lastPaymentAttempt = new Date();
            await order.save();

            return res.status(400).json({
                success: false,
                message: "Payment verification failed",
                error: verificationResult.error,
                errorCode:
                    verificationResult.errorCode || "VERIFICATION_FAILED",
            });
        }

        // Update order with successful payment
        order.paymentStatus = "paid";
        order.razorpayPaymentId = razorpay_payment_id;
        order.razorpaySignature = razorpay_signature;
        order.paymentVerifiedAt = new Date();
        order.canRetryPayment = false;
        order.paymentInfo = {
            ...order.paymentInfo,
            razorpayPayment: verificationResult.payment,
            verifiedAt: new Date().toISOString(),
            verificationMethod: "manual",
        };

        await order.save();

        // Create Shiprocket order after successful payment
        try {
            console.log("📦 Creating Shiprocket order after payment success:", order.orderId);
            
            // Populate order with product and user details
            const populatedOrder = await Order.findById(order._id)
                .populate('items.product')
                .populate('user');
            
            const shiprocketResponse = await createShiprocketOrder(populatedOrder, populatedOrder.user);
            
            if (shiprocketResponse) {
                order.shiprocket = {
                    orderId: shiprocketResponse.order_id,
                    shipmentId: shiprocketResponse.shipment_id,
                    createdAt: new Date(),
                };
                await order.save();
                console.log("✅ Shiprocket order created:", shiprocketResponse.order_id);
            }
        } catch (shiprocketError) {
            console.error("❌ Shiprocket order creation failed:", shiprocketError.message);
            // Don't throw - allow order to succeed even if Shiprocket fails
        }

        // Note: Stock confirmation will be handled by webhook or can be done here
        // For immediate confirmation, uncomment the next line:
        // await confirmStockDeduction(order._id);

        console.log(
            "✅ Payment verified successfully for order:",
            order.orderId
        );

        res.status(200).json({
            success: true,
            message: "Payment verified successfully",
            data: {
                orderId: order.orderId,
                paymentStatus: order.paymentStatus,
                paymentId: razorpay_payment_id,
                paymentMethod: verificationResult.payment.method,
                amount: verificationResult.payment.amount / 100, // Convert back from paise
                verifiedAt: order.paymentVerifiedAt,
            },
        });
    } catch (error) {
        console.error("❌ Payment verification error:", error);

        const errorMessage = formatErrorMessage(error.code, error.message);

        res.status(500).json({
            success: false,
            message: errorMessage,
            errorCode: error.code || "VERIFICATION_ERROR",
            ...(process.env.NODE_ENV !== "production" && {
                details: error.message,
            }),
        });
    }
};

/**
 * Handle Razorpay Webhooks
 * POST /api/razorpay/webhook
 */
export const handleWebhook = async (req, res, next) => {
    try {
        console.log("🔔 Razorpay: Webhook received");

        const signature = req.headers["x-razorpay-signature"];
        const payload = req.body;

        if (!signature) {
            console.error("❌ Missing webhook signature");
            return res.status(400).json({
                success: false,
                message: "Missing webhook signature",
            });
        }

        // Process webhook
        const result = await handleRazorpayWebhook(payload, signature);

        console.log("✅ Webhook processed successfully:", result.event);

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
            event: result.event,
            processedAt: result.processedAt,
        });
    } catch (error) {
        console.error("❌ Webhook processing failed:", error);

        // Return 400 to tell Razorpay to retry
        res.status(400).json({
            success: false,
            message: "Webhook processing failed",
            error: error.message,
        });
    }
};

/**
 * Get Payment Status
 * GET /api/razorpay/payment-status/:paymentId
 */
export const getPaymentStatus = async (req, res, next) => {
    try {
        console.log("📊 Razorpay: Getting payment status");

        const { paymentId } = req.params;

        const paymentStatus = await getRazorpayPaymentStatus(paymentId);

        res.status(200).json({
            success: true,
            data: paymentStatus,
        });
    } catch (error) {
        console.error("❌ Failed to get payment status:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get payment status",
            error: error.message,
        });
    }
};

/**
 * Get Order Status
 * GET /api/razorpay/order-status/:orderId
 */
export const getOrderStatus = async (req, res, next) => {
    try {
        console.log("📊 Razorpay: Getting order status");

        const { orderId } = req.params;

        const orderStatus = await getRazorpayOrderStatus(orderId);

        res.status(200).json({
            success: true,
            data: orderStatus,
        });
    } catch (error) {
        console.error("❌ Failed to get order status:", error);

        res.status(500).json({
            success: false,
            message: "Failed to get order status",
            error: error.message,
        });
    }
};

/**
 * Retry Payment
 * POST /api/razorpay/retry-payment
 */
export const retryPayment = async (req, res, next) => {
    try {
        console.log("🔄 Razorpay: Retrying payment for user:", req.user._id);

        const { orderId } = req.body;
        console.log("📋 Received orderId for retry:", orderId);

        // Find order using MongoDB _id
        const order = await Order.findOne({
            _id: orderId,
            user: req.user._id,
        }).populate("user", "name email phone");

        console.log(
            "🔍 Order found:",
            order
                ? `ID: ${order._id}, OrderId: ${order.orderId}`
                : "No order found"
        );

        if (!order) {
            console.log("❌ Order not found with criteria:", {
                orderId,
                userId: req.user._id,
            });
            return res.status(404).json({
                success: false,
                message: "Order not found",
                errorCode: "ORDER_NOT_FOUND",
            });
        }

        // Check if retry is allowed
        if (order.paymentStatus === "paid") {
            return res.status(400).json({
                success: false,
                message: "Order already paid",
                errorCode: "ORDER_ALREADY_PAID",
            });
        }

        if (!order.canRetryPayment) {
            return res.status(400).json({
                success: false,
                message: "Payment retry not allowed. Maximum attempts reached.",
                errorCode: "RETRY_NOT_ALLOWED",
            });
        }

        if (order.paymentAttempts >= 3) {
            return res.status(400).json({
                success: false,
                message: "Maximum payment attempts reached",
                errorCode: "MAX_ATTEMPTS_REACHED",
            });
        }

        // Validate stock availability before retry
        try {
            await validateStockForRetry(order);
        } catch (error) {
            console.error(
                "❌ Stock validation failed for retry:",
                error.message
            );
            return res.status(400).json({
                success: false,
                message: error.message,
                errorCode: "INSUFFICIENT_STOCK",
            });
        }

        // Use existing Razorpay order ID for retry
        const razorpayOrderId = order.razorpayOrderId;

        if (!razorpayOrderId) {
            // Create new Razorpay order if none exists
            const razorpayOrder = await createRazorpayOrder({
                orderId: order.orderId,
                amount: order.total,
                user: order.user,
            });

            order.razorpayOrderId = razorpayOrder.id;
        }

        // Update retry attempt
        order.paymentAttempts = (order.paymentAttempts || 0) + 1;
        order.lastPaymentAttemptAt = new Date();
        order.paymentTimeoutAt = new Date(Date.now() + 15 * 60 * 1000);

        await order.save();

        console.log("✅ Payment retry initiated for order:", order.orderId);

        res.status(200).json({
            success: true,
            message: "Payment retry initiated",
            data: {
                razorpayOrderId: order.razorpayOrderId,
                razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                amount: order.total * 100, // Convert to paise
                currency: "INR",
                orderId: order.orderId,
                attempt: order.paymentAttempts,
                timeoutAt: order.paymentTimeoutAt,
            },
        });
    } catch (error) {
        console.error("❌ Payment retry failed:", error);

        res.status(500).json({
            success: false,
            message: "Payment retry failed",
            error: error.message,
        });
    }
};

// =================== VALIDATION MIDDLEWARE ===================

export const validateCreateOrder = [
    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isString()
        .withMessage("Order ID must be a string"),
];

export const validateVerifyPayment = [
    body("razorpay_order_id")
        .notEmpty()
        .withMessage("Razorpay order ID is required"),
    body("razorpay_payment_id")
        .notEmpty()
        .withMessage("Razorpay payment ID is required"),
    body("razorpay_signature")
        .notEmpty()
        .withMessage("Razorpay signature is required"),
    body("orderId").notEmpty().withMessage("Order ID is required"),
];

export const validateRetryPayment = [
    body("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .isString()
        .withMessage("Order ID must be a string"),
];

export const validatePaymentId = [
    param("paymentId")
        .notEmpty()
        .withMessage("Payment ID is required")
        .matches(/^pay_[A-Za-z0-9]+$/)
        .withMessage("Invalid payment ID format"),
];

export const validateOrderId = [
    param("orderId")
        .notEmpty()
        .withMessage("Order ID is required")
        .matches(/^order_[A-Za-z0-9]+$/)
        .withMessage("Invalid order ID format"),
];
