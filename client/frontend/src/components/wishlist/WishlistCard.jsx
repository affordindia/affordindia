import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Loader from "../common/Loader.jsx";

const WishlistCard = ({ product }) => {
    const { removeFromWishlist, moveToCartFromWishlist, loading } =
        useWishlist();
    const { refreshCart } = useCart();
    const [actionLoading, setActionLoading] = useState(false);

    const handleRemoveFromWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActionLoading(true);
        try {
            await removeFromWishlist(product._id);
        } finally {
            setActionLoading(false);
        }
    };

    const handleMoveToCart = async (e) => {
        e.preventDefault();
        e.stopPropagation();
        setActionLoading(true);
        try {
            // Move from wishlist to cart (backend handles both operations)
            await moveToCartFromWishlist(product._id);

            // Refresh cart to update the cart count and cart page
            await refreshCart();
        } catch (error) {
            console.error("Error moving to cart:", error);
        } finally {
            setActionLoading(false);
        }
    };

    return (
        <div className="bg-[#f9f7f3] rounded-xl shadow-md overflow-hidden relative hover:shadow-lg transition-all flex flex-col group w-full">
            {/* Product Link */}
            <Link
                to={`/products/id/${product._id}`}
                className="flex flex-col flex-1"
            >
                {/* Image */}
                <div className="w-full aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Info */}
                <div className="p-3 flex flex-col gap-2 flex-1">
                    <h3 className="text-lg font-medium truncate">
                        {product.name}
                    </h3>
                    <div className="flex items-center justify-between w-full">
                        <div className="text-base text-gray-700 font-semibold">
                            ₹{product.price}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                            <span>{product.rating || "4.5"}</span>
                            <span className="ml-1">★</span>
                            <span className="ml-2">|</span>
                            <span className="ml-2">
                                {product.reviews || 120}
                            </span>
                        </div>
                    </div>

                    {/* Stock Status */}
                    <div className="text-sm">
                        {product.stock > 0 ? (
                            <span className="text-green-600">
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-red-600">Out of Stock</span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="p-3 pt-0 flex flex-col sm:flex-row gap-2">
                <button
                    onClick={handleMoveToCart}
                    disabled={loading || actionLoading || product.stock < 1}
                    className="flex-1 bg-blue-600 text-white py-2 px-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm"
                    title="Move to cart and remove from wishlist"
                >
                    <FaShoppingCart size={14} />
                    <span className="hidden xs:inline">Move to Cart</span>
                    <span className="xs:hidden">Move</span>
                </button>

                <button
                    onClick={handleRemoveFromWishlist}
                    disabled={loading || actionLoading}
                    className="sm:w-auto w-full bg-red-600 text-white py-2 px-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                    title="Remove from wishlist"
                >
                    <FaTrash size={14} />
                    <span className="sm:hidden">Remove</span>
                </button>
            </div>

            {/* Loading Overlay */}
            {(loading || actionLoading) && (
                <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
                    <Loader size="small" />
                </div>
            )}
        </div>
    );
};

export default WishlistCard;
