import express from "express";
import {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} from "../controllers/order.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

// Get all orders (admin)
router.get("/", adminAuth, getAllOrders);

// Get order by ID
router.get("/:id", getOrderById);

// Update order (status, etc.)
router.patch("/:id", adminAuth, updateOrder);

// Delete order (admin)
router.delete("/:id", adminAuth, deleteOrder);

export default router;
