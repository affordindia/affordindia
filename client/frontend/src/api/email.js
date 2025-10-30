/**
 * Email API Client
 * Simple template-based email operations using MSG91
 */

import api from "./axios";

/**
 * Submit contact form (sends admin notification + user auto-reply)
 * @param {Object} contactData - Contact form data
 * @param {string} contactData.name - Customer name
 * @param {string} contactData.email - Customer email
 * @param {string} contactData.message - Customer message
 * @returns {Promise<Object>} API response
 */
export const submitContactForm = async (contactData) => {
    console.log("API CALL: submitContactForm", {
        name: contactData.name,
        email: contactData.email,
        messageLength: contactData.message?.length,
    });

    const res = await api.post("/email/contact", contactData);
    return res.data;
};

/**
 * Send order confirmation email
 * @param {Object} orderData - Order details
 * @param {string} customerEmail - Customer email
 * @returns {Promise<Object>} API response
 */
export const sendOrderConfirmationEmail = async (orderData, customerEmail) => {
    console.log("API CALL: sendOrderConfirmationEmail", {
        orderId: orderData.orderId,
        customerEmail,
    });

    const res = await api.post("/email/order-confirmation", {
        customerEmail,
        orderData,
    });
    return res.data;
};

/**
 * Send order shipped email
 * @param {Object} orderData - Order details
 * @param {string} customerEmail - Customer email
 * @returns {Promise<Object>} API response
 */
export const sendOrderShippedEmail = async (orderData, customerEmail) => {
    console.log("API CALL: sendOrderShippedEmail", {
        orderId: orderData.orderId,
        customerEmail,
    });

    const res = await api.post("/email/order-shipped", {
        customerEmail,
        orderData,
    });
    return res.data;
};

/**
 * Check email service health
 * @returns {Promise<Object>} Health status
 */
export const checkEmailHealth = async () => {
    console.log("API CALL: checkEmailHealth");

    const res = await api.get("/email/health");
    return res.data;
};
