import React, { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
import { FaEye, FaEyeSlash, FaUser, FaLock } from "react-icons/fa";
import Loader from "../components/common/Loader.jsx";

const Login = () => {
    const { login, loading } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");

    const from = location.state?.from || "/dashboard";

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (loading) return;

        setError("");
        if (!formData.email || !formData.password) {
            setError("Please fill in all fields");
            return;
        }

        const result = await login({
            email: formData.email,
            password: formData.password,
        });

        if (result.success) {
            navigate(from, { replace: true });
        } else {
            // Handle various error types
            const errorMsg =
                result?.error ||
                result?.message ||
                "Login failed. Please check your credentials.";
            setError(errorMsg);
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-admin-bg to-admin-bg-secondary flex items-center justify-center p-4">
            <div className="max-w-md w-full space-y-8">
                {/* Header */}
                <div className="text-center">
                    <div className="mx-auto h-16 w-16 bg-admin-primary rounded-full flex items-center justify-center mb-4">
                        <span className="text-white text-2xl font-bold">A</span>
                    </div>
                    <h1 className="text-3xl font-bold text-admin-text font-montserrat">
                        Admin Portal
                    </h1>
                    <p className="mt-2 text-sm text-admin-text-secondary">
                        Sign in to access AffordIndia admin panel
                    </p>
                </div>

                {/* Login Form */}
                <div className="bg-admin-card rounded-2xl shadow-lg p-8 border border-admin-border">
                    {/* Error Message - always visible above the form */}
                    {error && (
                        <div
                            style={{
                                marginBottom: "1rem",
                                fontWeight: "bold",
                                color: "#d32f2f",
                                background: "#fdecea",
                                border: "1px solid #f44336",
                                borderRadius: "8px",
                                padding: "12px",
                                textAlign: "center",
                            }}
                        >
                            {error}
                        </div>
                    )}
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Email Input */}
                        <div>
                            <label
                                htmlFor="email"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Email Address
                            </label>
                            <div className="relative">
                                <FaUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted" />
                                <input
                                    id="email"
                                    name="email"
                                    type="email"
                                    required
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-4 py-3 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all duration-200 bg-admin-card"
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        {/* Password Input */}
                        <div>
                            <label
                                htmlFor="password"
                                className="block text-sm font-medium text-admin-text mb-2"
                            >
                                Password
                            </label>
                            <div className="relative">
                                <FaLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted" />
                                <input
                                    id="password"
                                    name="password"
                                    type={showPassword ? "text" : "password"}
                                    required
                                    value={formData.password}
                                    onChange={handleInputChange}
                                    className="w-full pl-10 pr-12 py-3 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent transition-all duration-200 bg-admin-card"
                                    placeholder="Enter your password"
                                />
                                <button
                                    type="button"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-admin-text-muted hover:text-admin-text-secondary focus:outline-none transition-colors"
                                >
                                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                                </button>
                            </div>
                        </div>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-admin-primary text-white py-3 px-4 rounded-lg font-semibold hover:bg-admin-primary-dark focus:outline-none focus:ring-2 focus:ring-admin-primary focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
                        >
                            {loading ? <Loader size="small" /> : "Sign In"}
                        </button>
                    </form>

                    {/* Footer */}
                    <div className="mt-6 text-center">
                        <p className="text-sm text-admin-text-secondary">
                            Forgot your password?{" "}
                            <button className="text-admin-primary hover:text-admin-primary-dark font-medium transition-colors">
                                Contact Support
                            </button>
                        </p>
                    </div>
                </div>

                {/* Additional Info */}
                <div className="text-center text-xs text-admin-text-muted">
                    © {new Date().getFullYear()} AffordIndia. All rights
                    reserved.
                </div>
            </div>
        </div>
    );
};

export default Login;
