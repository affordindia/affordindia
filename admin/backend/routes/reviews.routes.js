import express from "express";
import {
    getAllReviews,
    getReviewById,
    toggleReviewVisibility,
    deleteReview,
    bulkReviewOperations,
    getReviewStats,
} from "../controllers/review.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Protect all review management routes
router.use(verifyAdminAuth);

// GET /api/reviews - Get all reviews with filtering and pagination
router.get("/", requirePermission("reviews.view"), getAllReviews);

// GET /api/reviews/stats - Get review statistics
router.get("/stats", requirePermission("reviews.view"), getReviewStats);

// GET /api/reviews/:reviewId - Get specific review by ID
router.get("/:reviewId", requirePermission("reviews.view"), getReviewById);

// PATCH /api/reviews/:reviewId/toggle - Toggle review visibility
router.patch(
    "/:reviewId/toggle",
    requirePermission("reviews.moderate"),
    toggleReviewVisibility
);

// DELETE /api/reviews/:reviewId - Delete review
router.delete("/:reviewId", requirePermission("reviews.delete"), deleteReview);

// POST /api/reviews/bulk - Bulk operations on reviews
router.post(
    "/bulk",
    requirePermission("reviews.moderate"),
    bulkReviewOperations
);

export default router;
