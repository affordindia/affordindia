/**
 * Razorpay Payment Gateway Service
 *
 * PAYMENT PROVIDER MIGRATION NOTES:
 * - This service replaces HDFC paymentGateway.service.js functionality
 * - HDFC service preserved in paymentGateway.service.js for rollback capability
 * - Provides complete Razorpay integration with improved error handling
 * - Migration date: October 15, 2025
 * - Branch: feat/razorpay
 */

import Razorpay from "razorpay";
import crypto from "crypto";
import razorpayConfig from "../config/razorpay.config.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

// Initialize Razorpay instance
const razorpay = new Razorpay({
    key_id: razorpayConfig.keyId,
    key_secret: razorpayConfig.keySecret,
});

/**
 * Create Razorpay Order
 * @param {Object} orderData - Order details for payment
 * @returns {Object} - Razorpay order response
 */
export async function createRazorpayOrder(orderData) {
    try {
        console.log("🔄 Creating Razorpay order:", orderData.orderId);

        const { orderId, amount, user, notes = {} } = orderData;

        // Validate required fields
        if (!orderId || !amount || !user) {
            throw new Error("Missing required fields: orderId, amount, user");
        }

        if (amount <= 0) {
            throw new Error("Order amount must be greater than 0");
        }

        // Prepare Razorpay order options
        const razorpayOrderOptions = {
            amount: Math.round(amount * 100), // Convert to paise
            currency: razorpayConfig.currency,
            receipt: orderId, // Your order ID as receipt
            payment_capture: razorpayConfig.paymentCapture,
            notes: {
                order_id: orderId,
                user_id: user._id ? user._id.toString() : user.toString(),
                user_email: user.email || "",
                business_name: razorpayConfig.businessName,
                created_at: new Date().toISOString(),
                ...notes,
            },
        };

        // Create order with Razorpay
        const razorpayOrder = await razorpay.orders.create(
            razorpayOrderOptions
        );

        console.log(
            "✅ Razorpay order created successfully:",
            razorpayOrder.id
        );

        // Return structured response
        return {
            id: razorpayOrder.id,
            amount: razorpayOrder.amount,
            currency: razorpayOrder.currency,
            receipt: razorpayOrder.receipt,
            status: razorpayOrder.status,
            created_at: razorpayOrder.created_at,
            notes: razorpayOrder.notes,
        };
    } catch (error) {
        console.error("❌ Razorpay order creation failed:", error);

        // Handle specific Razorpay errors
        if (error.statusCode) {
            switch (error.statusCode) {
                case 400:
                    throw new Error(
                        `Invalid request: ${error.error.description}`
                    );
                case 401:
                    throw new Error(
                        "Razorpay authentication failed. Check API credentials."
                    );
                case 500:
                    throw new Error("Razorpay server error. Please try again.");
                default:
                    throw new Error(
                        `Razorpay API error: ${
                            error.error?.description || error.message
                        }`
                    );
            }
        }

        throw new Error(`Razorpay order creation failed: ${error.message}`);
    }
}

/**
 * Verify Razorpay Payment Signature
 * @param {Object} paymentData - Payment verification data
 * @returns {Object} - Verification result with payment details
 */
