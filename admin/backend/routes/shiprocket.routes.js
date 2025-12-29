import express from 'express';
import { handleShiprocketWebhook, syncOrderStatus, createShiprocketOrderHandler } from '../controllers/shiprocket.webhook.controller.js';
import { verifyAdminAuth } from '../middlewares/adminAuth.middleware.js';

const router = express.Router();

// GET handler for webhook verification (Shiprocket might test with GET)
router.get('/webhook', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Shiprocket webhook endpoint is active',
        timestamp: new Date().toISOString()
    });
});

// Public webhook endpoint - called by Shiprocket (no authentication required)
router.post('/webhook', handleShiprocketWebhook);

// API endpoint for client backend to create Shiprocket orders (public, can be called from client backend)
router.post('/orders/create', createShiprocketOrderHandler);

// Admin endpoint to manually sync order status from Shiprocket
router.post('/orders/:orderId/sync', verifyAdminAuth, syncOrderStatus);

export default router;
