import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { getProductById } from "../api/product.js";
import { useAuth } from "../context/AuthContext.jsx";
import ReviewsList from "../components/review/ReviewsList";
import RatingSummary from "../components/review/RatingSummary";
import Loader from "../components/common/Loader.jsx";

const Reviews = () => {
    const { id } = useParams();
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        window.scrollTo({ top: 0, left: 0, behavior: "auto" });

        if (id) {
            getProductById(id)
                .then((p) => {
                    const prod = p.product || p;
                    setProduct(prod);
                })
                .finally(() => setLoading(false));
        }
    }, [id]);

    if (loading) {
        return <Loader />;
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-8">
                <div className="text-center">
                    <h2 className="text-2xl font-semibold text-gray-600">
                        Product not found
                    </h2>
                    <Link
                        to="/"
                        className="text-[#B76E79] hover:underline mt-4 inline-block"
                    >
                        Go back to home
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            {/* Header with product info */}
            <div className="mb-6">
                {/* Product Info Header */}
                <div className="flex items-start gap-6 border-b border-gray-200 pb-6">
                    <Link to={`/products/id/${id}`} className="flex-shrink-0">
                        <img
                            src={product.images?.[0] || "/placeholder.jpg"}
                            alt={product.name}
                            className="w-24 h-24 sm:w-32 sm:h-32 object-cover rounded-lg hover:opacity-80 transition-opacity cursor-pointer"
                        />
                    </Link>
                    <div className="flex-1 min-w-0">
                        <h1 className="text-xl sm:text-2xl font-semibold text-[#404040] mb-3 break-words">
                            {product.name}
                        </h1>
                        <div className="space-y-3">
                            <div>
                                <RatingSummary
                                    ratings={product.ratings}
                                    reviewsCount={product.reviewsCount}
                                    size="sm"
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg sm:text-xl font-semibold text-[#404040]">
                                    ₹
                                    {product.discount > 0
                                        ? Math.round(
                                              product.price *
                                                  (1 - product.discount / 100)
                                          )
                                        : product.price}
                                </span>
                                {product.discount > 0 && (
                                    <span className="text-sm text-gray-500 line-through">
                                        ₹{product.price}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Full Reviews List */}
            <ReviewsList
                productId={id}
                currentUserId={user?._id || user?.id}
                showFullList={true}
            />
        </div>
    );
};

export default Reviews;
