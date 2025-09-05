import Order from "../models/order.model.js";
import hdfcConfig from "../config/hdfc.config.js";
import {
    getPaymentStatus,
    parsePaymentStatus,
    verifyWebhookSignature,
    verifyPaymentData,
} from "../services/paymentGateway.service.js";

/**
 * Verify HDFC webhook authentication
 * @param {string} authHeader - Authorization header value
 * @returns {boolean} - True if authentication is valid
 */
function verifyWebhookAuth(authHeader) {
    try {
        if (!authHeader || !authHeader.startsWith("Basic ")) {
            return false;
        }

        // Extract base64 encoded credentials
        const base64Credentials = authHeader.substring(6); // Remove "Basic "
        const credentials = Buffer.from(base64Credentials, "base64").toString(
            "utf-8"
        );
        const [username, password] = credentials.split(":");

        // Verify against environment variables
        const expectedUsername = process.env.HDFC_WEBHOOK_USERNAME;
        const expectedPassword = process.env.HDFC_WEBHOOK_PASSWORD;

        return username === expectedUsername && password === expectedPassword;
    } catch (error) {
        console.error("❌ Webhook auth verification failed:", error);
        return false;
    }
}

/**
 * Handle HDFC webhook notifications
 */
export const handleHdfcWebhook = async (req, res) => {
    try {
        console.log("🔔 Received HDFC webhook notification");
        console.log("📋 Webhook Headers:", req.headers);
        console.log("📋 Webhook Body:", JSON.stringify(req.body, null, 2));

        // Verify webhook authentication
        const authHeader = req.headers.authorization;
        if (!verifyWebhookAuth(authHeader)) {
            console.log("❌ Invalid webhook authentication");
            return res.status(401).json({
                success: false,
                message: "Unauthorized",
            });
        }

        const webhookData = req.body;

        // Optional: Verify signature if present in webhook data
        // Note: HDFC webhooks primarily use Basic auth, but signature verification adds extra security
        if (webhookData.signature && webhookData.signature_algorithm) {
            console.log("🔐 Verifying webhook signature...");
            const isSignatureValid = verifyWebhookSignature(
                webhookData,
                hdfcConfig.responseKey
            );

            if (!isSignatureValid) {
                console.log("❌ Invalid signature in webhook");
                return res.status(401).json({
                    success: false,
                    message: "Invalid signature",
                });
            }
            console.log("✅ Webhook signature verified successfully");
        }

        // Validate webhook structure
        if (!webhookData.event_name || !webhookData.content) {
            console.log("❌ Invalid webhook structure");
            return res.status(400).json({
                success: false,
                message: "Invalid webhook structure",
            });
        }

        // Handle different webhook events
        const eventName = webhookData.event_name;
        console.log(`🎯 Processing webhook event: ${eventName}`);

        switch (eventName) {
            case "ORDER_CREATED":
                console.log(
                    `📋 Order created event for: ${webhookData.content.order?.order_id}`
                );
                // Order created - just log for now, no action needed
                break;

            case "ORDER_SUCCEEDED":
            case "ORDER_FAILED":
            case "ORDER_CANCELLED":
                await handleOrderEvent(webhookData);
                break;

            case "TXN_CREATED":
                console.log(
                    `💳 Transaction created for: ${webhookData.content.txn?.order_id}`
                );
                // Transaction created - just log for now
                break;

            case "TXN_CHARGED":
                console.log(
                    `💰 Transaction charged for: ${webhookData.content.txn?.order_id}`
                );
                // Transaction charged - this usually follows ORDER_SUCCEEDED
                break;

            case "TXN_FAILED":
                console.log(
                    `❌ Transaction failed for: ${webhookData.content.txn?.order_id}`
                );
                // Transaction failed - this usually follows ORDER_FAILED
                break;

            default:
                console.log(`⚠️ Unhandled webhook event: ${eventName}`);
        }

        res.status(200).json({
            success: true,
            message: "Webhook processed successfully",
        });
    } catch (error) {
        console.error("❌ Webhook processing failed:", error);
        res.status(500).json({
            success: false,
            message: "Webhook processing failed",
            error: error.message,
        });
    }
};

/**
 * Handle order-related webhook events
 */
