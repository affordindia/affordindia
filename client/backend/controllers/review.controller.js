import {
    createReview,
    listReviews,
    getReview,
    updateReview,
    deleteReview,
    getUserReviewForProduct,
    deleteReviewImages,
} from "../services/review.service.js";

export const createProductReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const files = req.files || [];
        
        const review = await createReview(productId, req.user._id, req.body, files);

        res.status(201).json({
            success: true,
            message: "Review created successfully",
            review,
        });
    } catch (err) {
        next(err);
    }
};

export const listProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const result = await listReviews(productId);

        res.json({
            success: true,
            ...result,
        });
    } catch (err) {
        next(err);
    }
};

export const getProductReview = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params;
        const review = await getReview(productId, reviewId);

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found",
            });
        }

        res.json({
            success: true,
            review,
        });
    } catch (err) {
        next(err);
    }
};

export const updateProductReview = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params;
        const files = req.files || [];
        
        const review = await updateReview(
            productId,
            reviewId,
            req.user._id,
            req.body,
            files
        );

        if (!review) {
            return res.status(404).json({
                success: false,
                message: "Review not found or not authorized",
            });
        }

        res.json({
            success: true,
            message: "Review updated successfully",
            review,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteProductReview = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params;
        const result = await deleteReview(productId, reviewId, req.user._id);

        if (!result) {
            return res.status(404).json({
                success: false,
                message: "Review not found or not authorized",
            });
        }

        res.json({
            success: true,
            message: "Review deleted successfully",
        });
    } catch (err) {
        next(err);
    }
};

export const getUserProductReview = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const review = await getUserReviewForProduct(productId, req.user._id);

        res.json({
            success: true,
            review: review || null,
            hasReviewed: !!review,
        });
    } catch (err) {
        next(err);
    }
};

export const deleteReviewImagesController = async (req, res, next) => {
    try {
        const { reviewId } = req.params;
        const { imagePublicIds } = req.body;

        if (!imagePublicIds || !Array.isArray(imagePublicIds)) {
            return res.status(400).json({
                success: false,
                message: "imagePublicIds array is required"
            });
        }

        const updatedImages = await deleteReviewImages(reviewId, req.user._id, imagePublicIds);

        res.json({
            success: true,
            message: "Images deleted successfully",
            images: updatedImages
        });
    } catch (err) {
        next(err);
    }
};
