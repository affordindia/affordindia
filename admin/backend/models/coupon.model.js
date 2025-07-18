import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: { type: String, required: true, unique: true },
        discountType: {
            type: String,
            enum: ["percentage", "fixed"],
            required: true,
        },
        discountValue: { type: Number, required: true },
        minOrder: { type: Number, default: 0 },
        expiry: { type: Date },
        isActive: { type: Boolean, default: true },
    },
    { timestamps: true }
);

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
