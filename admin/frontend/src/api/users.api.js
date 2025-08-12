import api from "./axios.js";

// Get all users with pagination and filters
export const getUsers = async (params = {}) => {
    const response = await api.get("/users", { params });
    return response.data;
};

// Get user by ID
export const getUserById = async (id) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
};

// Block user
export const blockUser = async (id) => {
    const response = await api.patch(`/users/${id}/block`);
    return response.data;
};

// Unblock user
export const unblockUser = async (id) => {
    const response = await api.patch(`/users/${id}/unblock`);
    return response.data;
};

// Delete user
export const deleteUser = async (id) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
};

// Get user statistics
export const getUserStats = async () => {
    const response = await api.get("/users/stats");
    return response.data;
};
