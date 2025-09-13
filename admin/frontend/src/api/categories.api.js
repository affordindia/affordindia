import api from "./axios.js";

export const getCategories = async () => {
    try {
        // Fetch all categories without pagination limit
        const response = await api.get("/categories?limit=1000");
        return {
            success: true,
            data: response.data, // Return categories array directly
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch categories",
        };
    }
};

export const getCategory = async (id) => {
    try {
        const response = await api.get(`/categories/${id}`);
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
                "Failed to fetch category",
        };
    }
};

export const createCategory = async (categoryData) => {
    try {
        const response = await api.post("/categories", categoryData);
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
                "Failed to create category",
        };
    }
};

export const updateCategory = async (id, categoryData) => {
    try {
        const response = await api.put(`/categories/${id}`, categoryData);
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
                "Failed to update category",
        };
    }
};

export const deleteCategory = async (id) => {
    try {
        const response = await api.delete(`/categories/${id}`);
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
                "Failed to delete category",
        };
    }
};

export const getRootCategories = async () => {
    try {
        const response = await api.get("/categories?limit=1000");
        // Filter only root categories (those without parentCategory)
        const rootCategories = response.data.filter(
            (category) => !category.parentCategory
        );
        return {
            success: true,
            data: rootCategories,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to fetch root categories",
        };
    }
};

export const getCategoryUsage = async (id) => {
    try {
        const response = await api.get(`/categories/${id}/usage`);
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
                "Failed to fetch category usage",
        };
    }
};
