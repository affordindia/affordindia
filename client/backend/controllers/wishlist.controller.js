import {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
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
        // Add to cart
        await addOrUpdateCartItem(req.user._id, productId, 1);
        // Remove from wishlist
        const wishlist = await removeFromWishlist(req.user._id, productId);
        res.json(wishlist);
    } catch (err) {
        next(err);
    }
};

export const getWishlist = async (req, res, next) => {
    try {
        const { category, brand, minPrice, maxPrice, search } = req.query;
        let wishlist = await getUserWishlist(req.user._id);
        // Filter populated products if filters are provided
        if (
            wishlist &&
            wishlist.items &&
            wishlist.items.length > 0 &&
            (category || brand || minPrice || maxPrice || search)
        ) {
            wishlist.items = wishlist.items.filter((product) => {
                let match = true;
                if (
                    category &&
                    product.category &&
                    product.category.toString() !== category
                )
                    match = false;
                if (
                    brand &&
                    product.brand &&
                    product.brand.toString() !== brand
                )
                    match = false;
                if (minPrice && product.price < Number(minPrice)) match = false;
                if (maxPrice && product.price > Number(maxPrice)) match = false;
                if (
                    search &&
                    !product.name.toLowerCase().includes(search.toLowerCase())
                )
                    match = false;
                return match;
            });
        }
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
