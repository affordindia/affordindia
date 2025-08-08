import express from "express";
import {
    getSiteConfig,
    updateSiteConfig,
    getConfigSection,
    updateConfigSection,
    resetConfig,
} from "../controllers/config.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// Protect all config routes
router.use(authMiddleware);

// GET /api/config - Get all site configuration
router.get("/", getSiteConfig);

// PUT /api/config - Update all site configuration
router.put("/", updateSiteConfig);

// GET /api/config/:section - Get specific configuration section
router.get("/:section", getConfigSection);

// PUT /api/config/:section - Update specific configuration section
router.put("/:section", updateConfigSection);

// POST /api/config/reset - Reset configuration to defaults
router.post("/reset", resetConfig);

export default router;
