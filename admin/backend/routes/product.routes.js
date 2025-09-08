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
    getLowStockProducts,
    bulkUpdateStock,
    getProductsByCategoryHierarchy,
    getProductsBySubcategoryController,
} from "../controllers/product.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

// All routes protected by admin auth
router.use(verifyAdminAuth);

// GET /api/products/low-stock - Get low stock products
router.get(
    "/low-stock",
    requirePermission("products.view"),
    getLowStockProducts
);

// PATCH /api/products/bulk-stock - Bulk stock update
router.patch(
    "/bulk-stock",
    requirePermission("products.bulk_update"),
    bulkUpdateStock
);

// Product CRUD operations
router.get("/", requirePermission("products.view"), getAllProducts);
router.post(
    "/",
    requirePermission("products.create"),
    upload.array("images"),
    createProduct
);
router.get("/:id", requirePermission("products.view"), getProductById);
router.put(
    "/:id",
    requirePermission("products.update"),
    upload.array("images"),
    updateProduct
);
router.delete("/:id", requirePermission("products.delete"), deleteProduct);
router.delete(
    "/:id/images",
    requirePermission("products.update"),
    removeProductImage
);
router.patch(
    "/:id/stock",
    requirePermission("products.update"),
    updateProductStock
);
router.patch(
    "/:id/feature",
    requirePermission("products.update"),
    updateProductFeature
);

// Product reviews
router.post(
    "/:id/reviews",
    requirePermission("reviews.moderate"),
    addProductReview
);
router.get(
    "/:id/reviews",
    requirePermission("reviews.view"),
    getProductReviews
);
router.delete(
    "/:id/reviews/:reviewId",
    requirePermission("reviews.delete"),
    deleteProductReview
);

// Product analytics
router.get(
    "/:id/analytics",
    requirePermission("analytics.view"),
    getProductAnalytics
);

// Category hierarchy products
router.get(
    "/category/:categoryId/hierarchy",
    requirePermission("products.view"),
    getProductsByCategoryHierarchy
);

// Subcategory products
router.get(
    "/subcategory/:subcategoryId",
    requirePermission("products.view"),
    getProductsBySubcategoryController
);

export default router;
