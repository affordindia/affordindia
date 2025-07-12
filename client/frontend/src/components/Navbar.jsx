import React from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";

const Navbar = () => {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const cartCount = cart?.items?.length || 0;
    // Wishlist is auth-only, so show 0 or disabled if not available
    const wishlistCount = wishlist?.items?.length || 0;

    return (
        <nav className="bg-white shadow flex items-center justify-between px-6 py-3 mb-6">
            <div className="flex items-center gap-6">
                <Link to="/" className="font-bold text-lg text-blue-600">
                    AffordIndia
                </Link>
                <Link to="/products" className="hover:text-blue-600">
                    Products
                </Link>
            </div>
            <div className="flex items-center gap-4">
                <Link to="/wishlist" className="relative flex items-center">
                    <span className="material-icons">favorite_border</span>
                    <span className="ml-1">Wishlist</span>
                    <span className="absolute -top-2 -right-2 bg-pink-500 text-white text-xs rounded-full px-1.5">
                        {wishlistCount}
                    </span>
                </Link>
                <Link to="/cart" className="relative flex items-center">
                    <span className="material-icons">shopping_cart</span>
                    <span className="ml-1">Cart</span>
                    <span className="absolute -top-2 -right-2 bg-blue-500 text-white text-xs rounded-full px-1.5">
                        {cartCount}
                    </span>
                </Link>
            </div>
        </nav>
    );
};

export default Navbar;
