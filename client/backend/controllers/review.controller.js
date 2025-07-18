import {
    createReview,
    listReviews,
    getReview,
    updateReview,
    deleteReview,
} from "../services/review.service.js";

export const createProductReview = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId } = req.params;
        const userId = req.user._id;
        const review = await createReview(productId, userId, req.body);
        res.status(201).json(review);
    } catch (err) {
        next(err);
    }
};

export const listProductReviews = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const reviews = await listReviews(productId);
        res.json({ count: reviews.length, reviews });
    } catch (err) {
        next(err);
    }
};

export const getProductReview = async (req, res, next) => {
    try {
        const { productId, reviewId } = req.params;
        const review = await getReview(productId, reviewId);
        if (!review)
            return res.status(404).json({ message: "Review not found" });
        res.json(review);
    } catch (err) {
        next(err);
    }
};

export const updateProductReview = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId, reviewId } = req.params;
        const userId = req.user._id;
        const review = await updateReview(
            productId,
            reviewId,
            userId,
            req.body
        );
        if (!review)
            return res
                .status(404)
                .json({ message: "Review not found or not authorized" });
        res.json(review);
    } catch (err) {
        next(err);
    }
};

export const deleteProductReview = async (req, res, next) => {
    try {
        if (!req.user || !req.user._id) {
            return res.status(401).json({ message: "Authentication required" });
        }
        const { productId, reviewId } = req.params;
        const userId = req.user._id;
        const result = await deleteReview(productId, reviewId, userId);
        if (!result)
            return res
                .status(404)
                .json({ message: "Review not found or not authorized" });
        res.json({ success: true });
    } catch (err) {
        next(err);
    }
};
