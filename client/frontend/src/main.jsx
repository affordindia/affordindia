import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { UserProvider } from "./context/UserContext.jsx";
import { CartProvider } from "./context/CartContext.jsx";
import { WishlistProvider } from "./context/WishlistContext.jsx";
import { BrowserRouter } from "react-router-dom";

createRoot(document.getElementById("root")).render(
    <UserProvider>
        <CartProvider>
            <WishlistProvider>
                <BrowserRouter>
                    <App />
                </BrowserRouter>
            </WishlistProvider>
        </CartProvider>
    </UserProvider>
);
