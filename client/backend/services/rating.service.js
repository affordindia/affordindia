import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";

export const updateProductRating = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    // Get all reviews for this product
    const reviews = await Review.find({ product: productId });

    if (reviews.length === 0) {
        // No reviews - set rating to 0
        await Product.findByIdAndUpdate(productId, {
            ratings: 0,
            reviewsCount: 0,
        });
        return { ratings: 0, reviewsCount: 0 };
    }

    // Calculate average rating
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const avgRating = totalRating / reviews.length;
    const roundedRating = Math.round(avgRating * 10) / 10; // Round to 1 decimal place

    // Update product with new rating and count
    await Product.findByIdAndUpdate(productId, {
        ratings: roundedRating,
        reviewsCount: reviews.length,
    });

    return {
        ratings: roundedRating,
        reviewsCount: reviews.length,
        totalRating: totalRating,
    };
};
