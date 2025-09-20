import React, { useEffect, useState } from "react";
import { getFeaturedProducts } from "../../api/product.js";
import ProductCard from "../common/ProductCard";
import { Link } from "react-router-dom";
import Loader from "../common/Loader.jsx"; // ✅ Import Loader

const FeaturedProducts = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Add loading state

    useEffect(() => {
        setLoading(true);
        getFeaturedProducts({ limit: 8 })
            .then((data) => setProducts(data.products || data))
            .catch(() => setProducts([]))
            .finally(() => setLoading(false)); // ✅ End loading after fetch
    }, []);

    return (
        <section className="py-8 px-4 md:px-12">
            {/* Desktop Heading */}
            <div className="hidden md:flex items-center justify-center mb-9">
                <div className="w-8 border-t border-gray-400 mx-4" />
                <h2 className="text-center text-3xl font-semibold text-gray-800 uppercase whitespace-nowrap font-[playfair-display]">
                    Featured Products
                </h2>
                <div className="w-8 border-t border-gray-400 mx-4" />
            </div>

            {/* Mobile Heading (Clickable) */}
            <div className="block md:hidden mb-4">
                <Link
                    to="/products"
                    className="w-fit mx-auto flex flex-col justify-center items-center bg-[#B76E79] rounded-xl shadow-md px-4 py-2 min-h-[50px] cursor-pointer"
                >
                    <h2 className="text-white text-lg font-serif font-semibold text-center">
                        Featured Products
                    </h2>
                </Link>
            </div>

            {/* Loader or Products Grid */}
            {loading ? (
                <Loader fullScreen={false} size="large" />
            ) : (
                <>
                    {/* Mobile Grid - 2x2 */}
                    <div className="block md:hidden">
                        <div className="grid grid-cols-2 gap-4 md:gap-6">
                            {products.slice(0, 4).map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>

                    {/* Desktop Grid - Full Grid */}
                    <div className="hidden md:block">
                        <div className="grid grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                            {products.map((product) => (
                                <ProductCard
                                    key={product._id}
                                    product={product}
                                />
                            ))}
                        </div>
                    </div>
                </>
            )}

            {/* View Collection Button */}
            <div className="hidden md:flex justify-center mt-6">
                <Link to="/products" className="button">
                    <span className="button-content montserrat-global text-2xl">
                        View Collection
                    </span>
                </Link>
            </div>
        </section>
    );
};

export default FeaturedProducts;
