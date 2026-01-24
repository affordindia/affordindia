import express from 'express';
import { sendOrderStatusUpdate } from '../services/whatsapp.service.js';

const router = express.Router();

/**
 * POST /api/whatsapp/order-status
 * Send order status update via WhatsApp
 */
router.post('/order-status', async (req, res) => {
    try {
        const { mobile, customerName, orderId, status, trackingInfo } = req.body;

        if (!mobile || !orderId || !status) {
            return res.status(400).json({
                success: false,
                error: 'Missing required fields: mobile, orderId, status'
            });
        }

        const result = await sendOrderStatusUpdate(
            mobile,
            customerName,
            orderId,
            status,
            trackingInfo
        );

        res.json(result);
    } catch (error) {
        console.error('❌ WhatsApp order status error:', error);
        res.status(500).json({
            success: false,
            error: error.message
        });
    }
});

export default router;
