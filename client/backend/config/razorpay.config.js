export default {
    // API Credentials
    keyId: process.env.RAZORPAY_KEY_ID,
    keySecret: process.env.RAZORPAY_KEY_SECRET,

    // Webhook Configuration
    webhookSecret: process.env.RAZORPAY_WEBHOOK_SECRET,
    webhookUrl: process.env.RAZORPAY_WEBHOOK_URL,

    // Environment Settings
    environment: process.env.NODE_ENV === "production" ? "live" : "test",

    // Business Information
    businessName: process.env.RAZORPAY_BUSINESS_NAME || "AffordIndia",
    businessLogo:
        process.env.RAZORPAY_BUSINESS_LOGO ||
        "https://affordindia.vercel.app/logo.png",
    businessDescription: "Complete your payment for AffordIndia order",

    // Currency Settings
    currency: "INR",

    // Order Configuration
    orderTimeout: 15 * 60 * 1000, // 15 minutes in milliseconds
    maxRetryAttempts: 3,
    paymentCapture: 1, // Auto-capture payments

    // Frontend Integration
    theme: {
        color: "#B76E79", // AffordIndia brand color
        backdrop_color: "#FFFFFF",
    },

    // Callback URLs (for reference, actual handling in routes)
    successUrl: process.env.CLIENT_URL
        ? `${process.env.CLIENT_URL}/payment/success`
        : "https://affordindia.vercel.app/payment/success",
    failureUrl: process.env.CLIENT_URL
        ? `${process.env.CLIENT_URL}/payment/failed`
        : "https://affordindia.vercel.app/payment/failed",

    // Features Configuration
    features: {
        enablePartialPayments: false,
        enableMultiplePaymentMethods: true,
        enableSaveCards: false, // For security compliance
        enableWallets: true,
        enableUPI: true,
        enableNetbanking: true,
        enableEMI: false, // Can be enabled later
    },

    // Retry and Timeout Settings
    webhookRetryCount: 5,
    webhookRetryDelay: 30000, // 30 seconds
    paymentStatusPollInterval: 10000, // 10 seconds

    // Error Handling
    errorMessages: {
        payment_failed:
            "Payment failed. Please try again or use a different payment method.",
        insufficient_funds:
            "Insufficient funds in your account. Please try with a different payment method.",
        invalid_card: "Invalid card details. Please check and try again.",
        expired_card: "Your card has expired. Please use a different card.",
        authentication_failed:
            "Payment authentication failed. Please try again.",
        gateway_error:
            "Payment gateway is temporarily unavailable. Please try again.",
        timeout: "Payment timed out. Please try again.",
        cancelled:
            "Payment was cancelled. You can retry payment from your orders page.",
        network_error:
            "Network error occurred. Please check your connection and try again.",
    },

    // Notification Settings
    notifications: {
        email: true,
        sms: false, // Can be enabled with additional Razorpay features
        webhook: true,
    },

    // Security Settings
    security: {
        verifyWebhookSignature: true,
        enforceHTTPS: process.env.NODE_ENV === "production",
        logSensitiveData: process.env.NODE_ENV !== "production", // Only log in development
    },

    // Analytics and Monitoring
    analytics: {
        trackPaymentMethods: true,
        trackFailureReasons: true,
        trackRetryAttempts: true,
        trackProcessingTimes: true,
    },
};
