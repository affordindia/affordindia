// Predefined coupon templates for easy creation

export const COUPON_TEMPLATES = {
    WELCOME: {
        code: "WELCOME",
        description: "Welcome discount for new customers",
        discountType: "percentage",
        discountValue: 10,
        minOrderAmount: 0,
        isGlobal: true,
        userUsageLimit: 1, // One-time use per user
        validityDays: 30, // Valid for 30 days from creation
        category: "Welcome",
    },

    SAVE20: {
        code: "SAVE20",
        description: "Get ₹20 off on orders above ₹500",
        discountType: "fixed",
        discountValue: 20,
        minOrderAmount: 500,
        isGlobal: true,
        userUsageLimit: 0, // Unlimited uses per user
        validityDays: 90,
        category: "Fixed Discount",
    },

    MEGA50: {
        code: "MEGA50",
        description: "50% off up to ₹200 on all products",
        discountType: "percentage_upto",
        discountValue: 50,
        maxDiscountAmount: 200,
        minOrderAmount: 100,
        isGlobal: true,
        userUsageLimit: 1, // One-time use per user
        validityDays: 7,
        category: "Flash Sale",
    },

    FIRST15: {
        code: "FIRST15",
        description: "15% off on your first order",
        discountType: "percentage",
        discountValue: 15,
        minOrderAmount: 0,
        isGlobal: true,
        userUsageLimit: 1, // One-time use per user
        validityDays: 60,
        category: "First Time",
    },

    WEEKEND25: {
        code: "WEEKEND25",
        description: "₹25 off on weekend orders above ₹300",
        discountType: "fixed",
        discountValue: 25,
        minOrderAmount: 300,
        isGlobal: true,
        userUsageLimit: 2, // Can use twice per user
        validityDays: 14,
        category: "Weekend Special",
    },

    VIP30: {
        code: "VIP30",
        description: "30% off up to ₹500 for VIP customers",
        discountType: "percentage_upto",
        discountValue: 30,
        maxDiscountAmount: 500,
        minOrderAmount: 1000,
        isGlobal: true,
        userUsageLimit: 0, // Unlimited uses per user
        validityDays: 365,
        category: "VIP",
    },
};

// Function to create coupon from template
export const createCouponFromTemplate = (templateKey, customData = {}) => {
    const template = COUPON_TEMPLATES[templateKey];
    if (!template) {
        throw new Error(`Template ${templateKey} not found`);
    }

    const validFrom = new Date();
    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + template.validityDays);

    return {
        ...template,
        ...customData, // Allow overriding template values
        validFrom,
        validUntil,
        isActive: true,
    };
};

// Get all available templates
export const getAvailableTemplates = () => {
    return Object.keys(COUPON_TEMPLATES).map((key) => ({
        key,
        ...COUPON_TEMPLATES[key],
    }));
};
