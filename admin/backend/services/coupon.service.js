import Coupon from "../models/coupon.model.js";
import CouponUsage from "../models/coupon-usage.model.js";

class CouponService {
    // Create a new coupon
    async createCoupon(couponData) {
        try {
            const coupon = new Coupon(couponData);
            return await coupon.save();
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Coupon code already exists");
            }
            throw error;
        }
    }

    // Get all coupons with usage tracking and filters
    async getAllCoupons(filters = {}) {
        try {
            // Build query based on filters
            const query = {};

            if (filters.category) {
                query.applicableCategories = filters.category;
            }

            if (filters.discountType) {
                query.discountType = filters.discountType;
            }

            if (filters.status !== undefined) {
                query.isActive = filters.status === "true";
            }

            const coupons = await Coupon.find(query)
                .populate("applicableCategories", "name")
                .sort({ createdAt: -1 });

            // Get usage stats for each coupon
            const couponsWithUsage = await Promise.all(
                coupons.map(async (coupon) => {
                    const totalUsages = await CouponUsage.countDocuments({
                        coupon: coupon._id,
                    });

                    const couponObj = coupon.toObject();
                    return {
                        ...couponObj,
                        totalUsages, // Total times this coupon has been used
                    };
                })
            );

            return couponsWithUsage;
        } catch (error) {
            throw error;
        }
    }

    // Get coupon by ID
    async getCouponById(couponId) {
        try {
            const coupon = await Coupon.findById(couponId).populate(
                "applicableCategories",
                "name"
            );

            if (!coupon) {
                throw new Error("Coupon not found");
            }
            return coupon;
        } catch (error) {
            throw error;
        }
    }

    // Update coupon
    async updateCoupon(couponId, updateData) {
        try {
            const coupon = await Coupon.findByIdAndUpdate(
                couponId,
                updateData,
                { new: true, runValidators: true }
            ).populate("applicableCategories", "name");

            if (!coupon) {
                throw new Error("Coupon not found");
            }
            return coupon;
        } catch (error) {
            if (error.code === 11000) {
                throw new Error("Coupon code already exists");
            }
            throw error;
        }
    }

    // Delete coupon
    async deleteCoupon(couponId) {
        try {
            const coupon = await Coupon.findByIdAndDelete(couponId);
            if (!coupon) {
                throw new Error("Coupon not found");
            }

            // Also delete related usage records
            await CouponUsage.deleteMany({ coupon: couponId });

            return coupon;
        } catch (error) {
            throw error;
        }
    }

    // Toggle coupon status
    async toggleCouponStatus(couponId) {
        try {
            const coupon = await Coupon.findById(couponId);
            if (!coupon) {
                throw new Error("Coupon not found");
            }

            coupon.isActive = !coupon.isActive;
            return await coupon.save();
        } catch (error) {
            throw error;
        }
    }

    // Get coupon statistics
    async getCouponStats(couponId) {
        try {
            const coupon = await Coupon.findById(couponId);
            if (!coupon) {
                throw new Error("Coupon not found");
            }

            const usageStats = await CouponUsage.aggregate([
                { $match: { coupon: coupon._id } },
                {
                    $group: {
                        _id: null,
                        totalUsages: { $sum: 1 },
                        totalDiscountGiven: { $sum: "$discountAmount" },
                        uniqueUsers: { $addToSet: "$user" },
                    },
                },
            ]);

            const stats = usageStats[0] || {
                totalUsages: 0,
                totalDiscountGiven: 0,
                uniqueUsers: [],
            };

            return {
                coupon,
                totalUsages: stats.totalUsages,
                totalDiscountGiven: stats.totalDiscountGiven,
                uniqueUsersCount: stats.uniqueUsers.length,
                remainingUsages: "Unlimited", // No global usage limits
            };
        } catch (error) {
            throw error;
        }
    }

    // Validate coupon data
    validateCouponData(couponData, isUpdate = false) {
        const errors = [];

        // Check if couponData exists
        if (!couponData || typeof couponData !== "object") {
            errors.push("Request body is required");
            return errors;
        }

        // For updates, only validate fields that are present
        if (!isUpdate) {
            // Required fields validation for creation
            if (!couponData.code || couponData.code.trim() === "") {
                errors.push("Coupon code is required");
            }

            if (
                !couponData.description ||
                couponData.description.trim() === ""
            ) {
                errors.push("Description is required");
            }

            if (!couponData.discountType) {
                errors.push("Discount type is required");
            }

            if (
                couponData.discountValue === undefined ||
                couponData.discountValue < 0
            ) {
                errors.push("Discount value must be a positive number");
            }

            if (!couponData.validUntil) {
                errors.push("Valid until date is required");
            }
        } else {
            // For updates, validate only if fields are provided
            if (
                couponData.code !== undefined &&
                (!couponData.code || couponData.code.trim() === "")
            ) {
                errors.push("Coupon code cannot be empty");
            }

            if (
                couponData.description !== undefined &&
                (!couponData.description ||
                    couponData.description.trim() === "")
            ) {
                errors.push("Description cannot be empty");
            }

            if (
                couponData.discountValue !== undefined &&
                couponData.discountValue < 0
            ) {
                errors.push("Discount value must be a positive number");
            }
        }

        // Business logic validations (apply if fields are present)
        if (
            couponData.discountType === "percentage" &&
            couponData.discountValue &&
            couponData.discountValue > 100
        ) {
            errors.push("Percentage discount cannot exceed 100%");
        }

        if (
            couponData.discountType === "percentage_upto" &&
            couponData.discountValue &&
            !couponData.maxDiscountAmount
        ) {
            errors.push(
                "Maximum discount amount is required for percentage_upto type"
            );
        }

        if (
            couponData.validFrom &&
            couponData.validUntil &&
            new Date(couponData.validFrom) >= new Date(couponData.validUntil)
        ) {
            errors.push("Valid until date must be after valid from date");
        }

        if (
            couponData.userUsageLimit !== undefined &&
            couponData.userUsageLimit < 0
        ) {
            errors.push(
                "User usage limit must be 0 (unlimited) or a positive number"
            );
        }

        return errors;
    }
}

export default new CouponService();
