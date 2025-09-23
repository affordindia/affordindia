import React, { createContext, useContext, useState, useEffect } from "react";
import api from "../api/axios.js";
import { useAuth } from "./AuthContext.jsx";

const RBACContext = createContext();

export const useRBAC = () => {
    const context = useContext(RBACContext);
    if (!context) {
        throw new Error("useRBAC must be used within an RBACProvider");
    }
    return context;
};

export const RBACProvider = ({ children }) => {
    const { admin } = useAuth();
    const [accessLevels, setAccessLevels] = useState({});
    const [permissions, setPermissions] = useState({});
    const [userPermissions, setUserPermissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Only fetch RBAC config and permissions if authenticated (admin exists)
    useEffect(() => {
        const fetchRBAC = async () => {
            setLoading(true);
            setError(null);
            try {
                if (admin) {
                    const rbacRes = await api.get("/admin/auth/rbac-config");
                    if (rbacRes.data?.success) {
                        setAccessLevels(rbacRes.data.data?.ACCESS_LEVELS || {});
                        setPermissions(rbacRes.data.data?.PERMISSIONS || {});
                    } else {
                        setError(
                            rbacRes.data?.message ||
                                "Failed to fetch RBAC config"
                        );
                    }

                    const permRes = await api.get("/admin/auth/permissions");
                    if (permRes.data?.success) {
                        setUserPermissions(
                            permRes.data.data?.permissions || []
                        );
                    } else {
                        setUserPermissions([]);
                    }
                } else {
                    setAccessLevels({});
                    setPermissions({});
                    setUserPermissions([]);
                }
            } catch (e) {
                setError(e.message || "RBAC fetch failed");
            } finally {
                setLoading(false);
            }
        };
        fetchRBAC();
    }, [admin]);

    // Permission helpers
    const hasPermission = (permission) => {
        return userPermissions.includes(permission);
    };

    const hasAnyPermission = (permList) => {
        return permList.some((p) => hasPermission(p));
    };

    const hasAllPermissions = (permList) => {
        return permList.every((p) => hasPermission(p));
    };

    return (
        <RBACContext.Provider
            value={{
                accessLevels,
                permissions,
                userPermissions,
                loading,
                error,
                hasPermission,
                hasAnyPermission,
                hasAllPermissions,
            }}
        >
            {children}
        </RBACContext.Provider>
    );
};

export default RBACContext;
