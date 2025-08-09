import React, { useEffect } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import Loader from "./common/Loader.jsx";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            navigate("/login", {
                state: { from: location.pathname },
                replace: true,
            });
        }
    }, [isAuthenticated, loading, navigate, location.pathname]);

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (!isAuthenticated) {
        return null;
    }

    return children;
};

export default ProtectedRoute;