export async function verifyRazorpayPayment(paymentData) {
    try {
        console.log("🔐 Verifying Razorpay payment signature");

        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } =
            paymentData;

        // Validate required fields
        if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
            throw new Error("Missing required payment verification fields");
        }

        // Create signature for verification
        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const expectedSignature = crypto
            .createHmac("sha256", razorpayConfig.keySecret)
            .update(body.toString())
            .digest("hex");

        const isValidSignature = expectedSignature === razorpay_signature;

        if (!isValidSignature) {
            console.error("❌ Invalid payment signature");
            return {
                isValid: false,
                error: "Invalid payment signature",
                errorCode: "SIGNATURE_VERIFICATION_FAILED",
            };
        }

        // Get detailed payment information from Razorpay
        const payment = await razorpay.payments.fetch(razorpay_payment_id);

        console.log("✅ Payment signature verified successfully");

        return {
            isValid: true,
            payment: {
                id: payment.id,
                order_id: payment.order_id,
                amount: payment.amount,
                currency: payment.currency,
                status: payment.status,
                method: payment.method,
                captured: payment.captured,
                description: payment.description,
                card: payment.card || null,
                bank: payment.bank || null,
                upi: payment.upi || null,
                wallet: payment.wallet || null,
                vpa: payment.vpa || null,
                email: payment.email || null,
                contact: payment.contact || null,
                fee: payment.fee || 0,
                tax: payment.tax || 0,
                error_code: payment.error_code || null,
                error_description: payment.error_description || null,
                created_at: payment.created_at,
            },
        };
    } catch (error) {
        console.error("❌ Payment verification failed:", error);

        // Handle API errors
        if (error.statusCode === 400) {
            return {
                isValid: false,
                error: "Invalid payment ID or payment not found",
                errorCode: "PAYMENT_NOT_FOUND",
            };
        }

        return {
            isValid: false,
            error: error.message || "Payment verification failed",
            errorCode: "VERIFICATION_ERROR",
        };
    }
}

/**
 * Handle Razorpay Webhooks
 * @param {Object} payload - Webhook payload
 * @param {string} signature - Webhook signature
 * @returns {Object} - Processing result
 */
export async function handleRazorpayWebhook(payload, signature) {
    try {
        console.log("🔔 Processing Razorpay webhook:", payload.event);

        // Verify webhook signature
        if (razorpayConfig.security.verifyWebhookSignature) {
            const expectedSignature = crypto
                .createHmac("sha256", razorpayConfig.webhookSecret)
                .update(JSON.stringify(payload))
                .digest("hex");

            if (expectedSignature !== signature) {
                console.error("❌ Invalid webhook signature");
                throw new Error("Invalid webhook signature");
            }
        }

        const { event, payload: eventPayload } = payload;

        // Process different webhook events
        switch (event) {
            case "payment.captured":
                await handlePaymentCaptured(eventPayload.payment.entity);
                break;

            case "payment.failed":
                await handlePaymentFailed(eventPayload.payment.entity);
                break;

            case "order.paid":
                await handleOrderPaid(eventPayload.order.entity);
                break;

            case "payment.authorized":
                await handlePaymentAuthorized(eventPayload.payment.entity);
                break;

            case "payment.dispute.created":
                await handlePaymentDispute(
                    eventPayload.payment.entity,
                    eventPayload.dispute.entity
                );
                break;

            default:
                console.log(`📝 Unhandled webhook event: ${event}`);
        }

        return {
            success: true,
            event,
            processedAt: new Date().toISOString(),
        };
    } catch (error) {
        console.error("❌ Webhook handling failed:", error);
        throw error;
    }
}

/**
 * Get Razorpay Payment Status
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Object} - Payment status details
 */
export async function getRazorpayPaymentStatus(paymentId) {
    try {
        console.log("📊 Fetching payment status for:", paymentId);

        const payment = await razorpay.payments.fetch(paymentId);

        return {
            id: payment.id,
            order_id: payment.order_id,
            amount: payment.amount,
            currency: payment.currency,
            status: payment.status,
            method: payment.method,
            captured: payment.captured,
            description: payment.description,
            created_at: payment.created_at,
            error_code: payment.error_code || null,
            error_description: payment.error_description || null,
        };
    } catch (error) {
        console.error("❌ Failed to get payment status:", error);
        throw new Error(`Failed to get payment status: ${error.message}`);
    }
}

/**
 * Get Razorpay Order Status
 * @param {string} orderId - Razorpay order ID
 * @returns {Object} - Order status details
 */
export async function getRazorpayOrderStatus(orderId) {
    try {
        console.log("📊 Fetching order status for:", orderId);

        const order = await razorpay.orders.fetch(orderId);

        return {
            id: order.id,
            amount: order.amount,
            currency: order.currency,
            receipt: order.receipt,
            status: order.status,
            attempts: order.attempts,
            created_at: order.created_at,
            notes: order.notes,
        };
    } catch (error) {
        console.error("❌ Failed to get order status:", error);
        throw new Error(`Failed to get order status: ${error.message}`);
    }
}

