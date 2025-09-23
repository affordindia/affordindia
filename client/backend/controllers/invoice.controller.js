import {
    checkInvoiceExists,
    getInvoiceByOrderId,
    downloadInvoicePDF,
} from "../services/invoice.service.js";
import { param } from "express-validator";
import Order from "../models/order.model.js";

export const checkInvoiceExistsController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Verify order ownership
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or access denied",
            });
        }

        // Check if invoice exists
        const exists = await checkInvoiceExists(orderId);

        if (exists) {
            // Get minimal invoice info for the frontend
            const invoice = await getInvoiceByOrderId(orderId);
            res.status(200).json({
                success: true,
                exists: true,
                invoice: {
                    _id: invoice._id,
                    invoiceNumber: invoice.invoiceNumber,
                    generatedAt: invoice.generatedAt,
                    status: invoice.status,
                },
            });
        } else {
            res.status(200).json({
                success: true,
                exists: false,
            });
        }
    } catch (error) {
        console.error("Error in checkInvoiceExists:", error);
        res.status(500).json({
            success: false,
            message: "Internal server error",
        });
    }
};

export const downloadInvoiceController = async (req, res) => {
    try {
        const { orderId } = req.params;
        const userId = req.user._id;

        // Verify order ownership
        const order = await Order.findOne({
            _id: orderId,
            user: userId,
        });

        if (!order) {
            return res.status(404).json({
                success: false,
                message: "Order not found or access denied",
            });
        }

        // Download PDF
        const { buffer, filename } = await downloadInvoicePDF(orderId);

        // Set response headers for PDF download
        res.set({
            "Content-Type": "application/pdf",
            "Content-Disposition": `attachment; filename="${filename}"`,
            "Content-Length": buffer.length,
        });

        res.send(buffer);
    } catch (error) {
        console.error("Error in downloadInvoiceController:", error);

        if (error.message === "Invoice not found") {
            return res.status(404).json({
                success: false,
                message: "Invoice not found for this order",
            });
        }

        res.status(500).json({
            success: false,
            message: "Failed to download invoice",
        });
    }
};

// Validation middleware
export const validateOrderId = [
    param("orderId").isMongoId().withMessage("Invalid order ID format"),
];
