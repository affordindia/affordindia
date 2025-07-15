import express from "express";
import { getAllBanners } from "../controllers/banner.controller.js";

const router = express.Router();

router.get("/", getAllBanners);

export default router;
