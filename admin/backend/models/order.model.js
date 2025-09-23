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
        
        // Shiprocket integration fields
        shiprocket: {
            orderId: { type: Number }, // Shiprocket's internal order ID (sr_order_id)
            shipmentId: { type: Number }, // Shipment ID from Shiprocket
            awbCode: { type: String }, // Air Waybill code for tracking
            courierId: { type: Number }, // Selected courier partner ID
            courierName: { type: String }, // Courier partner name (Delhivery, Blue Dart, etc.)
            pickupScheduled: { type: Boolean, default: false },
            pickupDate: { type: Date },
            expectedDeliveryDate: { type: Date },
            currentStatus: { type: String }, // Latest status from Shiprocket
            statusHistory: [{ // Track all status updates from scans
                status: String,
                statusDate: Date,
                activity: String,
                location: String,
                srStatus: String, // Shiprocket status code
                srStatusLabel: String // Shiprocket status label
            }],
            rtoInitiated: { type: Boolean, default: false }, // Return to Origin
            delivered: { type: Boolean, default: false },
            lastSyncAt: { type: Date }, // Last time we synced with Shiprocket
            podStatus: { type: String }, // Proof of Delivery status
            pod: { type: String }, // Proof of Delivery details
            webhook: {
                lastReceivedAt: { type: Date },
                lastStatus: String,
            }
        },
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
