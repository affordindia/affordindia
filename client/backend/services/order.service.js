import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { calculateShipping } from "./shipping.service.js";
import { recordCouponUsage } from "./coupon.service.js";

// =================== PAYMENT PROVIDER IMPORTS ===================
// Migration: Replaced HDFC with Razorpay as primary payment provider
// Date: October 15, 2025
import { createRazorpayOrder } from "./razorpay.service.js";

// HDFC LEGACY IMPORT - PRESERVED FOR ROLLBACK
// import { createPaymentSession } from "./paymentGateway.service.js";

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

    // Determine payment status and provider
    let paymentStatus = "pending";
    let paymentProvider = "COD";

    if (paymentMethod === "COD") {
        paymentStatus = "pending";
        paymentProvider = "COD";
    } else if (paymentMethod === "ONLINE") {
        // For online payments, use Razorpay by default
        paymentStatus = "pending";
        paymentProvider = "RAZORPAY";
    }

    // Create order with new payment provider field
    const order = await Order.create({
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
        paymentProvider, // New field for payment provider tracking

        // =================== LEGACY HDFC FIELD PRESERVATION ===================
        // Keep paymentGateway for backward compatibility with existing orders
        paymentGateway: paymentMethod === "COD" ? "COD" : "HDFC", // Preserved for rollback

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

    // Add userName to order object for payment gateway use
    if (userName) {
        order.userName = userName;
    }

    // Handle payment method specific logic
    let paymentUrl = null;
    let razorpayOrderData = null;

    if (paymentMethod === "ONLINE") {
        try {
            console.log("🔄 Creating Razorpay order for:", order._id);
            console.log("🔢 Using Order ID for payment:", order.orderId);

            // Create Razorpay order (NEW IMPLEMENTATION)
            const razorpayResponse = await createRazorpayOrder(order);

            // Update order with Razorpay details
            await Order.findByIdAndUpdate(order._id, {
                razorpayOrderId: razorpayResponse.id,
                razorpayOrderData: razorpayResponse,
                paymentTimeoutAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes timeout
            });

            // Reserve stock for 15 minutes during payment
            await order.reserveStock(15);
            await order.save();

            razorpayOrderData = razorpayResponse;

            console.log("✅ Razorpay order created successfully:", order._id);
            console.log("💳 Razorpay Order ID:", razorpayResponse.id);
        } catch (error) {
            console.error(
                "❌ Razorpay order creation failed:",
                order._id,
                error
            );

            // If payment creation fails, we should handle this gracefully
            throw new Error(`Payment order creation failed: ${error.message}`);
        }

        // =================== HDFC LEGACY CODE - PRESERVED FOR ROLLBACK ===================
        /*
        try {
            console.log("� Creating HDFC payment session for order:", order._id);
            console.log("�🔢 Using custom Order ID for payment:", order.orderId);

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

            console.log("✅ Payment session created successfully for order:", order._id);
            console.log("💳 Payment URL:", paymentUrl);
        } catch (error) {
            console.error("❌ Payment session creation failed for order:", order._id, error);

            // If payment session creation fails, we should handle this gracefully
            // Option 1: Fail the entire order creation
            // Option 2: Mark order as failed and allow manual retry

            // For now, we'll fail the order creation
            throw new Error(`Payment session creation failed: ${error.message}`);
        }
        */
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

    // Add payment details for online payments
    if (paymentMethod === "ONLINE") {
        if (razorpayOrderData) {
            // Razorpay payment data (NEW)
            orderResponse.razorpayOrderId = razorpayOrderData.id;
            orderResponse.razorpayKeyId = process.env.RAZORPAY_KEY_ID;
            orderResponse.amount = razorpayOrderData.amount;
            orderResponse.currency = razorpayOrderData.currency;
            orderResponse.requiresPayment = true;
            orderResponse.paymentProvider = "RAZORPAY";
            orderResponse.paymentTimeout = order.paymentTimeoutAt;
        }

        // LEGACY HDFC SUPPORT - PRESERVED FOR ROLLBACK
        /*
        if (paymentUrl) {
            orderResponse.paymentUrl = paymentUrl;
            orderResponse.requiresPayment = true;
            orderResponse.paymentProvider = "HDFC";
        }
        */
    } else {
        orderResponse.requiresPayment = false;
        orderResponse.paymentProvider = "COD";
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

// =================== RAZORPAY PAYMENT FUNCTIONS (NEW) ===================

/**
 * Update order after successful Razorpay payment verification
 */
export const updateOrderAfterPayment = async (orderId, paymentData) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Update order with payment details
    order.paymentStatus = "paid";
    order.status = "processing";
    order.razorpayPaymentId = paymentData.razorpay_payment_id;
    order.razorpaySignature = paymentData.razorpay_signature;
    order.razorpayPaymentData = paymentData.paymentDetails;
    order.paymentVerifiedAt = new Date();

    // Release stock reservation (payment successful, order confirmed)
    order.releaseStock();

    await order.save();

    console.log("✅ Order payment verified and updated:", orderId);
    return order;
};

/**
 * Handle failed payment and stock management
 */
export const handleFailedPayment = async (orderId, reason) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    // Update payment status
    order.paymentStatus = "failed";
    order.paymentFailureReason = reason;

    // Check if retries are available
    if (order.canRetryPayment()) {
        // Keep order in pending state for retry
        order.status = "pending";
        console.log(
            `💔 Payment failed for order ${orderId}, retries available`
        );
    } else {
        // No more retries, cancel order and restock
        order.status = "cancelled";
        order.cancelledAt = new Date();

        // Release stock reservation and restock items
        order.releaseStock();
        await restockOrderItems(order);

        console.log(
            `💔 Payment failed for order ${orderId}, order cancelled and restocked`
        );
    }

    await order.save();
    return order;
};

/**
 * Restock items when order is cancelled or payment fails
 */
export const restockOrderItems = async (order) => {
    try {
        for (const item of order.items) {
            await Product.findByIdAndUpdate(item.product, {
                $inc: { stock: item.quantity },
            });
        }
        console.log(`📦 Restocked items for order: ${order._id}`);
    } catch (error) {
        console.error(
            `❌ Failed to restock items for order ${order._id}:`,
            error
        );
        throw error;
    }
};

/**
 * Clean up expired stock reservations
 */
export const cleanupExpiredReservations = async () => {
    try {
        const expiredOrders = await Order.findExpiredReservations();

        for (const order of expiredOrders) {
            console.log(
                `🧹 Cleaning up expired reservation for order: ${order._id}`
            );

            // Release reservation and restock if payment not completed
            if (order.paymentStatus !== "paid") {
                order.releaseStock();
                await restockOrderItems(order);

                // Cancel order if no payment received
                order.status = "cancelled";
                order.cancelledAt = new Date();
                order.paymentFailureReason =
                    "Payment timeout - stock reservation expired";
            }

            await order.save();
        }

        console.log(
            `🧹 Cleaned up ${expiredOrders.length} expired reservations`
        );
        return expiredOrders.length;
    } catch (error) {
        console.error("❌ Failed to cleanup expired reservations:", error);
        throw error;
    }
};

/**
 * Retry payment for an order (Razorpay specific)
 */
export const retryOrderPayment = async (orderId) => {
    const order = await Order.findById(orderId);
    if (!order) throw new Error("Order not found");

    if (!order.canRetryPayment()) {
        throw new Error("Order cannot be retried");
    }

    try {
        // Create new Razorpay order for retry
        const razorpayResponse = await createRazorpayOrder(order);

        // Update order with new payment attempt
        order.razorpayOrderId = razorpayResponse.id;
        order.razorpayOrderData = razorpayResponse;
        order.paymentTimeoutAt = new Date(Date.now() + 15 * 60 * 1000);
        order.paymentStatus = "pending";

        // Increment attempt counter and reserve stock again
        await order.incrementPaymentAttempt();
        order.reserveStock(15);

        await order.save();

        console.log(`🔄 Payment retry initiated for order: ${orderId}`);

        return {
            orderId: order._id,
            razorpayOrderId: razorpayResponse.id,
            razorpayKeyId: process.env.RAZORPAY_KEY_ID,
            amount: razorpayResponse.amount,
            currency: razorpayResponse.currency,
            attempt: order.paymentAttempts,
            timeoutAt: order.paymentTimeoutAt,
        };
    } catch (error) {
        console.error(`❌ Payment retry failed for order ${orderId}:`, error);
        throw error;
    }
};
