import express from "express";
import {
    createBanner,
    getAllBanners,
    getBannerById,
    updateBanner,
    deleteBanner,
    toggleBannerStatus,
} from "../controllers/banner.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";
import upload from "../middlewares/upload.middleware.js";

const router = express.Router();

router.use(adminAuth);

router.post("/", upload.single("image"), createBanner);
router.get("/", getAllBanners);
router.get("/:id", getBannerById);
router.put("/:id", upload.single("image"), updateBanner);
router.delete("/:id", deleteBanner);
router.patch("/:id/toggle-status", toggleBannerStatus);

export default router;
