import express from "express";
import {
    getAllUsers,
    getUserById,
    blockUser,
    unblockUser,
    deleteUser,
    getUserStats,
} from "../controllers/user.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.use(adminAuth);

// GET /api/users - Get all users with filtering and pagination
router.get("/", getAllUsers);

// GET /api/users/stats - Get user statistics
router.get("/stats", getUserStats);

// GET /api/users/:id - Get specific user by ID with extended info
router.get("/:id", getUserById);

// PATCH /api/users/:id/block - Block user
router.patch("/:id/block", blockUser);

// PATCH /api/users/:id/unblock - Unblock user
router.patch("/:id/unblock", unblockUser);

// DELETE /api/users/:id - Delete user (soft delete by default)
router.delete("/:id", deleteUser);

export default router;
