import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import {
    verifyAdminAuth,
    requireAccessLevel,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Protect all dashboard routes
router.use(verifyAdminAuth);

// GET /api/dashboard/stats - Get dashboard statistics (level 1+ access)
router.get("/stats", requireAccessLevel(1), getDashboardStats);

export default router;
