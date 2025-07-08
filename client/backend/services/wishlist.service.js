import Wishlist from "../models/wishlist.model.js";
import Product from "../models/product.model.js";

export const getUserWishlist = async (userId) => {
    let wishlist = await Wishlist.findOne({ user: userId }).populate({
        path: "items",
        select: "name price images stock",
    });
    if (!wishlist) {
        wishlist = await Wishlist.create({ user: userId, items: [] });
    }
    return wishlist;
};

export const addToWishlist = async (userId, productId) => {
    const product = await Product.findById(productId);
    if (!product) throw new Error("Product not found");
    let wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) wishlist = new Wishlist({ user: userId, items: [] });
    if (!wishlist.items.some((id) => id.toString() === productId)) {
        wishlist.items.push(productId);
        await wishlist.save();
    }
    return await getUserWishlist(userId);
};

export const removeFromWishlist = async (userId, productId) => {
    const wishlist = await Wishlist.findOne({ user: userId });
    if (!wishlist) throw new Error("Wishlist not found");
    const initialLength = wishlist.items.length;
    wishlist.items = wishlist.items.filter((id) => id.toString() !== productId);
    if (wishlist.items.length === initialLength) {
        throw new Error("Product not in wishlist");
    }
    await wishlist.save();
    return await getUserWishlist(userId);
};
