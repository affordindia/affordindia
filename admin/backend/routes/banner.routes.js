import express from "express";
import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
} from "../controllers/banner.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(verifyAdminAuth);

// Banner management operations
router.post(
    "/",
    requirePermission("banners.create"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "mobileImage", maxCount: 1 },
    ]),
    createBanner
);
router.get("/", requirePermission("banners.view"), getAllBanners);
router.get("/:id", requirePermission("banners.view"), getBannerById);
router.put(
    "/:id",
    requirePermission("banners.update"),
    upload.fields([
        { name: "image", maxCount: 1 },
        { name: "mobileImage", maxCount: 1 },
    ]),
    updateBanner
);
router.delete("/:id", requirePermission("banners.delete"), deleteBanner);
router.patch(
    "/:id/toggle-status",
    requirePermission("banners.update"),
    toggleBannerStatus
);

export default router;
