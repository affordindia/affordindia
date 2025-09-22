const getEmailConfig = () => ({
    // Email service provider settings
    service: process.env.EMAIL_SERVICE || "gmail", // gmail, outlook, yahoo, etc.

    // SMTP settings (if not using service)
    smtp: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true", // true for 465, false for other ports
    },

    // Authentication
    auth: {
        user: process.env.EMAIL_USER, // Your email address
        pass: process.env.EMAIL_PASS, // Your email password or app password
    },

    // Default settings
    defaults: {
        from: {
            name: process.env.EMAIL_FROM_NAME || "Afford India",
            address: process.env.EMAIL_FROM_ADDRESS || process.env.EMAIL_USER,
        },
        to: {
            support: process.env.EMAIL_SUPPORT || "support@affordindia.com",
            admin: process.env.EMAIL_ADMIN || "admin@affordindia.com",
        },
    },

    // Email templates settings
    templates: {
        contactForm: {
            subject: "New Contact Form Submission - Afford India",
            adminSubject: "New Contact Form Message",
            userSubject: "Thank you for contacting Afford India",
        },
    },
});

export default getEmailConfig;
