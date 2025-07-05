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
        shippingFee: { type: Number },
        discount: { type: Number },
        total: { type: Number },
        trackingNumber: { type: String },
        deliveredAt: { type: Date },
        cancelledAt: { type: Date },
        coupon: { type: mongoose.Schema.Types.ObjectId, ref: "Coupon" },
        notes: { type: String },
    },
    { timestamps: true }
);

const Order = mongoose.model("Order", orderSchema);
export default Order;
