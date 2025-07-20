import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5001/api",
});

// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

// Response interceptor to handle token refresh
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;
        
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;
            
            try {
                const refreshToken = localStorage.getItem("refreshToken");
                if (!refreshToken) {
                    // No refresh token, redirect to login
                    localStorage.removeItem("authToken");
                    window.location.href = "/login";
                    return Promise.reject(error);
                }
                
                // Try to refresh the token
                const refreshResponse = await axios.post(
                    `${api.defaults.baseURL}/auth/refresh`,
                    { refreshToken }
                );
                
                const { token: newAccessToken, refreshToken: newRefreshToken } = refreshResponse.data;
                
                // Update tokens
                localStorage.setItem("authToken", newAccessToken);
                localStorage.setItem("refreshToken", newRefreshToken);
                
                // Retry the original request with new token
                originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
                return api(originalRequest);
                
            } catch (refreshError) {
                // Refresh failed, clear tokens and redirect to login
                localStorage.removeItem("authToken");
                localStorage.removeItem("refreshToken");
                window.location.href = "/login";
                return Promise.reject(refreshError);
            }
        }
        
        return Promise.reject(error);
    }
);

export default api;
