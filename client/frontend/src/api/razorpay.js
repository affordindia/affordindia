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

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5001";

/**
 * Create Razorpay order for payment
 * @param {string} orderId - Internal order ID
 * @returns {Promise<Object>} Razorpay order data
 */
export const createRazorpayOrder = async (orderId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/razorpay/create-order`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ orderId }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Failed to create payment order"
            );
        }

        const data = await response.json();
        console.log("✅ Razorpay order created:", data);
        return data;
    } catch (error) {
        console.error("❌ Failed to create Razorpay order:", error);
        throw error;
    }
};

/**
 * Verify Razorpay payment after successful payment
 * @param {Object} paymentData - Razorpay payment response
 * @returns {Promise<Object>} Verification result
 */
export const verifyRazorpayPayment = async (paymentData) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/razorpay/verify-payment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify(paymentData),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Payment verification failed");
        }

        const data = await response.json();
        console.log("✅ Payment verified successfully:", data);
        return data;
    } catch (error) {
        console.error("❌ Payment verification failed:", error);
        throw error;
    }
};

/**
 * Retry a failed payment
 * @param {string} orderId - Order ID to retry payment for
 * @returns {Promise<Object>} New payment order data
 */
export const retryRazorpayPayment = async (orderId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/razorpay/retry-payment`,
            {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: JSON.stringify({ orderId }),
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to retry payment");
        }

        const data = await response.json();
        console.log("✅ Payment retry initiated:", data);
        return data;
    } catch (error) {
        console.error("❌ Failed to retry payment:", error);
        throw error;
    }
};

/**
 * Get payment status from Razorpay
 * @param {string} paymentId - Razorpay payment ID
 * @returns {Promise<Object>} Payment status
 */
export const getRazorpayPaymentStatus = async (paymentId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/razorpay/payment-status/${paymentId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(
                errorData.message || "Failed to get payment status"
            );
        }

        const data = await response.json();
        console.log("✅ Payment status retrieved:", data);
        return data;
    } catch (error) {
        console.error("❌ Failed to get payment status:", error);
        throw error;
    }
};

/**
 * Get order status from Razorpay
 * @param {string} razorpayOrderId - Razorpay order ID
 * @returns {Promise<Object>} Order status
 */
export const getRazorpayOrderStatus = async (razorpayOrderId) => {
    try {
        const response = await fetch(
            `${API_BASE_URL}/api/razorpay/order-status/${razorpayOrderId}`,
            {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Failed to get order status");
        }

        const data = await response.json();
        console.log("✅ Order status retrieved:", data);
        return data;
    } catch (error) {
        console.error("❌ Failed to get order status:", error);
        throw error;
    }
};

/**
 * Check Razorpay service health
 * @returns {Promise<Object>} Service health status
 */
export const checkRazorpayHealth = async () => {
    try {
        const response = await fetch(`${API_BASE_URL}/api/razorpay/health`, {
            method: "GET",
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || "Health check failed");
        }

        const data = await response.json();
        console.log("✅ Razorpay health check:", data);
        return data;
    } catch (error) {
        console.error("❌ Razorpay health check failed:", error);
        throw error;
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
