import axios from "axios";

// MSG91 API Configuration
const MSG91_CONFIG = {
    authKey: process.env.MSG91_AUTH_KEY,
    baseUrl: "https://control.msg91.com/api/v5/whatsapp",
    senderId: process.env.MSG91_SENDER_ID,
};

const formatPhoneNumber = (phone) => {
    if (!phone) {
        throw new Error("Phone number is required");
    }

    // Remove all non-digit characters
    let cleaned = phone.replace(/\D/g, "");

    // Validate minimum length
    if (cleaned.length < 10) {
        throw new Error("Phone number must be at least 10 digits");
    }

    // If starts with 91, keep as is
    if (cleaned.startsWith("91") && cleaned.length === 12) {
        return cleaned;
    }

    // If starts with 0, remove it (Indian mobile format)
    if (cleaned.startsWith("0") && cleaned.length === 11) {
        cleaned = cleaned.substring(1);
    }

    // If 10 digits, add 91 prefix for India
    if (cleaned.length === 10) {
        // Validate Indian mobile number pattern (starts with 6,7,8,9)
        if (!/^[6-9]/.test(cleaned)) {
            throw new Error("Invalid Indian mobile number format");
        }
        return "91" + cleaned;
    }

    // If other country codes, validate length
    if (cleaned.length > 15 || cleaned.length < 10) {
        throw new Error("Invalid phone number length");
    }

    return cleaned;
};

const sendWhatsAppMessage = async (mobile, templateId, templateData = []) => {
    try {
        if (!templateId) {
            throw new Error("Template ID is required");
        }

        const formattedMobile = formatPhoneNumber(mobile);

        // Create components object for template variables
        const components = {};
        templateData.forEach((data, index) => {
            components[`body_${index + 1}`] = {
                type: "text",
                value: data.toString(),
            };
        });

        const payload = {
            integrated_number: MSG91_CONFIG.senderId,
            content_type: "template",
            payload: {
                messaging_product: "whatsapp",
                type: "template",
                template: {
                    name: templateId,
                    language: {
                        code: "en",
                        policy: "deterministic",
                    },
                    to_and_components: [
                        {
                            to: [formattedMobile],
                            components: components,
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
                timeout: 30000,
            }
        );

        console.log("✅ WhatsApp API Response:", {
            mobile: formattedMobile,
            templateId,
            status: response.status,
            data: JSON.stringify(response.data),
            messageId: response.data?.message_id || response.data?.id,
        });

        return {
            success: true,
            data: response.data,
            mobile: formattedMobile,
            messageId: response.data?.message_id || response.data?.id,
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
    // Use shipment tracking template if trackingInfo provided (from webhook)
    // Otherwise use regular order status template
    const templateId = trackingInfo 
        ? process.env.WHATSAPP_TEMPLATE_SHIPMENT_TRACKING
        : process.env.WHATSAPP_TEMPLATE_ORDER_STATUS;
    
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

export const sendPaymentFailed = async (
    mobile,
    customerName,
    orderId,
    failureReason = "Payment processing failed"
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_PAYMENT_FAILED;
    const templateData = [customerName, orderId, failureReason];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendOrderTracking = async (
    mobile,
    customerName,
    orderId,
    trackingNumber,
    courierName,
    currentStatus,
    location = ""
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_ORDER_TRACKING;
    const templateData = location
        ? [
              customerName,
              orderId,
              trackingNumber,
              courierName,
              currentStatus,
              location,
          ]
        : [customerName, orderId, trackingNumber, courierName, currentStatus];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendReturnRequest = async (
    mobile,
    customerName,
    orderId,
    returnRequestId,
    status = "initiated"
) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_RETURN_REQUEST;
    const templateData = [customerName, orderId, returnRequestId, status];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendWelcomeMessage = async (mobile, customerName) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_WELCOME;
    const templateData = [customerName];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};

export const sendPasswordReset = async (mobile, customerName, resetCode) => {
    const templateId = process.env.WHATSAPP_TEMPLATE_PASSWORD_RESET;
    const templateData = [customerName, resetCode];

    return await sendWhatsAppMessage(mobile, templateId, templateData);
};
