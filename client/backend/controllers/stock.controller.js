/**
 * Stock Management Controller
 *
 * PURPOSE: Provides admin endpoints for stock management and monitoring
 * FEATURES: Manual cleanup, reservation stats, stock reconciliation
 *
 * MIGRATION NOTES:
 * - Supports both HDFC and Razorpay payment provider monitoring
 * - Provides insights into stock reservation effectiveness
 * - Date: October 15, 2025
 * - Branch: feat/razorpay
 */

import {
    runStockCleanup,
    getReservationStats,
    reconcileStock,
} from "../scripts/stockCleanup.js";
import Order from "../models/order.model.js";
import Product from "../models/product.model.js";

/**
 * Manual stock cleanup trigger
 * POST /api/stock/cleanup
 */
export const triggerStockCleanup = async (req, res) => {
    try {
        console.log("🧹 Manual stock cleanup triggered by admin");

        const result = await runStockCleanup();

        if (result.success) {
            res.json({
                success: true,
                message: "Stock cleanup completed successfully",
                data: result,
            });
        } else {
            res.status(500).json({
                success: false,
                message: "Stock cleanup failed",
                error: result.error,
            });
        }
    } catch (error) {
        console.error("❌ Stock cleanup API error:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Get stock reservation statistics
 * GET /api/stock/stats
 */
export const getStockStats = async (req, res) => {
    try {
        const stats = await getReservationStats();

        res.json({
            success: true,
            message: "Stock statistics retrieved successfully",
            data: stats,
        });
    } catch (error) {
        console.error("❌ Stock stats API error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve stock statistics",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Manual stock reconciliation
 * POST /api/stock/reconcile
 */
export const reconcileStockManually = async (req, res) => {
    try {
        console.log("🔄 Manual stock reconciliation triggered by admin");

        const result = await reconcileStock();

        res.json({
            success: true,
            message: "Stock reconciliation completed successfully",
            data: result,
        });
    } catch (error) {
        console.error("❌ Stock reconciliation API error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reconcile stock",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Get orders with active stock reservations
 * GET /api/stock/reservations
 */
export const getActiveReservations = async (req, res) => {
    try {
        const { page = 1, limit = 20, provider } = req.query;

        const filter = {
            stockReserved: true,
            stockReservationExpiry: { $gt: new Date() },
        };

        if (provider) {
            filter.paymentProvider = provider;
        }

        const reservations = await Order.find(filter)
            .populate("user", "name email phone")
            .populate("items.product", "name price stock")
            .sort("-stockReservedAt")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            message: "Active reservations retrieved successfully",
            data: {
                reservations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("❌ Active reservations API error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve active reservations",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Get expired stock reservations
 * GET /api/stock/expired
 */
export const getExpiredReservations = async (req, res) => {
    try {
        const { page = 1, limit = 20, provider } = req.query;

        const filter = {
            stockReserved: true,
            stockReservationExpiry: { $lte: new Date() },
            paymentStatus: { $ne: "paid" },
        };

        if (provider) {
            filter.paymentProvider = provider;
        }

        const expiredReservations = await Order.find(filter)
            .populate("user", "name email phone")
            .populate("items.product", "name price stock")
            .sort("-stockReservationExpiry")
            .limit(limit * 1)
            .skip((page - 1) * limit)
            .lean();

        const total = await Order.countDocuments(filter);

        res.json({
            success: true,
            message: "Expired reservations retrieved successfully",
            data: {
                expiredReservations,
                pagination: {
                    page: parseInt(page),
                    limit: parseInt(limit),
                    total,
                    pages: Math.ceil(total / limit),
                },
            },
        });
    } catch (error) {
        console.error("❌ Expired reservations API error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve expired reservations",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Get low stock products
 * GET /api/stock/low-stock
 */
export const getLowStockProducts = async (req, res) => {
    try {
        const { threshold = 10 } = req.query;

        const lowStockProducts = await Product.find({
            stock: { $lte: parseInt(threshold) },
            stock: { $gte: 0 },
        })
            .select("name price stock category images")
            .sort("stock")
            .lean();

        res.json({
            success: true,
            message: "Low stock products retrieved successfully",
            data: {
                products: lowStockProducts,
                threshold: parseInt(threshold),
                count: lowStockProducts.length,
            },
        });
    } catch (error) {
        console.error("❌ Low stock products API error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to retrieve low stock products",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

/**
 * Health check for stock management system
 * GET /api/stock/health
 */
export const stockHealthCheck = async (req, res) => {
    try {
        // Check for critical issues
        const issues = [];

        // Check for very old expired reservations (over 24 hours)
        const veryOldReservations = await Order.countDocuments({
            stockReserved: true,
            stockReservationExpiry: {
                $lt: new Date(Date.now() - 24 * 60 * 60 * 1000),
            },
            paymentStatus: { $ne: "paid" },
        });

        if (veryOldReservations > 0) {
            issues.push(
                `${veryOldReservations} very old expired reservations found`
            );
        }

        // Check for products with negative stock
        const negativeStockProducts = await Product.countDocuments({
            stock: { $lt: 0 },
        });

        if (negativeStockProducts > 0) {
            issues.push(
                `${negativeStockProducts} products with negative stock`
            );
        }

        // Check for orders with inconsistent stock reservation state
        const inconsistentOrders = await Order.countDocuments({
            stockReserved: true,
            stockReservationExpiry: { $exists: false },
        });

        if (inconsistentOrders > 0) {
            issues.push(
                `${inconsistentOrders} orders with inconsistent reservation state`
            );
        }

        const isHealthy = issues.length === 0;

        res.json({
            success: true,
            message: "Stock management health check completed",
            data: {
                status: isHealthy ? "healthy" : "issues_found",
                issues,
                timestamp: new Date(),
                metrics: {
                    veryOldReservations,
                    negativeStockProducts,
                    inconsistentOrders,
                },
            },
        });
    } catch (error) {
        console.error("❌ Stock health check API error:", error);
        res.status(500).json({
            success: false,
            message: "Stock health check failed",
            error:
                process.env.NODE_ENV === "development"
                    ? error.message
                    : undefined,
        });
    }
};

export default {
    triggerStockCleanup,
    getStockStats,
    reconcileStockManually,
    getActiveReservations,
    getExpiredReservations,
    getLowStockProducts,
    stockHealthCheck,
};
