import api from "./axios.js";

/**
 * Get all products with filters and pagination
 */
export const getProducts = async (params = {}) => {
    try {
        const response = await api.get("/products", { params });
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
                "Failed to fetch products",
        };
    }
};

/**
 * Get single product by ID
 */
export const getProduct = async (id) => {
    try {
        const response = await api.get(`/products/${id}`);
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
                "Failed to fetch product",
        };
    }
};

/**
 * Create new product
 */
export const createProduct = async (productData) => {
    try {
        const formData = new FormData();

        // Add basic product data
        Object.keys(productData).forEach((key) => {
            if (key !== "images") {
                let value = productData[key];

                // Convert boolean values to strings properly for FormData
                if (typeof value === "boolean") {
                    value = value.toString();
                }

                // Handle nested objects (like dimensions)
                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    Object.keys(value).forEach((nestedKey) => {
                        formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
                    });
                }
                // Handle arrays properly (especially subcategories)
                else if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item);
                    });
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Add images if provided
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                formData.append("images", image);
            });
        }

        const response = await api.post("/products", formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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
                "Failed to create product",
        };
    }
};

/**
 * Update existing product
 */
export const updateProduct = async (id, productData) => {
    try {
        const formData = new FormData();

        // Add basic product data
        Object.keys(productData).forEach((key) => {
            if (key !== "images") {
                let value = productData[key];

                // Convert boolean values to strings properly for FormData
                if (typeof value === "boolean") {
                    value = value.toString();
                }

                // Handle nested objects (like dimensions)
                if (typeof value === "object" && value !== null && !Array.isArray(value)) {
                    Object.keys(value).forEach((nestedKey) => {
                        formData.append(`${key}[${nestedKey}]`, value[nestedKey]);
                    });
                }
                // Handle arrays properly (especially subcategories)
                else if (Array.isArray(value)) {
                    value.forEach((item) => {
                        formData.append(`${key}[]`, item);
                    });
                } else {
                    formData.append(key, value);
                }
            }
        });

        // Add new images if provided
        if (productData.images && productData.images.length > 0) {
            productData.images.forEach((image) => {
                if (image instanceof File) {
                    formData.append("images", image);
                }
            });
        }

        const response = await api.put(`/products/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
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
                "Failed to update product",
        };
    }
};

/**
 * Delete product
 */
export const deleteProduct = async (id) => {
    try {
        await api.delete(`/products/${id}`);
        return {
            success: true,
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Failed to delete product",
        };
    }
};

/**
 * Update product stock
 */
export const updateProductStock = async (id, stock) => {
    try {
        const response = await api.patch(`/products/${id}/stock`, { stock });
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
                "Failed to update stock",
        };
    }
};

/**
 * Toggle product featured status
 */
export const toggleProductFeature = async (id, isFeatured) => {
    try {
        const response = await api.patch(`/products/${id}/feature`, {
            isFeatured,
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
                "Failed to update featured status",
        };
    }
};

/**
 * Get low stock products
 */
export const getLowStockProducts = async () => {
    try {
        const response = await api.get("/products/low-stock");
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
                "Failed to fetch low stock products",
        };
    }
};
