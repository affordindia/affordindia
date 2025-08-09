import api from "./axios.js";

/**
 * Get dashboard statistics
 * @returns {Promise<Object>} Dashboard stats
 */
export const getDashboardStats = async () => {
    console.log("API CALL: getDashboardStats");
    try {
        const response = await api.get("/dashboard/stats");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Dashboard API - Get stats error:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get dashboard stats",
            status: error.response?.status || 500,
        };
    }
};

/**
 * Get recent orders
 * @param {number} limit - Number of recent orders to fetch
 * @returns {Promise<Object>} Recent orders data
 */
export const getRecentOrders = async (limit = 10) => {
    console.log("API CALL: getRecentOrders");
    try {
        const response = await api.get(
            `/dashboard/recent-orders?limit=${limit}`
        );
        return {
            success: true,
            data: response.data,
            orders: response.data.orders || [],
        };
    } catch (error) {
        console.error("Dashboard API - Get recent orders error:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get recent orders",
            status: error.response?.status || 500,
        };
    }
};

/**
 * Get low stock products
 * @param {number} threshold - Stock threshold
 * @returns {Promise<Object>} Low stock products data
 */
export const getLowStockProducts = async (threshold = 10) => {
    console.log("API CALL: getLowStockProducts");
    try {
        const response = await api.get(
            `/dashboard/low-stock?threshold=${threshold}`
        );
        return {
            success: true,
            data: response.data,
            products: response.data.products || [],
        };
    } catch (error) {
        console.error("Dashboard API - Get low stock products error:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get low stock products",
            status: error.response?.status || 500,
        };
    }
};

/**
 * Get sales analytics
 * @param {string} period - Time period (day, week, month, year)
 * @returns {Promise<Object>} Sales analytics data
 */
export const getSalesAnalytics = async (period = "month") => {
    console.log("API CALL: getSalesAnalytics");
    try {
        const response = await api.get(`/dashboard/analytics?period=${period}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Dashboard API - Get sales analytics error:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get sales analytics",
            status: error.response?.status || 500,
        };
    }
};
