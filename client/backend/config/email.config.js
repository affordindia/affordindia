const getEmailConfig = () => ({
    // MSG91 API Configuration
    authKey: process.env.MSG91_AUTH_KEY,
    baseUrl: process.env.MSG91_BASE_URL || "https://control.msg91.com/api/v5",

    // Email defaults
    from: {
        name: process.env.MSG91_FROM_NAME || "Afford India",
        email: process.env.MSG91_FROM_EMAIL || "contact@affordindia.com",
    },

    domain: process.env.MSG91_DOMAIN || "contact.affordindia.com",

    // Email templates - Template IDs from MSG91 dashboard
    templates: {
        contactAdmin: process.env.MSG91_TEMPLATE_CONTACT_ADMIN,
        contactUser: process.env.MSG91_TEMPLATE_CONTACT_USER,
        orderConfirmation: process.env.MSG91_TEMPLATE_ORDER_CONFIRMATION,
        orderShipped: process.env.MSG91_TEMPLATE_ORDER_SHIPPED,
        orderDelivered: process.env.MSG91_TEMPLATE_ORDER_DELIVERED,
        orderCancelled: process.env.MSG91_TEMPLATE_ORDER_CANCELLED,
        paymentSuccess: process.env.MSG91_TEMPLATE_PAYMENT_SUCCESS,
        paymentFailed: process.env.MSG91_TEMPLATE_PAYMENT_FAILED,
    },
});

export default getEmailConfig;
