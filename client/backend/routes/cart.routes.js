import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    getCart,
    addOrUpdateItem,
    removeItem,
    clear,
    mergeCart,
    validateAddOrUpdateItem,
    validateRemoveItem,
    validateMergeCart,
} from "../controllers/cart.controller.js";
import { validationResult } from "express-validator";

const router = express.Router();

// All routes require authentication
router.use(authMiddleware);

// Validation error handler middleware
const handleValidation = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

router.get("/", getCart);
router.post("/", validateAddOrUpdateItem, handleValidation, addOrUpdateItem);
router.delete("/clear", clear);
router.delete("/:itemId", validateRemoveItem, handleValidation, removeItem);
router.post("/merge", validateMergeCart, handleValidation, mergeCart);

export default router;
