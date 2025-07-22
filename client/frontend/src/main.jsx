import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { AuthProvider } from "./context/AuthContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { ProfileProvider } from "./context/ProfileContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <AuthProvider>
        <CartProvider>
            <WishlistProvider>
                <ProfileProvider>
                    <BrowserRouter>
                        <App />
                    </BrowserRouter>
                </ProfileProvider>
            </WishlistProvider>
        </CartProvider>
    </AuthProvider>
);
