import {
    generateInvoice,
    getInvoiceByOrderId,
    getInvoiceById,
    getInvoiceByNumber,
    checkInvoiceExists,
    recordInvoiceDownload,
    getAllInvoices,
    createInvoicePDF,
} from "../services/invoice.service.js";
import { body, param } from "express-validator";

/**
 * Generate invoice for an order
 * POST /api/admin/invoice/:orderId/generate
 */
export const generateInvoiceController = async (req, res, next) => {
    try {
        const { orderId } = req.params;
        const adminId = req.admin.adminId; // From admin auth middleware

        // console.log(`Admin ${adminId} generating invoice for order ${orderId}`);

        const invoice = await generateInvoice(orderId, adminId);

        res.status(201).json({
            success: true,
            message: "Invoice generated successfully",
            invoice: {
                _id: invoice._id,
                invoiceNumber: invoice.invoiceNumber,
                generatedAt: invoice.generatedAt,
                status: invoice.status,
                generatedBy: invoice.generatedBy,
            },
        });
    } catch (error) {
        console.error("Error in generateInvoiceController:", error);

        if (error.message === "Invoice already exists for this order") {
            return res.status(409).json({
                success: false,
                message: error.message,
            });
        }

        if (error.message === "Order not found") {
            return res.status(404).json({
                success: false,
                message: error.message,
            });
        }

        next(error);
    }
};

/**
 * Get invoice status for an order
 * GET /api/admin/invoice/:orderId/status
 */
export const getInvoiceStatusController = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const invoice = await checkInvoiceExists(orderId);

        if (!invoice) {
            return res.json({
                success: true,
                exists: false,
                invoice: null,
            });
        }

        res.json({
            success: true,
            exists: true,
            invoice: {
                _id: invoice._id,
                invoiceNumber: invoice.invoiceNumber,
                generatedAt: invoice.generatedAt,
            },
        });
    } catch (error) {
        console.error("Error in getInvoiceStatusController:", error);
        next(error);
    }
};

/**
 * Download invoice PDF
 * GET /api/admin/invoice/:orderId/download
 */
export const downloadInvoiceController = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        // Get the invoice
        const invoice = await getInvoiceByOrderId(orderId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found for this order",
            });
        }

        // Generate PDF
        const pdfBuffer = await createInvoicePDF(invoice._id);

        // Record the download
        await recordInvoiceDownload(invoice._id);

        // Set headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Invoice_${invoice.invoiceNumber}.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error in downloadInvoiceController:", error);

        // Send error response if PDF generation fails
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate invoice PDF",
                error: error.message,
            });
        }

        next(error);
    }
};

/**
 * Get invoice details by order ID
 * GET /api/admin/invoice/:orderId
 */
export const getInvoiceByOrderIdController = async (req, res, next) => {
    try {
        const { orderId } = req.params;

        const invoice = await getInvoiceByOrderId(orderId);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found for this order",
            });
        }

        res.json({
            success: true,
            invoice: invoice,
        });
    } catch (error) {
        console.error("Error in getInvoiceByOrderIdController:", error);
        next(error);
    }
};

/**
 * Get invoice details by invoice number
 * GET /api/admin/invoice/details/:invoiceNumber
 */
export const getInvoiceByNumberController = async (req, res, next) => {
    try {
        const { invoiceNumber } = req.params;

        const invoice = await getInvoiceByNumber(invoiceNumber);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        res.json({
            success: true,
            invoice: invoice,
        });
    } catch (error) {
        console.error("Error in getInvoiceByIdController:", error);
        next(error);
    }
};

/**
 * Get all invoices with pagination
 * GET /api/admin/invoices
 */
export const getAllInvoicesController = async (req, res, next) => {
    try {
        const options = {
            page: req.query.page,
            limit: req.query.limit,
            status: req.query.status,
            startDate: req.query.startDate,
            endDate: req.query.endDate,
        };

        const result = await getAllInvoices(options);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Error in getAllInvoicesController:", error);
        next(error);
    }
};

/**
 * Download invoice PDF by invoice number
 * GET /api/admin/invoice/pdf/:invoiceNumber
 */
export const downloadInvoicePDFController = async (req, res, next) => {
    try {
        const { invoiceNumber } = req.params;

        // Get the invoice to verify it exists
        const invoice = await getInvoiceByNumber(invoiceNumber);

        if (!invoice) {
            return res.status(404).json({
                success: false,
                message: "Invoice not found",
            });
        }

        // Generate PDF
        const pdfBuffer = await createInvoicePDF(invoice._id);

        // Record the download
        await recordInvoiceDownload(invoice._id);

        // Set headers for PDF download
        res.setHeader("Content-Type", "application/pdf");
        res.setHeader(
            "Content-Disposition",
            `attachment; filename="Invoice_${invoiceNumber}.pdf"`
        );
        res.setHeader("Content-Length", pdfBuffer.length);

        // Send PDF buffer
        res.send(pdfBuffer);
    } catch (error) {
        console.error("Error in downloadInvoicePDFController:", error);

        // Send error response if PDF generation fails
        if (!res.headersSent) {
            return res.status(500).json({
                success: false,
                message: "Failed to generate invoice PDF",
                error: error.message,
            });
        }

        next(error);
    }
};

// Validation middleware
export const validateGenerateInvoice = [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
];

export const validateOrderId = [
    param("orderId").isMongoId().withMessage("Invalid order ID"),
];

export const validateInvoiceNumber = [
    param("invoiceNumber").notEmpty().withMessage("Invoice number is required"),
];

export const validateGetAllInvoices = [
    // Optional query parameters validation
    // Add more validation as needed
];

export default {
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
};
