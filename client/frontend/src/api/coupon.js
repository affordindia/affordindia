import api from "./axios";

// Get available coupons for user
export const getAvailableCoupons = async () => {
    const response = await api.get("/coupons/available");
    return response.data;
};

// Apply coupon to cart
export const applyCouponToCart = async (couponCode) => {
    const response = await api.post("/coupons/apply", { couponCode });
    return response.data;
};

// Remove coupon from cart
export const removeCouponFromCart = async () => {
    const response = await api.delete("/coupons/remove");
    return response.data;
};
