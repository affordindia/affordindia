import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import ProductCard from "../components/common/ProductCard.jsx";
import Banners from "../components/common/Banners.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { FaHeart, FaGift, FaStar } from "react-icons/fa";

const Rakhi = () => {
    const { allCategories, loading: contextLoading } = useAppData();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchRakhiData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Find Rakhi category dynamically from context
                const rakhiCategory = allCategories.find(
                    (category) => category.name?.toLowerCase() === "rakhi"
                );

                if (!rakhiCategory) {
                    console.warn("Rakhi category not found in allCategories");
                    setProducts([]);
                    return;
                }

                // Fetch rakhi products using dynamic category ID
                const productsResponse = await getProducts({
                    category: rakhiCategory._id,
                });

                const originalProducts = productsResponse.products || [];

                // TEST MODE: Duplicate single product to show 20 products for demo
                let testProducts = [];
                if (originalProducts.length > 0) {
                    const singleProduct = originalProducts[0];
                    for (let i = 0; i < 20; i++) {
                        testProducts.push({
                            ...singleProduct,
                            _id: `${singleProduct._id}_test_${i}`, // Unique ID for each duplicate
                            name: `${singleProduct.name} - Design ${i + 1}`, // Unique name
                            price: singleProduct.price + i * 10, // Vary price slightly
                        });
                    }
                }

                // Use test products if we have them, otherwise use original
                setProducts(
                    testProducts.length > 0 ? testProducts : originalProducts
                );
            } catch (err) {
                console.error("Error fetching Rakhi data:", err);
                setError(
                    "Failed to load Rakhi products. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        // Only fetch when context is loaded and categories are available
        if (!contextLoading && allCategories.length > 0) {
            fetchRakhiData();
        }
    }, [allCategories, contextLoading]);

    // Show loading if context is still loading or products are loading
    if (contextLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#C1B086] mx-auto mb-4"></div>
                    <p className="text-[#404040] text-lg">
                        Loading Rakhi Collection...
                    </p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <p className="text-[#404040] text-lg mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="bg-[#C1B086] text-white px-6 py-2 rounded-lg hover:bg-[#B5A578] transition-colors"
                    >
                        Try Again
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Rakhi Banners - using material="rakhi" */}
            <Banners material="rakhi" />

            {/* Rakhi Header Section */}
            <div className="bg-gradient-to-r from-red-50 to-orange-50 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaGift className="text-[#C1B086] text-4xl" />
                            <h1 className="text-4xl md:text-5xl font-bold text-[#404040]">
                                Rakhi Collection
                            </h1>
                            <FaHeart className="text-red-500 text-4xl" />
                        </div>
                        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                            Celebrate the beautiful bond of love with our
                            exquisite collection of Rakhis. Each piece is
                            crafted with love and tradition, perfect for making
                            this Raksha Bandhan memorable.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[#C1B086]">
                            <FaStar />
                            <span className="text-sm font-medium">
                                Handcrafted with Love
                            </span>
                            <FaStar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Rakhi Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {products.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#404040] mb-2">
                                Our Rakhi Collection
                            </h2>
                            <p className="text-gray-600">
                                Showing {products.length} beautiful Rakhi
                                {products.length !== 1 ? "s" : ""}
                            </p>
                        </div>

                        {/* Products Grid */}
                        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </>
                ) : (
                    <div className="text-center py-16">
                        <div className="text-6xl mb-6">🎁</div>
                        <h3 className="text-2xl font-semibold text-[#404040] mb-4">
                            No Rakhi Products Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We're working on bringing you beautiful Rakhi
                            collections. Please check back soon!
                        </p>
                        <a
                            href="/products"
                            className="bg-[#C1B086] text-white px-6 py-3 rounded-lg hover:bg-[#B5A578] transition-colors inline-block"
                        >
                            Explore All Products
                        </a>
                    </div>
                )}
            </div>

            {/* Rakhi Features Section */}
            <div className="bg-white py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-3xl font-bold text-center text-[#404040] mb-12">
                        Why Choose Our Rakhis?
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                        <div className="text-center">
                            <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaHeart className="text-red-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#404040] mb-2">
                                Handcrafted with Love
                            </h3>
                            <p className="text-gray-600">
                                Each Rakhi is carefully handcrafted by skilled
                                artisans with attention to detail and love.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-yellow-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaStar className="text-yellow-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#404040] mb-2">
                                Premium Quality
                            </h3>
                            <p className="text-gray-600">
                                Made with high-quality materials ensuring
                                durability and beautiful appearance.
                            </p>
                        </div>
                        <div className="text-center">
                            <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaGift className="text-green-500 text-2xl" />
                            </div>
                            <h3 className="text-xl font-semibold text-[#404040] mb-2">
                                Perfect Gift
                            </h3>
                            <p className="text-gray-600">
                                Beautifully packaged and ready to express your
                                love and care for your sibling.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Traditional Quote Section */}
            <div className="bg-gradient-to-r from-orange-50 to-red-50 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <blockquote className="text-2xl md:text-3xl font-medium text-[#404040] italic mb-4">
                        "A sister is a gift to the heart, a friend to the
                        spirit, a golden thread to the meaning of life."
                    </blockquote>
                    <p className="text-lg text-gray-600">
                        Celebrate this beautiful bond with our special Rakhi
                        collection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Rakhi;
