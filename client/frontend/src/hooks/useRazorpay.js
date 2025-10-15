/**
 * Razorpay Payment Hook
 *
 * PAYMENT PROVIDER MIGRATION NOTES:
 * - This hook replaces HDFC payment URL redirect approach
 * - Uses Razorpay checkout modal for seamless payment experience
 * - Provides better error handling and retry functionality
 * - Migration date: October 15, 2025
 * - Branch: feat/razorpay
 */

import { useState, useCallback } from "react";
import { toast } from "react-hot-toast";

// Razorpay script loading utility
const loadRazorpayScript = () => {
    return new Promise((resolve) => {
        // Check if script is already loaded
        if (window.Razorpay) {
            resolve(true);
            return;
        }

        const script = document.createElement("script");
        script.src = "https://checkout.razorpay.com/v1/checkout.js";
        script.onload = () => {
            resolve(true);
        };
        script.onerror = () => {
            resolve(false);
        };
        document.body.appendChild(script);
    });
};

/**
 * Custom hook for Razorpay payment integration
 */
export const useRazorpay = () => {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    /**
     * Initialize Razorpay payment
     * @param {Object} paymentData - Payment data from backend
     * @param {Object} userDetails - User information
     * @param {Function} onSuccess - Success callback
     * @param {Function} onFailure - Failure callback
     */
    const initiatePayment = useCallback(
        async (paymentData, userDetails, onSuccess, onFailure) => {
            try {
                setLoading(true);
                setError(null);

                // Load Razorpay script if not already loaded
                const scriptLoaded = await loadRazorpayScript();
                if (!scriptLoaded) {
                    throw new Error("Failed to load Razorpay payment gateway");
                }

                // Prepare Razorpay options
                const options = {
                    key: paymentData.razorpayKeyId,
                    amount: paymentData.amount, // Amount in paise
                    currency: paymentData.currency || "INR",
                    name: "AffordIndia",
                    description: `Order Payment - ${paymentData.orderId}`,
                    image: "/favicon.png", // Company logo
                    order_id: paymentData.razorpayOrderId,

                    // Customer information
                    prefill: {
                        name: userDetails.name,
                        email: userDetails.email,
                        contact: userDetails.phone,
                    },

                    // Theme customization
                    theme: {
                        color: "#B76E79", // AffordIndia brand color
                    },

                    // Modal configuration
                    modal: {
                        ondismiss: () => {
                            console.log("🚫 Payment modal dismissed by user");
                            setLoading(false);
                            if (onFailure) {
                                onFailure({
                                    error: "PAYMENT_CANCELLED",
                                    message: "Payment was cancelled by user",
                                });
                            }
                        },
                    },

                    // Payment success handler
                    handler: async (response) => {
                        console.log("✅ Payment successful:", response);

                        try {
                            // Call success callback with Razorpay response
                            if (onSuccess) {
                                await onSuccess({
                                    razorpay_order_id:
                                        response.razorpay_order_id,
                                    razorpay_payment_id:
                                        response.razorpay_payment_id,
                                    razorpay_signature:
                                        response.razorpay_signature,
                                    orderId: paymentData.orderId,
                                });
                            }

                            setLoading(false);
                        } catch (error) {
                            console.error(
                                "❌ Payment verification failed:",
                                error
                            );
                            setError("Payment verification failed");
                            setLoading(false);

                            if (onFailure) {
                                onFailure({
                                    error: "VERIFICATION_FAILED",
                                    message:
                                        error.message ||
                                        "Payment verification failed",
                                });
                            }
                        }
                    },

                    // Payment failure handler
                    error: (error) => {
                        console.error("❌ Payment failed:", error);
                        setError("Payment failed");
                        setLoading(false);

                        if (onFailure) {
                            onFailure({
                                error: "PAYMENT_FAILED",
                                message: error.description || "Payment failed",
                                code: error.code,
                                source: error.source,
                                step: error.step,
                                reason: error.reason,
                            });
                        }
                    },
                };

                // Create and open Razorpay checkout
                const rzp = new window.Razorpay(options);

                // Handle checkout failure
                rzp.on("payment.failed", (response) => {
                    console.error("🚫 Payment failed event:", response);
                    setError("Payment failed");
                    setLoading(false);

                    if (onFailure) {
                        onFailure({
                            error: "PAYMENT_FAILED",
                            message:
                                response.error?.description || "Payment failed",
                            code: response.error?.code,
                            source: response.error?.source,
                            step: response.error?.step,
                            reason: response.error?.reason,
                        });
                    }
                });

                // Open payment modal
                rzp.open();
            } catch (error) {
                console.error("❌ Failed to initiate payment:", error);
                setError(error.message);
                setLoading(false);

                if (onFailure) {
                    onFailure({
                        error: "INITIALIZATION_FAILED",
                        message:
                            error.message || "Failed to initialize payment",
                    });
                }
            }
        },
        []
    );

    /**
     * Retry a failed payment
     * @param {string} orderId - Order ID to retry payment for
     * @param {Object} userDetails - User information
     * @param {Function} onSuccess - Success callback
     * @param {Function} onFailure - Failure callback
     */
    const retryPayment = useCallback(
        async (orderId, userDetails, onSuccess, onFailure) => {
            try {
                setLoading(true);
                setError(null);

                // Call backend to create new payment attempt
                const response = await fetch(`/api/razorpay/retry-payment`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem(
                            "token"
                        )}`,
                    },
                    body: JSON.stringify({ orderId }),
                });

                if (!response.ok) {
                    const errorData = await response.json();
                    throw new Error(
                        errorData.message || "Failed to retry payment"
                    );
                }

                const retryData = await response.json();

                // Initiate payment with retry data
                await initiatePayment(
                    retryData,
                    userDetails,
                    onSuccess,
                    onFailure
                );
            } catch (error) {
                console.error("❌ Failed to retry payment:", error);
                setError(error.message);
                setLoading(false);

                toast.error(error.message || "Failed to retry payment");

                if (onFailure) {
                    onFailure({
                        error: "RETRY_FAILED",
                        message: error.message || "Failed to retry payment",
                    });
                }
            }
        },
        [initiatePayment]
    );

    /**
     * Clear error state
     */
    const clearError = useCallback(() => {
        setError(null);
    }, []);

    return {
        initiatePayment,
        retryPayment,
        loading,
        error,
        clearError,
    };
};

export default useRazorpay;
