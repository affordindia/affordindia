import {
    placeOrder,
    getUserOrders,
    getOrderById,
    cancelOrder,
    returnOrder,
} from "../services/order.service.js";
import { body, param } from "express-validator";

export const createOrder = async (req, res, next) => {
    try {
        const {
            shippingAddress,
            paymentMethod,
            paymentInfo,
            userName,
            receiverName,
            receiverPhone,
        } = req.body;
        const order = await placeOrder(
            req.user._id,
            shippingAddress,
            paymentMethod,
            paymentInfo,
            userName,
            receiverName,
            receiverPhone
        );
        res.status(201).json(order);
    } catch (err) {
        next(err);
    }
};

export const listOrders = async (req, res, next) => {
    try {
        const orders = await getUserOrders(req.user._id);
        res.json({ count: orders.length, orders });
    } catch (err) {
        next(err);
    }
};

export const getOrder = async (req, res, next) => {
    try {
        const order = await getOrderById(req.user._id, req.params.orderId);
        res.json(order);
    } catch (err) {
        next(err);
    }
};

export const cancel = async (req, res, next) => {
    try {
        const order = await cancelOrder(req.user._id, req.params.orderId);
        res.json(order);
    } catch (err) {
        next(err);
    }
};

export const returnOrderCtrl = async (req, res, next) => {
    try {
        const order = await returnOrder(req.user._id, req.params.orderId);
        res.json(order);
    } catch (err) {
        next(err);
    }
};

export const validateCreateOrder = [
    body("shippingAddress").isObject().withMessage("Shipping address required"),
    body("paymentMethod").isString().withMessage("Payment method required"),
];

export const validateOrderId = [
    param("orderId").isMongoId().withMessage("Invalid orderId"),
];
