import Coupon from "../models/coupon.model.js";
import CouponUsage from "../models/couponUsage.model.js";
import Cart from "../models/cart.model.js";

// Get user's cart with populated products (simpler version for coupon service)
const getCartForCouponValidation = async (userId) => {
    return await Cart.findOne({ user: userId }).populate({
        path: "items.product",
        select: "name price category images discount", // Include all needed fields
    });
};

// Find coupon by code
export const findCouponByCode = async (couponCode) => {
    return await Coupon.findOne({
        code: couponCode.toUpperCase(),
    }).populate("applicableCategories");
};

// Check if user has exceeded usage limit for a coupon
export const checkUserUsageLimit = async (couponId, userId, userUsageLimit) => {
    if (userUsageLimit === 0) {
        return { canUse: true, usageCount: 0 };
    }

    const userUsageCount = await CouponUsage.countDocuments({
        coupon: couponId,
        user: userId,
    });

    return {
        canUse: userUsageCount < userUsageLimit,
        usageCount: userUsageCount,
    };
};

// Check if coupon is applicable to a product
export const isCouponApplicableToProduct = (coupon, productId, categoryId) => {
    // If coupon is global, it applies to all products
    if (coupon.isGlobal) {
        return true;
    }

    // For category-based coupons, check if product category matches
    if (coupon.applicableCategories && coupon.applicableCategories.length > 0) {
        return coupon.applicableCategories.some((cid) => {
            // Handle both populated objects and ObjectIds
            const couponCategoryId = cid._id
                ? cid._id.toString()
                : cid.toString();
            const productCategoryId = categoryId.toString();
            return couponCategoryId === productCategoryId;
        });
    }

    // If no specific restrictions and not global, it applies to all products
    return true;
};

// Calculate cart totals and applicable amounts
export const calculateCartTotals = (cart, coupon) => {
    let subtotal = 0;
    let applicableAmount = 0;

    for (const item of cart.items) {
        const itemTotal = item.priceAtAdd * item.quantity;
        subtotal += itemTotal;

        // Check if item is applicable for this coupon
        const isApplicable = isCouponApplicableToProduct(
            coupon,
            item.product._id,
            item.product.category
        );

        if (isApplicable) {
            applicableAmount += itemTotal;
        }
    }

    // For global coupons or coupons with no category restrictions, use full subtotal
    // For category-specific coupons, use only applicable amount
    const orderAmount =
        coupon.isGlobal ||
        !coupon.applicableCategories ||
        coupon.applicableCategories.length === 0
            ? subtotal
            : applicableAmount;

    return { subtotal, applicableAmount, orderAmount };
};

// Validate coupon for a user
export const validateCouponForUser = async (couponCode, userId) => {
    try {
        // Find the coupon
        const coupon = await findCouponByCode(couponCode);
        if (!coupon) {
            throw new Error("Invalid coupon code");
        }

        // Check if coupon is valid (active, not expired)
        if (!coupon.isValidCoupon()) {
            const now = new Date();

            if (!coupon.isActive) {
                throw new Error("Coupon is currently inactive");
            } else if (now < coupon.validFrom) {
                throw new Error("Coupon is not yet active");
            } else if (now > coupon.validUntil) {
                throw new Error("Coupon has expired");
            } else {
                throw new Error("Coupon is not valid");
            }
        }

        // Check user-specific usage limit
        const usageCheck = await checkUserUsageLimit(
            coupon._id,
            userId,
            coupon.userUsageLimit
        );

        if (!usageCheck.canUse) {
            throw new Error(
                "You have already used this coupon the maximum number of times"
            );
        }

        // Get user's cart
        const cart = await getCartForCouponValidation(userId);
        if (!cart || cart.items.length === 0) {
            throw new Error("Your cart is empty");
        }

        // Calculate totals
        const { subtotal, orderAmount, applicableAmount } = calculateCartTotals(
            cart,
            coupon
        );

        // Check minimum order amount against the applicable amount for category-specific coupons
        const amountToCheck =
            coupon.isGlobal ||
            !coupon.applicableCategories ||
            coupon.applicableCategories.length === 0
                ? orderAmount
                : applicableAmount;

        if (amountToCheck < coupon.minOrderAmount) {
            throw new Error(
                `Minimum order amount of ₹${coupon.minOrderAmount} required for this coupon`
            );
        }

        // Calculate discount on applicable amount only
        const discountAmount = coupon.calculateDiscount(amountToCheck);
        if (discountAmount === 0) {
            throw new Error(
                "This coupon is not applicable to your current cart"
            );
        }

        return {
            coupon,
            subtotal,
            orderAmount: subtotal, // Always return full subtotal
            applicableAmount,
            discountAmount: Math.round(discountAmount * 100) / 100,
            newTotal: Math.round((subtotal - discountAmount) * 100) / 100,
        };
    } catch (error) {
        console.error("Error in validateCouponForUser:", error);
        throw error;
    }
};

