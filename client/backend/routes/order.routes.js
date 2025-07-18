import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    createOrder,
    listOrders,
    getOrder,
    cancel,
    returnOrderCtrl,
    validateCreateOrder,
    validateOrderId,
} from "../controllers/order.controller.js";
import { validationResult } from "express-validator";

const router = express.Router();

router.use(authMiddleware);

const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.post("/", validateCreateOrder, handleValidation, createOrder);
router.get("/", listOrders);
router.get("/:orderId", validateOrderId, handleValidation, getOrder);
router.put("/:orderId/cancel", validateOrderId, handleValidation, cancel);
router.put(
    "/:orderId/return",
    validateOrderId,
    handleValidation,
    returnOrderCtrl
);

export default router;
