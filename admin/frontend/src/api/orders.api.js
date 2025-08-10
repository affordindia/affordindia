import api from "./axios.js";

export const getOrders = async (filters = {}, pagination = {}) => {
    try {
        const params = new URLSearchParams();

        // Search term
        if (filters.search?.trim()) {
            params.append("search", filters.search.trim());
        }

        // Status filters (multi-value support)
        if (filters.status && filters.status.length > 0) {
            filters.status.forEach((status) => {
                params.append("status", status);
            });
        }

        // Payment status filters (multi-value support)
        if (filters.paymentStatus && filters.paymentStatus.length > 0) {
            filters.paymentStatus.forEach((paymentStatus) => {
                params.append("paymentStatus", paymentStatus);
            });
        }

        // Date range filters
        if (filters.startDate) {
            params.append("startDate", filters.startDate);
        }
        if (filters.endDate) {
            params.append("endDate", filters.endDate);
        }

        // Amount range filters
        if (filters.minAmount && filters.minAmount !== "") {
            params.append("minAmount", filters.minAmount);
        }
        if (filters.maxAmount && filters.maxAmount !== "") {
            params.append("maxAmount", filters.maxAmount);
        }

        // Payment method filter
        if (filters.paymentMethod) {
            params.append("paymentMethod", filters.paymentMethod);
        }

        // Has coupon filter
        if (filters.hasCoupon !== "") {
            params.append("hasCoupon", filters.hasCoupon);
        }

        // Items count range
        if (filters.minItems && filters.minItems !== "") {
            params.append("minItems", filters.minItems);
        }
        if (filters.maxItems && filters.maxItems !== "") {
            params.append("maxItems", filters.maxItems);
        }

        // Customer filters
        if (filters.customerName?.trim()) {
            params.append("customerName", filters.customerName.trim());
        }
        if (filters.customerEmail?.trim()) {
            params.append("customerEmail", filters.customerEmail.trim());
        }

        // Pagination
        if (pagination.skip !== undefined) {
            params.append("skip", pagination.skip);
        }
        if (pagination.limit !== undefined) {
            params.append("limit", pagination.limit);
        }

        // Sorting
        if (pagination.sort) {
            params.append("sort", JSON.stringify(pagination.sort));
        }

        const response = await api.get(`/orders?${params.toString()}`);
        return {
            success: true,
            orders: response.data.orders,
            total: response.data.total,
        };
    } catch (error) {
        console.error("Error fetching orders:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch orders",
        };
    }
};

export const getOrderById = async (id) => {
    try {
        const response = await api.get(`/orders/${id}`);
        return {
            success: true,
            order: response.data.order,
        };
    } catch (error) {
        console.error("Error fetching order:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order",
        };
    }
};

export const updateOrderStatus = async (id, data) => {
    try {
        const response = await api.patch(`/orders/${id}`, data);
        return {
            success: true,
            order: response.data.order,
        };
    } catch (error) {
        console.error("Error updating order:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to update order",
        };
    }
};

export const deleteOrder = async (id) => {
    try {
        const response = await api.delete(`/orders/${id}`);
        return {
            success: true,
            message: response.data.message,
        };
    } catch (error) {
        console.error("Error deleting order:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to delete order",
        };
    }
};

export const getOrderStats = async () => {
    try {
        const response = await api.get("/orders/stats");
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error fetching order stats:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch order stats",
        };
    }
};
