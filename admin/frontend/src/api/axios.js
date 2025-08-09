import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:5000/api",
    timeout: 30000, // 30 seconds timeout
    headers: {
        "Content-Type": "application/json",
    },
});

// Request interceptor to add auth token and log requests
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("admin_token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        console.log(
            `Making ${config.method?.toUpperCase()} request to: ${
                config.baseURL
            }${config.url}`
        );
        return config;
    },
    (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
    }
);

// Response interceptor to handle errors
api.interceptors.response.use(
    (response) => {
        console.log(
            `Response from ${response.config.url}:`,
            response.status,
            response.statusText
        );
        return response;
    },
    (error) => {
        if (error.code === "ECONNABORTED") {
            console.error("Request timeout - server might be down or slow");
            error.message =
                "Request timeout - please check if the server is running";
        } else if (error.code === "ERR_NETWORK") {
            console.error("Network error - server might not be running");
            error.message =
                "Network error - please check if the server is running on port 5000";
        } else if (error.response?.status === 401) {
            console.warn("Unauthorized - clearing token");
            localStorage.removeItem("admin_token");
            window.location.href = "/login";
        } else if (error.response?.status >= 500) {
            console.error(
                "Server error:",
                error.response.status,
                error.response.statusText
            );
            error.message = `Server error (${error.response.status}): ${
                error.response.data?.message || "Internal server error"
            }`;
        } else if (error.response?.status >= 400) {
            console.error(
                "Client error:",
                error.response.status,
                error.response.data
            );
            error.message =
                error.response.data?.message ||
                `Client error (${error.response.status})`;
        }

        return Promise.reject(error);
    }
);

export default api;
