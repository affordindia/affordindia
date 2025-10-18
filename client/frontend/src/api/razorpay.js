/**
 * Razorpay API Functions
 *
 * PAYMENT PROVIDER MIGRATION NOTES:
 * - These functions replace HDFC payment API calls
 * - Provides Razorpay-specific payment operations
 * - Includes payment verification and retry functionality
 * - Migration date: October 15, 2025
 * - Branch: feat/razorpay
 */

import api from "./axios.js";

/**
 * Create Razorpay order for payment
 * @param {string} orderId - Internal order ID
 * @returns {Promise<Object>} Razorpay order data
 */
export const createRazorpayOrder = async (orderId) => {
    try {
        // Use axios instance with automatic token refresh instead of raw fetch
        const response = await api.post("/razorpay/create-order", { orderId });

        console.log("✅ Razorpay order created:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to create Razorpay order:", error);

        // Provide better error messages for common issues
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Failed to create payment order");
        }
    }
};

/**
 * Verify Razorpay payment after successful payment
 * @param {Object} paymentData - Razorpay payment response
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
    try {
        // Use axios instance with automatic token refresh instead of raw fetch
        const response = await api.post(
            "/razorpay/verify-payment",
            paymentData
        );

        console.log("✅ Payment verified successfully:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Payment verification failed:", error);

        // Handle "Payment already verified" as a success case
        if (
            error.response?.status === 400 &&
            error.response?.data?.message === "Payment already verified"
        ) {
            console.log(
                "✅ Payment was already verified by webhook:",
                error.response.data.data
            );
            // Return the existing payment data as success
            return {
                success: true,
                message: "Payment already verified",
                alreadyVerified: true,
                ...error.response.data.data,
            };
        }

        // Provide better error messages for other issues
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Payment verification failed");
        }
    }
};

/**
 * Retry a failed payment
 * @param {string} orderId - Order ID to retry payment for
 * @returns {Promise<Object>} New payment order data
 */
export const retryRazorpayPayment = async (orderId) => {
    try {
        // Use axios instance with automatic token refresh
        const response = await api.post("/razorpay/retry-payment", { orderId });

        console.log("✅ Payment retry initiated:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to retry payment:", error);

        // Provide better error messages for common issues
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Failed to retry payment");
        }
    }
};

/**
 * Get payment status from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment status
 */
export const getRazorpayPaymentStatus = async (paymentId) => {
    try {
        // Use axios instance with automatic token refresh
        const response = await api.get(`/razorpay/payment-status/${paymentId}`);

        console.log("✅ Payment status retrieved:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get payment status:", error);

        // Provide better error messages for common issues
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Failed to get payment status");
        }
    }
};

/**
 * Get order status from Razorpay
 * @param {string} razorpayOrderId - Razorpay order ID
 * @returns {Promise<Object>} Order status
 */
export const getRazorpayOrderStatus = async (razorpayOrderId) => {
    try {
        // Use axios instance with automatic token refresh
        const response = await api.get(
            `/razorpay/order-status/${razorpayOrderId}`
        );

        console.log("✅ Order status retrieved:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Failed to get order status:", error);

        // Provide better error messages for common issues
        if (error.response?.status === 401) {
            throw new Error("Authentication failed. Please log in again.");
        } else if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Failed to get order status");
        }
    }
};

/**
 * Check Razorpay service health
 * @returns {Promise<Object>} Service health status
 */
export const checkRazorpayHealth = async () => {
    try {
        // Use axios instance (health check typically doesn't need auth, but good for consistency)
        const response = await api.get("/razorpay/health");

        console.log("✅ Razorpay health check:", response.data);
        return response.data;
    } catch (error) {
        console.error("❌ Razorpay health check failed:", error);

        // Health check doesn't need auth error handling, just generic error
        if (error.response?.data?.message) {
            throw new Error(error.response.data.message);
        } else {
            throw new Error("Health check failed");
        }
    }
};

// Export all functions as default object
export default {
    createRazorpayOrder,
    verifyRazorpayPayment,
    retryRazorpayPayment,
    getRazorpayPaymentStatus,
    getRazorpayOrderStatus,
    checkRazorpayHealth,
};
