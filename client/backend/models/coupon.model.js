import mongoose from "mongoose";

const couponSchema = new mongoose.Schema(
    {
        code: {
            type: String,
            required: true,
            unique: true,
            uppercase: true,
            trim: true,
        },
        description: {
            type: String,
            required: true,
        },
        discountType: {
            type: String,
            enum: ["percentage", "fixed", "percentage_upto"],
            required: true,
        },
        discountValue: {
            type: Number,
            required: true,
            min: 0,
        },
        maxDiscountAmount: {
            type: Number,
            default: null, // Only applicable for "percentage_upto" type
        },
        minOrderAmount: {
            type: Number,
            default: 0,
        },
        validFrom: {
            type: Date,
            default: Date.now,
        },
        validUntil: {
            type: Date,
            required: true,
        },
        isActive: {
            type: Boolean,
            default: true,
        },
        isGlobal: {
            type: Boolean,
            default: false, // If true, applies to all products regardless of category restrictions
        },
        applicableCategories: [
            {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Category",
            },
        ],
        userUsageLimit: {
            type: Number,
            default: 1, // How many times a single user can use this coupon (0 = unlimited per user)
        },
    },
    { timestamps: true }
);

// Index for better performance
couponSchema.index({ isActive: 1, validFrom: 1, validUntil: 1 });

// Method to check if coupon is valid
couponSchema.methods.isValidCoupon = function () {
    const now = new Date();
    return this.isActive && now >= this.validFrom && now <= this.validUntil;
};

// Method to calculate discount
couponSchema.methods.calculateDiscount = function (orderAmount) {
    if (!this.isValidCoupon() || orderAmount < this.minOrderAmount) {
        return 0;
    }

    let discount = 0;

    switch (this.discountType) {
        case "fixed":
            discount = this.discountValue;
            break;
        case "percentage":
            discount = (orderAmount * this.discountValue) / 100;
            break;
        case "percentage_upto":
            discount = (orderAmount * this.discountValue) / 100;
            if (this.maxDiscountAmount && discount > this.maxDiscountAmount) {
                discount = this.maxDiscountAmount;
            }
            break;
    }

    // Ensure discount doesn't exceed order amount
    return Math.min(discount, orderAmount);
};

const Coupon = mongoose.model("Coupon", couponSchema);
export default Coupon;
