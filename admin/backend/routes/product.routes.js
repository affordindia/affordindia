import express from "express";
import {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct,
    removeProductImage,
    updateProductStock,
    updateProductFeature,
    addProductReview,
    getProductReviews,
    deleteProductReview,
    getProductAnalytics,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// All routes protected by admin auth
router.use(authMiddleware);

router.get("/", getAllProducts);
router.post("/", upload.array("images"), createProduct);
router.get("/:id", getProductById);
router.put("/:id", upload.array("images"), updateProduct);
router.delete("/:id", deleteProduct);
router.delete("/:id/images", removeProductImage);
router.patch("/:id/stock", updateProductStock);
router.patch("/:id/feature", updateProductFeature);
router.post("/:id/reviews", addProductReview);
router.get("/:id/reviews", getProductReviews);
router.delete("/:id/reviews/:reviewId", deleteProductReview);
router.get("/:id/analytics", getProductAnalytics);

export default router;
