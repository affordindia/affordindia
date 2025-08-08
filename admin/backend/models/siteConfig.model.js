import mongoose from "mongoose";

const siteConfigSchema = new mongoose.Schema(
    {
        // Shipping Configuration
        shippingConfig: {
            freeShippingThreshold: { type: Number, default: 1000 },
            standardShippingFee: { type: Number, default: 50 },
            expressShippingFee: { type: Number, default: 100 },
            codFee: { type: Number, default: 25 },
            maxCodAmount: { type: Number, default: 10000 },
        },

        // Pagination Configuration  
        paginationConfig: {
            defaultProductsPerPage: { type: Number, default: 12 },
            maxProductsPerPage: { type: Number, default: 48 },
            defaultOrdersPerPage: { type: Number, default: 20 },
            maxOrdersPerPage: { type: Number, default: 100 },
        },

        // Business Configuration
        businessConfig: {
            minOrderAmount: { type: Number, default: 100 },
            maxOrderAmount: { type: Number, default: 50000 },
            lowStockThreshold: { type: Number, default: 10 },
            maxImagesPerProduct: { type: Number, default: 5 },
            maxReviewImagesPerReview: { type: Number, default: 5 },
        },

        // Tax Configuration
        taxConfig: {
            gstRate: { type: Number, default: 18 },
            includeGstInPrice: { type: Boolean, default: true },
        },

        // Return/Refund Policy Configuration
        returnConfig: {
            returnWindowDays: { type: Number, default: 7 },
            refundProcessingDays: { type: Number, default: 5 },
            returnShippingFee: { type: Number, default: 50 },
        },

        // General Settings
        generalConfig: {
            maintenanceMode: { type: Boolean, default: false },
            allowGuestCheckout: { type: Boolean, default: true },
            requirePhoneVerification: { type: Boolean, default: true },
        },

        // Last updated info
        lastUpdated: { type: Date, default: Date.now },
        updatedBy: { type: String, default: "admin" },
    },
    { timestamps: true }
);

const SiteConfig = mongoose.model("SiteConfig", siteConfigSchema);
export default SiteConfig;
