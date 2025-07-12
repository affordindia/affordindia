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
export const getFeaturedProducts = async () => {
    console.log("API CALL: getFeaturedProducts");
    const res = await api.get("/products/featured");
    return res.data;
};

// Get new products
export const getNewProducts = async () => {
    console.log("API CALL: getNewProducts");
    const res = await api.get("/products/new");
    return res.data;
};

// Get popular products
export const getPopularProducts = async () => {
    console.log("API CALL: getPopularProducts");
    const res = await api.get("/products/popular");
    return res.data;
};

// Get related products for a product
export const getRelatedProducts = async (id) => {
    console.log("API CALL: getRelatedProducts", id);
    const res = await api.get(`/products/${id}/related`);
    return res.data;
};
