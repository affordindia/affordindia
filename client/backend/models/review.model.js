import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
    {
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true,
        },
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Product",
            required: true,
        },
        rating: { type: Number, required: true, min: 1, max: 5 },
        comment: { type: String },
        images: [
            {
                url: { type: String, required: true },
                publicId: { type: String, required: true },
                altText: { type: String, default: "" },
            },
        ],
        imageCount: { type: Number, default: 0, max: 5 },
    },
    { timestamps: true }
);

// Database indexes for performance
reviewSchema.index({ product: 1, user: 1 }, { unique: true }); // Prevent duplicate reviews + fast lookup
reviewSchema.index({ product: 1, createdAt: -1 }); // Fast product review queries with sorting
reviewSchema.index({ user: 1 }); // Fast user review queries
reviewSchema.index({ rating: 1 }); // Fast rating-based queries

const Review = mongoose.model("Review", reviewSchema);
export default Review;
