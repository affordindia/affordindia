import api from "./axios.js";

// Login
export const login = async ({ email, password }) => {
    try {
        const res = await api.post("/admin/auth/login", { email, password });
        if (res.data?.success) {
            return { success: true, admin: res.data.data?.admin };
        }
        return { success: false, error: res.data?.message || "Login failed" };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Login failed",
        };
    }
};

// Logout
export const logout = async () => {
    try {
        const res = await api.post("/admin/auth/logout");
        return { success: res.data?.success };
    } catch (error) {
        return { success: false, error: error.message || "Logout failed" };
    }
};

// Refresh token
export const refreshToken = async () => {
    try {
        const res = await api.post("/admin/auth/refresh");
        return { success: res.data?.success };
    } catch (error) {
        return { success: false, error: error.message || "Refresh failed" };
    }
};

// Fetch profile
export const fetchProfile = async () => {
    try {
        const res = await api.get("/admin/auth/profile");
        if (res.data?.success) {
            return { success: true, admin: res.data.data?.admin };
        }
        return {
            success: false,
            error: res.data?.message || "Profile fetch failed",
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Profile fetch failed",
        };
    }
};

// Register admin
export const registerAdmin = async (adminData) => {
    try {
        const res = await api.post("/admin/auth/register", adminData);
        if (res.data?.success) {
            return { success: true, admin: res.data.data?.admin };
        }
        return {
            success: false,
            error: res.data?.message || "Register failed",
        };
    } catch (error) {
        return {
            success: false,
            error:
                error.response?.data?.message ||
                error.message ||
                "Register failed",
        };
    }
};
