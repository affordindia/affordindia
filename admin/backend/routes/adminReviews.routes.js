import express from "express";
import {
    getAllReviews,
    getReviewById,
    toggleReviewVisibility,
    deleteReview,
    bulkReviewOperations,
    getReviewStats,
} from "../controllers/review.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all review management routes
router.use(authMiddleware);

// GET /api/reviews - Get all reviews with filtering and pagination
router.get("/", getAllReviews);

// GET /api/reviews/stats - Get review statistics
router.get("/stats", getReviewStats);

// GET /api/reviews/:reviewId - Get specific review by ID
router.get("/:reviewId", getReviewById);

// PATCH /api/reviews/:reviewId/toggle - Toggle review visibility
router.patch("/:reviewId/toggle", toggleReviewVisibility);

// DELETE /api/reviews/:reviewId - Delete review
router.delete("/:reviewId", deleteReview);

// POST /api/reviews/bulk - Bulk operations on reviews
router.post("/bulk", bulkReviewOperations);

export default router;
