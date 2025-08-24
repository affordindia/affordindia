import React from "react";
import { Link } from "react-router-dom";

const AccessDenied = () => (
    <div className="min-h-screen flex flex-col items-center justify-center bg-admin-bg">
        <h1 className="text-3xl font-bold text-admin-error mb-4">
            Access Denied
        </h1>
        <p className="text-admin-text-secondary mb-6">
            You do not have permission to view this page or feature.
        </p>
        <Link to="/dashboard" className="text-admin-primary hover:underline">
            Go to Dashboard
        </Link>
    </div>
);

export default AccessDenied;
