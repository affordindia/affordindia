import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";

import { calculateShipping } from "./shipping.service.js";
import { recordCouponUsage } from "./coupon.service.js";
import { createPaymentSession } from "./paymentGateway.service.js";
import shiprocketOrderService from "./shiprocketOrder.service.js";

export const placeOrder = async (
    userId,
    shippingAddress,
    billingAddress,
    billingAddressSameAsShipping,
    paymentMethod,
    paymentInfo = {},
    userName = undefined,
    receiverName = undefined,
    receiverPhone = undefined
) => {
    console.log("🛒 Attempting to place order for user:", userId);

    // Get user's cart
    const cart = await Cart.findOne({ user: userId }).populate("items.product");

    console.log("🛒 Cart found:", cart ? `${cart.items.length} items` : "null");
    if (cart) {
        console.log(
            "🛒 Cart items:",
            cart.items.map((item) => ({
                product: item.product?.name || item.product?._id,
                quantity: item.quantity,
            }))
        );
    }

    if (!cart || cart.items.length === 0) throw new Error("Cart is empty");

    // Update user's name if provided and not already set
    if (userName && userName.trim()) {
        try {
            const currentUser = await User.findById(userId);
            if (
                currentUser &&
                (!currentUser.name || currentUser.name.trim() === "")
            ) {
                await User.findByIdAndUpdate(userId, { name: userName.trim() });
            }
        } catch (error) {
            console.error("Failed to update user name:", error);
            // Don't fail the order if profile update fails
        }
    }

    // Validate stock and calculate totals
    let subtotal = 0;
    let totalDiscount = 0;
    const orderItems = [];
    for (const item of cart.items) {
        const product = item.product;
        if (!product) throw new Error("Product not found in cart");
        if (product.stock < item.quantity)
            throw new Error(`Insufficient stock for ${product.name}`);
        const discount = product.discount || 0;
        const discountedPrice = Math.round(
            product.price * (1 - discount / 100)
        );
        const productDiscount =
            (product.price - discountedPrice) * item.quantity;
        subtotal += product.price * item.quantity;
        totalDiscount += productDiscount;
        orderItems.push({
            product: product._id,
            quantity: item.quantity,
            price: product.price,
            discountedPrice,
        });
    }

    // Get coupon discount from cart if applied
    const couponDiscount = cart.appliedCoupon?.discountAmount || 0;

    // Convert Mongoose subdocument to plain object for proper property access
    const appliedCoupon =
        cart.appliedCoupon && cart.appliedCoupon.code
            ? cart.appliedCoupon.toObject
                ? cart.appliedCoupon.toObject()
                : cart.appliedCoupon
            : null;

    // Use shipping service for consistent calculation
    const { shippingFee } = await calculateShipping(
        subtotal - totalDiscount - couponDiscount
    );

    // Calculate final total: subtotal - product discounts - coupon discount + shipping
    const total = subtotal - totalDiscount - couponDiscount + shippingFee;

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


    // Create order (initially pending)
    let order = await Order.create({
        user: userId,
        items: orderItems,
        shippingAddress,
        billingAddress: billingAddressSameAsShipping
            ? shippingAddress
            : billingAddress,
        billingAddressSameAsShipping,
        paymentMethod,
        paymentStatus,
        paymentInfo,
        paymentGateway: paymentMethod === "COD" ? "COD" : "HDFC",
        status: "pending",
        subtotal,
        totalDiscount,
        couponDiscount,
        shippingFee,
        total,
        receiverName,
        receiverPhone,
        coupon: appliedCoupon,
    });


    // --- Shiprocket Integration ---
    console.log("[Shiprocket] Integration block starting...");
    try {
        // Populate product details and user for Shiprocket formatting
        await order.populate([{ path: "items.product" }, { path: "user", select: "name phone email" }]);
        console.log("[Shiprocket] Populated order:", order.orderId);
        // Format order for Shiprocket
        const shiprocketOrderData = shiprocketOrderService.formatOrderForShiprocket(order);
        console.log("[Shiprocket] Formatted order data:", shiprocketOrderData);
        // Create order in Shiprocket
        const shiprocketResp = await shiprocketOrderService.createOrder(shiprocketOrderData);
        console.log("[Shiprocket] Shiprocket API response:", shiprocketResp);
        // Update order with Shiprocket info
        order.shiprocket = {
            orderId: shiprocketResp.order_id,
            shipmentId: shiprocketResp.shipment_id,
            awbCode: shiprocketResp.awb_code,
            courierId: shiprocketResp.courier_id,
            courierName: shiprocketResp.courier_name,
            pickupScheduled: !!shiprocketResp.pickup_scheduled,
            lastSyncAt: new Date(),
            statusHistory: [
                {
                    status: "Order Created",
                    activity: "Order received and processing",
                    location: order.shippingAddress?.city || "Warehouse",
                },
            ],
            rtoInitiated: false,
            delivered: false,
        };
        order.status = "shipped";
        await order.save();
        console.log("[Shiprocket] Order updated with Shiprocket info and status shipped.");
    } catch (err) {
        console.error("❌ Shiprocket integration failed:", err.message);
        // Optionally, keep order as pending if Shiprocket fails
    }
    console.log("[Shiprocket] Integration block finished.");

    // Add userName to order object for payment gateway use
    if (userName) {
        order.userName = userName;
    }

    // Handle payment method specific logic
    let paymentUrl = null;

    if (paymentMethod === "ONLINE") {
        try {
            console.log(
                "🔄 Creating HDFC payment session for order:",
                order._id
            );
            console.log("🔢 Using custom Order ID for payment:", order.orderId);

            // Create payment session with HDFC (using custom orderId)
            const paymentSessionResponse = await createPaymentSession(order);

            // Extract payment details directly
            const sessionId = paymentSessionResponse.id;
            paymentUrl = paymentSessionResponse.payment_links?.web;

            // Update order with payment session details
            await Order.findByIdAndUpdate(order._id, {
                paymentSessionId: sessionId,
                paymentUrl: paymentUrl,
                paymentSessionData: paymentSessionResponse, // Store for verification
            });

            console.log(
                "✅ Payment session created successfully for order:",
                order._id
            );
            console.log("💳 Payment URL:", paymentUrl);
        } catch (error) {
            console.error(
                "❌ Payment session creation failed for order:",
                order._id,
                error
            );

            // If payment session creation fails, we should handle this gracefully
            // Option 1: Fail the entire order creation
            // Option 2: Mark order as failed and allow manual retry

            // For now, we'll fail the order creation
            throw new Error(
                `Payment session creation failed: ${error.message}`
            );
        }
    }

    // Clear cart including applied coupon
    cart.items = [];
    cart.appliedCoupon = undefined;
    await cart.save();

    // Record coupon usage if a coupon was applied
    if (appliedCoupon && appliedCoupon.couponId) {
        try {
            const usageRecord = await recordCouponUsage(
                appliedCoupon.couponId,
                userId,
                order._id,
                couponDiscount,
                subtotal
            );
        } catch (error) {
            console.error("❌ Failed to record coupon usage:", error);
            // Don't fail the order if coupon usage recording fails
        }
    }

    // Format response with totalDiscount and discountedPrice per item
    const orderResponse = {
        ...order.toObject(),
        totalDiscount: order.totalDiscount,
        items: order.items.map((item) => ({
            ...item,
            discountedPrice: item.discountedPrice,
        })),
    };

    // Add payment URL for online payments
    if (paymentMethod === "ONLINE" && paymentUrl) {
        orderResponse.paymentUrl = paymentUrl;
        orderResponse.requiresPayment = true;
    } else {
        orderResponse.requiresPayment = false;
    }

    return orderResponse;
};

export const getUserOrders = async (userId) => {
    const orders = await Order.find({ user: userId })
        .populate({
            path: "items.product",
            select: "name price images description stock discount",
        })
        .populate({
            path: "user",
            select: "name phone",
        })
        .sort("-createdAt");
    // Format each order for API consistency
    return orders.map((order) => ({
        ...order.toObject(),
        totalDiscount: order.totalDiscount,
        items: order.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            discountedPrice: item.discountedPrice,
            _id: item._id,
        })),
    }));
};

export const getOrderById = async (userId, orderId) => {
    const order = await Order.findOne({ _id: orderId, user: userId })
        .populate({
            path: "items.product",
            select: "name price images description stock discount",
        })
        .populate({
            path: "user",
            select: "name phone",
        });

    if (!order) throw new Error("Order not found");
    // Format for API consistency
    return {
        ...order.toObject(),
        totalDiscount: order.totalDiscount,
        items: order.items.map((item) => ({
            product: item.product,
            quantity: item.quantity,
            price: item.price,
            discountedPrice: item.discountedPrice,
            _id: item._id,
        })),
    };
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
