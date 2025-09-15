import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import ProductCard from "../components/common/ProductCard.jsx";
import Banners from "../components/common/Banners.jsx";
import Loader from "../components/common/Loader.jsx";
import { useAppData } from "../context/AppDataContext.jsx";
import { FaHeart, FaGift, FaStar } from "react-icons/fa";

const Diwali = () => {
  const { allCategories, loading: contextLoading } = useAppData();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
  const fetchDiwaliData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Find Diwali category dynamically from context
        const diwaliCategory = allCategories.find(
          (category) => category.name?.toLowerCase() === "diwali"
        );

        if (!diwaliCategory) {
          console.warn("Diwali category not found in allCategories");
          setProducts([]);
          return;
        }

        // Fetch diwali products using dynamic category ID
        const productsResponse = await getProducts({
          category: diwaliCategory._id,
        });

        setProducts(productsResponse.products || []);
      } catch (err) {
        console.error("Error fetching Diwali data:", err);
        setError("Failed to load Diwali products. Please try again later.");
      } finally {
        setLoading(false);
      }
    };

    // Only fetch when context is loaded and categories are available
    if (!contextLoading && allCategories.length > 0) {
      fetchDiwaliData();
    }
  }, [allCategories, contextLoading]);

  // Show loading if context is still loading or products are loading
  if (contextLoading || loading) {
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
      {/* Diwali Banners - using material="diwali" */}
      <Banners material="diwali" />

      {/* Diwali Header Section */}
      <div className="bg-gradient-to-r from-yellow-50 to-orange-100 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center gap-3 mb-4">
              <FaGift className="text-[#C1B086] text-4xl" />
              <h1 className="text-4xl md:text-5xl font-bold text-[#404040]">
                Diwali Collection
              </h1>
              <FaHeart className="text-red-500 text-4xl" />
            </div>
            <p className="text-lg text-gray-600 mb-6 max-w-3xl mx-auto">
              Celebrate the festival of lights with our exclusive Diwali collection. Discover gifts, decor, and more to make your Diwali truly special.
            </p>
            <div className="flex items-center justify-center gap-2 text-[#C1B086]">
              <FaStar />
              <span className="text-sm font-medium">Handcrafted for Festivity</span>
              <FaStar />
            </div>
          </div>
        </div>
      </div>

      {/* Diwali Products Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {products.length > 0 ? (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-[#404040] mb-2">
                Our Diwali Collection
              </h2>
              <p className="text-gray-600">
                Showing {products.length} beautiful Diwali
                {products.length !== 1 ? "s" : ""}
              </p>
            </div>

            {/* Products Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-4 gap-3 sm:gap-4 md:gap-6 lg:gap-8">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          </>
        ) : (
          <div className="text-center py-16">
            <div className="text-6xl mb-6">🎁</div>
            <h3 className="text-2xl font-semibold text-[#404040] mb-4">
              No Diwali Products Available
            </h3>
            <p className="text-gray-600 mb-6">
              We're working on bringing you beautiful Diwali collections. Please
              check back soon!
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

      {/* Why Choose Diwali Gifts Section */}
      <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#404040] mb-10">
            Why Choose Diwali Gifts
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Lasting Memories
              </h3>
              <p className="text-gray-600 text-sm">
                Our Diwali gifts are designed to create lasting memories for you and your loved ones.
              </p>
            </div>
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Artisan Crafted
              </h3>
              <p className="text-gray-600 text-sm">
                Each piece is meticulously handcrafted by skilled artisans using
                traditional techniques passed down through generations.
              </p>
            </div>
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Premium Gift
              </h3>
              <p className="text-gray-600 text-sm">
                Our Diwali gifts make for an elegant and premium present that your
                loved ones will cherish for years to come.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Traditional Quote Section */}
      <div className="bg-gradient-to-r from-orange-50 to-yellow-100 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <blockquote className="text-2xl md:text-3xl font-medium text-[#404040] italic mb-4">
            "May the festival of lights fill your life with happiness, prosperity, and joy."
          </blockquote>
          <p className="text-lg text-gray-600">
            Celebrate Diwali with our special collection
          </p>
        </div>
      </div>
    </div>
  );
};

export default Diwali;
