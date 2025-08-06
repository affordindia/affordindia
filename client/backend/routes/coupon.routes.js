import express from "express";
import {
    validateCoupon,
    getAvailableCoupons,
    applyCouponToCart,
    removeCouponFromCart,
} from "../controllers/coupon.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// POST /api/coupons/validate - Validate coupon (check if it can be applied)
router.post("/validate", validateCoupon);

// GET /api/coupons/available - Get available coupons for user
router.get("/available", getAvailableCoupons);

// POST /api/coupons/apply - Apply coupon to cart
router.post("/apply", applyCouponToCart);

// DELETE /api/coupons/remove - Remove coupon from cart
router.delete("/remove", removeCouponFromCart);

export default router;
