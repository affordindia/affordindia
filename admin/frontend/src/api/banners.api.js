import api from "./axios.js";

// Get all banners
export const getBanners = async () => {
    try {
        const response = await api.get("/banners");
        return {
            success: true,
            data: response.data, // Return banners array directly
        };
    } catch (error) {
        console.error("Error fetching banners:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch banners",
        };
    }
};

// Get single banner by ID
export const getBanner = async (id) => {
    try {
        const response = await api.get(`/banners/${id}`);
        return {
            success: true,
            data: response.data, // Return banner directly
        };
    } catch (error) {
        console.error("Error fetching banner:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch banner",
        };
    }
};

// Create new banner
export const createBanner = async (bannerData) => {
    try {
        const response = await api.post("/banners", bannerData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error creating banner:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to create banner",
        };
    }
};

// Update banner
export const updateBanner = async (id, bannerData) => {
    try {
        const response = await api.put(`/banners/${id}`, bannerData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
        });
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error updating banner:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to update banner",
        };
    }
};

// Delete banner
export const deleteBanner = async (id) => {
    try {
        const response = await api.delete(`/banners/${id}`);
        return {
            success: true,
            data: response.data,
        };
    } catch (error) {
        console.error("Error deleting banner:", error);
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to delete banner",
        };
    }
};
