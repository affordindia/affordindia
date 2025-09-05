import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    handleHdfcWebhook,
    checkPaymentStatus,
    verifyPayment,
    handleHdfcReturn,
} from "../controllers/payment.controller.js";

const router = express.Router();

// Webhook endpoint for HDFC SmartGateway (no auth required)
router.post("/webhook", handleHdfcWebhook);

// Return URL endpoint for HDFC SmartGateway (no auth required)
// Support both GET and POST methods for return URL
router.get("/return", handleHdfcReturn);
router.post(
    "/return",
    express.urlencoded({ extended: true }), // parses application/x-www-form-urlencoded
    handleHdfcReturn
);

// Manual payment status check (no auth required for flexibility)
// Note: This endpoint is kept for legacy support but not actively used
router.get("/status/:sessionId", checkPaymentStatus);

// User-specific payment verification (requires auth) - PRIMARY ENDPOINT
router.get("/verify/:orderId", authMiddleware, verifyPayment);

export default router;
