import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";
import {
    createProductReview,
    listProductReviews,
    getProductReview,
    updateProductReview,
    deleteProductReview,
    getUserProductReview,
    deleteReviewImagesController,
} from "../controllers/review.controller.js";
import {
    validateCreateReview,
    validateUpdateReview,
    validateImageUpload,
    handleValidationErrors,
} from "../utils/review.validation.js";

const router = express.Router({ mergeParams: true });

// continue from product.routes --> /api/products/:productId/reviews

// Public routes
router.get("/", listProductReviews);
router.get("/:reviewId", getProductReview);

// Protected routes (require authentication)
router.post(
    "/",
    authMiddleware,
    upload.array("images", 5),
    validateImageUpload,
    validateCreateReview,
    handleValidationErrors,
    createProductReview
);
router.get("/user/my-review", authMiddleware, getUserProductReview);
router.put(
    "/:reviewId",
    authMiddleware,
    upload.array("images", 5),
    validateImageUpload,
    validateUpdateReview,
    handleValidationErrors,
    updateProductReview
);
router.delete("/:reviewId", authMiddleware, deleteProductReview);
router.delete(
    "/:reviewId/images",
    authMiddleware,
    deleteReviewImagesController
);

export default router;
