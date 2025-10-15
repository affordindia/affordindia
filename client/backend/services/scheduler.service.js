/**
 * Background Job Scheduler
 *
 * PURPOSE: Runs periodic maintenance tasks for the application
 * FEATURES: Stock cleanup, order status sync, payment reconciliation
 *
 * MIGRATION NOTES:
 * - Handles both HDFC and Razorpay payment provider maintenance
 * - Ensures system health across payment gateway migration
 * - Date: October 15, 2025
 * - Branch: feat/razorpay
 */

import { runStockCleanup } from "./stockCleanup.js";

/**
 * Stock cleanup job configuration
 */
const STOCK_CLEANUP_INTERVAL = 5 * 60 * 1000; // 5 minutes
const PAYMENT_RECONCILIATION_INTERVAL = 15 * 60 * 1000; // 15 minutes
const HEALTH_CHECK_INTERVAL = 30 * 60 * 1000; // 30 minutes

/**
 * Background job scheduler class
 */
class BackgroundScheduler {
    constructor() {
        this.jobs = new Map();
        this.isRunning = false;
    }

    /**
     * Start all background jobs
     */
    start() {
        if (this.isRunning) {
            console.log("📅 Background scheduler is already running");
            return;
        }

        console.log("🚀 Starting background job scheduler...");
        this.isRunning = true;

        // Schedule stock cleanup job
        this.scheduleJob(
            "stockCleanup",
            this.stockCleanupJob,
            STOCK_CLEANUP_INTERVAL
        );

        // Schedule payment reconciliation job
        this.scheduleJob(
            "paymentReconciliation",
            this.paymentReconciliationJob,
            PAYMENT_RECONCILIATION_INTERVAL
        );

        // Schedule health check job
        this.scheduleJob(
            "healthCheck",
            this.healthCheckJob,
            HEALTH_CHECK_INTERVAL
        );

        console.log("✅ Background scheduler started successfully");
        console.log(`📊 Running ${this.jobs.size} background jobs`);
    }

    /**
     * Stop all background jobs
     */
    stop() {
        if (!this.isRunning) {
            console.log("📅 Background scheduler is not running");
            return;
        }

        console.log("🛑 Stopping background job scheduler...");

        // Clear all intervals
        for (const [jobName, intervalId] of this.jobs) {
            clearInterval(intervalId);
            console.log(`🛑 Stopped job: ${jobName}`);
        }

        this.jobs.clear();
        this.isRunning = false;

        console.log("✅ Background scheduler stopped");
    }

    /**
     * Schedule a recurring job
     */
    scheduleJob(name, jobFunction, intervalMs) {
        // Run job immediately
        setTimeout(jobFunction, 5000); // Wait 5 seconds after startup

        // Schedule recurring execution
        const intervalId = setInterval(async () => {
            try {
                await jobFunction();
            } catch (error) {
                console.error(`❌ Background job '${name}' failed:`, error);
            }
        }, intervalMs);

        this.jobs.set(name, intervalId);
        console.log(
            `📅 Scheduled job '${name}' to run every ${intervalMs / 1000}s`
        );
    }

    /**
     * Stock cleanup background job
     */
    async stockCleanupJob() {
        try {
            console.log("🧹 Running scheduled stock cleanup...");
            const result = await runStockCleanup();

            if (result.success) {
                console.log(
                    `✅ Stock cleanup completed: ${result.cleanedReservations} reservations cleaned`
                );
            } else {
                console.error(
                    "❌ Scheduled stock cleanup failed:",
                    result.error
                );
            }
        } catch (error) {
            console.error("❌ Stock cleanup job error:", error);
        }
    }

    /**
     * Payment reconciliation background job
     */
    async paymentReconciliationJob() {
        try {
            console.log("💳 Running payment reconciliation...");

            // Import Order model dynamically
            const { default: Order } = await import("../models/order.model.js");

            // Find orders with pending payments older than 30 minutes
            const thirtyMinutesAgo = new Date(Date.now() - 30 * 60 * 1000);

            const stalePendingOrders = await Order.find({
                paymentStatus: "pending",
                paymentMethod: "ONLINE",
                createdAt: { $lt: thirtyMinutesAgo },
                status: "pending",
            });

            console.log(
                `📊 Found ${stalePendingOrders.length} stale pending orders`
            );

            // For each stale order, we could:
            // 1. Check payment status with Razorpay/HDFC
            // 2. Update order status accordingly
            // 3. Handle failed payments

            // For now, just log for monitoring
            if (stalePendingOrders.length > 0) {
                console.log("⚠️  Stale pending orders require attention");
            }
        } catch (error) {
            console.error("❌ Payment reconciliation job error:", error);
        }
    }

    /**
     * System health check background job
     */
    async healthCheckJob() {
        try {
            console.log("🏥 Running system health check...");

            // Import models dynamically
            const { default: Order } = await import("../models/order.model.js");
            const { default: Product } = await import(
                "../models/product.model.js"
            );

            // Check for critical issues
            const issues = [];

            // Check for orders stuck in pending state
            const oneDayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);
            const stuckOrders = await Order.countDocuments({
                status: "pending",
                createdAt: { $lt: oneDayAgo },
            });

            if (stuckOrders > 0) {
                issues.push(
                    `${stuckOrders} orders stuck in pending state for >24h`
                );
            }

            // Check for products with negative stock
            const negativeStock = await Product.countDocuments({
                stock: { $lt: 0 },
            });

            if (negativeStock > 0) {
                issues.push(`${negativeStock} products with negative stock`);
            }

            // Check for very old stock reservations
            const oldReservations = await Order.countDocuments({
                stockReserved: true,
                stockReservationExpiry: {
                    $lt: new Date(Date.now() - 6 * 60 * 60 * 1000),
                }, // 6 hours
            });

            if (oldReservations > 0) {
                issues.push(`${oldReservations} very old stock reservations`);
            }

            if (issues.length > 0) {
                console.log("⚠️  System health issues detected:");
                issues.forEach((issue) => console.log(`   - ${issue}`));
            } else {
                console.log("✅ System health check passed");
            }
        } catch (error) {
            console.error("❌ Health check job error:", error);
        }
    }

    /**
     * Get job status
     */
    getStatus() {
        return {
            isRunning: this.isRunning,
            jobCount: this.jobs.size,
            jobs: Array.from(this.jobs.keys()),
        };
    }
}

// Create global scheduler instance
const scheduler = new BackgroundScheduler();

/**
 * Initialize scheduler (call this from server.js)
 */
export const initializeScheduler = () => {
    scheduler.start();

    // Graceful shutdown handling
    process.on("SIGTERM", () => {
        console.log("📅 Received SIGTERM, stopping scheduler...");
        scheduler.stop();
    });

    process.on("SIGINT", () => {
        console.log("📅 Received SIGINT, stopping scheduler...");
        scheduler.stop();
    });
};

/**
 * Stop scheduler
 */
export const stopScheduler = () => {
    scheduler.stop();
};

/**
 * Get scheduler status
 */
export const getSchedulerStatus = () => {
    return scheduler.getStatus();
};

export { scheduler };
export default scheduler;
