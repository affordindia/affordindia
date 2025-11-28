/**
 * Email Routes
 * Simple template-based email operations using MSG91
 */

import express from "express";
import {
    submitContactForm,
    submitReturnCancelRequest,
    sendOrderConfirmation,
    sendOrderShipped,
    getEmailHealth,
} from "../controllers/email.controller.js";

const router = express.Router();

/**
 * @route   POST /api/email/contact
 * @desc    Submit contact form (sends admin notification + user auto-reply)
 * @access  Public
 * @body    { name, email, message }
 */
router.post("/contact", submitContactForm);

/**
 * @route   POST /api/email/return-cancel
 * @desc    Submit return/cancel request (sends admin notification + user acknowledgment)
 * @access  Public
 * @body    { name, email, orderId, reason, type }
 */
router.post("/return-cancel", submitReturnCancelRequest);

/**
 * @route   POST /api/email/order-confirmation
 * @desc    Send order confirmation email
 * @access  Private (should be protected with auth middleware)
 * @body    { customerEmail, orderData }
 */
router.post("/order-confirmation", sendOrderConfirmation);

/**
 * @route   POST /api/email/order-shipped
 * @desc    Send order shipped email
 * @access  Private (should be protected with auth middleware)
 * @body    { customerEmail, orderData }
 */
router.post("/order-shipped", sendOrderShipped);

/**
 * @route   GET /api/email/health
 * @desc    Check email service health
 * @access  Public (useful for monitoring)
 */
router.get("/health", getEmailHealth);

export default router;
