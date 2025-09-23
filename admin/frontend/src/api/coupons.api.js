import api from "./axios.js";

/**
 * Get all coupons with basic filters
 */
export const getCoupons = async (filters = {}) => {
    try {
        const params = new URLSearchParams();

        if (filters.category) params.append("category", filters.category);
        if (filters.discountType)
            params.append("discountType", filters.discountType);
        if (filters.status !== undefined)
            params.append("status", filters.status);

        const queryString = params.toString();
        const response = await api.get(
            `/coupons${queryString ? `?${queryString}` : ""}`
        );

        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupons",
        };
    }
};

/**
 * Get single coupon by ID
 */
export const getCoupon = async (id) => {
    try {
        const response = await api.get(`/coupons/${id}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupon",
        };
    }
};

/**
 * Create new coupon
 */
export const createCoupon = async (couponData) => {
    try {
        const response = await api.post("/coupons", couponData);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to create coupon",
        };
    }
};

/**
 * Update existing coupon
 */
export const updateCoupon = async (id, couponData) => {
    try {
        const response = await api.put(`/coupons/${id}`, couponData);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to update coupon",
        };
    }
};

/**
 * Delete coupon
 */
export const deleteCoupon = async (id) => {
    try {
        const response = await api.delete(`/coupons/${id}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to delete coupon",
        };
    }
};

/**
 * Toggle coupon status
 */
export const toggleCouponStatus = async (id) => {
    try {
        const response = await api.patch(`/coupons/${id}/toggle-status`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to toggle coupon status",
        };
    }
};

/**
 * Get coupon statistics
 */
export const getCouponStatistics = async () => {
    try {
        const response = await api.get("/coupons/stats");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupon statistics",
        };
    }
};

/**
 * Get coupon templates
 */
export const getCouponTemplates = async () => {
    try {
        const response = await api.get("/coupons/templates");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch coupon templates",
        };
    }
};

/**
 * Create coupon from template
 */
export const createCouponFromTemplate = async (templateId, customData = {}) => {
    try {
        const response = await api.post("/coupons/from-template", {
            templateId,
            ...customData,
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to create coupon from template",
        };
    }
};
