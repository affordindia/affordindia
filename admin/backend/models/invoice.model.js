import mongoose from "mongoose";

const invoiceSchema = new mongoose.Schema(
    {
        invoiceNumber: {
            type: String,
            unique: true,
            required: true,
        },
        orderId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
            unique: true, // One invoice per order
            // NOTE: This is the MongoDB ObjectId reference to the Order document
            // The custom order ID string (like "ORD_ABC123") is stored in invoiceData.order.orderId
        },
        generatedAt: {
            type: Date,
            default: Date.now,
            required: true,
        },
        generatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "AdminUser", // Admin who generated the invoice
            required: true,
        },
        invoiceData: {
            // Snapshot of order data at the time of invoice generation
            // This ensures invoice data remains consistent even if order is modified

            // Business Information (for Indian GST compliance)
            business: {
                name: String,
                address: String,
                city: String,
                state: String,
                pincode: String,
                country: String,
                gstin: String, // GST Identification Number
                pan: String, // PAN number
                phone: String,
                email: String,
                website: String,
                bankDetails: {
                    accountName: String,
                    accountNumber: String,
                    ifsc: String,
                    bankName: String,
                    branch: String,
                },
            },
            order: {
                mongoId: String, // MongoDB ObjectId as string
                orderId: String, // Custom order ID (like "ORD_ABC123")
                orderDate: Date,
                status: String,
                paymentMethod: String,
                paymentStatus: String,
            },
            customer: {
                name: String,
                email: String,
                phone: String,
            },
            items: [
                {
                    productName: String,
                    productId: String, // Product SKU or ID
                    hsnCode: String, // HSN Code for GST (required in India)
                    quantity: Number,
                    unit: String, // Unit of measurement (pcs, kg, etc.)
                    price: Number, // Original price per unit
                    discountedPrice: Number, // Price after discount per unit
                    taxRate: Number, // GST rate applicable to this item
                    taxAmount: Number, // Tax amount for this item
                    total: Number, // Total for this line item
                },
            ],
            addresses: {
                shipping: {
                    houseNumber: String,
                    street: String,
                    landmark: String,
                    area: String,
                    city: String,
                    state: String,
                    pincode: String,
                    country: String,
                },
                billing: {
                    houseNumber: String,
                    street: String,
                    landmark: String,
                    area: String,
                    city: String,
                    state: String,
                    pincode: String,
                    country: String,
                },
                billingAddressSameAsShipping: Boolean,
                isDifferentReceiver: Boolean, // Flag to indicate when receiver info differs from customer
            },
            pricing: {
                subtotal: Number, // Before any discounts
                totalDiscount: Number, // Product discounts
                couponDiscount: Number, // Coupon discount
                shippingFee: Number,

                // Indian GST Tax Fields
                taxableAmount: Number, // Amount on which tax is calculated (after discounts)
                cgst: {
                    rate: Number, // CGST rate (e.g., 9%)
                    amount: Number, // CGST amount
                },
                sgst: {
                    rate: Number, // SGST rate (e.g., 9%)
                    amount: Number, // SGST amount
                },
                igst: {
                    rate: Number, // IGST rate (e.g., 18%)
                    amount: Number, // IGST amount
                },
                totalTax: Number, // Total of all taxes (CGST + SGST + IGST)

                total: Number, // Final total including taxes
                totalInWords: String, // Amount in words for legal compliance

                // Additional Indian invoice fields
                roundingAdjustment: Number, // Rounding to nearest rupee
                finalAmount: Number, // After rounding
            },
            coupon: {
                code: String,
                discountAmount: Number,
                discountType: String,
            },
            receiverInfo: {
                name: String,
                phone: String,
            },
        },
        status: {
            type: String,
            enum: ["generated", "downloaded", "sent"], // Future: email sending
            default: "generated",
        },
        downloadCount: {
            type: Number,
            default: 0,
        },
        lastDownloadedAt: {
            type: Date,
        },
        notes: {
            type: String, // Admin notes about the invoice
        },
    },
    {
        timestamps: true,
        // Add virtual for formatted invoice number display
        toJSON: { virtuals: true },
        toObject: { virtuals: true },
    }
);

// Indexes for better query performance
invoiceSchema.index({ generatedAt: -1 });
invoiceSchema.index({ "invoiceData.customer.email": 1 });

// Virtual for formatted display
invoiceSchema.virtual("formattedInvoiceNumber").get(function () {
    return this.invoiceNumber;
});

// Instance method to update download info
invoiceSchema.methods.recordDownload = function () {
    this.downloadCount += 1;
    this.lastDownloadedAt = new Date();
    this.status = "downloaded";
    return this.save();
};

// Static method to find invoice by order ID
invoiceSchema.statics.findByOrderId = function (orderId) {
    return this.findOne({ orderId }).populate("generatedBy", "name email");
};

// Static method to check if invoice exists for order
invoiceSchema.statics.existsForOrder = function (orderId) {
    return this.findOne({ orderId }).select("_id invoiceNumber generatedAt");
};

const Invoice = mongoose.model("Invoice", invoiceSchema);
export default Invoice;
