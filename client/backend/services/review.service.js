import mongoose from "mongoose";
import Review from "../models/review.model.js";
import Product from "../models/product.model.js";
import { updateProductRating } from "./rating.service.js";
import {
    uploadMultipleToCloudinary,
    deleteFromCloudinary,
} from "./upload.service.js";

export const createReview = async (productId, userId, data, files = []) => {
    // Validate product exists
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }

    // Prevent duplicate review by same user
    const existing = await Review.findOne({ product: productId, user: userId });
    if (existing) {
        throw new Error("You have already reviewed this product");
    }

    // Handle image uploads
    const uploadedImages = [];
    if (files && files.length > 0) {
        try {
            const uploadResults = await uploadMultipleToCloudinary(
                files,
                "reviews"
            );
            uploadResults.forEach((result) => {
                uploadedImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    altText: "",
                });
            });
        } catch (error) {
            throw new Error(`Image upload failed: ${error.message}`);
        }
    }

    // Create the review
    const review = await Review.create({
        user: userId,
        product: productId,
        rating: data.rating,
        comment: data.comment || "",
        images: uploadedImages,
        imageCount: uploadedImages.length,
    });

    // Add review to product's reviews array
    product.reviews.push(review._id);
    await product.save();

    // Update product rating and count
    await updateProductRating(productId);

    // Return review with populated user data
    return await Review.findById(review._id).populate("user", "name");
};

export const listReviews = async (productId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    const reviews = await Review.find({ product: productId })
        .populate("user", "name")
        .sort("-createdAt")
        .lean();

    return {
        reviews,
        totalCount: reviews.length,
    };
};

export const getReview = async (productId, reviewId) => {
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
        throw new Error("Invalid ID");
    }

    return Review.findOne({ _id: reviewId, product: productId })
        .populate("user", "name")
        .lean();
};

export const updateReview = async (
    productId,
    reviewId,
    userId,
    data,
    files = []
) => {
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
        throw new Error("Invalid ID");
    }

    // Get existing review
    const existingReview = await Review.findOne({
        _id: reviewId,
        product: productId,
        user: userId,
    });

    if (!existingReview) {
        return null;
    }

    // Handle new image uploads
    const newImages = [];
    if (files && files.length > 0) {
        try {
            const uploadResults = await uploadMultipleToCloudinary(
                files,
                "reviews"
            );
            uploadResults.forEach((result) => {
                newImages.push({
                    url: result.secure_url,
                    publicId: result.public_id,
                    altText: "",
                });
            });
        } catch (error) {
            throw new Error(`Image upload failed: ${error.message}`);
        }
    }

    // If replaceImages is true, delete old images and use only new ones
    // Otherwise, keep existing images and add new ones
    let finalImages = [...existingReview.images];

    if (data.replaceImages === "true" || data.replaceImages === true) {
        // Delete old images from Cloudinary
        if (existingReview.images && existingReview.images.length > 0) {
            for (const image of existingReview.images) {
                try {
                    await deleteFromCloudinary(image.publicId);
                } catch (error) {
                    console.error("Error deleting old image:", error);
                }
            }
        }
        finalImages = newImages;
    } else {
        // Add new images to existing ones (up to 5 total)
        finalImages = [...existingReview.images, ...newImages].slice(0, 5);
    }

    const review = await Review.findOneAndUpdate(
        { _id: reviewId, product: productId, user: userId },
        {
            $set: {
                rating: data.rating,
                comment: data.comment || "",
                images: finalImages,
                imageCount: finalImages.length,
            },
        },
        { new: true }
    ).populate("user", "name");

    if (review) {
        // Update product rating since review rating may have changed
        await updateProductRating(productId);
    }

    return review;
};

export const deleteReview = async (productId, reviewId, userId) => {
    if (
        !mongoose.Types.ObjectId.isValid(productId) ||
        !mongoose.Types.ObjectId.isValid(reviewId)
    ) {
        throw new Error("Invalid ID");
    }

    const review = await Review.findOneAndDelete({
        _id: reviewId,
        product: productId,
        user: userId,
    });

    if (!review) {
        return false;
    }

    // Delete images from Cloudinary
    if (review.images && review.images.length > 0) {
        for (const image of review.images) {
            try {
                await deleteFromCloudinary(image.publicId);
            } catch (error) {
                console.error("Error deleting image from Cloudinary:", error);
            }
        }
    }

    // Remove review from product's reviews array
    await Product.findByIdAndUpdate(productId, {
        $pull: { reviews: review._id },
    });

    // Update product rating after deletion
    await updateProductRating(productId);

    return true;
};

export const getUserReviewForProduct = async (productId, userId) => {
    if (!mongoose.Types.ObjectId.isValid(productId)) {
        throw new Error("Invalid product ID");
    }

    return await Review.findOne({ product: productId, user: userId })
        .populate("user", "name")
        .lean();
};

export const deleteReviewImages = async (reviewId, userId, imagePublicIds) => {
    if (!mongoose.Types.ObjectId.isValid(reviewId)) {
        throw new Error("Invalid review ID");
    }

    const review = await Review.findOne({ _id: reviewId, user: userId });
    if (!review) {
        throw new Error("Review not found or not authorized");
    }

    // Delete images from Cloudinary
    for (const publicId of imagePublicIds) {
        try {
            await deleteFromCloudinary(publicId);
        } catch (error) {
            console.error(`Error deleting image ${publicId}:`, error);
        }
    }

    // Remove images from review
    const updatedImages = review.images.filter(
        (img) => !imagePublicIds.includes(img.publicId)
    );

    await Review.findByIdAndUpdate(reviewId, {
        images: updatedImages,
        imageCount: updatedImages.length,
    });

    return updatedImages;
};
