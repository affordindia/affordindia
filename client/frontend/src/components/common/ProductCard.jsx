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
        } ${loading || actionLoading ? "opacity-50 cursor-not-allowed" : ""}`}
        title={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
      >
        <FaHeart className={`text-2xl ${isInWishlist ? "fill-current" : ""}`} />
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
      <div className="p-2 md:p-3 flex flex-col gap-1 flex-1 min-h-0 ">
       <h3 className="text-sm md:text-lg font-medium truncate text-[#404040] montserrat-global">
  {product.name}
</h3>

        <div className="flex items-center justify-between w-full">
          <div className="text-sm md:text-lg text-gray-700 font-semibold montserrat-global">
            {hasDiscount ? (
              <>
                <span className="line-through text-gray-500 mr-2 text-sm md:text-xl font-bold montserrat-global">
                  ₹{product.price}
                </span>
                <span className="text-sm md:text-lg font-semibold montserrat-global">
                  ₹{discountedPrice}
                </span>
              </>
            ) : (
              <>₹{product.price}</>
            )}
          </div>

          {/* Only show ratings if there are actual reviews */}
          {product.reviewsCount > 0 && (
            <div className="flex items-center text-sm md:text-lg font-medium text-[#747474] montserrat-global">

              <span className="flex items-center gap-1">
                {product.ratings?.toFixed(1) || "0.0"}
              </span>
              <span className="">★</span>
              <span className="ml-1">|</span>
              <span className="ml-2">{product.reviewsCount}</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
