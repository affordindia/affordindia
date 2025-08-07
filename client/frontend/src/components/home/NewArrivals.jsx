import React, { useEffect, useState } from "react";
import { getNewProducts } from "../../api/product.js";
import ProductCard from "../common/ProductCard.jsx";
import { Link } from "react-router-dom";

const NewArrivals = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        getNewProducts({ limit: 6 })
            .then((data) => setProducts(data.products || data))
            .catch(() => setProducts([]));
    }, []);

    const mobileProducts = products.slice(0, 4); // 2x2 on mobile

    return (
        <section className="bg-[#ECECE8] py-8 md:py-12 px-4 md:px-8 font-[montserrat-global]">
            {/* Desktop Heading */}
            <div className="hidden md:flex items-center justify-center mb-9">
                <div className="w-8 border-t border-gray-400 mx-4" />
                <h2 className="text-center  text-3xl  font-semibold text-gray-800 uppercase whitespace-nowrap font-[playfair-display]">
                    New Arrivals
                </h2>
                <div className="w-8 border-t border-gray-400 mx-4" />
            </div>

            {/* Mobile Heading (Clickable) */}
            <div className="block md:hidden mb-4">
                <Link
                    to="/products"
                    className="w-fit mx-auto flex flex-col justify-center items-center bg-[#af4c5c] rounded-xl shadow-md px-4 py-2 min-h-[50px] cursor-pointer"
                >
                    <h2 className="text-white text-lg font-serif font-semibold text-center">
                        New Arrivals
                    </h2>
                </Link>
            </div>

      {/* Mobile Grid Layout */}
      <div className="block md:hidden mt-4">
        <div className="grid grid-cols-2 gap-2">
          {mobileProducts.map((product) => (
            <div key={product._id} className="flex justify-center items-center">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>

      {/* Desktop Scroll Layout */}
      <div className="hidden md:block overflow-x-auto scrollbar-hide mt-4 pb-4">
  <div className="flex gap-4">
    {products.map((product) => (
      <div
        key={product._id}
        className="min-w-[300px] max-w-[300px] flex-shrink-0"
      >
        <ProductCard product={product} />
      </div>
    ))}
  </div>
      </div>

            {/* View Collection Button (Hidden on Mobile) */}
            <div className="hidden md:flex justify-center mt-6">
                    <Link to="/products" className="button">
                      <span className="button-content montserrat-global text-2xl">View Collection</span>
                    </Link>
                  </div>
        </section>
    );
};

export default NewArrivals;
