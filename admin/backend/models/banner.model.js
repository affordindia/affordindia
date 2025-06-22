import mongoose from "mongoose";

const bannerSchema = new mongoose.Schema(
    {
        title: { type: String, required: true },
        image: { type: String, required: true },
        link: { type: String },
        isActive: { type: Boolean, default: true },
        startDate: { type: Date },
        endDate: { type: Date },
    },
    { timestamps: true }
);

const Banner = mongoose.model("Banner", bannerSchema);
export default Banner;
