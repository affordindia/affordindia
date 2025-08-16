import express from "express";
import {
    getAnalyticsOverview,
    getRevenueAnalytics,
    getSalesAnalytics,
    getTopProducts,
    getCustomerAnalytics,
    getOrderAnalytics,
} from "../controllers/analytics.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All analytics routes require authentication
router.use(authMiddleware);

// Analytics routes
router.get("/overview", getAnalyticsOverview);
router.get("/revenue", getRevenueAnalytics);
router.get("/sales", getSalesAnalytics);
router.get("/top-products", getTopProducts);
router.get("/customers", getCustomerAnalytics);
router.get("/orders", getOrderAnalytics);

export default router;
