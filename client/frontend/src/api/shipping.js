import axios from "./axios";

// Calculate shipping fee for given order amount
export const calculateShipping = async (orderAmount) => {
    console.log("API CALL: calculateShipping", orderAmount);
    try {
        const res = await axios.post("/shipping/calculate", { orderAmount });
        return res.data;
    } catch (error) {
        console.error("Error calculating shipping:", error);
        // Fallback to default values if API fails
        return {
            shippingFee: orderAmount >= 1000 ? 0 : 50,
            isFreeShipping: orderAmount >= 1000,
            minOrderForFree: 1000,
            remainingForFreeShipping:
                orderAmount >= 1000 ? 0 : 1000 - orderAmount,
        };
    }
};

// Get shipping configuration
export const getShippingConfig = async () => {
    console.log("API CALL: getShippingConfig");
    try {
        const res = await axios.get("/shipping/config");
        return res.data;
    } catch (error) {
        console.error("Error getting shipping config:", error);
        // Fallback to default values
        return {
            minOrderForFree: 1000,
            shippingFee: 50,
        };
    }
};
