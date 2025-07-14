import React, { useEffect, useState } from "react";
import { getNewProducts } from "../../api/product.js";
import ProductCard from "../common/ProductCard";
import { Link } from "react-router-dom";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getNewProducts({ limit: 6 })
            .then((data) => setProducts(data.products || data))
            .catch(() => setProducts([]));
    }, []);

    const topRow = products.slice(0, 2);
    const bottomRow = products.slice(2, 6);
    const mobileProducts = products.slice(0, 4);

    return (
        <section className="bg-primary py-8 md:py-12 px-2 md:px-8">
            {/* Mobile: minimal card-style header and 2x2 grid */}
            <div className="block md:hidden mb-4">
                <div className="flex flex-col justify-center items-center bg-gradient-to-t from-[#17171d] to-[#363452] rounded-xl shadow-md px-0 py-4 min-h-[80px] mb-4">
                    <h2 className="text-2xl font-serif font-bold text-white text-center">
                        New Arrivals
                    </h2>
                </div>
                <div className="grid grid-cols-2 gap-2">
                    {mobileProducts.map((product) => (
                        <div
                            key={product._id}
                            className="flex justify-center items-center"
                        >
                            <ProductCard product={product} />
                        </div>
                    ))}
                </div>
            </div>

            {/* Desktop: original layout */}
            <div className="hidden md:grid grid-cols-4 gap-4 mb-8 items-stretch">
                {/* Left card */}
                {topRow[0] ? (
                    <div className="flex justify-center items-center col-span-1">
                        <ProductCard product={topRow[0]} />
                    </div>
                ) : (
                    <div className="col-span-1" />
                )}
                {/* Header card in center, spans 2 columns */}
                <div className="flex flex-col justify-center items-center bg-gradient-to-t from-[#17171d] to-[#363452] rounded-xl shadow-md px-0 py-8 min-h-[300px] col-span-2">
                    <h2 className="text-4xl font-serif font-bold text-white py-2 text-center">
                        New Arrivals
                    </h2>
                    <p className="mt-2 text-gray-200 font-medium text-center text-base">
                        Discover our latest jewelry pieces, crafted with
                        excellence
                    </p>
                    <Link
                        to="/products"
                        className="inline-block mt-4 bg-[#fff3e0] text-black font-semibold px-6 py-2 rounded shadow hover:shadow-md transition text-base"
                    >
                        View Collection
                    </Link>
                </div>
                {/* Right card */}
                {topRow[1] ? (
                    <div className="flex justify-center items-center col-span-1">
                        <ProductCard product={topRow[1]} />
                    </div>
                ) : (
                    <div className="col-span-1" />
                )}
            </div>

            <div className="hidden md:grid grid-cols-4 gap-4">
                {bottomRow.map((product) => (
                    <div
                        key={product._id}
                        className="flex justify-center items-center"
                    >
                        <ProductCard product={product} />
                    </div>
                ))}
            </div>
        </section>
    );
};

export default NewArrivals;
