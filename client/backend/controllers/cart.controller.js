import {
    getUserCart,
    addOrUpdateCartItem,
    removeCartItem,
    clearCart,
    mergeGuestCart,
} from "../services/cart.service.js";
import { body, param } from "express-validator";

export const getCart = async (req, res, next) => {
    try {
        const cart = await getUserCart(req.user._id, false); // Don't recalculate coupons on GET
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const addOrUpdateItem = async (req, res, next) => {
    try {
        const { productId, quantity } = req.body;

        if (!productId || quantity === undefined || quantity === null) {
            return res.status(400).json({
                error: "Product ID and quantity are required",
            });
        }

        const cart = await addOrUpdateCartItem(
            req.user._id,
            productId,
            quantity
        );
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const { itemId } = req.params;
        const cart = await removeCartItem(req.user._id, itemId);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const clear = async (req, res, next) => {
    try {
        const cart = await clearCart(req.user._id);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const mergeCart = async (req, res, next) => {
    try {
        const { items } = req.body; // guest cart items

        if (!items || !Array.isArray(items)) {
            return res.status(400).json({
                error: "Items array is required",
            });
        }

        const cart = await mergeGuestCart(req.user._id, items);
        res.json(cart);
    } catch (err) {
        next(err);
    }
};

export const validateAddOrUpdateItem = [
    body("productId").isMongoId().withMessage("Invalid productId"),
    body("quantity")
        .isInt({ min: 0 })
        .withMessage("Quantity must be 0 or greater"),
];

export const validateRemoveItem = [
    param("itemId").isMongoId().withMessage("Invalid cart itemId"),
];

export const validateMergeCart = [
    body("items").isArray().withMessage("Items must be an array"),
    body("items.*.product")
        .isMongoId()
        .withMessage("Invalid productId in items"),
    body("items.*.quantity")
        .isInt({ min: 1 })
        .withMessage("Quantity in items must be at least 1"),
];
