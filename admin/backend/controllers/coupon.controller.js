import CouponService from "../services/coupon.service.js";
import {
    createCouponFromTemplate,
    getAvailableTemplates,
} from "../utils/coupon-templates.js";

// Create a new coupon
export const createCoupon = async (req, res) => {
    try {
        // Validate input data
        const validationErrors = CouponService.validateCouponData(req.body);
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        // Add creator info
        const couponData = {
            ...req.body,
        };

        const coupon = await CouponService.createCoupon(couponData);

        res.status(201).json({
            success: true,
            message: "Coupon created successfully",
            coupon,
        });
    } catch (error) {
        console.error("Create coupon error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create coupon",
        });
    }
};

// Get all coupons (simplified)
export const getAllCoupons = async (req, res) => {
    try {
        const coupons = await CouponService.getAllCoupons();

        res.json({
            success: true,
            coupons,
            total: coupons.length,
        });
    } catch (error) {
        console.error("Get coupons error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch coupons",
        });
    }
};

// Get coupon by ID
export const getCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await CouponService.getCouponById(id);

        res.json({
            success: true,
            coupon,
        });
    } catch (error) {
        console.error("Get coupon error:", error);
        res.status(404).json({
            success: false,
            message: error.message || "Coupon not found",
        });
    }
};

// Update coupon
export const updateCoupon = async (req, res) => {
    try {
        const { id } = req.params;

        // Validate input data for update
        const validationErrors = CouponService.validateCouponData(
            req.body,
            true
        );
        if (validationErrors.length > 0) {
            return res.status(400).json({
                success: false,
                message: "Validation failed",
                errors: validationErrors,
            });
        }

        const coupon = await CouponService.updateCoupon(id, req.body);

        res.json({
            success: true,
            message: "Coupon updated successfully",
            coupon,
        });
    } catch (error) {
        console.error("Update coupon error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to update coupon",
        });
    }
};

// Delete coupon
export const deleteCoupon = async (req, res) => {
    try {
        const { id } = req.params;
        await CouponService.deleteCoupon(id);

        res.json({
            success: true,
            message: "Coupon deleted successfully",
        });
    } catch (error) {
        console.error("Delete coupon error:", error);
        res.status(404).json({
            success: false,
            message: error.message || "Failed to delete coupon",
        });
    }
};

// Toggle coupon status
export const toggleCouponStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const coupon = await CouponService.toggleCouponStatus(id);

        res.json({
            success: true,
            message: `Coupon ${
                coupon.isActive ? "activated" : "deactivated"
            } successfully`,
            coupon,
        });
    } catch (error) {
        console.error("Toggle coupon status error:", error);
        res.status(404).json({
            success: false,
            message: error.message || "Failed to toggle coupon status",
        });
    }
};

// Get coupon statistics
export const getCouponStats = async (req, res) => {
    try {
        const { id } = req.params;
        const stats = await CouponService.getCouponStats(id);

        res.json({
            success: true,
            stats,
        });
    } catch (error) {
        console.error("Get coupon stats error:", error);
        res.status(404).json({
            success: false,
            message: error.message || "Failed to get coupon statistics",
        });
    }
};

// Get available coupon templates
export const getCouponTemplates = async (req, res) => {
    try {
        const templates = getAvailableTemplates();

        res.json({
            success: true,
            templates,
        });
    } catch (error) {
        console.error("Get templates error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to get coupon templates",
        });
    }
};

// Create coupon from template
export const createCouponFromTemplateController = async (req, res) => {
    try {
        const { templateKey, customData = {} } = req.body;

        if (!templateKey) {
            return res.status(400).json({
                success: false,
                message: "Template key is required",
            });
        }

        // Generate coupon data from template
        const couponData = createCouponFromTemplate(templateKey, customData);

        // Create the coupon using the service
        const coupon = await CouponService.createCoupon(couponData);

        res.status(201).json({
            success: true,
            message: "Coupon created from template successfully",
            coupon,
        });
    } catch (error) {
        console.error("Create coupon from template error:", error);
        res.status(400).json({
            success: false,
            message: error.message || "Failed to create coupon from template",
        });
    }
};
