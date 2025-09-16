import axios from "./axios";

// Get cart
export const getCart = async () => {
    // console.log("API CALL: getCart");
    const res = await axios.get("/cart");
    return res.data;
};

// Add or update item in cart
export const addOrUpdateCartItem = async (productId, quantity = 1) => {
    // console.log("API CALL: addOrUpdateCartItem", productId, quantity);
    const res = await axios.post("/cart", { productId, quantity });
    return res.data;
};

// Remove item from cart
export const removeCartItem = async (itemId) => {
    // console.log("API CALL: removeCartItem", itemId);
    const res = await axios.delete(`/cart/${itemId}`);
    return res.data;
};

// Clear cart
export const clearCart = async () => {
    // console.log("API CALL: clearCart");
    const res = await axios.delete("/cart/clear");
    return res.data;
};

// Merge guest cart
export const mergeCart = async (items) => {
    // console.log("API CALL: mergeCart", items);
    const res = await axios.post("/cart/merge", { items });
    return res.data;
};
