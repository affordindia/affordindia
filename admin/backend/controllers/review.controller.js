import {
    getAllReviewsService,
    getReviewByIdService,
    toggleReviewVisibilityService,
    deleteReviewService,
    bulkReviewOperationsService,
    getReviewStatsService,
} from "../services/review.service.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";

// Get all reviews across all products (admin view)
export const getAllReviews = async (req, res) => {
    try {
        // Support search/filter/pagination via query params
        const filter = {
            search: req.query.search?.trim(),
            searchMode: req.query.searchMode, // reviewId, productId, userId, text, product
            rating: req.query.rating,
            minRating: req.query.minRating,
            maxRating: req.query.maxRating,
            isVisible: req.query.isVisible,
        };

        const options = {
            skip: req.query.skip ? parseInt(req.query.skip) : DEFAULT_SKIP,
            limit: req.query.limit ? parseInt(req.query.limit) : DEFAULT_LIMIT,
            page: req.query.page ? parseInt(req.query.page) : 1,
            sortBy: req.query.sortBy || "createdAt",
            sortOrder: req.query.sortOrder || "desc",
        };

        const result = await getAllReviewsService(filter, options);

        res.json(result);
    } catch (error) {
        console.error("getAllReviews error:", error);
        res.status(500).json({
            message: "Failed to fetch reviews",
            error: error.message,
        });
    }
};

// Get review by ID with full details
export const getReviewById = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await getReviewByIdService(reviewId);
        res.json(review);
    } catch (error) {
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            message:
                error.message === "Review not found"
                    ? "Review not found"
                    : "Failed to fetch review",
            error: error.message,
        });
    }
};

// Toggle review visibility (hide/show)
export const toggleReviewVisibility = async (req, res) => {
    try {
        const { reviewId } = req.params;
        const review = await toggleReviewVisibilityService(reviewId);
        res.json({
            message: `Review ${
                review.isVisible ? "shown" : "hidden"
            } successfully`,
            review: {
                id: review._id,
                isVisible: review.isVisible,
            },
        });
    } catch (error) {
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            message:
                error.message === "Review not found"
                    ? "Review not found"
                    : "Failed to toggle review visibility",
            error: error.message,
        });
    }
};

// Delete review (admin only)
export const deleteReview = async (req, res) => {
    try {
        const { reviewId } = req.params;
        await deleteReviewService(reviewId);
        res.json({
            message: "Review deleted successfully",
        });
    } catch (error) {
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            message:
                error.message === "Review not found"
                    ? "Review not found"
                    : "Failed to delete review",
            error: error.message,
        });
    }
};

// Bulk operations on reviews
export const bulkReviewOperations = async (req, res) => {
    try {
        const { action, reviewIds } = req.body;

        if (!Array.isArray(reviewIds) || reviewIds.length === 0) {
            return res.status(400).json({
                message: "Please provide valid review IDs",
            });
        }

        const result = await bulkReviewOperationsService(action, reviewIds);
        res.json({
            message: result.message,
            result: result.result,
        });
    } catch (error) {
        const statusCode = error.message.includes("Invalid action") ? 400 : 500;
        res.status(statusCode).json({
            message: "Failed to perform bulk operation",
            error: error.message,
        });
    }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
    try {
        const stats = await getReviewStatsService();
        res.json(stats);
    } catch (error) {
        res.status(500).json({
            message: "Failed to fetch review statistics",
            error: error.message,
        });
    }
};
