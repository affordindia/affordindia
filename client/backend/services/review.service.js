import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import mongoose from "mongoose";

export const createReview = async (productId, userId, data) => {
    if (!userId) throw new Error("Authentication required");
    // Validate product exists
    if (!mongoose.Types.ObjectId.isValid(productId))
        throw new Error("Invalid productId");
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    // Prevent duplicate review by same user
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) throw new Error("You have already reviewed this product");
    const review = await Review.create({
        user: userId,
        product: productId,
        rating: data.rating,
        comment: data.comment,
    });
    // Add review to product's reviews array
    product.reviews.push(review._id);
    await product.save();
    return review;
};

export const listReviews = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId))
        throw new Error("Invalid productId");
    return Review.find({ product: productId })
        .populate("user", "name")
        .sort("-createdAt")
        .lean();
};

export const getReview = async (productId, reviewId) => {
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    )
        throw new Error("Invalid id");
    return Review.findOne({ _id: reviewId, product: productId })
        .populate("user", "name")
        .lean();
};

export const updateReview = async (productId, reviewId, userId, data) => {
    if (!userId) throw new Error("Authentication required");
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    )
        throw new Error("Invalid id");
    const review = await Review.findOneAndUpdate(
        { _id: reviewId, product: productId, user: userId },
        { $set: { rating: data.rating, comment: data.comment } },
        { new: true }
    );
    return review;
};

export const deleteReview = async (productId, reviewId, userId) => {
    if (!userId) throw new Error("Authentication required");
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    )
        throw new Error("Invalid id");
    const review = await Review.findOneAndDelete({
        _id: reviewId,
        product: productId,
        user: userId,
    });
    if (!review) return false;
    // Remove review from product's reviews array
    await Product.findByIdAndUpdate(productId, {
        $pull: { reviews: review._id },
    });
    return true;
};
