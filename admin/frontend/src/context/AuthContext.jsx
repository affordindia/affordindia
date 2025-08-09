import React, { createContext, useContext, useState, useEffect } from "react";
import { adminLogin } from "../api/auth.api.js";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Helper function to decode JWT token (without verification - just to check expiry)
const isTokenValid = (token) => {
    if (!token) return false;

    try {
        // Parse JWT payload (base64 decode)
        const payload = JSON.parse(atob(token.split(".")[1]));
        const currentTime = Date.now() / 1000;

        // Check if token is expired
        if (payload.exp && payload.exp < currentTime) {
            console.log("Token expired");
            return false;
        }

        // Check if token has required admin credentials
        if (payload.email && payload.password) {
            return true;
        }

        return false;
    } catch (error) {
        console.error("Error parsing token:", error);
        return false;
    }
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize authentication state on app load
    useEffect(() => {
        const initAuth = () => {
            try {
                const savedToken = localStorage.getItem("admin_token");

                if (savedToken && isTokenValid(savedToken)) {
                    // Token exists and is valid
                    setToken(savedToken);
                    setAdmin({
                        id: "admin",
                        email: "admin@affordindia.com",
                        name: "Admin User",
                        role: "admin",
                    });
                    setIsAuthenticated(true);
                } else {
                    // No token or token is invalid/expired
                    localStorage.removeItem("admin_token");
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                localStorage.removeItem("admin_token");
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = async (credentials) => {
        try {
            setLoading(true);

            // Use auth API for login
            const result = await adminLogin(credentials);

            if (result.success) {
                localStorage.setItem("admin_token", result.token);
                setToken(result.token);
                setAdmin(result.admin);
                setIsAuthenticated(true);

                return { success: true };
            } else {
                return {
                    success: false,
                    error: result.error,
                };
            }
        } catch (error) {
            console.error("Login error:", error);
            return {
                success: false,
                error: error.message || "Login failed",
            };
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        // Simple logout - just clear local state and storage
        localStorage.removeItem("admin_token");
        setToken(null);
        setAdmin(null);
        setIsAuthenticated(false);
    };

    const value = {
        admin,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
