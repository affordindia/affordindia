import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";

import { AuthProvider } from "./context/AuthContext"; // ✅ import AuthProvider
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <StrictMode>
        <AuthProvider> {/* ✅ Wrap everything with AuthProvider */}
            <UserProvider>
                <CartProvider>
                    <WishlistProvider>
                        <BrowserRouter>
                            <App />
                        </BrowserRouter>
                    </WishlistProvider>
                </CartProvider>
            </UserProvider>
        </AuthProvider>
    </StrictMode>
);
