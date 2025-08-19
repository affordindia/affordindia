import express from "express";
import {
    getSiteConfig,
    updateSiteConfig,
    getConfigSection,
    updateConfigSection,
    resetConfig,
} from "../controllers/config.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Protect all config routes
router.use(verifyAdminAuth);

// GET /api/config - Get all site configuration
router.get("/", requirePermission("config.view"), getSiteConfig);

// PUT /api/config - Update all site configuration
router.put("/", requirePermission("config.update"), updateSiteConfig);

// GET /api/config/:section - Get specific configuration section
router.get("/:section", requirePermission("config.view"), getConfigSection);

// PUT /api/config/:section - Update specific configuration section
router.put(
    "/:section",
    requirePermission("config.update"),
    updateConfigSection
);

// POST /api/config/reset - Reset configuration to defaults
router.post("/reset", requirePermission("config.update"), resetConfig);

export default router;
