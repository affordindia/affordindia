import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        material: { type: String }, // e.g., "silver", "brass", etc.
        link: { type: String },
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
        status: {
            type: String,
            enum: ["active", "inactive", "scheduled"],
            default: "inactive",
        },
        order: { type: Number, default: 0 },
    },
    { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
