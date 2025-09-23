import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaHeart } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext.jsx";

const ProductCard = ({ product }) => {
    const { wishlist, addToWishlist, removeFromWishlist, loading } =
        useWishlist();
    const [actionLoading, setActionLoading] = useState(false);

    const isInWishlist = wishlist?.items?.some(
        (item) => item._id === product._id
    );

    const handleWishlistToggle = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        setActionLoading(true);
        try {
            if (isInWishlist) {
                await removeFromWishlist(product._id);
            } else {
                await addToWishlist(product._id);
            }
        } catch (error) {
            // Handle error silently or show toast notification
            console.error("Wishlist error:", error);
        } finally {
            setActionLoading(false);
        }
    };
    // Calculate discounted price if discount is present
    const hasDiscount = product.discount && product.discount > 0;
    const discountedPrice = hasDiscount
        ? Math.round(product.price * (1 - product.discount / 100))
        : product.price;

    return (
        <Link
            to={`/products/id/${product._id}`}
            className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden relative hover:shadow-lg transition-all flex flex-col group w-full"
        >
            {/* Wishlist Icon */}
            <button
                onClick={handleWishlistToggle}
                disabled={loading || actionLoading}
                className={`absolute top-2 right-2 cursor-pointer z-10 p-1 transition-colors ${
                    isInWishlist
                        ? "text-red-500 hover:text-red-600"
                        : "text-gray-400 hover:text-red-500"
                } ${
                    loading || actionLoading
                        ? "opacity-50 cursor-not-allowed"
                        : ""
                }`}
                title={
                    isInWishlist ? "Remove from wishlist" : "Add to wishlist"
                }
            >
                <FaHeart
                    className={`text-2xl ${isInWishlist ? "fill-current" : ""}`}
                />
            </button>

            {/* Image - always square, info below, scales on hover */}
            <div className="w-full aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-120"
                />
            </div>

            {/* Info */}
            <div className="p-2 md:p-3 lg:p-4 flex flex-col gap-1 md:gap-2 flex-1 min-h-0">
                {/* Product Name - Always one line with ellipsis */}
                <h3 className="text-xs sm:text-sm md:text-base lg:text-lg font-medium text-[#404040] montserrat-global truncate leading-tight">
                    {product.name}
                </h3>

                {/* Price and Ratings - One line with ratings on right */}
                <div className="flex items-center justify-between w-full">
                    {/* Price - First hierarchy (most important) */}
                    <div className="text-base sm:text-lg md:text-xl lg:text-2xl text-gray-800 font-bold montserrat-global">
                        {hasDiscount ? (
                            <div className="flex items-center gap-1 sm:gap-2">
                                <span className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-[#404040]">
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

                    {/* Ratings - Third hierarchy (on the right) */}
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
            </div>
        </Link>
    );
};

export default ProductCard;
