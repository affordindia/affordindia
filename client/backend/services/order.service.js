import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import config from "../config/server.config.js";

export const placeOrder = async (
    userId,
    shippingAddress,
    paymentMethod,
    paymentInfo = {}
) => {
    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");
    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    // Validate stock and calculate totals
    let subtotal = 0;
    const orderItems = [];
    for (const item of cart.items) {
        const product = item.product;
        if (!product) throw new Error("Product not found in cart");
        if (product.stock < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);
        subtotal += product.price * item.quantity;
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
        });
    }
    // Use config for shipping and discount
    const shippingFee =
        subtotal < config.shipping.minOrderForFree
            ? config.shipping.shippingFee
            : 0;
    const discount = config.shipping.discount;
    const total = subtotal + shippingFee - discount;

    // Deduct stock
    for (const item of cart.items) {
        await Product.findByIdAndUpdate(item.product._id, {
            $inc: { stock: -item.quantity },
        });
    }

    // Determine payment status
    let paymentStatus = "pending";
    if (paymentMethod === "COD") {
        paymentStatus = "pending";
    } else if (paymentMethod === "ONLINE") {
        // In real payment integration, set to 'paid' only after confirmation
        paymentStatus = "pending";
    }

    // Create order
    const order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        paymentMethod,
        paymentStatus,
        paymentInfo,
        status: "pending",
        subtotal,
        shippingFee,
        discount,
        total,
    });

    // Clear cart
    cart.items = [];
    await cart.save();

    return order;
};

export const getUserOrders = async (userId) => {
    return Order.find({ user: userId }).sort("-createdAt");
};

export const getOrderById = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found");
    return order;
};

export const cancelOrder = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found");
    if (!["pending", "processing"].includes(order.status))
        throw new Error("Order cannot be cancelled at this stage");
    order.status = "cancelled";
    order.cancelledAt = new Date();
    await order.save();
    // Optionally, restock items here
    return order;
};

export const returnOrder = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId });
    if (!order) throw new Error("Order not found");
    if (order.status !== "delivered")
        throw new Error("Only delivered orders can be returned");
    order.status = "returned";
    await order.save();
    // Optionally, restock items here
    return order;
};
