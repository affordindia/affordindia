import React from "react";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
    const navigate = useNavigate();
    return (
        <div className="min-h-96 flex flex-col items-center justify-center bg-admin-bg">
            <h1 className="text-3xl font-bold text-admin-error mb-4">
                Access Denied
            </h1>
            <p className="text-admin-text-secondary mb-6">
                You do not have permission to view this page or feature.
            </p>
            <button
                onClick={() => navigate(-1)}
                className="text-admin-primary px-4 py-2 rounded-lg border border-admin-primary bg-white hover:bg-admin-bg transition-colors"
            >
                Go Back
            </button>
        </div>
    );
};

export default AccessDenied;
