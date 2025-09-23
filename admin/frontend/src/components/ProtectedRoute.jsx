import React from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useRBAC } from "../context/RBACContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "./common/Loader.jsx";

const ProtectedRoute = ({ children, requirePermissions }) => {
    const { isAuthenticated, loading: authLoading } = useAuth();
    const {
        hasPermission,
        hasAllPermissions,
        loading: rbacLoading,
    } = useRBAC();
    const navigate = useNavigate();
    const location = useLocation();

    // Show loader while either Auth or RBAC is loading
    if (authLoading || rbacLoading) {
        return <Loader fullScreen={true} />;
    }

    // Not authenticated: redirect to login, but avoid loop if already on /login
    if (!isAuthenticated) {
        if (location.pathname !== "/login") {
            navigate("/login", {
                state: { from: location.pathname },
                replace: true,
            });
        }
        return null;
    }

    // Permission check
    if (requirePermissions) {
        const perms = Array.isArray(requirePermissions)
            ? requirePermissions
            : [requirePermissions];
        if (!hasAllPermissions(perms)) {
            navigate("/access-denied", { replace: true });
            return null;
        }
    }

    return children;
};

export default ProtectedRoute;
