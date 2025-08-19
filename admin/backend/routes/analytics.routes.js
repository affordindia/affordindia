import express from "express";
import {
    getAnalyticsOverview,
    getRevenueAnalytics,
    getSalesAnalytics,
    getTopProducts,
    getCustomerAnalytics,
    getOrderAnalytics,
} from "../controllers/analytics.controller.js";
import {
    verifyAdminAuth,
    requireAccessLevel,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(verifyAdminAuth);

// Analytics routes with access level requirements
router.get("/overview", requireAccessLevel(1), getAnalyticsOverview);
router.get("/revenue", requireAccessLevel(1), getRevenueAnalytics);
router.get("/sales", requireAccessLevel(1), getSalesAnalytics);
router.get("/top-products", requireAccessLevel(1), getTopProducts);
router.get("/customers", requireAccessLevel(1), getCustomerAnalytics);
router.get("/orders", requireAccessLevel(1), getOrderAnalytics);

export default router;
