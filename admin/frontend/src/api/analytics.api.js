import api from "./axios.js";

export const getAnalyticsData = async (timeframe = "month") => {
    try {
        const response = await api.get(
            `/analytics/overview?timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get analytics data",
            status: error.response?.status || 500,
        };
    }
};

export const getRevenueAnalytics = async (timeframe = "month") => {
    try {
        const response = await api.get(
            `/analytics/revenue?timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get revenue analytics",
            status: error.response?.status || 500,
        };
    }
};

export const getSalesAnalytics = async (timeframe = "month") => {
    try {
        const response = await api.get(
            `/analytics/sales?timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
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

export const getTopPerformingProducts = async (
    limit = 10,
    timeframe = "month"
) => {
    try {
        const response = await api.get(
            `/analytics/top-products?limit=${limit}&timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get top products",
            status: error.response?.status || 500,
        };
    }
};

export const getCustomerAnalytics = async (timeframe = "month") => {
    try {
        const response = await api.get(
            `/analytics/customers?timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get customer analytics",
            status: error.response?.status || 500,
        };
    }
};

export const getOrderAnalytics = async (timeframe = "month") => {
    try {
        const response = await api.get(
            `/analytics/orders?timeframe=${timeframe}`
        );
        return {
            success: true,
            data: response.data.data,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to get order analytics",
            status: error.response?.status || 500,
        };
    }
};
