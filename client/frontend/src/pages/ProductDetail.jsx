import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/product.js";
import { getProductReviews } from "../api/review.js";
import { useCart } from "../context/CartContext.jsx";
import { useWishlist } from "../context/WishlistContext.jsx";
import HighlightsSection from "../components/productDetail/HighlightsSection.jsx";
import YouMightAlsoLike from "../components/home/YouMightAlsoLike.jsx";

import { FaRegHeart } from "react-icons/fa";

const ProductDetail = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [reviews, setReviews] = useState([]);
    const [loading, setLoading] = useState(true);
    const { addToCart } = useCart();
    const { wishlist, fetchWishlist } = useWishlist();
    const [wishlistMsg, setWishlistMsg] = useState("");
    const [selectedImage, setSelectedImage] = useState("");

    useEffect(() => {
        // Scroll to top whenever the product changes
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        setLoading(true);
        Promise.all([getProductById(id), getProductReviews(id)])
            .then(([p, r]) => {
                const prod = p.product || p;
                setProduct(prod);
                setReviews(r.reviews || r);
                if (prod.images && prod.images.length > 0) {
                    setSelectedImage(prod.images[0]);
                }
            })
            .finally(() => setLoading(false));
    }, [id]);

    const handleAddToCart = () => {
        if (product) addToCart(product, 1);
    };

    const handleAddToWishlist = async () => {
        setWishlistMsg("");
        try {
            await fetchWishlist();
            setWishlistMsg("Added to wishlist (if logged in)");
        } catch {
            setWishlistMsg("Login to use wishlist");
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;
    if (!product)
        return <div className="p-8 text-center">Product not found</div>;

    // Stock status logic
    const stock =
        typeof product.stock === "number"
            ? product.stock
            : product.stock === 0
            ? 0
            : undefined;
    let stockStatus = null;
    if (!stock) {
        stockStatus = (
            <div className="text-red-600 font-medium">Out of Stock</div>
        );
    } else if (stock > 10) {
        stockStatus = (
            <div className="text-green-600 dark:text-green-400 font-medium">
                In Stock
            </div>
        );
    } else if (stock < 5) {
        stockStatus = (
            <div className="text-red-600 font-medium">
                Only {stock} left in stock.
            </div>
        );
    } else {
        stockStatus = (
            <div className="text-orange-500 font-medium">
                In Stock ({stock} left)
            </div>
        );
    }

    return (
        <>
            <div className="max-w-7xl mx-auto px-4 md:px-4 py-8 flex flex-col md:flex-row md:items-start gap-8 md:gap-12 text-[#404040] dark:text-gray-200">
                {/* LEFT SECTION: IMAGE DISPLAY */}
                <div className="flex-shrink-0 w-full md:w-[440px]">
                    <div className="w-full aspect-square rounded-lg overflow-hidden border bg-white dark:bg-gray-900">
                        <img
                            src={selectedImage}
                            alt={product.name}
                            className="w-full h-full object-cover"
                        />
                    </div>
                    <div className="flex flex-wrap gap-3 mt-4">
                        {product.images?.map((img, idx) => (
                            <img
                                key={idx}
                                src={img}
                                alt={`thumbnail-${idx}`}
                                onClick={() => setSelectedImage(img)}
                                className={`w-16 h-16 rounded-lg border cursor-pointer object-cover transition-all duration-200 ${
                                    selectedImage === img
                                        ? "ring-2 ring-red-500"
                                        : "opacity-80 hover:opacity-100"
                                }`}
                            />
                        ))}
                    </div>
                </div>

                {/* RIGHT SECTION: DETAILS */}
                <div className="flex flex-col gap-3 flex-1 min-w-0 text-[#404040]">
                    <h1 className="text-4xl font-semibold break-words">
                        {product.name}
                    </h1>
                    <div className="text-lg">
                        ★ {product.rating || "4.5"} (
                        {product.numReviews || "122"} Ratings)
                    </div>
                    <div className="text-2xl font-semibold">
                        ₹{product.price}
                    </div>
                    {stockStatus}

                    {/* Buttons */}
                    <div className="flex gap-4 mt-4 flex-wrap">
                        <button
                            onClick={handleAddToCart}
                            className="bg-[#A89A3D] text-white px-6 py-2 rounded-sm font-semibold transition-all duration-200 hover:bg-[#968632] hover:scale-105 active:scale-95 focus:outline-none"
                            disabled={!stock}
                        >
                            Add to Cart
                        </button>
                        <button
                            onClick={handleAddToWishlist}
                            className="bg-[#272727] px-4 py-2 rounded-md text-white transition-all duration-200 hover:bg-[#1a1a1a] hover:scale-105 active:scale-95 focus:outline-none"
                        >
                            <FaRegHeart className="text-2xl transition-transform duration-200 hover:scale-110 active:scale-95" />
                        </button>
                    </div>
                    {wishlistMsg && (
                        <p className="text-sm mt-1 text-gray-500">
                            {wishlistMsg}
                        </p>
                    )}

                    {/* Description */}
                    <div className="mt-6">
                        <h2 className="text-lg font-semibold mb-2">
                            Description
                        </h2>
                        <div className="text-sm leading-relaxed">
                            {product.description
                                ? product.description
                                      .split(/\r?\n/)
                                      .map((para, idx) =>
                                          para.trim() ? (
                                              <p
                                                  key={idx}
                                                  className="mb-2 last:mb-0"
                                              >
                                                  {para}
                                              </p>
                                          ) : null
                                      )
                                : null}
                        </div>
                    </div>
                </div>
            </div>

            <HighlightsSection />

            <YouMightAlsoLike />
        </>
    );
};

export default ProductDetail;
