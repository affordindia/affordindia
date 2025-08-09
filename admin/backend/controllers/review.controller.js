import {
    getAllReviewsService,
    getReviewByIdService,
    toggleReviewVisibilityService,
    deleteReviewService,
    bulkReviewOperationsService,
    getReviewStatsService,
} from "../services/adminReview.service.js";
import { DEFAULT_SKIP, DEFAULT_LIMIT } from "../config/pagination.config.js";

// Get all reviews across all products (admin view)
export const getAllReviews = async (req, res) => {
    try {
        const {
            page = 1,
            limit = DEFAULT_LIMIT,
            rating,
            product,
            user,
            isVisible,
            sortBy = "createdAt",
            sortOrder = "desc",
        } = req.query;

        const skip = (page - 1) * limit;

        // Build filter object
        const filter = {};
        if (rating) filter.rating = rating;
        if (product) filter.product = product;
        if (user) filter.user = user;
        if (isVisible !== undefined) filter.isVisible = isVisible === "true";

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === "asc" ? 1 : -1;

        // Options object for service
        const options = {
            skip,
            limit: parseInt(limit),
            sort,
        };

        const result = await getAllReviewsService(filter, options);

        res.json({
            success: true,
            ...result,
        });
    } catch (error) {
        console.error("Get all reviews error:", error);
        res.status(500).json({
            success: false,
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

        res.json({
            success: true,
            review,
        });
    } catch (error) {
        console.error("Get review by ID error:", error);
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
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
            success: true,
            message: `Review ${
                review.isVisible ? "shown" : "hidden"
            } successfully`,
            review: {
                id: review._id,
                isVisible: review.isVisible,
            },
        });
    } catch (error) {
        console.error("Toggle review visibility error:", error);
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
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
            success: true,
            message: "Review deleted successfully",
        });
    } catch (error) {
        console.error("Delete review error:", error);
        const statusCode = error.message === "Review not found" ? 404 : 500;
        res.status(statusCode).json({
            success: false,
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
                success: false,
                message: "Please provide valid review IDs",
            });
        }

        const result = await bulkReviewOperationsService(action, reviewIds);

        res.json({
            success: true,
            message: result.message,
            result: result.result,
        });
    } catch (error) {
        console.error("Bulk review operations error:", error);
        const statusCode = error.message.includes("Invalid action") ? 400 : 500;
        res.status(statusCode).json({
            success: false,
            message: "Failed to perform bulk operation",
            error: error.message,
        });
    }
};

// Get review statistics
export const getReviewStats = async (req, res) => {
    try {
        const stats = await getReviewStatsService();

        res.json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("Get review stats error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch review statistics",
            error: error.message,
        });
    }
};
