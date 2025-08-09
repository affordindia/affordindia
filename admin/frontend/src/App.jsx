import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/common/AdminNavbar.jsx";
import AdminSidebar from "./components/common/AdminSidebar.jsx";
import AdminFooter from "./components/common/AdminFooter.jsx";
import Loader from "./components/common/Loader.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";

const App = () => {
    const { isAuthenticated, loading } = useAuth();
    const [sidebarOpen, setSidebarOpen] = useState(false);

    // Close sidebar on window resize (desktop)
    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth >= 1024) {
                setSidebarOpen(false);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const toggleSidebar = () => {
        setSidebarOpen(!sidebarOpen);
    };

    const closeSidebar = () => {
        setSidebarOpen(false);
    };

    // Show loading screen while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <Loader />
            </div>
        );
    }

    // If not authenticated, show login page
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-admin-bg">
                <Routes>
                    <Route path="*" element={<Login />} />
                </Routes>
            </div>
        );
    }

    // Admin layout with navbar at top, sidebar below navbar
    return (
        <div className="min-h-screen bg-admin-bg">
            {/* Navbar - Full Width at Top */}
            <AdminNavbar
                toggleSidebar={toggleSidebar}
                sidebarOpen={sidebarOpen}
            />

            {/* Content Area Below Navbar */}
            <div className="pt-16 flex min-h-screen">
                {/* Sidebar - Below Navbar */}
                <AdminSidebar
                    sidebarOpen={sidebarOpen}
                    closeSidebar={closeSidebar}
                />

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col lg:ml-64">
                    {/* Main Content */}
                    <main className="flex-1">
                        <div className="min-h-full p-4 sm:p-6">
                            <Routes>
                                <Route
                                    path="/"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/dashboard"
                                    element={
                                        <ProtectedRoute>
                                            <Dashboard />
                                        </ProtectedRoute>
                                    }
                                />
                            </Routes>
                        </div>
                    </main>

                    {/* Footer */}
                    <AdminFooter />
                </div>
            </div>
        </div>
    );
};

export default App;
