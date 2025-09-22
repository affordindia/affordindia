import express from "express";
import {
    getAllBanners,
    getBannersByIds,
} from "../controllers/banner.controller.js";

const router = express.Router();

router.get("/", getAllBanners);
router.post("/bulk", getBannersByIds);

export default router;
