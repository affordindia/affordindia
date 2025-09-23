import {
    getAnalyticsOverviewService,
    getRevenueAnalyticsService,
    getSalesAnalyticsService,
    getTopProductsService,
    getCustomerAnalyticsService,
    getOrderAnalyticsService,
} from "../services/analytics.service.js";

// Get comprehensive analytics overview
export const getAnalyticsOverview = async (req, res) => {
    try {
        const { timeframe = "month" } = req.query;

        const data = await getAnalyticsOverviewService(timeframe);

        res.status(200).json({
            success: true,
            message: "Analytics overview retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Analytics overview error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve analytics overview",
            error: error.message,
        });
    }
};

// Get revenue analytics with detailed breakdown
export const getRevenueAnalytics = async (req, res) => {
    try {
        const { timeframe = "month" } = req.query;

        const data = await getRevenueAnalyticsService(timeframe);

        res.status(200).json({
            success: true,
            message: "Revenue analytics retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Revenue analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve revenue analytics",
            error: error.message,
        });
    }
};

// Get sales breakdown analytics
export const getSalesAnalytics = async (req, res) => {
    try {
        const { timeframe = "month" } = req.query;

        const data = await getSalesAnalyticsService(timeframe);

        res.status(200).json({
            success: true,
            message: "Sales analytics retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Sales analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve sales analytics",
            error: error.message,
        });
    }
};

// Get top performing products
export const getTopProducts = async (req, res) => {
    try {
        const { limit = 10, timeframe = "month" } = req.query;

        const data = await getTopProductsService(limit, timeframe);

        res.status(200).json({
            success: true,
            message: "Top products retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Top products error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve top products",
            error: error.message,
        });
    }
};

// Get customer analytics
export const getCustomerAnalytics = async (req, res) => {
    try {
        const { timeframe = "month" } = req.query;

        const data = await getCustomerAnalyticsService(timeframe);

        res.status(200).json({
            success: true,
            message: "Customer analytics retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Customer analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve customer analytics",
            error: error.message,
        });
    }
};

// Get order analytics
export const getOrderAnalytics = async (req, res) => {
    try {
        const { timeframe = "month" } = req.query;

        const data = await getOrderAnalyticsService(timeframe);

        res.status(200).json({
            success: true,
            message: "Order analytics retrieved successfully",
            data,
        });
    } catch (error) {
        console.error("Order analytics error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve order analytics",
            error: error.message,
        });
    }
};
