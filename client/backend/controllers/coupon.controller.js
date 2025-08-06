import {
    validateCouponForUser,
    getAvailableCouponsForUser,
    applyCouponToCart as applyCouponService,
    removeCouponFromCart as removeCouponService,
} from "../services/coupon.service.js";

// Validate and apply coupon to cart
export const validateCoupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const userId = req.user._id;

        if (!couponCode) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }

        const validation = await validateCouponForUser(couponCode, userId);

        res.json({
            success: true,
            message: "Coupon validated successfully",
            couponData: {
                couponId: validation.coupon._id,
                code: validation.coupon.code,
                description: validation.coupon.description,
                discountType: validation.coupon.discountType,
                discountValue: validation.coupon.discountValue,
                maxDiscountAmount: validation.coupon.maxDiscountAmount,
                discountAmount: validation.discountAmount,
                orderAmount: validation.orderAmount,
                newTotal: validation.newTotal,
            },
        });
    } catch (error) {
        console.error("Validate coupon error:", error);
        const statusCode = error.message.includes("Invalid coupon") ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// Get available coupons for user (excluding used/exhausted coupons)
export const getAvailableCoupons = async (req, res) => {
    try {
        const userId = req.user._id;
        const availableCoupons = await getAvailableCouponsForUser(userId);

        res.json({
            success: true,
            coupons: availableCoupons,
        });
    } catch (error) {
        console.error("Get available coupons error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch available coupons",
            error: error.message,
        });
    }
};

// Apply coupon to cart
export const applyCouponToCart = async (req, res) => {
    try {
        const { couponCode } = req.body;
        const userId = req.user._id;

        if (!couponCode) {
            return res.status(400).json({
                success: false,
                message: "Coupon code is required",
            });
        }

        const cart = await applyCouponService(couponCode, userId);

        res.json({
            success: true,
            message: "Coupon applied to cart successfully",
            cart,
        });
    } catch (error) {
        console.error("Apply coupon error:", error);
        const statusCode = error.message.includes("Invalid coupon") ? 404 : 400;
        res.status(statusCode).json({
            success: false,
            message: error.message,
        });
    }
};

// Remove coupon from cart
export const removeCouponFromCart = async (req, res) => {
    try {
        const userId = req.user._id;
        const cart = await removeCouponService(userId);

        res.json({
            success: true,
            message: "Coupon removed from cart successfully",
            cart,
        });
    } catch (error) {
        console.error("Remove coupon error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to remove coupon from cart",
            error: error.message,
        });
    }
};
