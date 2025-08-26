import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AccessDenied from "./components/AccessDenied.jsx";
import AdminNavbar from "./components/common/AdminNavbar.jsx";
import AdminSidebar from "./components/common/AdminSidebar.jsx";
import AdminFooter from "./components/common/AdminFooter.jsx";
import Loader from "./components/common/Loader.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/dashboard/Dashboard.jsx";
import Analytics from "./pages/analytics/Analytics.jsx";
import Profile from "./pages/profile/Profile.jsx";
import Products from "./pages/products/Products.jsx";
import ProductDetail from "./pages/products/ProductDetail.jsx";
import AddProduct from "./pages/products/AddProduct.jsx";
import EditProduct from "./pages/products/EditProduct.jsx";
import Orders from "./pages/orders/Orders.jsx";
import OrderDetail from "./pages/orders/OrderDetail.jsx";
import Coupons from "./pages/Coupons/Coupons.jsx";
import AddEditCoupon from "./pages/Coupons/AddEditCoupon.jsx";
import Categories from "./pages/Categories/Categories.jsx";
import AddEditCategory from "./pages/Categories/AddEditCategory.jsx";
import Banners from "./pages/Banners/Banners.jsx";
import AddEditBanner from "./pages/Banners/AddEditBanner.jsx";
import Users from "./pages/users/Users.jsx";
import UserDetail from "./pages/users/UserDetail.jsx";
import Reviews from "./pages/reviews/Reviews.jsx";
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

    // Always show loader while checking authentication
    if (loading) {
        return (
            <div className="min-h-screen bg-admin-bg flex items-center justify-center">
                <Loader fullScreen={true} />
            </div>
        );
    }

    // After loading, show login page if not authenticated
    if (!isAuthenticated) {
        return (
            <div className="min-h-screen bg-admin-bg">
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/access-denied" element={<AccessDenied />} />
                    <Route
                        path="*"
                        element={<Navigate to="/login" replace />}
                    />
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
                                    path="/access-denied"
                                    element={<AccessDenied />}
                                />
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
                                <Route
                                    path="/profile"
                                    element={
                                        <ProtectedRoute>
                                            <Profile />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/analytics"
                                    element={
                                        <ProtectedRoute requirePermissions="analytics.view">
                                            <Analytics />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products"
                                    element={
                                        <ProtectedRoute requirePermissions="products.view">
                                            <Products />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/view/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="products.view">
                                            <ProductDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/add"
                                    element={
                                        <ProtectedRoute requirePermissions="products.create">
                                            <AddProduct />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/edit/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="products.update">
                                            <EditProduct />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute requirePermissions="orders.view">
                                            <Orders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="orders.view">
                                            <OrderDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons"
                                    element={
                                        <ProtectedRoute requirePermissions="coupons.view">
                                            <Coupons />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons/add"
                                    element={
                                        <ProtectedRoute requirePermissions="coupons.create">
                                            <AddEditCoupon />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons/edit/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="coupons.update">
                                            <AddEditCoupon />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories"
                                    element={
                                        <ProtectedRoute requirePermissions="categories.view">
                                            <Categories />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories/add"
                                    element={
                                        <ProtectedRoute requirePermissions="categories.create">
                                            <AddEditCategory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories/edit/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="categories.update">
                                            <AddEditCategory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners"
                                    element={
                                        <ProtectedRoute requirePermissions="banners.view">
                                            <Banners />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners/add"
                                    element={
                                        <ProtectedRoute requirePermissions="banners.create">
                                            <AddEditBanner />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners/edit/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="banners.update">
                                            <AddEditBanner />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/users"
                                    element={
                                        <ProtectedRoute requirePermissions="users.view">
                                            <Users />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/users/:id"
                                    element={
                                        <ProtectedRoute requirePermissions="users.view">
                                            <UserDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/reviews"
                                    element={
                                        <ProtectedRoute requirePermissions="reviews.view">
                                            <Reviews />
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
