import {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    moveWishlistItemToCart,
} from "../services/wishlist.service.js";
import { addOrUpdateCartItem } from "../services/cart.service.js";
import { body, param, query } from "express-validator";

export const addItem = async (req, res, next) => {
    try {
        const { productId } = req.body;
        const wishlist = await addToWishlist(req.user._id, productId);
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const removeItem = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const wishlist = await removeFromWishlist(req.user._id, productId);
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const moveToCart = async (req, res, next) => {
    try {
        const { productId } = req.params;
        const wishlist = await moveWishlistItemToCart(
            req.user._id,
            productId,
            addOrUpdateCartItem
        );
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const getWishlist = async (req, res, next) => {
    try {
        const wishlist = await getUserWishlist(req.user._id);
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const validateAddItem = [
    body("productId").isMongoId().withMessage("Invalid productId"),
];

export const validateRemoveItem = [
    param("productId").isMongoId().withMessage("Invalid productId"),
];

export const validateMoveToCart = [
    param("productId").isMongoId().withMessage("Invalid productId"),
];
