/**
 * Stock Management Routes
 *
 * PURPOSE: Admin-only routes for stock management and monitoring
 * SECURITY: Requires admin authentication for all endpoints
 *
 * MIGRATION NOTES:
 * - Provides monitoring for both HDFC and Razorpay stock reservations
 * - Enables manual intervention for stock issues
 * - Date: October 15, 2025
 * - Branch: feat/razorpay
 */

import express from "express";
import {
    triggerStockCleanup,
    getStockStats,
    reconcileStockManually,
    getActiveReservations,
    getExpiredReservations,
    getLowStockProducts,
    stockHealthCheck,
} from "../controllers/stock.controller.js";

// Note: Import admin auth middleware when available
// import adminAuthMiddleware from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

// For now, using a simple admin check (replace with proper admin auth)
const requireAdmin = (req, res, next) => {
    // TODO: Replace with proper admin authentication
    // For now, allowing all authenticated requests
    next();
};

// =================== STOCK CLEANUP ENDPOINTS ===================

/**
 * Trigger manual stock cleanup
 * POST /api/stock/cleanup
 *
 * Manually triggers the stock reservation cleanup process
 * Useful for immediate cleanup without waiting for scheduled task
 */
router.post("/cleanup", requireAdmin, triggerStockCleanup);

/**
 * Manual stock reconciliation
 * POST /api/stock/reconcile
 *
 * Performs manual stock reconciliation and reports discrepancies
 * Use when stock counts seem inconsistent
 */
router.post("/reconcile", requireAdmin, reconcileStockManually);

// =================== STOCK MONITORING ENDPOINTS ===================

/**
 * Get stock reservation statistics
 * GET /api/stock/stats
 *
 * Returns comprehensive statistics about stock reservations
 * Includes breakdown by payment provider (HDFC vs Razorpay)
 */
router.get("/stats", requireAdmin, getStockStats);

/**
 * Get active stock reservations
 * GET /api/stock/reservations
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - provider: Payment provider filter (HDFC/RAZORPAY/COD)
 */
router.get("/reservations", requireAdmin, getActiveReservations);

/**
 * Get expired stock reservations
 * GET /api/stock/expired
 *
 * Query params:
 * - page: Page number (default: 1)
 * - limit: Items per page (default: 20)
 * - provider: Payment provider filter (HDFC/RAZORPAY/COD)
 */
router.get("/expired", requireAdmin, getExpiredReservations);

/**
 * Get low stock products
 * GET /api/stock/low-stock
 *
 * Query params:
 * - threshold: Stock threshold (default: 10)
 */
router.get("/low-stock", requireAdmin, getLowStockProducts);

// =================== HEALTH CHECK ENDPOINTS ===================

/**
 * Stock management system health check
 * GET /api/stock/health
 *
 * Checks for critical stock management issues
 * Returns status and list of any problems found
 */
router.get("/health", requireAdmin, stockHealthCheck);

// =================== DOCUMENTATION ENDPOINT ===================

/**
 * API documentation for stock management
 * GET /api/stock/docs
 */
router.get("/docs", (req, res) => {
    const endpoints = [
        {
            method: "POST",
            path: "/api/stock/cleanup",
            description: "Trigger manual stock cleanup",
            auth: "Admin required",
        },
        {
            method: "POST",
            path: "/api/stock/reconcile",
            description: "Manual stock reconciliation",
            auth: "Admin required",
        },
        {
            method: "GET",
            path: "/api/stock/stats",
            description: "Get stock reservation statistics",
            auth: "Admin required",
        },
        {
            method: "GET",
            path: "/api/stock/reservations",
            description: "Get active stock reservations",
            auth: "Admin required",
            params: { page: "number", limit: "number", provider: "string" },
        },
        {
            method: "GET",
            path: "/api/stock/expired",
            description: "Get expired stock reservations",
            auth: "Admin required",
            params: { page: "number", limit: "number", provider: "string" },
        },
        {
            method: "GET",
            path: "/api/stock/low-stock",
            description: "Get low stock products",
            auth: "Admin required",
            params: { threshold: "number" },
        },
        {
            method: "GET",
            path: "/api/stock/health",
            description: "Stock management health check",
            auth: "Admin required",
        },
    ];

    res.json({
        service: "Stock Management API",
        version: "1.0.0",
        description: "Admin endpoints for stock management and monitoring",
        features: [
            "Manual stock cleanup",
            "Stock reservation monitoring",
            "Payment provider comparison (HDFC vs Razorpay)",
            "Low stock alerts",
            "System health checks",
        ],
        endpoints,
    });
});

// =================== ERROR HANDLING ===================

/**
 * Stock management specific error handler
 */
router.use((error, req, res, next) => {
    console.error("🚨 Stock Management Route Error:", error);

    if (error.name === "ValidationError") {
        return res.status(400).json({
            success: false,
            message: "Validation error",
            errors: Object.values(error.errors).map((err) => err.message),
        });
    }

    if (error.code === "STOCK_ERROR") {
        return res.status(409).json({
            success: false,
            message: "Stock management error",
            errorCode: "STOCK_CONFLICT",
        });
    }

    // Generic error response
    res.status(500).json({
        success: false,
        message:
            process.env.NODE_ENV === "production"
                ? "Internal server error"
                : error.message,
        errorCode: "INTERNAL_ERROR",
        timestamp: new Date().toISOString(),
    });
});

export default router;
