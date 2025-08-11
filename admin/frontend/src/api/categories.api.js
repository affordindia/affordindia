import api from "./axios.js";

/**
 * Get all categories
 */
export const getCategories = async () => {
    try {
        const response = await api.get("/categories");
        return {
            success: true,
            data: {
                categories: response.data, // Backend returns categories array directly
            },
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

/**
 * Create new category
 */
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

/**
 * Update category
 */
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

/**
 * Delete category
 */
export const deleteCategory = async (id) => {
    try {
        await api.delete(`/categories/${id}`);
        return {
            success: true,
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
