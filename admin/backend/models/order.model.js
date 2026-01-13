import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        orderId: {
            type: String,
            unique: true,
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        items: [
            {
                product: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true,
                },
                quantity: { type: Number, required: true },
                price: { type: Number, required: true },
                discountedPrice: { type: Number, required: true }, // price after discount
            },
        ],
        shippingAddress: {
            houseNumber: { type: String },
            street: { type: String },
            landmark: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },
        billingAddress: {
            houseNumber: { type: String },
            street: { type: String },
            landmark: { type: String },
            area: { type: String },
            city: { type: String },
            state: { type: String },
            pincode: { type: String },
            country: { type: String, default: "India" },
        },
        billingAddressSameAsShipping: { type: Boolean, default: true },
        receiverName: { type: String },
        receiverPhone: { type: String },
        paymentMethod: { type: String },
        paymentStatus: {
            type: String,
            enum: ["pending", "paid", "failed"],
            default: "pending",
        },
        paymentInfo: { type: Object },
        status: {
            type: String,
            enum: [
                "pending",
                "processing",
                "shipped",
                "delivered",
                "cancelled",
                "returned",
            ],
            default: "pending",
        },
        subtotal: { type: Number },
        totalDiscount: { type: Number, default: 0 }, // sum of all product discounts
        couponDiscount: { type: Number, default: 0 }, // coupon discount amount
        shippingFee: { type: Number },
        total: { type: Number },
        trackingNumber: { type: String },
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
        returnedAt: { type: Date },
        coupon: {
            couponId: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
            code: String,
            discountAmount: Number,
            discountType: String,
            discountValue: Number,
        },
        notes: { type: String },
        
        // =================== SHIPROCKET INTEGRATION FIELDS ===================
        shiprocket: {
            orderId: { type: String }, // Shiprocket order ID
            shipmentId: { type: String }, // Shiprocket shipment ID
            awbCode: { type: String }, // AWB (Air Waybill) tracking code
            courierId: { type: String },
            courierName: { type: String },
            status: { type: String }, // Current Shiprocket status
            statusId: { type: Number },
            shipmentStatus: { type: String },
            shipmentStatusId: { type: Number },
            etd: { type: String }, // Estimated delivery date
            pickupScheduledDate: { type: String },
            awbAssignedDate: { type: String },
            lastUpdated: { type: Date },
            scans: [{ type: Object }], // Tracking scan history
            webhookEvents: [{
                status: String,
                receivedAt: Date,
                data: Object
            }],
            createdAt: { type: Date }
        },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });
orderSchema.index({ 'shiprocket.awbCode': 1 });
orderSchema.index({ 'shiprocket.orderId': 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
