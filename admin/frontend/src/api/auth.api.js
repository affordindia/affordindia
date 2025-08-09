import api from "./axios.js";

export const adminLogin = async (credentials) => {
    console.log("API CALL: adminLogin");
    try {
        console.log("Attempting login with credentials:", {
            email: credentials.email,
        });

        const response = await api.post("/admin/login", {
            email: credentials.email,
            password: credentials.password,
        });

        console.log("Login response:", response.data);

        // Backend returns only { token }, so we create admin data
        const adminData = {
            email: credentials.email,
            id: "admin",
            name: "Admin User",
            role: "admin",
        };

        return {
            success: true,
            data: response.data,
            token: response.data.token,
            admin: adminData,
        };
    } catch (error) {
        console.error("Auth API - Login error:", error);

        let errorMessage = "Login failed";
        if (error.code === "ECONNABORTED") {
            errorMessage = "Request timeout - server may be slow";
        } else if (error.code === "ERR_NETWORK") {
            errorMessage = "Cannot connect to server - check if it's running";
        } else if (error.response?.status === 401) {
            errorMessage = "Invalid email or password";
        } else if (error.response?.data?.message) {
            errorMessage = error.response.data.message;
        } else if (error.message) {
            errorMessage = error.message;
        }

        return {
            success: false,
            error: errorMessage,
            status: error.response?.status || 500,
        };
    }
};
