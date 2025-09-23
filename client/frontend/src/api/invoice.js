import api from "./axios";

export const checkInvoiceExists = async (orderId) => {
    try {
        const response = await api.get(`/invoice/check/${orderId}`);
        return response.data;
    } catch (error) {
        console.error("Error checking invoice:", error);
        throw error.response?.data || { message: "Failed to check invoice" };
    }
};

export const downloadInvoice = async (orderId) => {
    try {
        const response = await api.get(`/invoice/download/${orderId}`, {
            responseType: "blob",
        });
        return response.data;
    } catch (error) {
        console.error("Error downloading invoice:", error);
        throw error.response?.data || { message: "Failed to download invoice" };
    }
};
