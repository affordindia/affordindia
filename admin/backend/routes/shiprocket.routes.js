import express from 'express';
import { handleShiprocketWebhook, syncOrderStatus } from '../controllers/shiprocket.webhook.controller.js';
import { verifyAdminAuth } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

// Public webhook endpoint - called by Shiprocket (no authentication required)
router.post('/webhook', handleShiprocketWebhook);

// Admin endpoint to manually sync order status from Shiprocket
router.post('/orders/:orderId/sync', verifyAdminAuth, syncOrderStatus);

export default router;
