import Order from "../models/order.model.js";
import Cart from "../models/cart.model.js";
import Product from "../models/product.model.js";
import User from "../models/user.model.js";
import { calculateShipping } from "./shipping.service.js";
import { recordCouponUsage } from "./coupon.service.js";
import { createRazorpayOrder } from "./razorpay.service.js";
import { sendOrderPlaced } from "./whatsapp.service.js";

// HDFC LEGACY IMPORT - COMMENTED OUT FOR RAZORPAY MIGRATION
// PRESERVED FOR FUTURE ROLLBACK IF NEEDED
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

    // Get user data for later use (name updates and WhatsApp notifications)
    const currentUser = await User.findById(userId);

    // Update user's name if provided and not already set
    if (userName && userName.trim()) {
        try {
            if (
                currentUser &&
                (!currentUser.name || currentUser.name.trim() === "")
            ) {
                await User.findByIdAndUpdate(userId, { name: userName.trim() });
                // Update the currentUser object to reflect the change
                currentUser.name = userName.trim();
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

    // NEW STOCK MANAGEMENT: Only deduct stock for COD orders
    // Online payment orders: stock deducted only on successful payment
    if (paymentMethod === "COD") {
        console.log("📦 Deducting stock for COD order");
        for (const item of cart.items) {
            await Product.findByIdAndUpdate(item.product._id, {
                $inc: { stock: -item.quantity },
            });
        }
    } else {
        console.log(
            "⏳ Stock will be deducted on successful payment for online order"
        );
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
        // COMMENTED OUT - NO ONLINE ORDERS YET, PRESERVED FOR FUTURE ROLLBACK
        // Keep paymentGateway for backward compatibility with existing orders
        // paymentGateway: paymentMethod === "COD" ? "COD" : "HDFC", // Preserved for rollback

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
            const razorpayResponse = await createRazorpayOrder({
                orderId: order.orderId,
                amount: order.total,
                user: order.user,
                notes: {
                    customer_name: userName || order.user?.name,
                    order_items: order.items.length,
                    order_created_at: order.createdAt,
                    subtotal: order.subtotal,
                    discount: order.totalDiscount,
                    coupon_discount: order.couponDiscount,
                    shipping_fee: order.shippingFee,
                },
            });

            // Update order with Razorpay details
            await Order.findByIdAndUpdate(order._id, {
                razorpayOrderId: razorpayResponse.id,
                razorpayOrderData: razorpayResponse,
                paymentTimeoutAt: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes timeout
            });

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

    // Clear cart only for COD orders (immediate success)
    // For online orders, cart will be cleared after payment success via webhook
    if (paymentMethod === "COD") {
        cart.items = [];
        cart.appliedCoupon = undefined;
        await cart.save();
        console.log("🛒 Cart cleared for COD order:", order._id);

        // Create Shiprocket order for COD via admin API
        try {
            console.log("📦 Creating Shiprocket order for COD:", order.orderId);
            
            const adminBaseUrl = process.env.ADMIN_BACKEND_URL || "http://localhost:5000";
            console.log("📦 Calling admin API:", `${adminBaseUrl}/api/shiprocket/orders/create`);
            
            const response = await fetch(`${adminBaseUrl}/api/shiprocket/orders/create`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: order._id.toString() })
            });
            
            console.log("📦 Response status:", response.status);
            
            if (!response.ok) {
                const errorText = await response.text();
                console.error("❌ Admin API error:", response.status, errorText);
                throw new Error(`Admin API returned ${response.status}`);
            }
            
            const shiprocketResponse = await response.json();
            
            if (shiprocketResponse?.success && shiprocketResponse?.data) {
                console.log("✅ Shiprocket order created:", shiprocketResponse.data.shiprocketOrderId);
            } else {
                console.error("❌ Shiprocket API response:", shiprocketResponse);
            }
        } catch (shiprocketError) {
            console.error("❌ Shiprocket order creation failed:", shiprocketError.message);
            // Don't throw - allow order to succeed even if Shiprocket fails
        }

        // Send WhatsApp order placed notification for COD
        try {
            // Use the currentUser data we fetched earlier
            const customerPhone = receiverPhone || currentUser?.phone;
            const customerName = userName || currentUser?.name || "Customer";
            const deliveryDate = new Date(
                Date.now() + 7 * 24 * 60 * 60 * 1000
            ).toLocaleDateString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
            });

            if (customerPhone) {
                await sendOrderPlaced(
                    customerPhone,
                    customerName,
                    order.orderId,
                    order.total,
                    deliveryDate
                );
                console.log(
                    "📱 Order placed WhatsApp sent for COD order:",
                    order.orderId
                );
            }
        } catch (whatsappError) {
            console.error(
                "❌ Failed to send order placed WhatsApp:",
                whatsappError
            );
            // Don't fail the entire order process if WhatsApp fails
        }
    } else {
        console.log(
            "🛒 Cart retained for online payment order:",
            order._id,
            "- will be cleared on payment success"
        );
    }

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

        // =================== HDFC LEGACY RESPONSE SUPPORT ===================
        // COMMENTED OUT - NO ONLINE ORDERS YET, PRESERVED FOR FUTURE ROLLBACK
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

// =================== STOCK MANAGEMENT (ESSENTIAL ONLY) ===================

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
