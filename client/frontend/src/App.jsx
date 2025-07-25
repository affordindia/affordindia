import React from "react";
import { Routes, Route } from "react-router-dom";
import Navbar from "./components/common/Navbar.jsx";
import Footer from "./components/common/Footer.jsx";
import PromoStrip from "./components/common/PromoStrip.jsx";
import Home from "./pages/Home.jsx";
import Products from "./pages/Products.jsx";
import ProductDetail from "./pages/ProductDetail.jsx";
import Cart from "./pages/Cart.jsx";
import Checkout from "./pages/Checkout.jsx";
import OrderConfirmation from "./pages/OrderConfirmation.jsx";
import OrderDetail from "./pages/OrderDetail.jsx";
import Wishlist from "./pages/Wishlist.jsx";
import Signup from "./pages/Signup.jsx";
import Profile from "./pages/Profile.jsx";
import Orders from "./pages/Orders.jsx";
import Rakhi from "./pages/Rakhi.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import ReturnPolicy from "./pages/static/ReturnPolicy.jsx";
import TermsCondition from "./pages/static/TermsCondition.jsx";
import PrivacyPolicy from "./pages/static/PrivacyPolicy.jsx";
import Shipping from "./pages/static/Shipping.jsx";
import CancelationPolicy from "./pages/static/CancelationPolicy.jsx";
import Faq from "./pages/static/Faq.jsx";
import AboutUs from "./pages/static/AboutUs.jsx";
import ContactUs from "./pages/ContactUs.jsx";

const App = () => {
    const { login } = useAuth();

    return (
        <div className="flex flex-col min-h-screen">
            {/* Promotional Strip */}
            <PromoStrip />
            <Navbar />
            <main className="flex-1">
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/products" element={<Products />} />
                    <Route path="/products/:material" element={<Products />} />
                    <Route
                        path="/products/id/:id"
                        element={<ProductDetail />}
                    />
                    <Route path="/rakhi" element={<Rakhi />} />
                    <Route
                        path="/login"
                        element={<Signup onAuthSuccess={login} />}
                    />
                    <Route
                        path="/signup"
                        element={<Signup onAuthSuccess={login} />}
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
                        path="/orders"
                        element={
                            <ProtectedRoute>
                                <Orders />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/orders/:orderId"
                        element={
                            <ProtectedRoute>
                                <OrderDetail />
                            </ProtectedRoute>
                        }
                    />
                    <Route path="/cart" element={<Cart />} />
                    <Route
                        path="/checkout"
                        element={
                            <ProtectedRoute>
                                <Checkout />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/order-confirmation/:orderId"
                        element={
                            <ProtectedRoute>
                                <OrderConfirmation />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="/wishlist"
                        element={
                            <ProtectedRoute>
                                <Wishlist />
                            </ProtectedRoute>
                        }
                    />
                    <Route
                        path="*"
                        element={
                            <div className="p-8 text-center">404 Not Found</div>
                        }
                    />

                    <Route path="/returnpolicy" element={<ReturnPolicy />} />
                    <Route path="/terms" element={<TermsCondition />} />
                    <Route path="/privacy" element={<PrivacyPolicy />} />
                    <Route path="/shipping" element={<Shipping />} />
                    <Route path="/cancel" element={<CancelationPolicy />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/faqs" element={<Faq />} />
                </Routes>
            </main>
            <Footer />
        </div>
    );
};

export default App;
