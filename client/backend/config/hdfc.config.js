// HDFC SmartGateway configuration
export default {
    merchantId: process.env.HDFC_MERCHANT_ID,
    apiKey: process.env.HDFC_API_KEY,
    apiSecret: process.env.HDFC_API_SECRET,
    clientId: process.env.HDFC_CLIENT_ID,
    action: process.env.HDFC_ACTION,

    // API URLs
    sessionApiUrl: process.env.HDFC_SESSION_API_URL,
    statusApiBaseURL: process.env.HDFC_STATUS_API_URL,

    // Callback URLs
    returnUrl: process.env.HDFC_RETURN_URL,
    cancelUrl: process.env.HDFC_CANCEL_URL,
    webhookUrl: process.env.HDFC_WEBHOOK_URL,

    // Security
    webhookSecret: process.env.HDFC_WEBHOOK_SECRET,
    responseKey: process.env.HDFC_RESPONSE_KEY, // For HMAC signature verification

    // Business details
    displayBusinessAs: process.env.HDFC_BUSINESS_NAME || "AFFORD INDIA",

    // Environment
    environment:
        process.env.NODE_ENV === "production" ? "production" : "sandbox",
};
