import express from "express";
import {
    checkInvoiceExistsController,
    downloadInvoiceController,
    validateOrderId,
} from "../controllers/invoice.controller.js";
import { validationResult } from "express-validator";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Validation middleware to handle validation errors
const handleValidationErrors = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({
            success: false,
            message: "Validation failed",
            errors: errors.array(),
        });
    }
    next();
};

// Apply user authentication to all routes
router.use(authMiddleware);

// Check if invoice exists
router.get(
    "/check/:orderId",
    validateOrderId,
    handleValidationErrors,
    checkInvoiceExistsController
);

// Download invoice PDF
router.get(
    "/download/:orderId",
    validateOrderId,
    handleValidationErrors,
    downloadInvoiceController
);

export default router;
