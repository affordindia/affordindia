import api from "./axios.js";

export const getReviews = async (params = {}) => {
    try {
        const response = await api.get("/reviews", { params });
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
                "Failed to fetch reviews",
        };
    }
};

export const getReviewById = async (reviewId) => {
    try {
        const response = await api.get(`/reviews/${reviewId}`);
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
                "Failed to fetch review",
        };
    }
};

export const toggleReviewVisibility = async (reviewId) => {
    try {
        const response = await api.patch(`/reviews/${reviewId}/toggle`);
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
                "Failed to toggle review visibility",
        };
    }
};

export const deleteReview = async (reviewId) => {
    try {
        const response = await api.delete(`/reviews/${reviewId}`);
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
                "Failed to delete review",
        };
    }
};

export const bulkReviewOperations = async (action, reviewIds) => {
    try {
        const response = await api.post("/reviews/bulk", {
            action,
            reviewIds,
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
                "Failed to perform bulk operation",
        };
    }
};

export const getReviewStats = async () => {
    try {
        const response = await api.get("/reviews/stats");
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
                "Failed to fetch review statistics",
        };
    }
};
