import nodemailer from "nodemailer";
import getEmailConfig from "../config/email.config.js";

// Create email transporter
const createTransporter = () => {
    const emailConfig = getEmailConfig(); // Get config dynamically
    const config = {
        auth: emailConfig.auth,
    };

    // Use custom SMTP settings for Titan Mail or other providers
    if (
        emailConfig.service === "custom" ||
        !emailConfig.service ||
        emailConfig.service === "smtp"
    ) {
        config.host = emailConfig.smtp.host;
        config.port = emailConfig.smtp.port;
        config.secure = emailConfig.smtp.secure;
    } else {
        // Use service provider (gmail, outlook, etc.)
        config.service = emailConfig.service;
    }

    return nodemailer.createTransport(config);
};

// Verify transporter configuration
export const verifyEmailConfig = async () => {
    try {
        const emailConfig = getEmailConfig();

        // Check if required environment variables are set
        if (!emailConfig.auth.user || !emailConfig.auth.pass) {
            console.error(
                "❌ Email credentials missing. Please set EMAIL_USER and EMAIL_PASS in your .env file"
            );
            return false;
        }

        const transporter = createTransporter();
        await transporter.verify();
        console.log("✅ Email configuration is valid");
        return true;
    } catch (error) {
        console.error("❌ Email configuration error:", error.message);
        return false;
    }
};

// Send contact form email to admin
export const sendContactFormToAdmin = async (contactData) => {
    try {
        const emailConfig = getEmailConfig(); // Get config dynamically
        const transporter = createTransporter();

        const { name, email, message } = contactData;

        const mailOptions = {
            from: {
                name: emailConfig.defaults.from.name,
                address: emailConfig.defaults.from.address,
            },
            to: emailConfig.defaults.to.support,
            subject: emailConfig.templates.contactForm.adminSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #B76E79; color: white; padding: 20px; border-radius: 8px 8px 0 0;">
                        <h2 style="margin: 0;">New Contact Form Submission</h2>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 20px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                        <h3 style="color: #333; margin-top: 0;">Contact Details:</h3>
                        
                        <table style="width: 100%; border-collapse: collapse;">
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555; width: 100px;">Name:</td>
                                <td style="padding: 8px 0; color: #333;">${name}</td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555;">Email:</td>
                                <td style="padding: 8px 0; color: #333;">
                                    <a href="mailto:${email}" style="color: #B76E79; text-decoration: none;">${email}</a>
                                </td>
                            </tr>
                            <tr>
                                <td style="padding: 8px 0; font-weight: bold; color: #555; vertical-align: top;">Message:</td>
                                <td style="padding: 8px 0; color: #333; line-height: 1.6;">
                                    ${message.replace(/\\n/g, "<br>")}
                                </td>
                            </tr>
                        </table>
                        
                        <div style="margin-top: 20px; padding: 15px; background-color: #e8f4f8; border-left: 4px solid #B76E79; border-radius: 4px;">
                            <p style="margin: 0; color: #555; font-size: 14px;">
                                <strong>Submitted on:</strong> ${new Date().toLocaleString(
                                    "en-IN",
                                    {
                                        timeZone: "Asia/Kolkata",
                                        year: "numeric",
                                        month: "long",
                                        day: "numeric",
                                        hour: "2-digit",
                                        minute: "2-digit",
                                    }
                                )}
                            </p>
                        </div>
                        
                        <div style="margin-top: 20px; text-align: center;">
                            <a href="mailto:${email}" 
                               style="background-color: #B76E79; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                                Reply to Customer
                            </a>
                        </div>
                    </div>
                </div>
            `,
            replyTo: email, // Allow direct reply to customer
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("❌ Error sending admin notification email:", error);
        throw error;
    }
};

// Send auto-reply email to user
export const sendContactFormAutoReply = async (contactData) => {
    try {
        const emailConfig = getEmailConfig(); // Get config dynamically
        const transporter = createTransporter();

        const { name, email } = contactData;
        const mailOptions = {
            from: {
                name: emailConfig.defaults.from.name,
                address: emailConfig.defaults.from.address,
            },
            to: email,
            subject: emailConfig.templates.contactForm.userSubject,
            html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
                    <div style="background-color: #B76E79; color: white; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
                        <h2 style="margin: 0;">Thank You for Contacting Us!</h2>
                    </div>
                    
                    <div style="background-color: #f9f9f9; padding: 30px; border: 1px solid #ddd; border-radius: 0 0 8px 8px;">
                        <p style="color: #333; font-size: 16px; line-height: 1.6; margin-top: 0;">
                            Dear <strong>${name}</strong>,
                        </p>
                        
                        <p style="color: #555; line-height: 1.6;">
                            Thank you for reaching out to <strong>Afford India</strong>! We have received your message and our team will get back to you within <strong>24-48 hours</strong>.
                        </p>
                        
                        <div style="background-color: #fff; padding: 20px; border-left: 4px solid #B76E79; margin: 20px 0; border-radius: 4px;">
                            <p style="margin: 0; color: #555; font-size: 14px;">
                                <strong>What happens next?</strong><br>
                                • Our support team will review your message<br>
                                • You'll receive a personalized response via email<br>
                                • For urgent matters, call us at <strong>+91 9211501006</strong>
                            </p>
                        </div>
                        
                        <p style="color: #555; line-height: 1.6;">
                            In the meantime, feel free to explore our latest collections and offers on our website.
                        </p>
                        
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${
                                process.env.FRONTEND_URL ||
                                "https://affordindia.com"
                            }" 
                               style="background-color: #B76E79; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; display: inline-block;">
                                Visit Our Store
                            </a>
                        </div>
                        
                        <hr style="border: none; border-top: 1px solid #ddd; margin: 30px 0;">
                        
                        <div style="text-align: center; color: #777; font-size: 14px;">
                            <p style="margin: 5px 0;">
                                <strong>Afford India</strong><br>
                                Where Arts Come Alive
                            </p>
                            <p style="margin: 5px 0;">
                                📧 contact@affordindia.com <br> 
                                📞 +91 9211501006 <br>
                                🕐 Mon-Sat: 10:00 AM - 05:00 PM
                            </p>
                        </div>
                    </div>
                </div>
            `,
        };

        const result = await transporter.sendMail(mailOptions);
        return { success: true, messageId: result.messageId };
    } catch (error) {
        console.error("❌ Error sending auto-reply email:", error);
        throw error;
    }
};

// Send both emails for contact form
export const sendContactFormEmails = async (contactData) => {
    try {
        const results = await Promise.allSettled([
            sendContactFormToAdmin(contactData),
            sendContactFormAutoReply(contactData),
        ]);

        const adminResult = results[0];
        const userResult = results[1];

        return {
            success: true,
            admin:
                adminResult.status === "fulfilled"
                    ? adminResult.value
                    : { success: false, error: adminResult.reason },
            user:
                userResult.status === "fulfilled"
                    ? userResult.value
                    : { success: false, error: userResult.reason },
        };
    } catch (error) {
        console.error("❌ Error sending contact form emails:", error);
        throw error;
    }
};
