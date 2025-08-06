import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import { calculateShipping } from "./shipping.service.js";

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
            discount: item.product.discount ?? 0,
            category: item.product.category, // Include category for coupon validation
        },
        quantity: item.quantity,
        priceAtAdd: item.priceAtAdd,
        currentPrice: item.product.price,
    }));
};

// Helper function to calculate cart totals including coupon discount and shipping
const calculateCartTotals = (items, appliedCoupon = null) => {
    let subtotal = 0;
    let totalItems = 0;

    for (const item of items) {
        const itemTotal = item.priceAtAdd * item.quantity;
        subtotal += itemTotal;
        totalItems += item.quantity;
    }

    let couponDiscount = 0;
    if (appliedCoupon && appliedCoupon.code && appliedCoupon.discountAmount) {
        couponDiscount = appliedCoupon.discountAmount;
    }

    // Calculate shipping based on subtotal after coupon discount
    const discountedSubtotal = Math.max(0, subtotal - couponDiscount);
    const shippingInfo = calculateShipping(discountedSubtotal);

    const total = discountedSubtotal + shippingInfo.shippingFee;

    return {
        subtotal: Math.round(subtotal * 100) / 100,
        couponDiscount: Math.round(couponDiscount * 100) / 100,
        shippingFee: shippingInfo.shippingFee,
        total: Math.round(total * 100) / 100,
        totalItems,
        ...shippingInfo,
    };
};

// Helper function to recalculate applied coupon after cart changes
const recalculateAppliedCoupon = async (userId, cart) => {
    if (!cart.appliedCoupon || !cart.appliedCoupon.code) {
        return cart;
    }

    try {
        // Import here to avoid circular dependency
        const { validateCouponForUser } = await import("./coupon.service.js");

        // Validate if the applied coupon is still valid for the updated cart
        const validation = await validateCouponForUser(
            cart.appliedCoupon.code,
            userId
        );

        // Update the cart with new discount amount
        const updatedCart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                $set: {
                    "appliedCoupon.discountAmount": validation.discountAmount,
                },
            },
            { new: true }
        );

        return updatedCart;
    } catch (error) {
        // If coupon is no longer valid, remove it from cart
        console.log("Removing invalid coupon from cart:", error.message);
        await Cart.findOneAndUpdate(
            { user: userId },
            { $unset: { appliedCoupon: 1 } },
            { new: true }
        );

        // Return cart without coupon
        return await Cart.findOne({ user: userId });
    }
};

export const getUserCart = async (userId, recalculateCoupons = true) => {
    try {
        let cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $setOnInsert: { user: userId, items: [] } },
            { upsert: true, new: true }
        ).populate({
            path: "items.product",
            select: "name price images stock discount category",
        });

        // Recalculate applied coupon when requested (default true) or when cart is empty with coupon
        if (
            cart.items.length > 0 &&
            cart.appliedCoupon &&
            cart.appliedCoupon.code &&
            recalculateCoupons
        ) {
            cart = await recalculateAppliedCoupon(userId, cart);
            // Re-populate after potential updates
            cart = await Cart.findById(cart._id).populate({
                path: "items.product",
                select: "name price images stock discount category",
            });
        } else if (cart.items.length === 0 && cart.appliedCoupon) {
            // Remove coupon if cart is empty
            await Cart.findOneAndUpdate(
                { user: userId },
                { $unset: { appliedCoupon: 1 } }
            );
            cart.appliedCoupon = undefined;
        }

        const transformedItems = transformCartItems(cart.items);
        const totals = calculateCartTotals(
            transformedItems,
            cart.appliedCoupon
        );

        return {
            _id: cart._id,
            user: cart.user,
            items: transformedItems,
            appliedCoupon:
                cart.appliedCoupon && cart.appliedCoupon.code
                    ? cart.appliedCoupon
                    : null,
            ...totals,
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

        // If quantity is 0 or negative, remove the item
        if (quantity <= 0) {
            // Find the cart item to remove
            const cart = await Cart.findOne({ user: userId });
            if (cart) {
                const itemToRemove = cart.items.find(
                    (item) => item.product.toString() === productId.toString()
                );
                if (itemToRemove) {
                    await Cart.findOneAndUpdate(
                        { user: userId },
                        { $pull: { items: { product: productId } } },
                        { new: true }
                    );
                }
            }
            return await getUserCart(userId);
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

        return await getUserCart(userId); // Always recalculate coupons after item update
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

        return await getUserCart(userId); // Always recalculate coupons after item removal
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
