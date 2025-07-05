import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createProductReview,
    listProductReviews,
    getProductReview,
    updateProductReview,
    deleteProductReview,
} from "../controllers/review.controller.js";

const router = express.Router({ mergeParams: true });

// continue from product.routes --> /api/products/:productId/reviews
router.get("/", listProductReviews);
router.post("/", authMiddleware, createProductReview);
router.get("/:reviewId", getProductReview);
router.put("/:reviewId", authMiddleware, updateProductReview);
router.delete("/:reviewId", authMiddleware, deleteProductReview);

export default router;