async function handleOrderEvent(webhookData) {
    try {
        const orderData = webhookData.content.order;
        const customOrderId = orderData.order_id; // This is our custom order ID
        const eventName = webhookData.event_name;

        console.log(
            `📦 Processing order event: ${eventName} for order: ${customOrderId}`
        );

        // Find order by custom order ID
        const order = await Order.findOne({ orderId: customOrderId });
        if (!order) {
            console.log(`❌ Order not found for ID: ${customOrderId}`);
            return;
        }

        // CRITICAL: Verify webhook data matches original session data
        // For webhooks, extract the order data from the content
        const orderDataForVerification = webhookData.content.order;
        const verification = verifyPaymentData(order, orderDataForVerification);

        if (!verification.isValid) {
            console.error(
                "❌ Webhook payment data verification failed:",
                verification.errors
            );
            // For webhook, we log the error but don't completely fail
            // This allows manual investigation of discrepancies
            console.error(
                "🚨 SECURITY ALERT: Payment data mismatch detected in webhook"
            );
            console.error("📋 Order ID:", customOrderId);
            console.error("📋 Verification details:", verification.details);
            // Continue processing but mark it for review
        } else {
            console.log("✅ Webhook payment data verification passed");
        }

        // Update order based on event
        let updateData = {
            paymentResponse: orderData,
            paymentVerifiedAt: new Date(),
        };

        switch (eventName) {
            case "ORDER_SUCCEEDED":
                updateData.paymentStatus = "paid";
                updateData.status = "processing";
                console.log(`✅ Order ${customOrderId} payment succeeded`);
                break;

            case "ORDER_FAILED":
                updateData.paymentStatus = "failed";
                updateData.status = "failed";
                console.log(`❌ Order ${customOrderId} payment failed`);
                break;

            case "ORDER_CANCELLED":
                updateData.paymentStatus = "cancelled";
                updateData.status = "cancelled";
                console.log(`🚫 Order ${customOrderId} payment cancelled`);
                break;
        }

        // Update the order
        await Order.findByIdAndUpdate(order._id, updateData);
        console.log(
            `📊 Updated order ${customOrderId} with status: ${updateData.paymentStatus}`
        );
    } catch (error) {
        console.error("❌ Order event processing failed:", error);
        throw error;
    }
}

/**
 * Handle transaction-related webhook events
 */
async function handleTransactionEvent(webhookData) {
    try {
        const transactionData = webhookData.content;
        const eventName = webhookData.event_name;

        console.log(`💳 Processing transaction event: ${eventName}`);
        console.log(`💳 Transaction data:`, transactionData);

        // Additional transaction-specific processing can be added here
        // For now, we primarily handle order events
    } catch (error) {
        console.error("❌ Transaction event processing failed:", error);
        throw error;
    }
}

/**
 * Manual payment status check endpoint (by session ID)
 * NOTE: This is a legacy endpoint kept for backwards compatibility
 * Use verifyPayment endpoint instead for new implementations
 */
export const checkPaymentStatus = async (req, res) => {
    try {
        const { sessionId } = req.params;
        const { orderId } = req.query; // Optional: verify order belongs to user

        console.log("🔍 Manual payment status check for session:", sessionId);

        // Find order by session ID
        const order = await Order.findOne({ paymentSessionId: sessionId });
        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // If orderId provided, verify it matches
        if (orderId && order._id.toString() !== orderId) {
            return res.status(403).json({
                success: false,
                message: "Order ID mismatch",
            });
        }

        // Get payment status from HDFC
        const paymentStatusResponse = await getPaymentStatus(
            order.orderId,
            order.user.toString()
        );
        const paymentStatus = parsePaymentStatus(paymentStatusResponse);

        // Verify payment data (for legacy endpoint, log warnings but don't fail)
        const verification = verifyPaymentData(order, paymentStatusResponse);
        if (!verification.isValid) {
            console.warn(
                "⚠️ Payment data verification failed in legacy endpoint:",
                verification.errors
            );
        }

        // Update order if status changed
        if (order.paymentStatus !== paymentStatus) {
            const updateData = {
                paymentStatus: paymentStatus,
                paymentResponse: paymentStatusResponse,
                paymentVerifiedAt: new Date(),
            };

            if (paymentStatus === "paid") {
                updateData.status = "processing";
            }

            await Order.findByIdAndUpdate(order._id, updateData);
            console.log(
                `📊 Updated payment status for order ${order._id}: ${paymentStatus}`
            );
        }

        res.json({
            success: true,
            paymentStatus: paymentStatus,
            orderStatus: order.status,
            sessionId: sessionId,
            orderId: order._id,
            lastUpdated: new Date(),
        });
    } catch (error) {
        console.error("❌ Payment status check failed:", error);
        res.status(500).json({
            success: false,
            message: "Payment status check failed",
            error: error.message,
        });
    }
};

