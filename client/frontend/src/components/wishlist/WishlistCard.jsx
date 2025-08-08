import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaShoppingCart, FaTrash } from "react-icons/fa";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useCart } from "../../context/CartContext.jsx";
import Loader from "../common/Loader.jsx";

const WishlistCard = ({ product }) => {
  const { removeFromWishlist, moveToCartFromWishlist, loading } = useWishlist();
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

  return (
    <div className="bg-[#ffffff] rounded-xl shadow-md overflow-hidden relative hover:shadow-lg transition-all flex flex-col group w-full ">
      {/* Product Link */}
      <Link to={`/products/id/${product._id}`} className="flex flex-col flex-1">
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
          <h3 className="text-lg font-medium truncate">{product.name}</h3>
          <div className="flex items-center justify-between w-full">
            <div className="text-base text-gray-700 font-semibold">
              ₹{product.price}
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <span>{product.rating || "4.5"}</span>
              <span className="ml-1">★</span>
              <span className="ml-2">|</span>
              <span className="ml-2">{product.reviews || 120}</span>
            </div>
          </div>

          {/* Stock Status */}
          <div className="text-sm">
            {product.stock > 0 ? (
              <span className="text-green-600">In Stock ({product.stock})</span>
            ) : (
              <span className="text-[#E35151]">Out of Stock</span>
            )}
          </div>
        </div>
      </Link>

      {/* Action Buttons - Always Horizontal */}
      <div className="px-3 pb-3 pt-0 flex flex-row gap-2">
        {/* Move to Cart Button */}
        <button
          onClick={handleMoveToCart}
          disabled={loading || actionLoading || product.stock < 1}
          className="flex-1 bg-[#B76E79] text-white py-2 px-1 xs:px-3 rounded-lg hover:bg-[#C68F98] disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center gap-1 xs:gap-2 text-md xs:text-sm font-medium min-h-[36px] xs:min-h-[40px] montserrat-global"
          title="Move to cart and remove from wishlist"
        >
          <FaShoppingCart size={12} className="xs:hidden" />
          <FaShoppingCart size={14} className="hidden xs:block" />
          <span className="hidden xs:inline">Move to Cart</span>
          <span className="xs:hidden">Cart</span>
        </button>

        {/* Delete Button */}
        <button
          onClick={handleRemoveFromWishlist}
          disabled={loading || actionLoading}
          className="w-9 xs:w-12 bg-white border border-[#8C8C8C] py-2 px-1 xs:px-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-200 hover:bg-[#E35151] group/delete min-h-[36px] xs:min-h-[40px] flex-shrink-0"
          title="Remove from wishlist"
        >
          <FaTrash
            size={12}
            className="text-[#E35151] group-hover/delete:text-white transition-colors duration-200 xs:hidden"
          />
          <FaTrash
            size={14}
            className="text-[#E35151] group-hover/delete:text-white transition-colors duration-200 hidden xs:block"
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