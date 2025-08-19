import express from "express";
import {
    getAllOrders,
    getOrderById,
    updateOrder,
    deleteOrder,
} from "../controllers/order.controller.js";
import {
    verifyAdminAuth,
    requirePermission,
} from "../middlewares/adminAuth.middleware.js";

const router = express.Router();

// Order management operations
router.get(
    "/",
    verifyAdminAuth,
    requirePermission("orders.view"),
    getAllOrders
);
router.get(
    "/:id",
    verifyAdminAuth,
    requirePermission("orders.view"),
    getOrderById
);
router.patch(
    "/:id",
    verifyAdminAuth,
    requirePermission("orders.update"),
    updateOrder
);
router.delete(
    "/:id",
    verifyAdminAuth,
    requirePermission("orders.cancel"),
    deleteOrder
);

export default router;