/**
 * Verify payment for a specific order (user-specific) - PRIMARY ENDPOINT
 * This is the main payment verification API used by the frontend
 */
export const verifyPayment = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        console.log(
            `🔍 Verifying payment for order: ${orderId}, user: ${userId}`
        );

        // Find order by ID (expecting MongoDB _id)
        const order = await Order.findOne({ _id: orderId, user: userId });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found",
            });
        }

        // Handle COD orders differently - they don't need payment verification
        if (order.paymentMethod === "COD") {
            console.log(
                "💰 COD order detected - returning order status without payment verification"
            );
            return res.json({
                success: true,
                paymentStatus: "cod", // Special status for COD
                orderStatus: order.status,
                orderId: order._id,
                customOrderId: order.orderId,
                total: order.total, // Add total amount
                amount: order.total, // Add amount for backward compatibility
                paymentMethod: "COD",
                verifiedAt: new Date(),
                order: {
                    _id: order._id,
                    orderId: order.orderId,
                    total: order.total,
                    paymentMethod: order.paymentMethod,
                    paymentStatus: "cod",
                    status: order.status,
                    createdAt: order.createdAt,
                },
            });
        }

        // Check if payment session exists (only for online payments)
        if (!order.paymentSessionId) {
            return res.status(400).json({
                success: false,
                message: "No payment session found for this order",
            });
        }

        // Get latest payment status
        const paymentStatusResponse = await getPaymentStatus(
            order.orderId,
            order.user.toString()
        );
        const paymentStatus = parsePaymentStatus(paymentStatusResponse);

        // CRITICAL: Verify payment data matches original session data
        const verification = verifyPaymentData(order, paymentStatusResponse);

        if (!verification.isValid) {
            console.error(
                "❌ Payment data verification failed:",
                verification.errors
            );
            return res.status(400).json({
                success: false,
                message: "Payment data verification failed",
                errors: verification.errors,
                details: verification.details,
            });
        }

        if (verification.warnings.length > 0) {
            console.warn(
                "⚠️ Payment verification warnings:",
                verification.warnings
            );
        }

        console.log("✅ Payment data verification passed");

        // Update order with latest status
        const updateData = {
            paymentStatus: paymentStatus,
            paymentResponse: paymentStatusResponse,
            paymentVerifiedAt: new Date(),
        };

        if (paymentStatus === "paid") {
            updateData.status = "processing";
        } else if (paymentStatus === "failed") {
            updateData.status = "failed";
        }

        await Order.findByIdAndUpdate(order._id, updateData);

        console.log(
            `✅ Payment verification completed for order: ${orderId}, status: ${paymentStatus}`
        );

        res.json({
            success: true,
            paymentStatus: paymentStatus,
            orderStatus: updateData.status || order.status,
            orderId: order._id,
            customOrderId: order.orderId,
            total: order.total, // Add total amount
            amount: order.total, // Add amount for backward compatibility
            paymentMethod: order.paymentMethod,
            verifiedAt: new Date(),
            order: {
                _id: order._id,
                orderId: order.orderId,
                total: order.total,
                paymentMethod: order.paymentMethod,
                paymentStatus: paymentStatus,
                status: updateData.status || order.status,
                createdAt: order.createdAt,
            },
        });
    } catch (error) {
        console.error("❌ Payment verification failed:", error);
        res.status(500).json({
            success: false,
            message: "Payment verification failed",
            error: error.message,
        });
    }
};

/**
 * Handle HDFC return callback (when user returns from payment page)
 */
