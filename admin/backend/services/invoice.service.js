import Invoice from "../models/invoice.model.js";
import Order from "../models/order.model.js";
import { generateInvoiceNumber } from "../utils/invoiceNumber.util.js";
import { generateInvoicePDF } from "../utils/pdfGenerator.util.js";
import businessConfig from "../config/business.config.js";
import { ToWords } from "to-words";

/**
 * Generate invoice for an order
 * @param {string} orderId - MongoDB ObjectId of the order
 * @param {string} adminId - MongoDB ObjectId of the admin generating the invoice
 * @returns {Promise<Object>} Generated invoice
 */
export const generateInvoice = async (orderId, adminId) => {
    try {
        // Check if invoice already exists for this order
        const existingInvoice = await Invoice.findByOrderId(orderId);
        if (existingInvoice) {
            throw new Error("Invoice already exists for this order");
        }

        // Fetch the order with all populated data
        const order = await Order.findById(orderId)
            .populate("user", "name email phone")
            .populate("items.product", "name price images")
            .populate("coupon");

        if (!order) {
            throw new Error("Order not found");
        }

        // Generate unique invoice number
        const invoiceNumber = await generateInvoiceNumber();

        // Create invoice data snapshot
        const invoiceData = await createInvoiceDataSnapshot(order);

        // Create the invoice
        const invoice = await Invoice.create({
            invoiceNumber,
            orderId: order._id,
            generatedAt: new Date(),
            generatedBy: adminId,
            invoiceData,
            status: "generated",
        });

        console.log(
            `Invoice ${invoiceNumber} generated for order ${order._id}`
        );

        // Return populated invoice
        return await Invoice.findById(invoice._id).populate(
            "generatedBy",
            "name email"
        );
    } catch (error) {
        console.error("Error generating invoice:", error);
        throw error;
    }
};

/**
 * Create invoice data snapshot from order
 * @param {Object} order - Order document
 * @returns {Object} Invoice data snapshot
 */
const createInvoiceDataSnapshot = async (order) => {
    // Business information from configuration

    const businessInfo = {
        name: businessConfig.name,
        address: businessConfig.address,
        city: businessConfig.city,
        state: businessConfig.state,
        pincode: businessConfig.pincode,
        country: businessConfig.country,
        gstin: businessConfig.gstin,
        pan: businessConfig.pan,
        phone: businessConfig.phone,
        email: businessConfig.email,
        website: businessConfig.website,
        bankDetails: businessConfig.bankDetails,
    };

    // Calculate GST for each item and totals
    const processedItems = order.items.map((item) => {
        const product = item.product;
        const quantity = item.quantity;
        const unitPrice = item.discountedPrice || item.price;
        const lineTotal = unitPrice * quantity;

        // Default GST rate from configuration
        const gstRate = product.gstRate || businessConfig.defaultGSTRate;
        const taxAmount = Math.round((lineTotal * gstRate) / 100);

        return {
            productName: product.name,
            productId: product.sku || product._id.toString(),
            hsnCode: product.hsnCode || "123456", // Default HSN if not available
            quantity: quantity,
            unit: "pcs", // This should come from product data
            price: item.price,
            discountedPrice: unitPrice,
            taxRate: gstRate,
            taxAmount: taxAmount,
            total: lineTotal,
        };
    });

    // Calculate pricing with GST
    const subtotal = order.subtotal || 0;
    const totalDiscount = order.totalDiscount || 0;
    const couponDiscount = order.couponDiscount || 0;
    const shippingFee = order.shippingFee || 0;

    // Taxable amount (after all discounts, before tax)
    const taxableAmount =
        subtotal - totalDiscount - couponDiscount + shippingFee;

    // Calculate total tax from all items
    const totalTax = processedItems.reduce(
        (sum, item) => sum + item.taxAmount,
        0
    );

    // Determine if it's intra-state or inter-state for CGST/SGST vs IGST
    const isIntraState = true; // This should be determined by comparing business state with shipping state

    let cgst = { rate: 0, amount: 0 };
    let sgst = { rate: 0, amount: 0 };
    let igst = { rate: 0, amount: 0 };

    if (isIntraState) {
        // Intra-state: CGST + SGST
        cgst = { rate: 9, amount: Math.round(totalTax / 2) };
        sgst = { rate: 9, amount: Math.round(totalTax / 2) };
    } else {
        // Inter-state: IGST
        igst = { rate: 18, amount: totalTax };
    }

    const totalWithTax = taxableAmount + totalTax;
    const roundingAdjustment = Math.round(totalWithTax) - totalWithTax;
    const finalAmount = Math.round(totalWithTax);

    return {
        business: businessInfo,
        order: {
            mongoId: order._id.toString(),
            orderId: order.orderId,
            orderDate: order.createdAt,
            status: order.status,
            paymentMethod: order.paymentMethod,
            paymentStatus: order.paymentStatus,
        },
        customer: {
            name: order.user.name,
            email: order.user.email || "-",
            phone: order.user.phone,
        },
        items: processedItems,
        addresses: {
            shipping: order.shippingAddress,
            billing: order.billingAddressSameAsShipping
                ? order.shippingAddress
                : order.billingAddress,
            billingAddressSameAsShipping: order.billingAddressSameAsShipping,
            // Flag to indicate if billing and shipping persons are different
            isDifferentReceiver: !!(order.receiverName || order.receiverPhone),
        },
        pricing: {
            subtotal: subtotal,
            totalDiscount: totalDiscount,
            couponDiscount: couponDiscount,
            shippingFee: shippingFee,
            taxableAmount: taxableAmount,
            cgst: cgst,
            sgst: sgst,
            igst: igst,
            totalTax: totalTax,
            total: totalWithTax,
            totalInWords: numberToWords(finalAmount),
            roundingAdjustment: roundingAdjustment,
            finalAmount: finalAmount,
        },
        coupon: order.coupon
            ? {
                  code: order.coupon.code,
                  discountAmount: order.couponDiscount,
                  discountType: order.coupon.discountType,
              }
            : null,
        receiverInfo: {
            name: order.receiverName,
            phone: order.receiverPhone,
        },
    };
};

