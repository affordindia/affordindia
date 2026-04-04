import api from "./axios";

// Get all categories
export const getCategories = async () => {
    // console.log("API CALL: getCategories");
    const res = await api.get("/categories");
    return res.data;
};

// Get categories with hierarchy (root categories with their subcategories)
export const getCategoriesWithHierarchy = async () => {
    // console.log("API CALL: getCategoriesWithHierarchy");
    const res = await api.get("/categories/hierarchy");
    return res.data;
};

// Get root categories only
export const getRootCategories = async () => {
    // console.log("API CALL: getRootCategories");
    const res = await api.get("/categories/root");
    return res.data;
};

// Get subcategories by parent category ID
export const getSubcategories = async (parentId) => {
    // console.log("API CALL: getSubcategories", parentId);
    const res = await api.get(`/categories/${parentId}/subcategories`);
    return res.data;
};

// Get all subcategories (for preloading in context)
export const getAllSubcategories = async () => {
    // console.log("API CALL: getAllSubcategories");
    const res = await api.get("/categories/subcategories/all");
    return res.data;
};
