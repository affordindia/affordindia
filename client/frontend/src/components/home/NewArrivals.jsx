import React, { useEffect, useState } from "react";
import { getNewProducts } from "../../api/product.js";
import ProductCard from "../common/ProductCard.jsx";
import { Link } from "react-router-dom";
import Loader from "../common/Loader.jsx";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true); // ✅ Loader state

    useEffect(() => {
        setLoading(true);
        getNewProducts({ limit: 6 })
            .then((data) => {
                setProducts(data.products || data);
            })
            .catch(() => setProducts([]))
            .finally(() => setLoading(false)); // ✅ Stop loader
    }, []);

    const mobileProducts = products.slice(0, 4);

    // ✅ Loader while data is fetching
    if (loading) {
        return (
            <div className="py-8">
                <Loader fullScreen={false} size="large" />
            </div>
        );
    }

    return (
        <section className="bg-[#ECECE8] py-8 md:py-12 px-4 md:px-8 font-[montserrat-global]">
            {/* Desktop Heading */}
            <div className="hidden md:flex items-center justify-center mb-9">
                <div className="w-8 border-t border-gray-400 mx-4" />
                <h2 className="text-center text-3xl font-semibold text-gray-800 uppercase whitespace-nowrap font-[playfair-display]">
                    New Arrivals
                </h2>
                <div className="w-8 border-t border-gray-400 mx-4" />
            </div>

            {/* Mobile Heading */}
            <div className="block md:hidden mb-4">
                <Link
                    to="/products"
                    className="w-fit mx-auto flex flex-col justify-center items-center bg-[#B76E79] rounded-xl shadow-md px-4 py-2 min-h-[50px] cursor-pointer"
                >
                    <h2 className="text-white text-lg font-serif font-semibold text-center">
                        New Arrivals
                    </h2>
                </Link>
            </div>

            {/* Mobile Grid - 2x2 */}
            <div className="block md:hidden mt-4">
                {mobileProducts.length > 0 ? (
                    <div className="grid grid-cols-2 gap-4 md:gap-6">
                        {mobileProducts.slice(0, 4).map((product) => (
                            <div key={product._id}>
                                <ProductCard product={product} />
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-4 text-gray-500">
                        No new arrivals found.
                    </div>
                )}
            </div>

            {/* Desktop Carousel */}
            <div className="hidden md:block mt-4">
                {products.length > 0 ? (
                    <Swiper
                        breakpoints={{
                            768: {
                                slidesPerView: 3,
                                spaceBetween: 18,
                            },
                            1024: {
                                slidesPerView: 4,
                                spaceBetween: 18,
                            },
                            1280: {
                                slidesPerView: 4,
                                spaceBetween: 24,
                            },
                        }}
                    >
                        {products.map((product) => (
                            <SwiperSlide key={product._id}>
                                <div className="flex justify-center items-center pb-2">
                                    {/* <div className="w-full "> */}
                                    <ProductCard product={product} />
                                    {/* </div> */}
                                </div>
                            </SwiperSlide>
                        ))}
                    </Swiper>
                ) : (
                    <div className="text-center py-8 text-gray-500">
                        No new arrivals found.
                    </div>
                )}
            </div>

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

export default NewArrivals;
