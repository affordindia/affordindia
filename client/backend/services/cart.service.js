import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";

// Helper function to transform cart items for frontend
const transformCartItems = (items) => {
    return items.map((item) => ({
        _id: item._id,
        product: {
            _id: item.product._id,
            name: item.product.name,
            images: item.product.images,
            stock: item.product.stock,
            price: item.product.price,
        },
        quantity: item.quantity,
        priceAtAdd: item.priceAtAdd,
        currentPrice: item.product.price,
    }));
};

export const getUserCart = async (userId) => {
    try {
        let cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { user: userId, items: [] } },
            { upsert: true, new: true }
        ).populate({
            path: "items.product",
            select: "name price images stock",
        });

        return {
            _id: cart._id,
            user: cart.user,
            items: transformCartItems(cart.items),
            updatedAt: cart.updatedAt,
            createdAt: cart.createdAt,
        };
    } catch (error) {
        console.error("Error in getUserCart:", error);
        throw new Error("Failed to get user cart");
    }
};

export const addOrUpdateCartItem = async (userId, productId, quantity) => {
    try {
        const product = await Product.findById(productId);
        if (!product) {
            throw new Error("Product not found");
        }
        if (product.stock < quantity) {
            throw new Error("Insufficient stock for the requested quantity");
        }

        // Try to update existing item first
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId, "items.product": productId },
            {
                $set: {
                    "items.$.quantity": quantity,
                    "items.$.priceAtAdd": product.price,
                },
            },
            { new: true }
        );

        // If no existing item found, add new item
        if (!updatedCart) {
            await Cart.findOneAndUpdate(
                { user: userId },
                {
                    $push: {
                        items: {
                            product: productId,
                            quantity,
                            priceAtAdd: product.price,
                        },
                    },
                    $setOnInsert: { user: userId },
                },
                { upsert: true }
            );
        }

        return await getUserCart(userId);
    } catch (error) {
        console.error("Error in addOrUpdateCartItem:", error);
        throw error;
    }
};

export const removeCartItem = async (userId, itemId) => {
    try {
        const result = await Cart.findOneAndUpdate(
            { user: userId },
            { $pull: { items: { _id: itemId } } },
            { new: true }
        );

        if (!result) {
            throw new Error("Cart not found");
        }

        return await getUserCart(userId);
    } catch (error) {
        console.error("Error in removeCartItem:", error);
        throw error;
    }
};

export const clearCart = async (userId) => {
    try {
        await Cart.findOneAndUpdate({ user: userId }, { $set: { items: [] } });

        return await getUserCart(userId);
    } catch (error) {
        console.error("Error in clearCart:", error);
        throw error;
    }
};

export const mergeGuestCart = async (userId, guestItems) => {
    try {
        if (!guestItems || !Array.isArray(guestItems)) {
            throw new Error("Invalid guest items");
        }

        // Ensure cart exists
        await Cart.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { user: userId, items: [] } },
            { upsert: true }
        );

        for (const guestItem of guestItems) {
            if (!guestItem.product || !guestItem.quantity) {
                continue; // Skip invalid items
            }

            const product = await Product.findById(guestItem.product);
            if (!product) {
                continue; // Skip items with invalid products
            }

            // Try to update existing item
            const updated = await Cart.findOneAndUpdate(
                { user: userId, "items.product": guestItem.product },
                {
                    $inc: { "items.$.quantity": guestItem.quantity },
                    $set: { "items.$.priceAtAdd": product.price },
                }
            );

            // If no existing item, add new one
            if (!updated) {
                await Cart.findOneAndUpdate(
                    { user: userId },
                    {
                        $push: {
                            items: {
                                product: guestItem.product,
                                quantity: Math.min(
                                    guestItem.quantity,
                                    product.stock
                                ),
                                priceAtAdd: product.price,
                            },
                        },
                    }
                );
            }
        }

        return await getUserCart(userId);
    } catch (error) {
        console.error("Error in mergeGuestCart:", error);
        throw error;
    }
};
