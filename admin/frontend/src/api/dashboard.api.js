import api from "./axios.js";

export const getDashboardStats = async () => {
    try {
        const response = await api.get("/dashboard/stats");
        return {
            success: true,
            data: response.data.data, // Backend sends { success: true, data: stats }
        };
    } catch (error) {
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

export const getRecentOrders = async (limit = 10) => {
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

export const getLowStockProducts = async (threshold = 10) => {
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

export const getSalesAnalytics = async (period = "month") => {
    try {
        const response = await api.get(`/dashboard/analytics?period=${period}`);
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
                "Failed to get sales analytics",
            status: error.response?.status || 500,
        };
    }
};
