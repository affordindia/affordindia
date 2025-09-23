import express from "express";
import {
    testAuth,
    getAuthStatus,
    clearAuth
} from "../controllers/shiprocketTest.controller.js";
import {
    handleShiprocketWebhook,
    testWebhook
} from "../controllers/webhook.controller.js";
import {
    createShiprocketOrder,
    testCreateOrder,
    cancelShiprocketOrder,
    generateAWB,
    getCouriersList,
    getCourierServiceability,
    testGenerateAWB
} from "../controllers/shiprocketOrder.controller.js";
import {
    trackByAWB,
    trackByShipmentId,
    trackOrderById,
    testTracking,
    getTrackingHistory,
    trackMultipleShipments
} from "../controllers/shiprocketTracking.controller.js";
import {
    simulateOrderStatus,
    simulateTrackingData,
    resetOrderForTesting
} from "../controllers/testSimulation.controller.js";
import {
    debugOrderData,
    addTestShiprocketData,
    createTestOrderWithTracking
} from "../controllers/debugOrder.controller.js";

const router = express.Router();

// Webhook endpoints (no authentication required - Shiprocket will call this)
router.get("/webhook", (req, res) => res.status(200).json({ ok: true }));
router.post("/webhook", handleShiprocketWebhook);
router.post("/webhook/test", testWebhook);

// Order creation endpoints
router.post("/orders/test-create", testCreateOrder);
router.post("/orders/:orderId/create", createShiprocketOrder);
router.delete("/orders/:orderId/cancel", cancelShiprocketOrder);

// AWB generation endpoints
router.post("/orders/:orderId/awb", generateAWB);
router.post("/awb/test", testGenerateAWB);

// Courier management endpoints
router.get("/couriers", getCouriersList);
router.get("/orders/:orderId/serviceability", getCourierServiceability);

// Tracking endpoints
router.get("/track/awb/:awbCode", trackByAWB);
router.get("/track/shipment/:shipmentId", trackByShipmentId);
router.get("/track/order/:orderId", trackOrderById);
router.get("/track/history/:awbCode", getTrackingHistory);
router.post("/track/test", testTracking);
router.post("/track/multiple", trackMultipleShipments);

// Test simulation endpoints for UI testing
router.post("/test/simulate-order-status", simulateOrderStatus);
router.post("/test/simulate-tracking", simulateTrackingData);
router.put("/test/reset-order/:orderId", resetOrderForTesting);

// Debug endpoints
router.get("/debug/orders", debugOrderData);
router.post("/debug/add-shiprocket/:orderId", addTestShiprocketData);
router.post("/debug/create-test-order", createTestOrderWithTracking);

// Authentication test endpoints
router.post("/test-auth", testAuth);

// Get current auth status
router.get("/auth-status", getAuthStatus);

// Clear authentication token
router.post("/clear-auth", clearAuth);

export default router;