import Order from "../models/order.model.js";
import {
    DEFAULT_ORDER_SKIP,
    DEFAULT_ORDER_LIMIT,
} from "../config/pagination.config.js";

// Get order by ID
export async function getOrderByIdService(orderId) {
    return Order.findById(orderId)
        .populate("user", "name email phone")
        .populate("items.product", "name price images")
        .populate("coupon");
}

// Get all orders (admin, paginated)
export async function getAllOrdersService(filter = {}, options = {}) {
    const skip = options.skip ?? DEFAULT_ORDER_SKIP;
    const limit = options.limit ?? DEFAULT_ORDER_LIMIT;
    const sort = options.sort ?? { createdAt: -1 };
    const orders = await Order.find(filter)
        .skip(Number(skip))
        .limit(Number(limit))
        .sort(sort)
        .populate("user", "name email phone")
        .populate("items.product", "name price images")
        .populate("coupon");
    const total = await Order.countDocuments(filter);
    return { orders, total };
}

// Update order (status, tracking, etc.)
export async function updateOrderService(orderId, updateData) {
    const order = await Order.findByIdAndUpdate(orderId, updateData, {
        new: true,
    })
        .populate("user", "name email phone")
        .populate("items.product", "name price images")
        .populate("coupon");
    return order;
}

// Delete order (hard delete)
export async function deleteOrderService(orderId) {
    return Order.findByIdAndDelete(orderId);
}

// Add more as needed (e.g., update status, analytics)
