import axios from "./axios";

// Create order
export const createOrder = async (orderData) => {
    console.log("API CALL: createOrder", orderData);
    const res = await axios.post("/orders", orderData);
    return res.data;
};

// List orders
export const getOrders = async () => {
    console.log("API CALL: getOrders");
    const res = await axios.get("/orders");
    return res.data;
};

// Get order by ID
export const getOrderById = async (orderId) => {
    console.log("API CALL: getOrderById", orderId);
    const res = await axios.get(`/orders/${orderId}`);
    return res.data;
};

// Cancel order
export const cancelOrder = async (orderId) => {
    console.log("API CALL: cancelOrder", orderId);
    const res = await axios.put(`/orders/${orderId}/cancel`);
    return res.data;
};

// Return order
export const returnOrder = async (orderId) => {
    console.log("API CALL: returnOrder", orderId);
    const res = await axios.put(`/orders/${orderId}/return`);
    return res.data;
};
