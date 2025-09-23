import express from "express";
import authMiddleware from "../middlewares/auth.middleware.js";
import {
    getWishlist,
    addItem,
    removeItem,
    moveToCart,
    validateAddItem,
    validateRemoveItem,
    validateMoveToCart,
} from "../controllers/wishlist.controller.js";
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

router.get("/", getWishlist);
router.post("/", validateAddItem, handleValidation, addItem);
router.delete("/:productId", validateRemoveItem, handleValidation, removeItem);
router.post(
    "/:productId/move-to-cart",
    validateMoveToCart,
    handleValidation,
    moveToCart
);

export default router;
