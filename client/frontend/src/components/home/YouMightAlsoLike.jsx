import React, { useEffect, useState } from "react";
import { getProducts } from "../../api/product";
import { useAppData } from "../../context/AppDataContext.jsx";
import ProductCard from "../common/ProductCard";
import Loader from "../common/Loader";
import { Swiper, SwiperSlide } from "swiper/react"; // Swiper only, no navigation
import "swiper/css";

const YouMightAlsoLike = () => {
    const { categories } = useAppData();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                let prods = [];
                for (const cat of categories) {
                    const prodRes = await getProducts({
                        category: cat._id,
                        limit: 10,
                    });
                    const arr =
                        (prodRes && (prodRes.products || prodRes)) || [];
                    if (Array.isArray(arr) && arr.length > 0) {
                        prods.push(arr[Math.floor(Math.random() * arr.length)]);
                    }
                }
                if (prods.length < 10) {
                    const allRes = await getProducts({ limit: 30 });
                    const all = (allRes && (allRes.products || allRes)) || [];
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

    return (
        <section className="py-8 px-2 md:px-8 bg-[#EBEBEB]">
            {/* Desktop Heading */}
            <div className="hidden md:flex items-center justify-center mb-9">
                <div className="w-8 border-t border-gray-400 mx-4" />
                <h2 className="text-center text-3xl font-semibold text-gray-800 uppercase whitespace-nowrap font-[playfair-display]">
                    Similar Products
                </h2>
                <div className="w-8 border-t border-gray-400 mx-4" />
            </div>

            {/* Mobile Heading */}
            <div className="block md:hidden mb-6">
                <div className="flex items-center justify-center">
                    <div className="w-10 border-t border-gray-400 mx-2" />
                    <h2 className="text-center font-serif text-base tracking-widest font-semibold text-gray-800 uppercase whitespace-nowrap">
                        Similar Products
                    </h2>
                    <div className="w-10 border-t border-gray-400 mx-2" />
                </div>
            </div>

            {loading ? (
                <Loader />
            ) : !products ||
              !Array.isArray(products) ||
              products.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                    No products found.
                </div>
            ) : (
                <Swiper
                    breakpoints={{
                        0: {
                            slidesPerView: 2.1,
                            spaceBetween: 6,
                        },
                        480: {
                            slidesPerView: 2.2,
                            spaceBetween: 8,
                        },
                        640: {
                            slidesPerView: 3.1,
                            spaceBetween: 10,
                        },
                        768: {
                            slidesPerView: 3.2,
                            spaceBetween: 12,
                        },
                        1024: {
                            slidesPerView: 4.2,
                            spaceBetween: 18,
                        },
                    }}
                >
                    {products.map((product) => (
                        <SwiperSlide key={product._id}>
                            <div className="flex justify-center items-center pb-2 ">
                                <ProductCard product={product} />
                            </div>
                        </SwiperSlide>
                    ))}
                </Swiper>
            )}
        </section>
    );
};

export default YouMightAlsoLike;
