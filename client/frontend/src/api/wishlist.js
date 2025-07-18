import axios from "./axios";

// Get wishlist (supports filters: category, brand, minPrice, maxPrice, search)
export const getWishlist = async (params) => {
    console.log("API CALL: getWishlist", params);
    const res = await axios.get("/wishlist", { params });
    return res.data;
};

// Add item to wishlist
export const addToWishlist = async (productId) => {
    console.log("API CALL: addToWishlist", productId);
    const res = await axios.post("/wishlist", { productId });
    return res.data;
};

// Remove item from wishlist
export const removeFromWishlist = async (productId) => {
    console.log("API CALL: removeFromWishlist", productId);
    const res = await axios.delete(`/wishlist/${productId}`);
    return res.data;
};

// Move item from wishlist to cart
export const moveToCartFromWishlist = async (productId) => {
    console.log("API CALL: moveToCartFromWishlist", productId);
    const res = await axios.post(`/wishlist/${productId}/move-to-cart`);
    return res.data;
};
