import express from "express";
import {
    getAllAdmins,
    getAdminById,
    updateAdmin,
    deleteAdmin,
    toggleAdminStatus,
} from "../controllers/adminAuth.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(verifyAdminAuth);

// Admin management routes with specific permissions
router.get("/", requirePermission("admins.view"), getAllAdmins);
router.get("/:id", requirePermission("admins.view"), getAdminById);
router.put("/:id", requirePermission("admins.update"), updateAdmin);
router.delete("/:id", requirePermission("admins.delete"), deleteAdmin);
router.patch(
    "/:id/status",
    requirePermission("admins.update"),
    toggleAdminStatus
);

export default router;
