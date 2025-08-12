import React, { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";
import AdminNavbar from "./components/common/AdminNavbar.jsx";
import AdminSidebar from "./components/common/AdminSidebar.jsx";
import AdminFooter from "./components/common/AdminFooter.jsx";
import Loader from "./components/common/Loader.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
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
                                <Route
                                    path="/products"
                                    element={
                                        <ProtectedRoute>
                                            <Products />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/view/:id"
                                    element={
                                        <ProtectedRoute>
                                            <ProductDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/add"
                                    element={
                                        <ProtectedRoute>
                                            <AddProduct />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/products/edit/:id"
                                    element={
                                        <ProtectedRoute>
                                            <EditProduct />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders"
                                    element={
                                        <ProtectedRoute>
                                            <Orders />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/orders/:id"
                                    element={
                                        <ProtectedRoute>
                                            <OrderDetail />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons"
                                    element={
                                        <ProtectedRoute>
                                            <Coupons />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons/add"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditCoupon />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/coupons/edit/:id"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditCoupon />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories"
                                    element={
                                        <ProtectedRoute>
                                            <Categories />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories/add"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditCategory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/categories/edit/:id"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditCategory />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners"
                                    element={
                                        <ProtectedRoute>
                                            <Banners />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners/add"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditBanner />
                                        </ProtectedRoute>
                                    }
                                />
                                <Route
                                    path="/banners/edit/:id"
                                    element={
                                        <ProtectedRoute>
                                            <AddEditBanner />
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
