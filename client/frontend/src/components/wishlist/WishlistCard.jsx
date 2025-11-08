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
            await moveToCartFromWishlist(product._id);
            await refreshCart();
        } catch (error) {
            console.error("Error moving to cart:", error);
        } finally {
            setActionLoading(false);
        }
    };

    // Calculate discounted price if discount is present (matching ProductCard)
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <div className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden relative hover:shadow-lg transition-all flex flex-col group w-full">
            {/* Product Link */}
            <Link
                to={`/products/id/${product._id}`}
                className="flex flex-col flex-1"
            >
                {/* Image - Square aspect ratio like ProductCard */}
                <div className="w-full aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
                    <img
                        src={product.images?.[0] || "/placeholder.jpg"}
                        alt={product.name}
                        className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                </div>

                {/* Info - Matching ProductCard structure */}
                <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-1 md:gap-2 flex-1 min-h-0">
                    {/* Product Name */}
                    <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-[#404040] montserrat-global truncate leading-tight">
                        {product.name}
                    </h3>

                    {/* Price and Ratings Row */}
                    <div className="flex items-center justify-between w-full">
                        {/* Price */}
                        <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-[#404040] font-bold montserrat-global">
                            {hasDiscount ? (
                                <div className="flex items-center gap-1 sm:gap-2">
                                    <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-semibold text-[#404040]">
                                        ₹{discountedPrice}
                                    </span>
                                    <span className="line-through text-[#ACACAC] text-xs sm:text-sm md:text-base font-medium">
                                        ₹{product.price}
                                    </span>
                                </div>
                            ) : (
                                <span>₹{product.price}</span>
                            )}
                        </div>

                        {/* Ratings */}
                        {product.reviewsCount > 0 && (
                            <div className="flex items-center text-sm sm:text-base md:text-lg text-[#747474] montserrat-global flex-shrink-0">
                                <span className="flex items-center gap-1">
                                    <span className="font-medium">
                                        {product.ratings?.toFixed(1) || "0.0"}
                                    </span>
                                    <span>★</span>
                                </span>
                                <span className="mx-1">|</span>
                                <span>({product.reviewsCount})</span>
                            </div>
                        )}
                    </div>

                    {/* Stock Status */}
                    <div className="text-xs sm:text-sm mt-1">
                        {product.stock > 0 ? (
                            <span className="text-green-600 font-medium">
                                In Stock ({product.stock})
                            </span>
                        ) : (
                            <span className="text-[#E35151] font-medium">
                                Out of Stock
                            </span>
                        )}
                    </div>
                </div>
            </Link>

            {/* Action Buttons */}
            <div className="p-2 md:p-3 lg:p-4 pt-0 md:pt-0 lg:pt-0 flex flex-row gap-2">
                {/* Move to Cart Button */}
                <button
                    onClick={handleMoveToCart}
                    disabled={loading || actionLoading || product.stock < 1}
                    className="flex-1 bg-[#B76E79] text-white py-2 px-3 rounded-lg hover:bg-[#C68F98] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-2 text-sm font-medium min-h-[40px] montserrat-global transition-colors"
                    title="Move to cart and remove from wishlist"
                >
                    <FaShoppingCart size={14} />
                    <span className="hidden sm:inline">Move to Cart</span>
                    <span className="sm:hidden">Cart</span>
                </button>

                {/* Delete Button */}
                <button
                    onClick={handleRemoveFromWishlist}
                    disabled={loading || actionLoading}
                    className="w-12 bg-white border border-[#8C8C8C] py-2 px-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:bg-[#E35151] group/delete min-h-[40px] flex-shrink-0"
                    title="Remove from wishlist"
                >
                    <FaTrash
                        size={14}
                        className="text-[#E35151] group-hover/delete:text-white transition-colors duration-200"
                    />
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
