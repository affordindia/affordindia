import express from "express";
import {
    generateInvoiceController,
    getInvoiceStatusController,
    downloadInvoiceController,
    downloadInvoicePDFController,
    getInvoiceByOrderIdController,
    getInvoiceByNumberController,
    getAllInvoicesController,
    validateGenerateInvoice,
    validateOrderId,
    validateInvoiceNumber,
    validateGetAllInvoices,
} from "../controllers/invoice.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";
import { validationResult } from "express-validator";

const router = express.Router();

// Validation error handler middleware
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

// Apply admin authentication to all routes
router.use(verifyAdminAuth);

// Invoice generation routes
router.post(
    "/invoice/:orderId/generate",
    requirePermission("invoices.generate"),
    validateGenerateInvoice,
    handleValidationErrors,
    generateInvoiceController
);

// Invoice status check
router.get(
    "/invoice/:orderId/status",
    requirePermission("invoices.view"),
    validateOrderId,
    handleValidationErrors,
    getInvoiceStatusController
);

// Invoice download
router.get(
    "/invoice/:orderId/download",
    requirePermission("invoices.download"),
    validateOrderId,
    handleValidationErrors,
    downloadInvoiceController
);

// Download invoice PDF by invoice number
router.get(
    "/invoice/pdf/:invoiceNumber",
    requirePermission("invoices.download"),
    validateInvoiceNumber,
    handleValidationErrors,
    downloadInvoicePDFController
);

// Get invoice by order ID
router.get(
    "/invoice/:orderId",
    requirePermission("invoices.view"),
    validateOrderId,
    handleValidationErrors,
    getInvoiceByOrderIdController
);

// Get invoice by invoice number
router.get(
    "/invoice/details/:invoiceNumber",
    requirePermission("invoices.view"),
    validateInvoiceNumber,
    handleValidationErrors,
    getInvoiceByNumberController
);

// Get all invoices (for admin management)
router.get(
    "/invoices",
    requirePermission("invoices.manage"),
    validateGetAllInvoices,
    handleValidationErrors,
    getAllInvoicesController
);

export default router;
