import config from "../config/server.config.js";

export const calculateShipping = (orderAmount) => {
    const { minOrderForFree, shippingFee } = config.shipping;

    const isEligibleForFreeShipping = orderAmount >= minOrderForFree;
    const finalShippingFee = isEligibleForFreeShipping ? 0 : shippingFee;

    return {
        shippingFee: finalShippingFee,
        isFreeShipping: isEligibleForFreeShipping,
        minOrderForFree,
        remainingForFreeShipping: isEligibleForFreeShipping
            ? 0
            : minOrderForFree - orderAmount,
    };
};

export const getShippingConfig = () => {
    return {
        minOrderForFree: config.shipping.minOrderForFree,
        shippingFee: config.shipping.shippingFee,
    };
};
