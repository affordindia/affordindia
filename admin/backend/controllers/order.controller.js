import {
    getOrderByIdService,
    getAllOrdersService,
    updateOrderService,
    deleteOrderService,
} from "../services/order.service.js";
import {
    DEFAULT_ORDER_SKIP,
    DEFAULT_ORDER_LIMIT,
} from "../config/pagination.config.js";
import mongoose from "mongoose";

export async function getOrderById(req, res, next) {
    try {
        const order = await getOrderByIdService(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
}

export async function getAllOrders(req, res, next) {
    try {
        // Build filter and options inline, supporting multi-value fields
        const filter = {};
        // Multi-value support for status
        if (req.query.status) {
            if (Array.isArray(req.query.status)) {
                filter.status = { $in: req.query.status };
            } else {
                filter.status = req.query.status;
            }
        }
        // Multi-value support for paymentStatus
        if (req.query.paymentStatus) {
            if (Array.isArray(req.query.paymentStatus)) {
                filter.paymentStatus = { $in: req.query.paymentStatus };
            } else {
                filter.paymentStatus = req.query.paymentStatus;
            }
        }
        // user and coupon (single value, but validate ObjectId)
        if (req.query.user && mongoose.Types.ObjectId.isValid(req.query.user))
            filter.user = req.query.user;
        if (
            req.query.coupon &&
            mongoose.Types.ObjectId.isValid(req.query.coupon)
        )
            filter.coupon = req.query.coupon;
        // Date range
        if (req.query.startDate || req.query.endDate) {
            filter.createdAt = {};
            if (req.query.startDate)
                filter.createdAt.$gte = new Date(req.query.startDate);
            if (req.query.endDate)
                filter.createdAt.$lte = new Date(req.query.endDate);
        }
        const options = {
            skip: req.query.skip
                ? parseInt(req.query.skip)
                : DEFAULT_ORDER_SKIP,
            limit: req.query.limit
                ? parseInt(req.query.limit)
                : DEFAULT_ORDER_LIMIT,
            sort: req.query.sort
                ? JSON.parse(req.query.sort)
                : { createdAt: -1 },
        };
        const result = await getAllOrdersService(filter, options);
        res.json({ success: true, ...result });
    } catch (error) {
        next(error);
    }
}

export async function updateOrder(req, res, next) {
    try {
        const order = await updateOrderService(req.params.id, req.body);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, order });
    } catch (error) {
        next(error);
    }
}

export async function deleteOrder(req, res, next) {
    try {
        const order = await deleteOrderService(req.params.id);
        if (!order)
            return res
                .status(404)
                .json({ success: false, message: "Order not found" });
        res.json({ success: true, message: "Order deleted" });
    } catch (error) {
        next(error);
    }
}

// Add more as needed
