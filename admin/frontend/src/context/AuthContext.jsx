import React, { createContext, useContext, useState, useEffect } from "react";
import {
    login as apiLogin,
    logout as apiLogout,
    fetchProfile,
    refreshToken,
} from "../api/auth.api.js";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [admin, setAdmin] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // On mount, fetch profile to check authentication, but skip if on /login
    useEffect(() => {
        const checkAuth = async () => {
            // Only fetch profile if not on /login
            if (window.location.pathname === "/login") {
                setLoading(false);
                return;
            }
            setLoading(true);
            setError(null);
            try {
                const res = await fetchProfile();
                if (res.success) {
                    setAdmin(res.admin);
                } else {
                    setAdmin(null);
                }
            } catch (e) {
                setAdmin(null);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    // Login
    const login = async (credentials) => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiLogin(credentials);
            if (res.success) {
                setAdmin(res.admin);
                return { success: true };
            } else {
                setError(res.error);
                return { success: false, error: res.error };
            }
        } catch (e) {
            setError(e.message || "Login failed");
            return { success: false, error: e.message || "Login failed" };
        } finally {
            setLoading(false);
        }
    };

    // Logout
    const logout = async () => {
        setLoading(true);
        setError(null);
        try {
            await apiLogout();
        } catch (e) {
            // ignore
        } finally {
            setAdmin(null);
            setLoading(false);
        }
    };

    // Token refresh (can be called from axios or manually)
    const handleTokenRefresh = async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await refreshToken();
            if (res.success) {
                // Optionally re-fetch profile
                const profileRes = await fetchProfile();
                if (profileRes.success) {
                    setAdmin(profileRes.admin);
                }
                return true;
            }
            setAdmin(null);
            return false;
        } catch (e) {
            setAdmin(null);
            return false;
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthContext.Provider
            value={{
                admin,
                isAuthenticated: !!admin,
                loading,
                error,
                login,
                logout,
                handleTokenRefresh,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};
