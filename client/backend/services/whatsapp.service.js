import axios from "axios";

// MSG91 API Configuration
const MSG91_CONFIG = {
    authKey: process.env.MSG91_AUTH_KEY,
    baseUrl: "https://control.msg91.com/api/v5/whatsapp",
    senderId: process.env.MSG91_SENDER_ID,
};

const formatPhoneNumber = (phone) => {
    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // If starts with 91, keep as is
    if (cleaned.startsWith("91") && cleaned.length === 12) {
        return cleaned;
    }

    // If 10 digits, add 91 prefix
    if (cleaned.length === 10) {
        return "91" + cleaned;
    }

    // Return as is if already formatted
    return cleaned;
};

const sendWhatsAppMessage = async (mobile, templateId, templateData = []) => {
    try {
        const formattedMobile = formatPhoneNumber(mobile);

        const payload = {
            integrated_number: MSG91_CONFIG.senderId,
            content_type: "template",
            payload: {
                to: formattedMobile,
                type: "template",
                template: {
                    name: templateId,
                    language: {
                        code: "en",
                    },
                    components: [
                        {
                            type: "body",
                            parameters: templateData.map((data) => ({
                                type: "text",
                                text: data.toString(),
                            })),
                        },
                    ],
                },
            },
        };

        const response = await axios.post(
            `${MSG91_CONFIG.baseUrl}/whatsapp-outbound-message/bulk/`,
            payload,
            {
                headers: {
                    authkey: MSG91_CONFIG.authKey,
                    "Content-Type": "application/json",
                },
            }
        );

        console.log("✅ WhatsApp message sent successfully:", {
            mobile: formattedMobile,
            templateId,
            response: response.data,
        });

        return {
            success: true,
            data: response.data,
            mobile: formattedMobile,
        };
    } catch (error) {
        console.error("❌ WhatsApp message failed:", {
            mobile,
            templateId,
            error: error.response?.data || error.message,
        });

        return {
            success: false,
            error: error.response?.data || error.message,
            mobile,
        };
    }
};

export const sendOTPMessage = async (mobile, otp) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_OTP;
    const templateData = [otp];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendLoginAlert = async (
    mobile,
    deviceInfo = "Unknown Device",
    timestamp = new Date().toLocaleString()
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_LOGIN_ALERT;
    const templateData = [deviceInfo, timestamp];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderPlaced = async (
    mobile,
    customerName,
    orderId,
    amount,
    deliveryDate
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_PLACED;
    const templateData = [customerName, orderId, `₹${amount}`, deliveryDate];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderStatusUpdate = async (
    mobile,
    customerName,
    orderId,
    status,
    trackingInfo = ""
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_STATUS;
    const templateData = trackingInfo
        ? [customerName, orderId, status, trackingInfo]
        : [customerName, orderId, status];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendPaymentConfirmation = async (
    mobile,
    customerName,
    orderId,
    amount,
    paymentMethod
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_PAYMENT_SUCCESS;
    const templateData = [customerName, `₹${amount}`, orderId, paymentMethod];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderShipped = async (
    mobile,
    customerName,
    orderId,
    trackingNumber,
    courierName,
    expectedDelivery
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_SHIPPED;
    const templateData = [
        customerName,
        orderId,
        trackingNumber,
        courierName,
        expectedDelivery,
    ];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderDelivered = async (
    mobile,
    customerName,
    orderId,
    deliveryTime
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_DELIVERED;
    const templateData = [customerName, orderId, deliveryTime];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendPromotionalMessage = async (
    mobile,
    customerName,
    offerDetails,
    validUntil,
    promoCode = ""
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_PROMOTIONAL;
    const templateData = promoCode
        ? [customerName, offerDetails, promoCode, validUntil]
        : [customerName, offerDetails, validUntil];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderCancelled = async (
    mobile,
    customerName,
    orderId,
    reason,
    refundInfo
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_CANCELLED;
    const templateData = [customerName, orderId, reason, refundInfo];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const testWhatsAppService = async () => {
    try {
        if (!MSG91_CONFIG.authKey || !MSG91_CONFIG.senderId) {
            throw new Error(
                "MSG91 configuration missing. Please check environment variables."
            );
        }

        return {
            success: true,
            message: "WhatsApp service configured successfully",
            config: {
                hasAuthKey: !!MSG91_CONFIG.authKey,
                hasSenderId: !!MSG91_CONFIG.senderId,
                baseUrl: MSG91_CONFIG.baseUrl,
            },
        };
    } catch (error) {
        return {
            success: false,
            error: error.message,
        };
    }
};

// Helper function to get all available template functions
export const getAvailableTemplates = () => {
    return {
        otp: "sendOTPMessage",
        loginAlert: "sendLoginAlert",
        orderPlaced: "sendOrderPlaced",
        orderStatus: "sendOrderStatusUpdate",
        paymentSuccess: "sendPaymentConfirmation",
        orderShipped: "sendOrderShipped",
        orderDelivered: "sendOrderDelivered",
        promotional: "sendPromotionalMessage",
        orderCancelled: "sendOrderCancelled",
    };
};
