import axios from "axios";
import getEmailConfig from "../config/email.config.js";

/**
 * Send template email using MSG91
 */
export const sendTemplateEmail = async (
    templateId,
    recipientEmail,
    variables = {}
) => {
    try {
        const config = getEmailConfig();

        if (!config.authKey) {
            throw new Error("MSG91_AUTH_KEY not configured");
        }

        // MSG91 Email API format (correct structure)
        const payload = {
            recipients: [
                {
                    to: [
                        {
                            name: variables.name || "Customer",
                            email: recipientEmail,
                        },
                    ],
                    variables: variables,
                },
            ],
            from: {
                name: config.from.name,
                email: config.from.email,
            },
            template_id: templateId,
            domain: config.domain,
        };

        console.log("📧 Sending template email via MSG91:", {
            to: recipientEmail,
            templateId: templateId,
            variables: Object.keys(variables),
        });

        const response = await axios.post(
            `${config.baseUrl}/email/send`,
            payload,
            {
                headers: {
                    accept: "application/json",
                    authkey: config.authKey,
                    "content-type": "application/json",
                },
                timeout: 30000,
            }
        );

        return {
            success: true,
            messageId: response.data.request_id || response.data.message_id,
            data: response.data,
        };
    } catch (error) {
        console.error(
            "❌ Error sending template email:",
            error.response?.data || error.message
        );
        throw new Error(
            `Email sending failed: ${
                error.response?.data?.message || error.message
            }`
        );
    }
};

/**
 * Send contact form emails (admin notification + user auto-reply)
 */
export const sendContactFormEmails = async (contactData) => {
    try {
        const config = getEmailConfig();
        const { name, email, message } = contactData;

        // Send admin notification email
        const adminResult = await sendTemplateEmail(
            config.templates.contactAdmin,
            config.from.email, // Send to admin email
            {
                name: name,
                email: email,
                message: message,
                submitted_on: new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }
        );

        // Send user auto-reply email
        const userResult = await sendTemplateEmail(
            config.templates.contactUser,
            email,
            {
                name: name,
                // support_email: config.from.email,
                // support_phone: "+91 9211501006",
                // website_url:
                // process.env.FRONTEND_URL || "https://affordindia.com",
            }
        );

        return {
            success: true,
            admin: adminResult,
            user: userResult,
        };
    } catch (error) {
        console.error("❌ Error sending contact form emails:", error);
        throw error;
    }
};

/**
 * Send return/cancel request emails (admin notification + user auto-reply)
 */
export const sendReturnCancelRequestEmails = async (requestData) => {
    try {
        const config = getEmailConfig();
        const { name, email, orderId, reason, type } = requestData;

        // Send admin notification email
        const adminResult = await sendTemplateEmail(
            config.templates.returnCancelAdmin,
            config.from.email, // Send to admin email
            {
                name: name,
                email: email,
                orderId: orderId,
                reason: reason,
                type: type, // "return" or "cancel"
                submitted_on: new Date().toLocaleString("en-IN", {
                    timeZone: "Asia/Kolkata",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                }),
            }
        );

        // Send user auto-reply email
        const userResult = await sendTemplateEmail(
            config.templates.returnCancelUser,
            email,
            {
                name: name,
                // orderId: orderId,
                // type: type,
                // support_email: config.from.email,
                // support_phone: "+91 9211501006",
                // website_url: process.env.FRONTEND_URL || "https://affordindia.com",
            }
        );

        return {
            success: true,
            admin: adminResult,
            user: userResult,
        };
    } catch (error) {
        console.error("❌ Error sending return/cancel request emails:", error);
        throw error;
    }
};

/**
 * Send order confirmation email
 */
export const sendOrderConfirmationEmail = async (customerEmail, orderData) => {
    try {
        const config = getEmailConfig();

        return await sendTemplateEmail(
            config.templates.orderConfirmation,
            customerEmail,
            {
                customer_name: orderData.customerName,
                order_id: orderData.orderId,
                order_total: orderData.total,
                order_items: orderData.items,
                order_date: orderData.date,
            }
        );
    } catch (error) {
        console.error("❌ Error sending order confirmation email:", error);
        throw error;
    }
};

/**
 * Send order shipped email
 */
export const sendOrderShippedEmail = async (customerEmail, orderData) => {
    try {
        const config = getEmailConfig();

        return await sendTemplateEmail(
            config.templates.orderShipped,
            customerEmail,
            {
                customer_name: orderData.customerName,
                order_id: orderData.orderId,
                tracking_number: orderData.trackingNumber,
                estimated_delivery: orderData.estimatedDelivery,
            }
        );
    } catch (error) {
        console.error("❌ Error sending order shipped email:", error);
        throw error;
    }
};

/**
 * Send order delivered email
 */
export const sendOrderDeliveredEmail = async (customerEmail, orderData) => {
    try {
        const config = getEmailConfig();

        return await sendTemplateEmail(
            config.templates.orderDelivered,
            customerEmail,
            {
                customer_name: orderData.customerName,
                order_id: orderData.orderId,
                delivered_date: orderData.deliveredDate,
            }
        );
    } catch (error) {
        console.error("❌ Error sending order delivered email:", error);
        throw error;
    }
};

/**
 * Send payment success email
 */
export const sendPaymentSuccessEmail = async (customerEmail, paymentData) => {
    try {
        const config = getEmailConfig();

        return await sendTemplateEmail(
            config.templates.paymentSuccess,
            customerEmail,
            {
                customer_name: paymentData.customerName,
                order_id: paymentData.orderId,
                payment_amount: paymentData.amount,
                payment_method: paymentData.method,
                transaction_id: paymentData.transactionId,
            }
        );
    } catch (error) {
        console.error("❌ Error sending payment success email:", error);
        throw error;
    }
};

/**
 * Health check for email service
 */
export const checkEmailHealth = async () => {
    try {
        const config = getEmailConfig();

        return {
            healthy: !!(config.authKey && config.from.email),
            service: "MSG91 Email Service",
            timestamp: new Date().toISOString(),
            config: {
                authKeyPresent: !!config.authKey,
                fromEmailPresent: !!config.from.email,
                templatesConfigured: Object.keys(config.templates).length,
            },
        };
    } catch (error) {
        return {
            healthy: false,
            service: "MSG91 Email Service",
            error: error.message,
            timestamp: new Date().toISOString(),
        };
    }
};