// Get available coupons for a user with applicability status
export const getAvailableCouponsForUser = async (userId) => {
    try {
        const now = new Date();

        // Get active coupons that are currently valid
        const coupons = await Coupon.find({
            isActive: true,
            validFrom: { $lte: now },
            validUntil: { $gte: now },
        })
            .select(
                "code description discountType discountValue maxDiscountAmount minOrderAmount userUsageLimit isGlobal applicableCategories"
            )
            .populate("applicableCategories");

        // Get user's cart for applicability checking
        const cart = await getCartForCouponValidation(userId);

        // Filter coupons based on user usage limit and add applicability status
        const availableCoupons = [];

        for (const coupon of coupons) {
            const usageCheck = await checkUserUsageLimit(
                coupon._id,
                userId,
                coupon.userUsageLimit
            );

            // Only include coupons user can still use (not exceeded usage limit)
            if (usageCheck.canUse) {
                let isApplicable = true;
                let applicabilityReason = "";

                // Check if coupon is applicable to current cart
                if (cart && cart.items.length > 0) {
                    try {
                        const { orderAmount, applicableAmount } =
                            calculateCartTotals(cart, coupon);

                        // For category-specific coupons, check applicable amount against minimum
                        const amountToCheck =
                            coupon.isGlobal ||
                            !coupon.applicableCategories ||
                            coupon.applicableCategories.length === 0
                                ? orderAmount
                                : applicableAmount;

                        // Check minimum order amount
                        if (amountToCheck < coupon.minOrderAmount) {
                            isApplicable = false;
                            applicabilityReason = `Minimum order amount ₹${coupon.minOrderAmount} required`;
                        } else {
                            // For global coupons, always applicable if min order is met
                            if (coupon.isGlobal) {
                                isApplicable = true;
                            } else if (
                                coupon.applicableCategories &&
                                coupon.applicableCategories.length > 0
                            ) {
                                // Check if any items are applicable for category-specific coupons
                                let hasApplicableItems = false;

                                for (const item of cart.items) {
                                    const isItemApplicable =
                                        isCouponApplicableToProduct(
                                            coupon,
                                            item.product._id,
                                            item.product.category
                                        );
                                    if (isItemApplicable) {
                                        hasApplicableItems = true;
                                        break;
                                    }
                                }

                                if (!hasApplicableItems) {
                                    isApplicable = false;
                                    applicabilityReason =
                                        "Not applicable to items in your cart";
                                } else if (applicableAmount === 0) {
                                    isApplicable = false;
                                    applicabilityReason =
                                        "No applicable items meet the minimum amount";
                                }
                            }
                            // For coupons with no category restrictions, assume applicable
                        }
                    } catch (error) {
                        // If there's an error calculating, assume it's applicable but let validation catch issues
                        isApplicable = true;
                        applicabilityReason = "";
                    }
                } else {
                    isApplicable = false;
                    applicabilityReason = "Cart is empty";
                }

                availableCoupons.push({
                    ...coupon.toObject(),
                    isApplicable,
                    applicabilityReason,
                });
            }
        }

        return availableCoupons;
    } catch (error) {
        console.error("Error in getAvailableCouponsForUser:", error);
        throw error;
    }
};

// Apply coupon to cart
export const applyCouponToCart = async (couponCode, userId) => {
    try {
        // Validate coupon first
        const validation = await validateCouponForUser(couponCode, userId);

        // Update cart with applied coupon
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            {
                appliedCoupon: {
                    couponId: validation.coupon._id,
                    code: validation.coupon.code,
                    discountAmount: validation.discountAmount,
                    discountType: validation.coupon.discountType,
                    discountValue: validation.coupon.discountValue,
                },
            },
            { new: true }
        ).populate({
            path: "items.product",
            select: "name price discountedPrice category images",
        });

        return cart;
    } catch (error) {
        console.error("Error in applyCouponToCart:", error);
        throw error;
    }
};

// Remove coupon from cart
export const removeCouponFromCart = async (userId) => {
    try {
        const cart = await Cart.findOneAndUpdate(
            { user: userId },
            { $unset: { appliedCoupon: 1 } },
            { new: true }
        ).populate({
            path: "items.product",
            select: "name price discountedPrice category images",
        });

        return cart;
    } catch (error) {
        console.error("Error in removeCouponFromCart:", error);
        throw error;
    }
};

// Record coupon usage (called when order is placed)
export const recordCouponUsage = async (
    couponId,
    userId,
    orderId,
    discountAmount,
    orderAmount
) => {
    try {
        return await CouponUsage.create({
            coupon: couponId,
            user: userId,
            order: orderId,
            discountAmount,
            orderAmount,
        });
    } catch (error) {
        console.error("Error in recordCouponUsage:", error);
        throw error;
    }
};
