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
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAdminAuth);

// GET /api/coupons/templates - Get available coupon templates
router.get("/templates", requirePermission("coupons.view"), getCouponTemplates);

// POST /api/coupons/from-template - Create coupon from template
router.post(
    "/from-template",
    requirePermission("coupons.create"),
    createCouponFromTemplateController
);

// GET /api/coupons - Get all coupons
router.get("/", requirePermission("coupons.view"), getAllCoupons);

// POST /api/coupons - Create new coupon
router.post("/", requirePermission("coupons.create"), createCoupon);

// GET /api/coupons/:id/stats - Get coupon statistics
router.get("/:id/stats", requirePermission("coupons.view"), getCouponStats);

// GET /api/coupons/:id - Get single coupon
router.get("/:id", requirePermission("coupons.view"), getCoupon);

// PUT /api/coupons/:id - Update coupon
router.put("/:id", requirePermission("coupons.update"), updateCoupon);

// DELETE /api/coupons/:id - Delete coupon
router.delete("/:id", requirePermission("coupons.delete"), deleteCoupon);

// PATCH /api/coupons/:id/toggle-status - Toggle coupon active status
router.patch(
    "/:id/toggle-status",
    requirePermission("coupons.update"),
    toggleCouponStatus
);

export default router;
