import {
    calculateShipping,
    getShippingConfig,
} from "../services/shipping.service.js";

export const calculateShippingFee = async (req, res, next) => {
    try {
        const { orderAmount } = req.body;

        if (!orderAmount || orderAmount < 0) {
            return res.status(400).json({
                error: "Valid order amount is required",
            });
        }

        const shippingInfo = calculateShipping(orderAmount);
        res.json(shippingInfo);
    } catch (error) {
        next(error);
    }
};

export const getShippingConfiguration = async (req, res, next) => {
    try {
        const config = getShippingConfig();
        res.json(config);
    } catch (error) {
        next(error);
    }
};
