import Invoice from "../models/invoice.model.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.util.js";

export const checkInvoiceExists = async (orderId) => {
    try {
        const invoice = await Invoice.findOne({ orderId }).select("_id");
        return !!invoice;
    } catch (error) {
        console.error("Error checking invoice existence:", error);
        throw error;
    }
};

export const getInvoiceByOrderId = async (orderId) => {
    try {
        const invoice = await Invoice.findOne({ orderId });
        return invoice;
    } catch (error) {
        console.error("Error getting invoice by order ID:", error);
        throw error;
    }
};

export const createInvoicePDF = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error("Invoice not found");
        }

        // Helper function to safely format numbers (COPIED FROM ADMIN)
        const safeToFixed = (value, decimals = 2) => {
            return (value && typeof value === "number" ? value : 0).toFixed(
                decimals
            );
        };

        // Format data for PDF template (COPIED EXACTLY FROM ADMIN)
        const templateData = {
            invoiceNumber: invoice.invoiceNumber,
            invoiceDate: new Date(invoice.generatedAt).toLocaleDateString(
                "en-IN"
            ),

            // Order information
            order: {
                orderId: invoice.invoiceData.order.orderId,
                orderDate: new Date(
                    invoice.invoiceData.order.orderDate
                ).toLocaleDateString("en-IN"),
                status: invoice.invoiceData.order.status,
                paymentMethod: invoice.invoiceData.order.paymentMethod,
                paymentStatus: invoice.invoiceData.order.paymentStatus,
            },

            // Business information
            business: {
                name: invoice.invoiceData.business.name,
                address: invoice.invoiceData.business.address,
                city: invoice.invoiceData.business.city,
                state: invoice.invoiceData.business.state,
                pincode: invoice.invoiceData.business.pincode,
                gstin: invoice.invoiceData.business.gstin,
                email: invoice.invoiceData.business.email,
                phone: invoice.invoiceData.business.phone,
                bankDetails: invoice.invoiceData.business.bankDetails,
            },

            // Customer information
            customer: {
                name: invoice.invoiceData.customer.name,
                email: invoice.invoiceData.customer.email,
                phone: invoice.invoiceData.customer.phone,
            },

            // Receiver information (for different shipping recipient)
            receiverInfo: invoice.invoiceData.receiverInfo || null,

            // Addresses with receiver logic
            addresses: {
                billing: invoice.invoiceData.addresses.billing,
                shipping: invoice.invoiceData.addresses.shipping,
                isDifferentReceiver:
                    invoice.invoiceData.addresses.isDifferentReceiver || false,
            },

            // Items
            items: invoice.invoiceData.items.map((item) => ({
                productName: item.productName,
                hsnCode: item.hsnCode,
                quantity: item.quantity,
                unitPrice: safeToFixed(item.discountedPrice || item.price),
                totalPrice: safeToFixed(item.total),
            })),

            // Tax details
            taxableAmount: safeToFixed(
                invoice.invoiceData.pricing.taxableAmount
            ),
            cgst:
                invoice.invoiceData.pricing.cgst &&
                invoice.invoiceData.pricing.cgst.amount
                    ? safeToFixed(invoice.invoiceData.pricing.cgst.amount)
                    : null,
            sgst:
                invoice.invoiceData.pricing.sgst &&
                invoice.invoiceData.pricing.sgst.amount
                    ? safeToFixed(invoice.invoiceData.pricing.sgst.amount)
                    : null,
            igst:
                invoice.invoiceData.pricing.igst &&
                invoice.invoiceData.pricing.igst.amount
                    ? safeToFixed(invoice.invoiceData.pricing.igst.amount)
                    : null,

            // Totals
            subtotal: safeToFixed(invoice.invoiceData.pricing.subtotal),
            totalDiscount: safeToFixed(
                invoice.invoiceData.pricing.totalDiscount
            ),
            couponDiscount: safeToFixed(
                invoice.invoiceData.pricing.couponDiscount
            ),
            shippingFee: safeToFixed(invoice.invoiceData.pricing.shippingFee),
            totalTax: safeToFixed(invoice.invoiceData.pricing.totalTax),
            finalAmount: safeToFixed(invoice.invoiceData.pricing.finalAmount),
            totalInWords: invoice.invoiceData.pricing.totalInWords,

            // Coupon information
            coupon: invoice.invoiceData.coupon || null,
        };

        // Use the existing PDF generator with the FORMATTED data (like admin)
        const pdfBuffer = await generateInvoicePDF(templateData);

        return pdfBuffer;
    } catch (error) {
        console.error("Error creating invoice PDF:", error);
        throw error;
    }
};

export const downloadInvoicePDF = async (orderId) => {
    try {
        // Step 1: Get the invoice by order ID (like admin does)
        const invoice = await getInvoiceByOrderId(orderId);
        if (!invoice) {
            throw new Error("Invoice not found");
        }

        // Step 2: Generate PDF using invoice ID (exactly like admin does)
        const pdfBuffer = await createInvoicePDF(invoice._id);

        // Step 3: Update download count
        await Invoice.findByIdAndUpdate(invoice._id, {
            $inc: { downloadCount: 1 },
            status: "downloaded",
            lastDownloadedAt: new Date(),
        });

        return {
            buffer: pdfBuffer,
            filename: `Invoice_${invoice.invoiceNumber}.pdf`,
        };
    } catch (error) {
        console.error("Error downloading invoice PDF:", error);
        throw error;
    }
};
