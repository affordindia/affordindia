import api from "./axios.js";

/**
 * Check if invoice exists for an order
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Object>} API response with invoice data or null
 */
export const checkInvoiceByOrderId = async (orderId) => {
    try {
        const response = await api.get(`/admin/invoice/${orderId}`);
        return response.data;
    } catch (error) {
        if (error.response?.status === 404) {
            return { success: true, invoice: null };
        }
        throw error;
    }
};

/**
 * Generate invoice for an order
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Object>} API response with generated invoice data
 */
export const generateInvoice = async (orderId) => {
    try {
        const response = await api.post(`/admin/invoice/${orderId}/generate`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get invoice details by order ID
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Object>} API response with invoice details
 */
export const getInvoiceDetailsByOrderId = async (orderId) => {
    try {
        const response = await api.get(`/admin/invoice/${orderId}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Download invoice PDF by order ID
 * @param {string} orderId - MongoDB ObjectId of the order
 * @returns {Promise<Blob>} PDF blob for download
 */
export const downloadInvoicePDFByOrderId = async (orderId) => {
    try {
        const response = await api.get(`/admin/invoice/${orderId}/download`, {
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        throw error;
    }
};

/**
 * Get all invoices with filtering and pagination
 * @param {Object} filters - Filter options
 * @param {Object} pagination - Pagination options
 * @returns {Promise<Object>} API response with invoices list
 */
export const getInvoices = async (filters = {}, pagination = {}) => {
    try {
        const params = new URLSearchParams();

        // Search term
        if (filters.search?.trim()) {
            params.append("search", filters.search.trim());
        }

        // Status filter
        if (filters.status) {
            params.append("status", filters.status);
        }

        // Date range filters
        if (filters.startDate) {
            params.append("startDate", filters.startDate);
        }
        if (filters.endDate) {
            params.append("endDate", filters.endDate);
        }

        // Pagination
        if (pagination.page) {
            params.append("page", pagination.page);
        }
        if (pagination.limit) {
            params.append("limit", pagination.limit);
        }

        const response = await api.get(`/admin/invoice?${params.toString()}`);
        return response.data;
    } catch (error) {
        throw error;
    }
};
