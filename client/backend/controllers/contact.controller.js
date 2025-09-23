import { sendContactFormEmails } from "../services/email.service.js";

// Validation helper
const validateContactForm = (data) => {
    const errors = [];

    if (!data.name || data.name.trim().length < 2) {
        errors.push("Name must be at least 2 characters long");
    }

    if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
        errors.push("Please provide a valid email address");
    }

    if (!data.message || data.message.trim().length < 10) {
        errors.push("Message must be at least 10 characters long");
    }

    // Security checks
    if (data.name && data.name.length > 100) {
        errors.push("Name is too long (max 100 characters)");
    }

    if (data.email && data.email.length > 254) {
        errors.push("Email is too long (max 254 characters)");
    }

    if (data.message && data.message.length > 5000) {
        errors.push("Message is too long (max 5000 characters)");
    }

    return errors;
};

// Sanitize input data
const sanitizeContactData = (data) => {
    return {
        name: data.name ? data.name.trim() : "",
        email: data.email ? data.email.trim().toLowerCase() : "",
        message: data.message ? data.message.trim() : "",
    };
};

export const submitContactForm = async (req, res) => {
    try {
        // Extract and sanitize data
        const rawData = req.body;
        const contactData = sanitizeContactData(rawData);

        // Validate the contact form data
        const validationErrors = validateContactForm(contactData);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        // Send emails
        const emailResults = await sendContactFormEmails(contactData);

        // Check if at least the admin email was sent successfully
        if (!emailResults.admin.success) {
            console.error("Failed to send admin notification email");
            return res.status(500).json({
                success: false,
                message:
                    "Failed to process your message. Please try again or contact us directly.",
                error: "Email delivery failed",
            });
        }

        // Prepare response
        const response = {
            success: true,
            message:
                "Thank you for your message! We'll get back to you within 24-48 hours.",
            data: {
                submitted: true,
                adminEmailSent: emailResults.admin.success,
                userEmailSent: emailResults.user.success,
                submittedAt: new Date().toISOString(),
            },
        };

        res.status(200).json(response);
    } catch (error) {
        console.error("❌ Error processing contact form:", error);

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

// Health check for email service
export const checkEmailHealth = async (req, res) => {
    try {
        const { verifyEmailConfig } = await import(
            "../services/email.service.js"
        );
        const isHealthy = await verifyEmailConfig();

        res.status(isHealthy ? 200 : 503).json({
            success: isHealthy,
            service: "Email Service",
            status: isHealthy ? "healthy" : "unhealthy",
            timestamp: new Date().toISOString(),
        });
    } catch (error) {
        res.status(503).json({
            success: false,
            service: "Email Service",
            status: "error",
            error: error.message,
            timestamp: new Date().toISOString(),
        });
    }
};
