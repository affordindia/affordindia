import React, { createContext, useContext, useState, useEffect } from "react";
import {
    getCurrentUser,
    refreshToken,
    setAuthTokens,
    getAuthToken,
    getRefreshToken,
    removeAuthTokens,
} from "../api/auth.api";

const AuthContext = createContext();

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    // Initialize authentication state on app load
    useEffect(() => {
        const initAuth = async () => {
            try {
                const savedToken = getAuthToken();
                const savedRefreshToken = getRefreshToken();

                if (savedToken && savedRefreshToken) {
                    // Verify token is still valid by fetching user info
                    const response = await getCurrentUser();
                    setUser(response.user);
                    setToken(savedToken);
                    setIsAuthenticated(true);
                } else {
                    setIsAuthenticated(false);
                }
            } catch (error) {
                console.error("Auth initialization error:", error);
                // Token might be expired or invalid, clear them
                removeAuthTokens();
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };

        initAuth();
    }, []);

    const login = (userData, accessToken, refreshToken) => {
        setUser(userData);
        setToken(accessToken);
        setIsAuthenticated(true);
        setAuthTokens(accessToken, refreshToken);
    };

    const refreshAuthToken = async () => {
        try {
            const savedRefreshToken = getRefreshToken();
            if (!savedRefreshToken)
                throw new Error("No refresh token available");

            const response = await refreshToken(savedRefreshToken);
            setToken(response.token);
            setAuthTokens(response.token, response.refreshToken);
            return response.token;
        } catch (error) {
            console.error("Token refresh error:", error);
            logout();
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setIsAuthenticated(false);
        removeAuthTokens();
    };

    const updateUser = (userData) => {
        setUser(userData);
    };

    const value = {
        user,
        token,
        loading,
        isAuthenticated,
        login,
        logout,
        refreshToken: refreshAuthToken,
        updateUser,
    };

    return (
        <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
    );
};