export const handleHdfcReturn = async (req, res) => {
    try {
        console.log("🔄 HDFC return callback received");
        console.log("📋 Return query params:", req.query);
        console.log("📋 Return body params:", req.body);
        console.log("📋 Return method:", req.method);

        // HDFC can send data in query params (GET) or body (POST)
        const params = { ...req.query, ...req.body };
        console.log("📋 All return parameters:", params);

        // Step 1: Verify signature if present (for secure returns)
        if (params.signature && params.signature_algorithm) {
            console.log("🔐 Verifying return URL signature...");
            const isSignatureValid = verifyWebhookSignature(
                params,
                hdfcConfig.responseKey
            );

            if (!isSignatureValid) {
                console.log("❌ Invalid signature in return callback");
                return res.redirect(
                    `${process.env.FRONTEND_URL}/payment/status?error=invalid_signature`
                );
            }
            console.log("✅ Return URL signature verified successfully");
        } else {
            console.log(
                "⚠️ No signature found in return URL - proceeding with status verification"
            );
        }

        // Extract order_id from various possible parameter names
        const order_id =
            params.order_id ||
            params.orderId ||
            params.orderRef ||
            params.merchant_order_id;
        const status = params.status || params.orderStatus;

        console.log("🔍 Extracted parameters:", { order_id, status });

        if (!order_id) {
            console.log("❌ No order ID in return callback");
            console.log("📋 Available parameters:", Object.keys(params));
            console.log("📋 Query params:", req.query);
            console.log("📋 Body params:", req.body);
            console.log("📋 Headers:", req.headers);

            // For debugging: If we have a session ID, try to find order by that
            const sessionId =
                params.session_id || params.sessionId || params.id;
            if (sessionId) {
                console.log(
                    "🔍 Trying to find order by session ID:",
                    sessionId
                );
                try {
                    const orderBySession = await Order.findOne({
                        paymentSessionId: sessionId,
                    });
                    if (orderBySession) {
                        console.log(
                            "✅ Found order by session ID:",
                            orderBySession.orderId
                        );
                        // Redirect to status page with MongoDB _id
                        return res.redirect(
                            `${process.env.FRONTEND_URL}/payment/status/${orderBySession._id}`
                        );
                    }
                } catch (err) {
                    console.log("❌ Error finding order by session ID:", err);
                }
            }

            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/status?error=missing_order_id`
            );
        }

        // Find order by custom order ID
        const order = await Order.findOne({ orderId: order_id });
        if (!order) {
            console.log("❌ Order not found for return callback:", order_id);
            return res.redirect(
                `${process.env.FRONTEND_URL}/payment/status?error=order_not_found`
            );
        }

        // Get the latest payment status from HDFC to verify
        const paymentStatusResponse = await getPaymentStatus(
            order.orderId,
            order.user.toString()
        );
        const paymentStatus = parsePaymentStatus(paymentStatusResponse);

        // CRITICAL: Verify payment data matches original session data
        const verification = verifyPaymentData(order, paymentStatusResponse);

        if (!verification.isValid) {
            console.error(
                "❌ Payment data verification failed in return callback:",
                verification.errors
            );
            return res.redirect(
                `${
                    process.env.FRONTEND_URL
                }/payment/status?error=verification_failed&details=${encodeURIComponent(
                    verification.details
                )}`
            );
        }

        console.log("✅ Payment data verification passed in return callback");

        console.log(
            `📄 Return callback - Order: ${order.orderId}, Status: ${paymentStatus}`
        );

        // Update order with final status
        const updateData = {
            paymentStatus: paymentStatus,
            paymentResponse: paymentStatusResponse,
            paymentVerifiedAt: new Date(),
        };

        if (paymentStatus === "paid") {
            updateData.status = "processing";
        } else if (paymentStatus === "failed") {
            updateData.status = "failed";
        }

        await Order.findByIdAndUpdate(order._id, updateData);

        // Redirect user based on payment status using MongoDB _id
        if (!process.env.FRONTEND_URL) {
            throw new Error("FRONTEND_URL environment variable is not set");
        }
        res.redirect(`${process.env.FRONTEND_URL}/payment/status/${order._id}`);
    } catch (error) {
        console.error("❌ Return callback processing failed:", error);
        if (!process.env.FRONTEND_URL) {
            return res.status(500).json({
                success: false,
                message: "FRONTEND_URL environment variable is not set",
            });
        }
        res.redirect(
            `${process.env.FRONTEND_URL}/payment/status?error=processing_failed`
        );
    }
};
