import express from "express";
import {
    getProfile,
    updateProfile,
    getAddresses,
    addAddress,
    updateAddress,
    deleteAddress,
    setDefaultAddress,
} from "../controllers/profile.controller.js";
import authMiddleware from "../middlewares/auth.middleware.js";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Profile info
router.get("/", getProfile);
router.put("/", updateProfile);

// Address management
router.get("/addresses", getAddresses);
router.post("/addresses", addAddress);
router.put("/addresses/:addressId", updateAddress);
router.delete("/addresses/:addressId", deleteAddress);
router.post("/addresses/:addressId/default", setDefaultAddress);

export default router;