/**
 * Get invoice by order ID
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Object|null>} Invoice if exists
 */
export const getInvoiceByOrderId = async (orderId) => {
    try {
        return await Invoice.findByOrderId(orderId);
    } catch (error) {
        console.error("Error fetching invoice by order ID:", error);
        throw error;
    }
};

/**
 * Get invoice by invoice number
 * @param {string} invoiceNumber - Invoice number (e.g., "INV_ABC123_0001")
 * @returns {Promise<Object|null>} Invoice if exists
 */
export const getInvoiceByNumber = async (invoiceNumber) => {
    try {
        return await Invoice.findOne({ invoiceNumber }).populate(
            "generatedBy",
            "name email"
        );
    } catch (error) {
        console.error("Error fetching invoice by number:", error);
        throw error;
    }
};

/**
 * Get invoice by invoice ID (backward compatibility)
 * @param {string} invoiceId - MongoDB ObjectId of the invoice
 * @returns {Promise<Object|null>} Invoice if exists
 */
export const getInvoiceById = async (invoiceId) => {
    try {
        return await Invoice.findById(invoiceId).populate(
            "generatedBy",
            "name email"
        );
    } catch (error) {
        console.error("Error fetching invoice by ID:", error);
        throw error;
    }
};

/**
 * Check if invoice exists for order
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Object|null>} Basic invoice info if exists
 */
export const checkInvoiceExists = async (orderId) => {
    try {
        return await Invoice.existsForOrder(orderId);
    } catch (error) {
        console.error("Error checking invoice existence:", error);
        throw error;
    }
};

/**
 * Record invoice download
 * @param {string} invoiceId - MongoDB ObjectId of the invoice
 * @returns {Promise<Object>} Updated invoice
 */
export const recordInvoiceDownload = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error("Invoice not found");
        }

        await invoice.recordDownload();
        return invoice;
    } catch (error) {
        console.error("Error recording invoice download:", error);
        throw error;
    }
};

/**
 * Get all invoices with pagination
 * @param {Object} options - Query options
 * @returns {Promise<Object>} Paginated invoices
 */