// =================== WEBHOOK EVENT HANDLERS ===================

/**
 * Handle Payment Captured Event
 */
async function handlePaymentCaptured(payment) {
    try {
        console.log("💰 Processing payment captured:", payment.id);

        const order = await Order.findOne({
            razorpayOrderId: payment.order_id,
        });
        if (!order) {
            console.error("❌ Order not found for payment:", payment.id);
            return;
        }

        // Update order with payment success
        order.paymentStatus = "paid";
        order.razorpayPaymentId = payment.id;
        order.paymentVerifiedAt = new Date();
        order.paymentInfo = {
            ...order.paymentInfo,
            razorpayPayment: payment,
            capturedAt: new Date().toISOString(),
        };

        await order.save();

        // Confirm stock deduction (stock should already be reserved)
        await confirmStockDeduction(order._id);

        console.log(
            "✅ Payment captured successfully processed for order:",
            order.orderId
        );
    } catch (error) {
        console.error("❌ Failed to handle payment captured:", error);
    }
}

/**
 * Handle Payment Failed Event
 */
async function handlePaymentFailed(payment) {
    try {
        console.log("❌ Processing payment failed:", payment.id);

        const order = await Order.findOne({
            razorpayOrderId: payment.order_id,
        });
        if (!order) {
            console.error("❌ Order not found for payment:", payment.id);
            return;
        }

        // Update order with payment failure
        order.paymentStatus = "failed";
        order.paymentAttempts = (order.paymentAttempts || 0) + 1;
        order.lastPaymentAttempt = new Date();
        order.canRetryPayment =
            order.paymentAttempts < razorpayConfig.maxRetryAttempts;
        order.paymentFailureReason =
            payment.error_description || "Payment failed";
        order.paymentInfo = {
            ...order.paymentInfo,
            razorpayPayment: payment,
            failedAt: new Date().toISOString(),
        };

        await order.save();

        // Release reserved stock if max attempts reached
        if (!order.canRetryPayment) {
            await releaseReservedStock(order._id);
        } else {
            // Extend stock reservation for retry
            await extendStockReservation(order._id);
        }

        console.log("❌ Payment failure processed for order:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to handle payment failure:", error);
    }
}

/**
 * Handle Order Paid Event
 */
async function handleOrderPaid(orderData) {
    try {
        console.log("✅ Processing order paid:", orderData.id);

        const order = await Order.findOne({ razorpayOrderId: orderData.id });
        if (!order) {
            console.error("❌ Order not found:", orderData.id);
            return;
        }

        // Double-check payment status
        if (order.paymentStatus !== "paid") {
            order.paymentStatus = "paid";
            order.paymentVerifiedAt = new Date();
            await order.save();

            await confirmStockDeduction(order._id);
        }

        console.log("✅ Order paid event processed:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to handle order paid:", error);
    }
}

/**
 * Handle Payment Authorized Event (for manual capture)
 */
async function handlePaymentAuthorized(payment) {
    try {
        console.log("🔐 Processing payment authorized:", payment.id);

        const order = await Order.findOne({
            razorpayOrderId: payment.order_id,
        });
        if (!order) {
            console.error("❌ Order not found for payment:", payment.id);
            return;
        }

        // Update order with authorized status
        order.paymentStatus = "authorized";
        order.razorpayPaymentId = payment.id;
        order.paymentInfo = {
            ...order.paymentInfo,
            razorpayPayment: payment,
            authorizedAt: new Date().toISOString(),
        };

        await order.save();

        console.log(
            "🔐 Payment authorized processed for order:",
            order.orderId
        );
    } catch (error) {
        console.error("❌ Failed to handle payment authorized:", error);
    }
}

/**
 * Handle Payment Dispute Event
 */
