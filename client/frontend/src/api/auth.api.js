import api from "./axios";

// Verify Firebase token and authenticate user
export const verifyPhoneAuth = async (firebaseToken) => {
    console.log("API CALL: verifyPhoneAuth");
    const res = await api.post("/auth/phone", { firebaseToken });
    return res.data;
};

// Refresh JWT token
export const refreshToken = async (refreshToken) => {
    console.log("API CALL: refreshToken");
    const res = await api.post("/auth/refresh", { refreshToken });
    return res.data;
};

// Get current user info
export const getCurrentUser = async () => {
    console.log("API CALL: getCurrentUser");
    const res = await api.get("/auth/me");
    return res.data;
};

// Helper method to store tokens in localStorage
export const setAuthTokens = (accessToken, refreshToken) => {
    localStorage.setItem("authToken", accessToken);
    localStorage.setItem("refreshToken", refreshToken);
};

// Helper method to get access token from localStorage
export const getAuthToken = () => {
    return localStorage.getItem("authToken");
};

// Helper method to get refresh token from localStorage
export const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
};

// Helper method to remove tokens from localStorage
export const removeAuthTokens = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
};

// Legacy method for backward compatibility
export const setAuthToken = (token) => {
    localStorage.setItem("authToken", token);
};

// Legacy method for backward compatibility
export const removeAuthToken = () => {
    localStorage.removeItem("authToken");
    localStorage.removeItem("refreshToken");
};

// Check if user is authenticated
export const isAuthenticated = () => {
    const token = getAuthToken();
    return !!token;
};
