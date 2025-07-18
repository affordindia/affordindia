import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

export const getUserCart = async (userId) => {
    let cart = await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name price images stock",
    });
    if (!cart) {
        cart = await Cart.create({ user: userId, items: [] });
    }
    // Map items to include current product price
    const itemsWithCurrentPrice = cart.items.map((item) => {
        const product = item.product;
        return {
            _id: item._id,
            product: product._id,
            name: product.name,
            images: product.images,
            stock: product.stock,
            quantity: item.quantity,
            priceAtAdd: item.priceAtAdd,
            currentPrice: product.price,
        };
    });
    return {
        _id: cart._id,
        user: cart.user,
        items: itemsWithCurrentPrice,
        updatedAt: cart.updatedAt,
        createdAt: cart.createdAt,
    };
};

export const addOrUpdateCartItem = async (userId, productId, quantity) => {
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    if (product.stock < quantity) {
        throw new Error("Insufficient stock for the requested quantity");
    }
    let cart = await Cart.findOne({ user: userId });
    if (!cart) {
        cart = new Cart({ user: userId, items: [] });
    }
    const itemIndex = cart.items.findIndex(
        (item) => item.product.toString() === productId
    );
    if (itemIndex > -1) {
        cart.items[itemIndex].quantity = quantity;
        cart.items[itemIndex].priceAtAdd = product.price;
    } else {
        cart.items.push({
            product: productId,
            quantity,
            priceAtAdd: product.price,
        });
    }
    await cart.save();
    // Repopulate cart to return with current product details
    return await getUserCart(userId);
};

export const removeCartItem = async (userId, itemId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    const initialLength = cart.items.length;
    cart.items = cart.items.filter((item) => item._id.toString() !== itemId);
    if (cart.items.length === initialLength) {
        throw new Error("Cart item not found");
    }
    await cart.save();
    return await getUserCart(userId);
};

export const clearCart = async (userId) => {
    const cart = await Cart.findOne({ user: userId });
    if (!cart) throw new Error("Cart not found");
    cart.items = [];
    await cart.save();
    return await getUserCart(userId);
};

export const mergeGuestCart = async (userId, guestItems) => {
    let cart = await Cart.findOne({ user: userId });
    if (!cart) cart = new Cart({ user: userId, items: [] });
    for (const guestItem of guestItems) {
        const product = await Product.findById(guestItem.product);
        if (!product) continue;
        const itemIndex = cart.items.findIndex(
            (item) => item.product.toString() === guestItem.product
        );
        const quantity = Math.min(
            (cart.items[itemIndex]?.quantity || 0) + guestItem.quantity,
            product.stock
        );
        if (itemIndex > -1) {
            cart.items[itemIndex].quantity = quantity;
            cart.items[itemIndex].priceAtAdd = product.price;
        } else {
            cart.items.push({
                product: guestItem.product,
                quantity,
                priceAtAdd: product.price,
            });
        }
    }
    await cart.save();
    return await getUserCart(userId);
};
