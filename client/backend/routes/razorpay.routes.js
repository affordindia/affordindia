/**
 * Razorpay Payment Routes
 *
 * PAYMENT PROVIDER MIGRATION NOTES:
 * - These routes replace HDFC payment routes in payment.routes.js
 * - HDFC routes preserved in payment.routes.js for rollback capability
 * - Provides dedicated Razorpay endpoints with improved security
 * - Migration date: October 15, 2025
 * - Branch: feat/razorpay
 */

import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createOrder,
    verifyPayment,
    handleWebhook,
    getPaymentStatus,
    getOrderStatus,
    retryPayment,
    validateCreateOrder,
    validateVerifyPayment,
    validateRetryPayment,
    validatePaymentId,
    validateOrderId,
} from "../controllers/razorpay.controller.js";

const router = express.Router();

// =================== PUBLIC ROUTES (No Authentication Required) ===================

/**
 * Webhook endpoint for Razorpay payment notifications
 * POST /api/razorpay/webhook
 *
 * Security: Webhook signature verification handled in controller
 * Rate limiting: Consider adding rate limiting in production
 */
router.post("/webhook", handleWebhook);

// =================== AUTHENTICATED ROUTES (Require User Login) ===================

/**
 * Create Razorpay Order
 * POST /api/razorpay/create-order
 *
 * Body: { orderId: "string" }
 * Returns: { razorpayOrderId, amount, currency, orderId, orderTimeout }
 *
 * Purpose: Initialize payment process by creating Razorpay order
 * Security: Requires user authentication, validates order ownership
 */
router.post("/create-order", authMiddleware, validateCreateOrder, createOrder);

/**
 * Verify Razorpay Payment
 * POST /api/razorpay/verify-payment
 *
 * Body: {
 *   razorpay_order_id: "string",
 *   razorpay_payment_id: "string",
 *   razorpay_signature: "string",
 *   orderId: "string"
 * }
 * Returns: { orderId, paymentStatus, paymentId, paymentMethod, amount }
 *
 * Purpose: Verify payment signature and update order status
 * Security: Signature verification, user ownership validation
 */
router.post(
    "/verify-payment",
    authMiddleware,
    validateVerifyPayment,
    verifyPayment
);

/**
 * Retry Failed Payment
 * POST /api/razorpay/retry-payment
 *
 * Body: { orderId: "string" }
 * Returns: { razorpayOrderId, amount, currency, attempt, timeoutAt }
 *
 * Purpose: Allow users to retry failed payments
 * Security: Validates retry eligibility and attempt limits
 */
router.post(
    "/retry-payment",
    authMiddleware,
    validateRetryPayment,
    retryPayment
);

// =================== STATUS CHECK ROUTES ===================

/**
 * Get Payment Status by Payment ID
 * GET /api/razorpay/payment-status/:paymentId
 *
 * Params: { paymentId: "pay_xxxxx" }
 * Returns: Payment details from Razorpay
 *
 * Purpose: Check payment status directly from Razorpay
 * Security: Requires authentication for security
 */
router.get(
    "/payment-status/:paymentId",
    authMiddleware,
    validatePaymentId,
    getPaymentStatus
);

/**
 * Get Order Status by Razorpay Order ID
 * GET /api/razorpay/order-status/:orderId
 *
 * Params: { orderId: "order_xxxxx" }
 * Returns: Order details from Razorpay
 *
 * Purpose: Check order status directly from Razorpay
 * Security: Requires authentication for security
 */
router.get(
    "/order-status/:orderId",
    authMiddleware,
    validateOrderId,
    getOrderStatus
);

// =================== HEALTH CHECK ROUTES ===================

/**
 * Health Check for Razorpay Integration
 * GET /api/razorpay/health
 *
 * Purpose: Verify Razorpay service availability
 * Returns: Service status and configuration check
 */
router.get("/health", (req, res) => {
    try {
        // Basic configuration check
        const configCheck = {
            hasKeyId: !!process.env.RAZORPAY_KEY_ID,
            hasKeySecret: !!process.env.RAZORPAY_KEY_SECRET,
            hasWebhookSecret: !!process.env.RAZORPAY_WEBHOOK_SECRET,
            environment: process.env.NODE_ENV || "development",
        };

        const isHealthy =
            configCheck.hasKeyId &&
            configCheck.hasKeySecret &&
            configCheck.hasWebhookSecret;

        res.status(isHealthy ? 200 : 500).json({
            success: isHealthy,
            service: "Razorpay Payment Gateway",
            status: isHealthy ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
            config: {
                ...configCheck,
                // Don't expose actual secrets
                keyIdPreview: process.env.RAZORPAY_KEY_ID
                    ? process.env.RAZORPAY_KEY_ID.substring(0, 8) + "..."
                    : null,
            },
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            service: "Razorpay Payment Gateway",
            status: "error",
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
});

// =================== ERROR HANDLING MIDDLEWARE ===================

/**
 * Razorpay-specific error handler
 * Handles errors that occur in Razorpay routes
 */
router.use((error, req, res, next) => {
    console.error("🚨 Razorpay Route Error:", error);

    // Handle specific error types
    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: Object.values(error.errors).map((err) => err.message),
        });
    }

    if (error.code === "RAZORPAY_ERROR") {
        return res.status(502).json({
            success: false,
            message: "Payment gateway error",
            errorCode: "GATEWAY_ERROR",
        });
    }

    // Generic error response
    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error.message,
        errorCode: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
    });
});

// =================== ROUTE DOCUMENTATION ===================

/**
 * API Documentation Endpoint
 * GET /api/razorpay/docs
 *
 * Returns: Available endpoints and their usage
 */
router.get("/docs", (req, res) => {
    const endpoints = [
        {
            method: "POST",
            path: "/api/razorpay/create-order",
            description: "Create Razorpay order for payment",
            auth: "Required",
            body: { orderId: "string" },
        },
        {
            method: "POST",
            path: "/api/razorpay/verify-payment",
            description: "Verify payment signature and update order",
            auth: "Required",
            body: {
                razorpay_order_id: "string",
                razorpay_payment_id: "string",
                razorpay_signature: "string",
                orderId: "string",
            },
        },
        {
            method: "POST",
            path: "/api/razorpay/retry-payment",
            description: "Retry failed payment attempt",
            auth: "Required",
            body: { orderId: "string" },
        },
        {
            method: "POST",
            path: "/api/razorpay/webhook",
            description: "Handle Razorpay webhook notifications",
            auth: "Signature verification",
            body: "Razorpay webhook payload",
        },
        {
            method: "GET",
            path: "/api/razorpay/payment-status/:paymentId",
            description: "Get payment status from Razorpay",
            auth: "Required",
            params: { paymentId: "pay_xxxxx" },
        },
        {
            method: "GET",
            path: "/api/razorpay/order-status/:orderId",
            description: "Get order status from Razorpay",
            auth: "Required",
            params: { orderId: "order_xxxxx" },
        },
        {
            method: "GET",
            path: "/api/razorpay/health",
            description: "Check Razorpay service health",
            auth: "None",
            params: {},
        },
    ];

    res.json({
        service: "Razorpay Payment Gateway API",
        version: "1.0.0",
        migration: "Replaced HDFC SmartGateway",
        endpoints,
    });
});

export default router;
