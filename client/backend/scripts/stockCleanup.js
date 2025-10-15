/**
 * Stock Reservation Cleanup Script
 *
 * PURPOSE: Automatically release expired stock reservations and restock items
 * SCHEDULE: Should be run every 5-10 minutes via cron job or background task
 *
 * MIGRATION NOTES:
 * - Handles both HDFC and Razorpay payment provider stock reservations
 * - Ensures stock consistency across payment gateway migration
 * - Date: October 15, 2025
 * - Branch: feat/razorpay
 */

import { cleanupExpiredReservations } from "../services/order.service.js";
import Order from "../models/order.model.js";

/**
 * Main cleanup function
 */
export const runStockCleanup = async () => {
    try {
        console.log("🧹 Starting stock reservation cleanup...");

        const startTime = new Date();

        // Clean up expired reservations using order service
        const cleanedCount = await cleanupExpiredReservations();

        // Additional cleanup for orphaned reservations (safety net)
        const orphanedCleanup = await cleanupOrphanedReservations();

        const endTime = new Date();
        const duration = endTime - startTime;

        console.log(`✅ Stock cleanup completed in ${duration}ms`);
        console.log(`📊 Cleaned up ${cleanedCount} expired reservations`);
        console.log(`📊 Cleaned up ${orphanedCleanup} orphaned reservations`);

        return {
            success: true,
            cleanedReservations: cleanedCount,
            orphanedCleanup,
            duration,
        };
    } catch (error) {
        console.error("❌ Stock cleanup failed:", error);
        return {
            success: false,
            error: error.message,
        };
    }
};

/**
 * Clean up orphaned stock reservations (additional safety measure)
 * These are reservations that might have been missed by the main cleanup
 */
export const cleanupOrphanedReservations = async () => {
    try {
        // Find orders with stock reserved but very old timestamps (over 1 hour)
        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

        const orphanedOrders = await Order.find({
            stockReserved: true,
            stockReservedAt: { $lt: oneHourAgo },
            paymentStatus: { $ne: "paid" },
            status: { $ne: "processing" },
        });

        let cleanedCount = 0;

        for (const order of orphanedOrders) {
            console.log(
                `🧹 Cleaning orphaned reservation for order: ${order._id}`
            );

            // Import restock function dynamically to avoid circular dependency
            const { restockOrderItems } = await import(
                "../services/order.service.js"
            );

            // Release reservation and restock
            order.releaseStock();
            await restockOrderItems(order);

            // Mark order as cancelled if not already
            if (order.status === "pending") {
                order.status = "cancelled";
                order.cancelledAt = new Date();
                order.paymentFailureReason =
                    "Stock reservation cleanup - payment timeout";
            }

            await order.save();
            cleanedCount++;
        }

        return cleanedCount;
    } catch (error) {
        console.error("❌ Orphaned reservation cleanup failed:", error);
        throw error;
    }
};

/**
 * Get stock reservation statistics
 */
export const getReservationStats = async () => {
    try {
        const stats = await Order.aggregate([
            {
                $match: {
                    stockReserved: true,
                },
            },
            {
                $group: {
                    _id: "$paymentProvider",
                    totalReservations: { $sum: 1 },
                    activeReservations: {
                        $sum: {
                            $cond: [
                                {
                                    $gt: [
                                        "$stockReservationExpiry",
                                        new Date(),
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                    expiredReservations: {
                        $sum: {
                            $cond: [
                                {
                                    $lte: [
                                        "$stockReservationExpiry",
                                        new Date(),
                                    ],
                                },
                                1,
                                0,
                            ],
                        },
                    },
                },
            },
        ]);

        // Get total stock across all products for context
        const { default: Product } = await import("../models/product.model.js");
        const totalStock = await Product.aggregate([
            {
                $group: {
                    _id: null,
                    totalStock: { $sum: "$stock" },
                    totalProducts: { $sum: 1 },
                },
            },
        ]);

        return {
            reservationsByProvider: stats,
            totalStock: totalStock[0] || { totalStock: 0, totalProducts: 0 },
            timestamp: new Date(),
        };
    } catch (error) {
        console.error("❌ Failed to get reservation stats:", error);
        throw error;
    }
};

/**
 * Manual stock reconciliation
 * Use this function to manually fix stock discrepancies
 */
export const reconcileStock = async () => {
    try {
        console.log("🔄 Starting manual stock reconciliation...");

        // Get all active reservations
        const activeReservations = await Order.find({
            stockReserved: true,
            stockReservationExpiry: { $gt: new Date() },
            paymentStatus: { $ne: "paid" },
        }).populate("items.product");

        console.log(
            `📊 Found ${activeReservations.length} active reservations`
        );

        // Calculate reserved stock per product
        const reservedStock = {};

        for (const order of activeReservations) {
            for (const item of order.items) {
                const productId = item.product._id.toString();
                if (!reservedStock[productId]) {
                    reservedStock[productId] = {
                        productName: item.product.name,
                        currentStock: item.product.stock,
                        reservedQuantity: 0,
                        reservingOrders: [],
                    };
                }
                reservedStock[productId].reservedQuantity += item.quantity;
                reservedStock[productId].reservingOrders.push({
                    orderId: order._id,
                    quantity: item.quantity,
                    expiry: order.stockReservationExpiry,
                });
            }
        }

        console.log("📊 Stock reconciliation summary:");
        Object.entries(reservedStock).forEach(([productId, data]) => {
            console.log(`  Product: ${data.productName}`);
            console.log(`    Current Stock: ${data.currentStock}`);
            console.log(`    Reserved: ${data.reservedQuantity}`);
            console.log(`    Reserving Orders: ${data.reservingOrders.length}`);
        });

        return {
            success: true,
            reservedStock,
            activeReservations: activeReservations.length,
        };
    } catch (error) {
        console.error("❌ Stock reconciliation failed:", error);
        throw error;
    }
};

// If running directly as a script
if (import.meta.url === `file://${process.argv[1]}`) {
    runStockCleanup()
        .then((result) => {
            console.log("📋 Cleanup result:", result);
            process.exit(result.success ? 0 : 1);
        })
        .catch((error) => {
            console.error("💥 Script failed:", error);
            process.exit(1);
        });
}

export default {
    runStockCleanup,
    cleanupOrphanedReservations,
    getReservationStats,
    reconcileStock,
};
