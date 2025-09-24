import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 30000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

// Optional: log requests
api.interceptors.request.use(
    (config) => {
        // For FormData, let axios set the Content-Type automatically (including boundary)
        if (config.data instanceof FormData) {
            delete config.headers["Content-Type"];
        }
        // Cookies sent automatically
        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor: on 401, try refresh once, then logout/redirect if still unauthorized
api.interceptors.response.use(
    (response) => response,
    async (error) => {
        const originalRequest = error.config;

        // Only handle 401
        if (error.response?.status !== 401) {
            return Promise.reject(error);
        }

        // Prevent infinite loop
        if (originalRequest._retry) {
            return Promise.reject(error);
        }
        originalRequest._retry = true;

        // Don't refresh for auth endpoints
        const authPaths = [
            "/admin/auth/login",
            "/admin/auth/refresh",
            "/admin/auth/register",
        ];
        const reqUrl = originalRequest.url || "";
        if (authPaths.some((p) => reqUrl.includes(p))) {
            return Promise.reject(error);
        }

        try {
            // Always use POST and send credentials
            const refreshRes = await axios({
                method: "post",
                url: "/admin/auth/refresh",
                baseURL: api.defaults.baseURL,
                withCredentials: true,
                timeout: 15000,
                headers: {
                    "Content-Type": "application/json",
                },
            });
            if (refreshRes?.data?.success) {
                // Retry original request
                return api(originalRequest);
            }
        } catch (err) {
            // Ignore, will logout below
        }

        // Logout and redirect to login
        window.location.href = "/login";
        return Promise.reject(error);
    }
);

export default api;
