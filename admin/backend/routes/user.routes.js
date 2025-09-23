import express from "express";
import {
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    deleteUser,
    getUserStats,
} from "../controllers/user.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

router.use(verifyAdminAuth);

// GET /api/users - Get all users with filtering and pagination
router.get("/", requirePermission("users.view"), getAllUsers);

// GET /api/users/stats - Get user statistics
router.get("/stats", requirePermission("users.view"), getUserStats);

// GET /api/users/:id - Get specific user by ID with extended info
router.get("/:id", requirePermission("users.view"), getUserById);

// PATCH /api/users/:id/block - Block user
router.patch("/:id/block", requirePermission("users.block"), blockUser);

// PATCH /api/users/:id/unblock - Unblock user
router.patch("/:id/unblock", requirePermission("users.block"), unblockUser);

// DELETE /api/users/:id - Delete user (soft delete by default)
router.delete("/:id", requirePermission("users.delete"), deleteUser);

export default router;
