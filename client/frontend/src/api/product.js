import api from "./axios";

// List products (supports filters, search, sort, etc.)
export const getProducts = async (params) => {
    console.log("API CALL: getProducts", params);
    const res = await api.get("/products", { params });
    return res.data;
};

// Get single product by ID
export const getProductById = async (id) => {
    console.log("API CALL: getProductById", id);
    const res = await api.get(`/products/${id}`);
    return res.data;
};

// Get featured products
export const getFeaturedProducts = async (params) => {
    console.log("API CALL: getFeaturedProducts", params);
    const res = await api.get("/products/featured", { params });
    return res.data;
};

// Get new products
export const getNewProducts = async (params) => {
    console.log("API CALL: getNewProducts", params);
    const res = await api.get("/products/new", { params });
    return res.data;
};

// Get popular products
export const getPopularProducts = async (params) => {
    console.log("API CALL: getPopularProducts", params);
    const res = await api.get("/products/popular", { params });
    return res.data;
};

// Get related products for a product
export const getRelatedProducts = async (id) => {
    console.log("API CALL: getRelatedProducts", id);
    const res = await api.get(`/products/${id}/related`);
    return res.data;
};

// Get multiple products by IDs in a single request
export const getProductsByIds = async (productIds) => {
    console.log("API CALL: getProductsByIds", productIds);
    const res = await api.post("/products/bulk", { productIds });
    return res.data;
};
