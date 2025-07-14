import React from "react";
import { Link } from "react-router-dom";
import { FaHeart, FaStar } from "react-icons/fa";

const ProductCard = ({ product, small }) => {
    return (
        <Link
            to={`/products/${product._id}`}
            className={`bg-[#f9f7f3] rounded-xl shadow-md overflow-hidden relative hover:shadow-lg transition-all flex flex-col group ${
                small ? "w-[140px] md:w-[160px]" : "w-[250px]"
            }`}
        >
            {/* Wishlist Icon */}
            <div className="absolute top-2 right-2 text-gray-500 hover:text-red-500 cursor-pointer z-10">
                <FaHeart />
            </div>

            {/* Image - always square, info below, scales on hover */}
            <div className="w-full aspect-square bg-gray-100 flex-shrink-0 overflow-hidden">
                <img
                    src={product.images[0] || "/placeholder.jpg"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-120"
                />
            </div>

            {/* Info */}
            <div className="p-3 flex flex-col gap-1 flex-1 min-h-0">
                <h3 className="text-lg font-medium truncate">{product.name}</h3>
                <div className="flex items-center justify-between w-full">
                    <div className="text-gray-700 font-semibold">
                        ₹{product.price}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                        <span className="flex items-center gap-1">
                            <FaStar className="text-yellow-500" />
                            {product.rating || "4.5"}
                        </span>
                        <span className="ml-1">★</span>
                        <span className="ml-2">|</span>
                        <span className="ml-2">{product.reviews || 120}</span>
                    </div>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
