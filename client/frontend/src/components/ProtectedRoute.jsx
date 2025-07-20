import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        if (!loading && !isAuthenticated) {
            // Save the current path so we can redirect back after login
            navigate('/login', { 
                state: { from: location.pathname },
                replace: true 
            });
        }
    }, [isAuthenticated, loading, navigate, location.pathname]);

    if (loading) {
        return (
            <div className="loading-container">
                <div className="loading-spinner">
                    <div className="spinner"></div>
                    <p>Loading...</p>
                </div>
            </div>
        );
    }

    if (!isAuthenticated) {
        return null; // Component will redirect, so return null
    }

    return children;
};

export default ProtectedRoute;
