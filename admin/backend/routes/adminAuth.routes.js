import express from "express";
import {
    adminLogin,
    adminRegister,
    refreshToken,
    adminLogout,
    getProfile,
    updateProfile,
    getAdminPermissions,
    getAllPermissions,
    getAllRBACConfig,
} from "../controllers/adminAuth.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Public routes
router.post("/login", adminLogin);
router.post("/refresh", refreshToken);

// Protected routes - require authentication
router.use(verifyAdminAuth);

router.post("/register", requirePermission("admins.create"), adminRegister);
router.post("/logout", adminLogout);
router.get("/profile", getProfile);
router.put("/profile", updateProfile);
router.get("/permissions", getAdminPermissions);
router.get(
    "/permissions/all",
    requirePermission("admins.manage_permissions"),
    getAllPermissions
);
router.get("/rbac-config", getAllRBACConfig);

export default router;
