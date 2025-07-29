import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import { useAppData } from "../context/AppDataContext.jsx";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Banners from "../components/common/Banners.jsx";
import Loader from "../components/common/Loader.jsx";
import ProductFilters from "../components/products/ProductFilters.jsx";
import ProductList from "../components/products/ProductList.jsx";
import ProductPagination from "../components/products/ProductPagination.jsx";
import DesignJourney from "../components/products/DesignJourney.jsx";
import Craftsmanship from "../components/products/Craftsmanship.jsx";
import WhyChooseOurProducts from "../components/products/WhyChooseOurProducts.jsx";
import MobileProductControls from "../components/products/MobileProductControls.jsx";

const priceRanges = [
    { label: "Under ₹500", min: 0, max: 500 },
    { label: "₹500 - ₹1000", min: 500, max: 1000 },
    { label: "₹1000 - ₹5000", min: 1000, max: 5000 },
    { label: "₹5000 - ₹10000", min: 5000, max: 10000 },
];

const materialOptions = [
    { label: "All", value: "all" },
    { label: "Silver", value: "silver" },
    { label: "Brass", value: "brass" },
    { label: "Wood", value: "wood" },
];

const DEFAULT_LIMIT = 20;

const Products = () => {
    const { material = "all" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
    const { categories } = useAppData();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    const urlSort = params.get("sort") || "";
    const urlMinPrice = params.get("minPrice");
    const urlMaxPrice = params.get("maxPrice");
    const urlPage = parseInt(params.get("page") || "1", 10);

    const [search, setSearch] = useState(urlSearch);
    const [sort, setSort] = useState(urlSort);
    const [selectedPrice, setSelectedPrice] = useState(() => {
        if (urlMinPrice != null && urlMaxPrice != null) {
            return priceRanges.findIndex(
                (r) =>
                    String(r.min) === urlMinPrice &&
                    String(r.max) === urlMaxPrice
            );
        }
        return null;
    });
    const [selectedMaterial, setSelectedMaterial] = useState(material);
    const [page, setPage] = useState(urlPage);
    const [total, setTotal] = useState(0);

    // Sync state with URL params
    useEffect(() => {
        setSearch(urlSearch);
        setSort(urlSort);
        setPage(urlPage);
        setSelectedMaterial(material);
        if (urlMinPrice && urlMaxPrice) {
            const idx = priceRanges.findIndex(
                (r) =>
                    String(r.min) === urlMinPrice &&
                    String(r.max) === urlMaxPrice
            );
            setSelectedPrice(idx);
        } else {
            setSelectedPrice(null);
        }
    }, [urlSearch, urlSort, urlMinPrice, urlMaxPrice, urlPage, material]);

    // Fetch products
    useEffect(() => {
        if (selectedMaterial === "wood") {
            setProducts([]);
            setLoading(false);
            setError(null);
            return;
        }

        setLoading(true);
        setError(null);

        const fetchProducts = async () => {
            try {
                let categoryId = null;
                if (selectedMaterial !== "all") {
                    const match = categories.find(
                        (c) => c.name.toLowerCase() === selectedMaterial
                    );
                    if (match) categoryId = match._id;
                }

                const skip = (page - 1) * DEFAULT_LIMIT;
                const productParams = {
                    ...(categoryId ? { category: categoryId } : {}),
                    ...(sort ? { sort } : {}),
                    ...(selectedPrice !== null
                        ? {
                              minPrice: priceRanges[selectedPrice].min,
                              maxPrice: priceRanges[selectedPrice].max,
                          }
                        : {}),
                    ...(search && search.trim() !== "" ? { search } : {}),
                    ...(skip > 0 ? { skip } : {}),
                };

                const prodRes = await getProducts(productParams);

                if (Array.isArray(prodRes)) {
                    setProducts(prodRes);
                    setTotal(0);
                } else {
                    setProducts(prodRes.products || []);
                    setTotal(prodRes.total || prodRes.totalCount || 0);
                }
            } catch (err) {
                setError(err.message || "Error fetching products");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedMaterial, search, sort, selectedPrice, page, categories]);

    // Handlers
    const updateQueryParams = (newParams) => {
        const params = new URLSearchParams(location.search);
        Object.entries(newParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });
        navigate({
            pathname:
                selectedMaterial === "all"
                    ? "/products"
                    : `/products/${selectedMaterial}`,
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate({
            pathname: "/products",
            search: search ? `?search=${encodeURIComponent(search)}` : "",
        });
    };

    const handleSort = (e) => {
        setSort(e.target.value);
        updateQueryParams({ sort: e.target.value, page: 1 });
    };

    const handlePrice = (idx) => {
        if (selectedPrice === idx) {
            setSelectedPrice(null);
            updateQueryParams({
                minPrice: undefined,
                maxPrice: undefined,
                page: 1,
            });
        } else {
            setSelectedPrice(idx);
            updateQueryParams({
                minPrice: priceRanges[idx].min,
                maxPrice: priceRanges[idx].max,
                page: 1,
            });
        }
    };

    const handleMaterial = (e) => {
        const value = e.target.value;
        setSelectedMaterial(value);
        const params = new URLSearchParams(location.search);
        navigate({
            pathname: value === "all" ? "/products" : `/products/${value}`,
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        updateQueryParams({ page: newPage });
    };

    // New handler for mobile controls to apply multiple filters simultaneously
    const handleApplyMobileFilters = (pendingPrice, pendingMaterial) => {
        const filterParams = { page: 1 }; // Reset to page 1 when applying filters

        // Handle price filter
        if (pendingPrice !== null && pendingPrice >= 0) {
            setSelectedPrice(pendingPrice);
            filterParams.minPrice = priceRanges[pendingPrice].min;
            filterParams.maxPrice = priceRanges[pendingPrice].max;
        } else {
            setSelectedPrice(null);
            filterParams.minPrice = undefined;
            filterParams.maxPrice = undefined;
        }

        // Handle material filter
        if (pendingMaterial && pendingMaterial !== "all") {
            setSelectedMaterial(pendingMaterial);
            // Material affects the pathname, so we'll handle this in navigation
        } else {
            setSelectedMaterial("all");
            pendingMaterial = "all";
        }

        // Navigate with all parameters at once
        const params = new URLSearchParams(location.search);
        Object.entries(filterParams).forEach(([key, value]) => {
            if (value === undefined || value === null || value === "") {
                params.delete(key);
            } else {
                params.set(key, value);
            }
        });

        navigate({
            pathname:
                pendingMaterial === "all"
                    ? "/products"
                    : `/products/${pendingMaterial}`,
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };

    if (loading) return <Loader fullScreen={true} />;

    if (selectedMaterial === "wood") {
        return (
            <div className="min-h-screen bg-white">
                <Banners material={selectedMaterial} />
                <div className="p-8 text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">
                        Wood Products Coming Soon
                    </h2>
                    <p className="text-gray-600">
                        We're working on adding beautiful wooden products to our
                        collection. Stay tuned!
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white">
            <Banners material={selectedMaterial} />

            {/* Search Results Info */}
            {search && search.trim() !== "" && (
                <div className="px-4 pt-4 md:hidden">
                    <div className="max-w-7xl mx-auto">
                        <p className="text-sm text-gray-600">
                            Showing products for "
                            <span className="font-medium text-gray-800">
                                {search}
                            </span>
                            "
                        </p>
                    </div>
                </div>
            )}

            {/* Main Content */}
            <div className="px-4 py-4">
                <div className="max-w-7xl mx-auto">
                    {/* Top Controls (PC only) */}
                    <div className="hidden md:flex flex-row justify-between items-center mb-6 gap-4">
                        {/* Search Results Info for Desktop */}
                        <div className="flex-1">
                            {search && search.trim() !== "" && (
                                <p className="text-sm text-gray-600">
                                    Showing products for "
                                    <span className="font-medium text-gray-800">
                                        {search}
                                    </span>
                                    "
                                </p>
                            )}
                        </div>

                        {/* Sort Dropdown */}
                        <div className="bg-[#F7F4EF]">
                            <select
                                className="px-3 py-2 rounded-md text-sm bg-[#F7F4EF]"
                                value={sort}
                                onChange={handleSort}
                            >
                                <option value="">Sort by</option>
                                <option value="price">
                                    Price (Low to High)
                                </option>
                                <option value="-price">
                                    Price (High to Low)
                                </option>
                            </select>
                        </div>
                    </div>

                    <div className="flex gap-8 items-start">
                        {/* Sidebar Filters (Desktop Only) */}
                        <aside className="hidden md:block w-48 flex-shrink-0 bg-[#F7F4EF] p-4 rounded-md">
                            <ProductFilters
                                priceRanges={priceRanges}
                                selectedPrice={selectedPrice}
                                onPrice={handlePrice}
                                materialOptions={materialOptions}
                                selectedMaterial={selectedMaterial}
                                onMaterial={handleMaterial}
                                layout="vertical"
                            />
                        </aside>

                        {/* Product List */}
                        <main className="flex-1">
                            {error ? (
                                <div className="text-center text-red-500 py-8">
                                    {error}
                                </div>
                            ) : products.length === 0 ? (
                                <div className="text-center text-gray-500 py-8">
                                    No products found. Try adjusting your
                                    filters.
                                </div>
                            ) : (
                                <>
                                    <ProductList products={products} />
                                    {total > DEFAULT_LIMIT && (
                                        <ProductPagination
                                            currentPage={page}
                                            totalPages={Math.ceil(
                                                total / DEFAULT_LIMIT
                                            )}
                                            onPageChange={handlePageChange}
                                        />
                                    )}
                                </>
                            )}
                        </main>
                    </div>
                </div>
            </div>

            {/* Mobile Controls */}
            <MobileProductControls
                priceRanges={priceRanges}
                selectedPrice={selectedPrice}
                onPrice={handlePrice}
                materialOptions={materialOptions}
                selectedMaterial={selectedMaterial}
                onMaterial={handleMaterial}
                onApplyMobileFilters={handleApplyMobileFilters}
                sort={sort}
                handleSort={handleSort}
            />

            {/* Additional Sections 
            <DesignJourney />
            <Craftsmanship />
            */}
            
            <WhyChooseOurProducts />
        </div>
    );
};

export default Products;
