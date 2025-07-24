import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import { useAppData } from "../../context/AppDataContext.jsx";
import ProductCard from "../common/ProductCard";
import Loader from "../common/Loader";
import "keen-slider/keen-slider.min.css";
import { useKeenSlider } from "keen-slider/react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const YouMightAlsoLike = () => {
    const { categories } = useAppData();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderRef, instanceRef] = useKeenSlider({
        mode: "free-snap",
        slides: {
            perView: "auto",
        },
    });

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // For each category, get 1 random product
                let prods = [];
                for (const cat of categories) {
                    const prodRes = await getProducts({
                        category: cat._id,
                        limit: 10,
                    });
                    const arr =
                        (prodRes && (prodRes.products || prodRes)) || [];
                    if (Array.isArray(arr) && arr.length > 0) {
                        // Pick a random product from this category
                        prods.push(arr[Math.floor(Math.random() * arr.length)]);
                    }
                }
                // If less than 10, fill with random products
                if (prods.length < 10) {
                    const allRes = await getProducts({ limit: 30 });
                    const all = (allRes && (allRes.products || allRes)) || [];
                    // Add randoms not already in prods
                    const used = new Set(prods.map((p) => p._id));
                    const extras = (Array.isArray(all) ? all : []).filter(
                        (p) => !used.has(p._id)
                    );
                    while (prods.length < 10 && extras.length) {
                        const idx = Math.floor(Math.random() * extras.length);
                        prods.push(extras.splice(idx, 1)[0]);
                    }
                }
                setProducts(Array.isArray(prods) ? prods.slice(0, 10) : []);
            } catch {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [categories]);

    // Navigation handlers
    const goPrev = () => instanceRef.current && instanceRef.current.prev();
    const goNext = () => instanceRef.current && instanceRef.current.next();

    return (
        <section className="py-8 px-2 md:px-8 bg-secondary">
            <h2 className="text-2xl md:text-3xl font-serif font-bold text-center mb-6">
                You Might Also Like These Products
            </h2>
            {loading ? (
                <Loader />
            ) : !products ||
              !Array.isArray(products) ||
              products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No products found.
                </div>
            ) : (
                <div className="relative">
                    {/* Left arrow */}
                    {/* {products.length > 0 && (
                        <button
                            onClick={goPrev}
                            className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                            aria-label="Previous"
                            style={{ marginLeft: "-1.5rem" }}
                        >
                            <FaChevronLeft className="text-lg text-gray-700 dark:text-gray-200 group-hover:text-[#A89A3D] transition-colors" />
                        </button>
                    )} */}

                    {/* keen-slider carousel */}
                    <div
                        ref={sliderRef}
                        className="keen-slider flex gap-x-2 sm:gap-x-4 lg:gap-x-6"
                    >
                        {Array.isArray(products) &&
                            products.map((product) => (
                                <div
                                    key={product._id}
                                    className="keen-slider__slide flex justify-center items-center pb-2"
                                    style={{
                                        minWidth: "clamp(160px, 33vw, 220px)",
                                        maxWidth: 220,
                                    }}
                                >
                                    <ProductCard product={product} />
                                </div>
                            ))}
                    </div>

                    {/* Right arrow */}
                    {/* {products.length > 0 && (
                        <button
                            onClick={goNext}
                            className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-700 rounded-full w-8 h-8 flex items-center justify-center shadow-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors group"
                            aria-label="Next"
                            style={{ marginRight: "-1.5rem" }}
                        >
                            <FaChevronRight className="text-lg text-gray-700 dark:text-gray-200 group-hover:text-[#A89A3D] transition-colors" />
                        </button>
                    )} */}
                </div>
            )}
        </section>
    );
};

export default YouMightAlsoLike;
