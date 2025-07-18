import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import { getBanners } from "../api/banner.js";
import { getCategories } from "../api/category.js";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import Banners from "../components/common/Banners.jsx";
import ProductFilters from "../components/products/ProductFilters.jsx";
import ProductList from "../components/products/ProductList.jsx";
import ProductPagination from "../components/products/ProductPagination.jsx";

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

const DEFAULT_LIMIT = 20; // Keep in sync with backend config

const Products = () => {
    const { material = "all" } = useParams();
    const navigate = useNavigate();
    const location = useLocation();
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

    // Fetch products only
    useEffect(() => {
        if (selectedMaterial === "wood") {
            setProducts([]);
            setLoading(false);
            setError(null);
            return;
        }
        setLoading(true);
        setError(null);
        getCategories()
            .then((catRes) => {
                const categories = catRes.categories || catRes || [];
                let categoryId = null;
                if (selectedMaterial !== "all") {
                    const match = categories.find(
                        (c) => c.name.toLowerCase() === selectedMaterial
                    );
                    if (match) categoryId = match._id;
                }
                // Build product params from URL state
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
                    // Do NOT send limit, let backend use config default
                };
                return getProducts(productParams);
            })
            .then((prodRes) => {
                if (Array.isArray(prodRes)) {
                    setProducts(prodRes);
                    setTotal(0);
                } else {
                    setProducts(prodRes.products || []);
                    setTotal(prodRes.total || 0);
                }
            })
            .catch((err) => {
                setError(err.message || "Error fetching products");
                setProducts([]);
            })
            .finally(() => setLoading(false));
    }, [selectedMaterial, search, sort, selectedPrice, page]);

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
        // Reset all filters including material to 'all' when searching
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
        // Preserve search and filters when switching material via filter dropdown
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

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    if (selectedMaterial === "wood") {
        return (
            <div className="max-w-4xl mx-auto">
                <div className="text-3xl font-bold text-center py-16 text-gray-600">
                    Wood Collection Coming Soon!
                </div>
            </div>
        );
    }
    if (error)
        return <div className="p-8 text-center text-red-500">{error}</div>;

    return (
        <div className="w-full">
            <Banners material={selectedMaterial} />

            <section className="w-full px-4 md:px-8 py-8">
                <div className="max-w-7xl mx-auto">
                    {/* Top Controls */}
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
                        {/* Filters (Mobile Only Display) */}
                        <div className="md:hidden w-full">
                            <ProductFilters
                                sort={sort}
                                onSort={handleSort}
                                priceRanges={priceRanges}
                                selectedPrice={selectedPrice}
                                onPrice={handlePrice}
                                materialOptions={materialOptions}
                                selectedMaterial={selectedMaterial}
                                onMaterial={handleMaterial}
                                layout="vertical"
                            />
                            <hr className="my-4" />
                        </div>

                        {/* Sort Dropdown */}
                        <div className="ml-auto">
                            <select
                                className="border px-3 py-2 rounded-md text-sm"
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

                    {/* Main Content */}
                    <div className="flex gap-8 items-start">
                        {/* Sidebar Filters (Desktop Only) */}
                        <aside className="hidden md:block w-48 flex-shrink-0 bg-gray-50 p-4 rounded-md">
                            <ProductFilters
                                sort={sort}
                                onSort={handleSort}
                                priceRanges={priceRanges}
                                selectedPrice={selectedPrice}
                                onPrice={handlePrice}
                                materialOptions={materialOptions}
                                selectedMaterial={selectedMaterial}
                                onMaterial={handleMaterial}
                                layout="vertical"
                            />
                        </aside>

                        {/* Product List & Pagination */}
                        <main className="flex-1 min-w-0">
                            <ProductList products={products} />

                            <div className="mt-8">
                                <ProductPagination
                                    total={total}
                                    limit={DEFAULT_LIMIT}
                                    page={page}
                                    onPageChange={handlePageChange}
                                />
                            </div>
                        </main>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default Products;
