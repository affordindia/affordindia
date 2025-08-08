import express from "express";
import { getDashboardStats } from "../controllers/dashboard.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all dashboard routes
router.use(authMiddleware);

// GET /api/dashboard/stats - Get dashboard statistics
router.get("/stats", getDashboardStats);

export default router;
