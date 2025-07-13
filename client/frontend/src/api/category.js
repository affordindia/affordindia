import api from "./axios";

// Get all categories
export const getCategories = async () => {
    console.log("API CALL: getCategories");
    const res = await api.get("/categories");
    return res.data;
};