async function handlePaymentDispute(payment, dispute) {
    try {
        console.log("⚠️ Processing payment dispute:", payment.id);

        const order = await Order.findOne({
            razorpayOrderId: payment.order_id,
        });
        if (!order) {
            console.error("❌ Order not found for payment:", payment.id);
            return;
        }

        // Add dispute information to order
        order.paymentInfo = {
            ...order.paymentInfo,
            dispute: {
                id: dispute.id,
                amount: dispute.amount,
                reason_code: dispute.reason_code,
                respond_by: dispute.respond_by,
                created_at: dispute.created_at,
            },
            disputeCreatedAt: new Date().toISOString(),
        };

        await order.save();

        // TODO: Send notification to admin about dispute

        console.log("⚠️ Payment dispute processed for order:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to handle payment dispute:", error);
    }
}

// =================== STOCK MANAGEMENT FUNCTIONS ===================

/**
 * Confirm stock deduction after successful payment
 */
async function confirmStockDeduction(orderId) {
    try {
        const order = await Order.findById(orderId).populate("items.product");
        if (!order) return;

        console.log("📦 Confirming stock deduction for order:", order.orderId);

        // Stock should already be reserved, just update the reservation status
        order.stockReserved = false; // Stock now permanently deducted
        await order.save();

        console.log("✅ Stock deduction confirmed for order:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to confirm stock deduction:", error);
    }
}

/**
 * Release reserved stock for failed/cancelled payments
 */
async function releaseReservedStock(orderId) {
    try {
        const order = await Order.findById(orderId).populate("items.product");
        if (!order || !order.stockReserved) return;

        console.log("📦 Releasing reserved stock for order:", order.orderId);

        // Restore stock levels
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: item.quantity },
            });
        }

        // Update order status
        order.stockReserved = false;
        order.stockReservationExpiry = null;
        await order.save();

        console.log("✅ Reserved stock released for order:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to release reserved stock:", error);
    }
}

/**
 * Extend stock reservation for payment retry
 */
async function extendStockReservation(orderId) {
    try {
        const order = await Order.findById(orderId);
        if (!order) return;

        console.log("⏰ Extending stock reservation for order:", order.orderId);

        // Extend reservation by another timeout period
        order.stockReservationExpiry = new Date(
            Date.now() +
                razorpayConfig.orderTimeout +
                razorpayConfig.stockReservationBuffer * 60 * 1000
        );
        await order.save();

        console.log("✅ Stock reservation extended for order:", order.orderId);
    } catch (error) {
        console.error("❌ Failed to extend stock reservation:", error);
    }
}

// =================== UTILITY FUNCTIONS ===================

/**
 * Get payment method details for analytics
 */
export function getPaymentMethodDetails(paymentMethod) {
    const methodMapping = {
        card: "Credit/Debit Card",
        netbanking: "Net Banking",
        wallet: "Digital Wallet",
        upi: "UPI",
        emi: "EMI",
        paylater: "Pay Later",
    };

    return methodMapping[paymentMethod] || paymentMethod;
}

/**
 * Format error message for user display
 */
export function formatErrorMessage(errorCode, errorDescription) {
    const userFriendlyMessages = razorpayConfig.errorMessages;

    // Map error codes to user-friendly messages
    const errorMap = {
        BAD_REQUEST_ERROR: userFriendlyMessages.payment_failed,
        GATEWAY_ERROR: userFriendlyMessages.gateway_error,
        NETWORK_ERROR: userFriendlyMessages.network_error,
        TIMEOUT: userFriendlyMessages.timeout,
        INVALID_CARD: userFriendlyMessages.invalid_card,
        EXPIRED_CARD: userFriendlyMessages.expired_card,
        INSUFFICIENT_FUNDS: userFriendlyMessages.insufficient_funds,
        AUTHENTICATION_FAILED: userFriendlyMessages.authentication_failed,
    };

    return (
        errorMap[errorCode] ||
        errorDescription ||
        userFriendlyMessages.payment_failed
    );
}

export default {
    createRazorpayOrder,
    verifyRazorpayPayment,
    handleRazorpayWebhook,
    getRazorpayPaymentStatus,
    getRazorpayOrderStatus,
    getPaymentMethodDetails,
    formatErrorMessage,
};
