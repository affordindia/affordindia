import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
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
    },
    { timestamps: true }
);

orderSchema.index({ user: 1 });

const Order = mongoose.model("Order", orderSchema);
export default Order;
