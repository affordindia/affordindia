import express from "express";
import { verifyPhoneAuth, refreshToken, getCurrentUser } from "../controllers/auth.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// POST /api/auth/phone - Verify Firebase token and authenticate user
router.post("/phone", verifyPhoneAuth);

// POST /api/auth/refresh - Refresh JWT token
router.post("/refresh", refreshToken);

// GET /api/auth/me - Get current user info (protected route)
router.get("/me", authMiddleware, getCurrentUser);

export default router;
