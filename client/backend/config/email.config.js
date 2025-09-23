const getEmailConfig = () => ({
    // Email service provider settings (using custom SMTP for Titan Mail)
    service: process.env.EMAIL_SERVICE || "custom", // Using custom SMTP for Titan Mail

    // SMTP settings for Titan Mail (GoDaddy)
    smtp: {
        host: process.env.EMAIL_HOST || "smtpout.secureserver.net",
        port: process.env.EMAIL_PORT || 587,
        secure: process.env.EMAIL_SECURE === "true", // false for 587, true for 465
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
            address:
                process.env.EMAIL_FROM_ADDRESS || "contact@affordindia.com",
        },
        to: {
            support: process.env.EMAIL_SUPPORT || "contact@affordindia.com",
            admin: process.env.EMAIL_ADMIN || "contact@affordindia.com",
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
