import express from "express";
import {
    listProducts,
    getProduct,
    featuredProducts,
    newProducts,
    popularProducts,
    relatedProducts,
} from "../controllers/product.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";
import reviewRoutes from "./review.routes.js";

const router = express.Router();

// Public product routes
router.get("/", listProducts);
router.get("/featured", featuredProducts);
router.get("/new", newProducts);
router.get("/popular", popularProducts);
router.get("/:id/related", relatedProducts);
router.get("/:id", getProduct);

// Mount review routes under products (all review routes already protect necessary actions)
router.use("/:productId/reviews", reviewRoutes);

// Example: If you add product wishlist, cart, or order actions that require auth, protect like this:
// router.post("/:id/wishlist", auth, ...);
// router.post("/:id/cart", auth, ...);

export default router;
