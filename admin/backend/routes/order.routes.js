import express from "express";
import {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} from "../controllers/order.controller.js";
import adminAuth from "../middlewares/auth.middleware.js";

const router = express.Router();

router.get("/", adminAuth, getAllOrders);
router.get("/:id", getOrderById);
router.patch("/:id", adminAuth, updateOrder);
router.delete("/:id", adminAuth, deleteOrder);

export default router;
