import mongoose from "mongoose";

const couponUsageSchema = new mongoose.Schema(
    {
        coupon: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Coupon",
            required: true,
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        order: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Order",
            required: true,
        },
        discountAmount: {
            type: Number,
            required: true,
        },
        originalAmount: {
            type: Number,
            required: true,
        },
        finalAmount: {
            type: Number,
            required: true,
        },
    },
    { timestamps: true }
);

// Compound index for efficient queries
couponUsageSchema.index({ coupon: 1, user: 1 });
couponUsageSchema.index({ user: 1 });
couponUsageSchema.index({ coupon: 1 });

const CouponUsage = mongoose.model("CouponUsage", couponUsageSchema);
export default CouponUsage;
