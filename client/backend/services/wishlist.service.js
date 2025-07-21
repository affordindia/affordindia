import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

export const getUserWishlist = async (userId) => {
    let wishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { items: [] } },
        { new: true, upsert: true }
    ).populate({
        path: "items",
        select: "name price images stock",
    });
    return wishlist;
};

export const addToWishlist = async (userId, productId) => {
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error();
        error.message = "Product not found";
        error.status = 404;
        throw error;
    }
    let wishlist = await Wishlist.findOneAndUpdate(
        { user: userId },
        { $setOnInsert: { items: [] } },
        { new: true, upsert: true }
    );
    if (!wishlist.items.some((id) => id.toString() === productId)) {
        wishlist.items.push(productId);
        await wishlist.save();
    }
    return await getUserWishlist(userId);
};

export const removeFromWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) {
        const error = new Error();
        error.message = "Wishlist not found";
        error.status = 404;
        throw error;
    }
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter((id) => id.toString() !== productId);
    if (wishlist.items.length === initialLength) {
        const error = new Error();
        error.message = "Product not in wishlist";
        error.status = 400;
        throw error;
    }
    await wishlist.save();
    return await getUserWishlist(userId);
};

export const moveWishlistItemToCart = async (
    userId,
    productId,
    addOrUpdateCartItem
) => {
    // Check product existence and stock
    const product = await Product.findById(productId);
    if (!product) {
        const error = new Error();
        error.message = "Product not found";
        error.status = 404;
        throw error;
    }
    if (product.stock < 1) {
        const error = new Error();
        error.message = "Product is out of stock";
        error.status = 400;
        throw error;
    }
    // Add to cart
    await addOrUpdateCartItem(userId, productId, 1);
    // Remove from wishlist
    return await removeFromWishlist(userId, productId);
};
