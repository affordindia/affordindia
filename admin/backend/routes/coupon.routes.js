import express from "express";
import {
    createCoupon,
    getAllCoupons,
    getCoupon,
    updateCoupon,
    deleteCoupon,
    toggleCouponStatus,
    getCouponStats,
    getCouponTemplates,
    createCouponFromTemplateController,
} from "../controllers/coupon.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// GET /api/coupons/templates - Get available coupon templates
router.get("/templates", getCouponTemplates);

// POST /api/coupons/from-template - Create coupon from template
router.post("/from-template", createCouponFromTemplateController);

// GET /api/coupons - Get all coupons
router.get("/", getAllCoupons);

// POST /api/coupons - Create new coupon
router.post("/", createCoupon);

// GET /api/coupons/:id/stats - Get coupon statistics
router.get("/:id/stats", getCouponStats);

// GET /api/coupons/:id - Get single coupon
router.get("/:id", getCoupon);

// PUT /api/coupons/:id - Update coupon
router.put("/:id", updateCoupon);

// DELETE /api/coupons/:id - Delete coupon
router.delete("/:id", deleteCoupon);

// PATCH /api/coupons/:id/toggle-status - Toggle coupon active status
router.patch("/:id/toggle-status", toggleCouponStatus);

export default router;
