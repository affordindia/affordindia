import {
    sendTemplateEmail,
    sendContactFormEmails,
    sendOrderConfirmationEmail,
    sendOrderShippedEmail,
    sendOrderDeliveredEmail,
    sendPaymentSuccessEmail,
    checkEmailHealth,
} from "../services/email.service.js";

/**
 * Send contact form emails (admin notification + user auto-reply)
 * POST /api/email/contact
 */
export const submitContactForm = async (req, res) => {
    try {
        const { name, email, message } = req.body;

        // Validation
        if (!name || !email || !message) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: name, email, and message",
            });
        }

        // Additional validation
        const errors = [];
        if (name.trim().length < 2) {
            errors.push("Name must be at least 2 characters long");
        }
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            errors.push("Please provide a valid email address");
        }
        if (message.trim().length < 10) {
            errors.push("Message must be at least 10 characters long");
        }

        if (errors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: errors,
            });
        }

        const contactData = {
            name: name.trim(),
            email: email.trim().toLowerCase(),
            message: message.trim(),
        };

        const result = await sendContactFormEmails(contactData);

        // Check if at least admin email was sent successfully
        if (!result.admin.success) {
            console.error("Failed to send admin notification email");
            return res.status(500).json({
                success: false,
                message:
                    "Failed to process your message. Please try again or contact us directly.",
                error: "Email delivery failed",
            });
        }

        res.status(200).json({
            success: true,
            message:
                "Thank you for your message! We'll get back to you within 24-48 hours.",
            data: {
                submitted: true,
                adminEmailSent: result.admin.success,
                userEmailSent: result.user.success,
                submittedAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("❌ Error in submitContactForm controller:", error);
        res.status(500).json({
            success: false,
            message:
                "An unexpected error occurred. Please try again later or contact us directly.",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Send order confirmation email
 * POST /api/email/order-confirmation
 */
export const sendOrderConfirmation = async (req, res) => {
    try {
        const { customerEmail, orderData } = req.body;

        if (!customerEmail || !orderData) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: customerEmail and orderData",
            });
        }

        const result = await sendOrderConfirmationEmail(
            customerEmail,
            orderData
        );

        res.status(200).json({
            success: true,
            message: "Order confirmation email sent successfully",
            data: {
                messageId: result.messageId,
                sentAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("❌ Error in sendOrderConfirmation controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send order confirmation email",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Send order shipped email
 * POST /api/email/order-shipped
 */
export const sendOrderShipped = async (req, res) => {
    try {
        const { customerEmail, orderData } = req.body;

        if (!customerEmail || !orderData) {
            return res.status(400).json({
                success: false,
                message: "Missing required fields: customerEmail and orderData",
            });
        }

        const result = await sendOrderShippedEmail(customerEmail, orderData);

        res.status(200).json({
            success: true,
            message: "Order shipped email sent successfully",
            data: {
                messageId: result.messageId,
                sentAt: new Date().toISOString(),
            },
        });
    } catch (error) {
        console.error("❌ Error in sendOrderShipped controller:", error);
        res.status(500).json({
            success: false,
            message: "Failed to send order shipped email",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Health check for email service
 * GET /api/email/health
 */
export const getEmailHealth = async (req, res) => {
    try {
        const health = await checkEmailHealth();

        res.status(health.healthy ? 200 : 503).json({
            success: health.healthy,
            ...health,
        });
    } catch (error) {
        console.error("❌ Error in getEmailHealth controller:", error);
        res.status(503).json({
            success: false,
            service: "MSG91 Email Service",
            status: "error",
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
};
