import React, { useEffect, useState } from "react";
import { getProductsByIds } from "../api/product.js";
import { getBannersByIds } from "../api/banner.js";
import ProductCard from "../components/common/ProductCard.jsx";
import Banners from "../components/common/Banners.jsx";
import Loader from "../components/common/Loader.jsx";
import { FaHeart, FaGift, FaStar } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Custom Banner Component for FestiveSale
const CustomBanners = ({ banners }) => {
    const [sliderRef] = useKeenSlider(
        {
            loop: true,
            duration: 1000,
            slides: {
                perView: 1,
                spacing: 0,
            },
        },
        [
            (slider) => {
                let timeout;
                function clearNextTimeout() {
                    if (timeout) clearTimeout(timeout);
                }
                function nextTimeout() {
                    clearNextTimeout();
                    timeout = setTimeout(() => {
                        if (slider) slider.next();
                    }, 3000);
                }
                slider.on("created", () => {
                    nextTimeout();
                });
                slider.on("dragStarted", clearNextTimeout);
                slider.on("animationEnded", nextTimeout);
                return () => clearNextTimeout();
            },
        ]
    );

    if (!banners || banners.length === 0) {
        return null;
    }

    // If only one banner, render it directly without slider
    if (banners.length === 1) {
        const banner = banners[0];
        return (
            <div className="w-full">
                <div className="relative">
                    {banner.link ? (
                        <Link to={banner.link}>
                            <img
                                src={banner.image}
                                alt={banner.title || "Festival Banner"}
                                className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                                loading="lazy"
                            />
                        </Link>
                    ) : (
                        <img
                            src={banner.image}
                            alt={banner.title || "Festival Banner"}
                            className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                            loading="lazy"
                        />
                    )}
                    {banner.title && (
                        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                            <h3 className="text-white text-xl font-semibold">
                                {banner.title}
                            </h3>
                            {banner.description && (
                                <p className="text-white/90 text-sm mt-1">
                                    {banner.description}
                                </p>
                            )}
                        </div>
                    )}
                </div>
            </div>
        );
    }

    // Multiple banners - use slider
    return (
        <div className="w-full">
            <div ref={sliderRef} className="keen-slider">
                {banners.map((banner) => (
                    <div
                        key={banner._id}
                        className="keen-slider__slide relative"
                    >
                        {banner.link ? (
                            <Link to={banner.link}>
                                <img
                                    src={banner.image}
                                    alt={banner.title || "Festival Banner"}
                                    className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                                    loading="lazy"
                                />
                            </Link>
                        ) : (
                            <img
                                src={banner.image}
                                alt={banner.title || "Festival Banner"}
                                className="w-full h-64 md:h-96 lg:h-[500px] object-cover"
                                loading="lazy"
                            />
                        )}
                        {banner.title && (
                            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
                                <h3 className="text-white text-xl font-semibold">
                                    {banner.title}
                                </h3>
                                {banner.description && (
                                    <p className="text-white/90 text-sm mt-1">
                                        {banner.description}
                                    </p>
                                )}
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

const FestiveSale = () => {
    // FEATURED PRODUCTS - Replace with actual product IDs from your database
    const FEATURED_PRODUCT_IDS = [
        "68bfeee7aabdeb3888680d65",
        "68bfef52aabdeb3888680d6d",
    ];

    // FEATURED BANNERS - Replace with actual banner IDs from your database
    const FEATURED_BANNER_IDS = ["68caaa78ddcaa468361eac50"];

    //BANNER CONFIGURATION - Change for each festival
    const BANNER_MATERIAL = "diwali"; // Options: "diwali", "holi", "christmas", "eid", etc.

    const [products, setProducts] = useState([]);
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchFestiveData = async () => {
            try {
                setLoading(true);
                setError(null);

                // Fetch both products and banners in parallel using bulk APIs
                const [productsResponse, bannersResponse] =
                    await Promise.allSettled([
                        getProductsByIds(FEATURED_PRODUCT_IDS),
                        getBannersByIds(FEATURED_BANNER_IDS),
                    ]);

                // Handle products response
                if (productsResponse.status === "fulfilled") {
                    const validProducts = productsResponse.value.products || [];
                    setProducts(validProducts);

                    if (productsResponse.value.failedIds?.length > 0) {
                        console.warn(
                            "Some products failed to load:",
                            productsResponse.value.failedIds
                        );
                    }
                } else {
                    console.error(
                        "Failed to fetch products:",
                        productsResponse.reason
                    );
                }

                // Handle banners response
                if (bannersResponse.status === "fulfilled") {
                    const validBanners = bannersResponse.value.banners || [];
                    setBanners(validBanners);

                    if (bannersResponse.value.failedIds?.length > 0) {
                        console.warn(
                            "Some banners failed to load:",
                            bannersResponse.value.failedIds
                        );
                    }
                } else {
                    console.error(
                        "Failed to fetch banners:",
                        bannersResponse.reason
                    );
                    // If banner fetch fails, fallback to material-based banners
                    setBanners([]);
                }

                // Set error only if both requests failed completely
                if (
                    productsResponse.status === "rejected" &&
                    bannersResponse.status === "rejected"
                ) {
                    setError(
                        "Failed to load festive sale data. Please try again later."
                    );
                } else if (
                    productsResponse.status === "fulfilled" &&
                    productsResponse.value.products.length === 0
                ) {
                    setError(
                        "No festive products could be loaded at this time."
                    );
                }
            } catch (err) {
                console.error("Error fetching Festive Sale data:", err);
                setError(
                    "Failed to load Festive Sale. Please try again later."
                );
            } finally {
                setLoading(false);
            }
        };

        fetchFestiveData();
    }, []); // No dependencies needed since we're using hardcoded IDs

    // Show loading if products are loading
    if (loading) {
        return <Loader fullScreen={true} />;
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
            {/* Festival Banners - Use custom banners if available, otherwise fallback to material-based */}
            {banners.length > 0 ? (
                <CustomBanners banners={banners} />
            ) : (
                <Banners material={BANNER_MATERIAL} />
            )}

            {/* Festive Sale Header Section */}
            <div className="bg-gradient-to-r from-yellow-50 to-orange-100 py-12">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="text-center">
                        <div className="flex items-center justify-center gap-3 mb-4">
                            <FaGift className="text-[#C1B086] text-4xl" />
                            <h1 className="text-4xl md:text-5xl font-bold text-[#404040]">
                                Festive Sale
                            </h1>
                            <FaHeart className="text-red-500 text-4xl" />
                        </div>
                        <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
                            Celebrate the festival of lights with our exclusive
                            Festive Sale collection. Discover amazing deals,
                            gifts, and decor to make your celebrations truly
                            special.
                        </p>
                        <div className="flex items-center justify-center gap-2 text-[#C1B086]">
                            <FaStar />
                            <span className="text-sm font-medium">
                                Special Festive Offers
                            </span>
                            <FaStar />
                        </div>
                    </div>
                </div>
            </div>

            {/* Festive Sale Products Section */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
                {products.length > 0 ? (
                    <>
                        <div className="mb-8">
                            <h2 className="text-2xl font-semibold text-[#404040] mb-2">
                                Our Festive Sale Collection
                            </h2>
                            <p className="text-gray-600">
                                Showing {products.length} amazing festive
                                {products.length !== 1
                                    ? " products"
                                    : " product"}{" "}
                                on sale
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
                            No Festive Sale Products Available
                        </h3>
                        <p className="text-gray-600 mb-6">
                            We're working on bringing you amazing festive deals.
                            Please check back soon!
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

            {/* Why Choose Festive Gifts Section */}
            <div className="bg-white py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
                    <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#404040] mb-10">
                        Why Choose Our Festive Sale
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
                        <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
                            <h3 className="text-lg font-semibold text-[#404040] mb-2">
                                Special Discounts
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Enjoy exclusive festive discounts on our premium
                                collection, making celebrations more affordable.
                            </p>
                        </div>
                        <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
                            <h3 className="text-lg font-semibold text-[#404040] mb-2">
                                Artisan Crafted
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Each piece is meticulously handcrafted by
                                skilled artisans using traditional techniques
                                passed down through generations.
                            </p>
                        </div>
                        <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
                            <h3 className="text-lg font-semibold text-[#404040] mb-2">
                                Perfect Gifts
                            </h3>
                            <p className="text-gray-600 text-sm">
                                Our festive collection makes for elegant and
                                premium presents that your loved ones will
                                cherish for years to come.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Traditional Quote Section */}
            <div className="bg-gradient-to-r from-orange-50 to-yellow-100 py-12">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <blockquote className="text-2xl md:text-3xl font-medium text-[#404040] italic mb-4">
                        "May this festive season bring joy, prosperity, and
                        happiness to your home."
                    </blockquote>
                    <p className="text-lg text-gray-600">
                        Celebrate with our special festive sale collection
                    </p>
                </div>
            </div>
        </div>
    );
};

export default FestiveSale;