export const getAllInvoices = async (options = {}) => {
    try {
        const page = parseInt(options.page) || 1;
        const limit = parseInt(options.limit) || 10;
        const skip = (page - 1) * limit;

        const filter = {};
        if (options.status) filter.status = options.status;
        if (options.startDate && options.endDate) {
            filter.generatedAt = {
                $gte: new Date(options.startDate),
                $lte: new Date(options.endDate),
            };
        }

        const invoices = await Invoice.find(filter)
            .populate("generatedBy", "name email")
            .populate("orderId", "orderId status")
            .sort({ generatedAt: -1 })
            .skip(skip)
            .limit(limit);

        const total = await Invoice.countDocuments(filter);

        return {
            invoices,
            total,
            page,
            totalPages: Math.ceil(total / limit),
        };
    } catch (error) {
        console.error("Error fetching invoices:", error);
        throw error;
    }
};

// Configure ToWords for Indian number system
const toWords = new ToWords({
    localeCode: "en-IN",
    converterOptions: {
        currency: true,
        ignoreDecimal: false,
        ignoreZeroCurrency: false,
        doNotAddOnly: false,
        currencyOptions: {
            name: "Rupee",
            plural: "Rupees",
            symbol: "₹",
            fractionalUnit: {
                name: "Paisa",
                plural: "Paise",
                symbol: "",
            },
        },
    },
});

/**
 * Convert number to words (for Indian invoices)
 * Using to-words package with Indian number system
 * @param {number} amount - Amount to convert
 * @returns {string} Amount in words
 */
const numberToWords = (amount) => {
    try {
        // Convert amount to words using Indian number system
        return toWords.convert(amount, { currency: true });
    } catch (error) {
        console.error("Error converting number to words:", error);
        // Fallback to simple format
        return `₹${amount} Only`;
    }
};

/**
 * Generate PDF for an invoice
 * @param {string} invoiceId - MongoDB ObjectId of the invoice
 * @returns {Promise<Buffer>} PDF buffer
 */
export const createInvoicePDF = async (invoiceId) => {
    try {
        const invoice = await Invoice.findById(invoiceId);
        if (!invoice) {
            throw new Error("Invoice not found");
        }

        // Helper function to safely format numbers
        const safeToFixed = (value, decimals = 2) => {
            return (value && typeof value === "number" ? value : 0).toFixed(
                decimals
            );
        };

        // Format data for PDF template
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
            cgstRate: invoice.invoiceData.pricing.cgst
                ? invoice.invoiceData.pricing.cgst.rate
                : null,
            sgstRate: invoice.invoiceData.pricing.sgst
                ? invoice.invoiceData.pricing.sgst.rate
                : null,
            igstRate: invoice.invoiceData.pricing.igst
                ? invoice.invoiceData.pricing.igst.rate
                : null,
            totalTax: safeToFixed(invoice.invoiceData.pricing.totalTax),

            // Totals
            subtotal: safeToFixed(invoice.invoiceData.pricing.subtotal),
            shippingCharges: invoice.invoiceData.pricing.shippingFee
                ? safeToFixed(invoice.invoiceData.pricing.shippingFee)
                : null,
            discount:
                invoice.invoiceData.pricing.totalDiscount ||
                invoice.invoiceData.pricing.couponDiscount
                    ? safeToFixed(
                          (invoice.invoiceData.pricing.totalDiscount || 0) +
                              (invoice.invoiceData.pricing.couponDiscount || 0)
                      )
                    : null,
            finalAmount: safeToFixed(invoice.invoiceData.pricing.finalAmount),
            totalInWords: invoice.invoiceData.pricing.totalInWords,
        };

        // Generate PDF using the simple PDF generator utility
        const pdfBuffer = await generateInvoicePDF(templateData);

        return pdfBuffer;
    } catch (error) {
        console.error("Error generating invoice PDF:", error);
        throw new Error(`Failed to generate invoice PDF: ${error.message}`);
    }
};

export default {
    generateInvoice,
    getInvoiceByOrderId,
    getInvoiceById,
    getInvoiceByNumber,
    checkInvoiceExists,
    recordInvoiceDownload,
    getAllInvoices,
    createInvoicePDF,
};
