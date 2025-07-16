import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import { getBanners } from "../api/banner.js";
import { getCategories } from "../api/category.js";
import { Link, useParams, useNavigate, useLocation } from "react-router-dom";
import Banners from "../components/common/Banners.jsx";

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
    const [banners, setBanners] = useState([]);
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

    // Fetch banners and products
    useEffect(() => {
        if (selectedMaterial === "wood") {
            setProducts([]);
            setBanners([]);
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
                return Promise.all([getProducts(productParams), getBanners()]);
            })
            .then(([prodRes, bannerRes]) => {
                // prodRes should be an array or an object with products/total
                if (Array.isArray(prodRes)) {
                    setProducts(prodRes);
                    setTotal(0); // No total info
                } else {
                    setProducts(prodRes.products || []);
                    setTotal(prodRes.total || 0);
                }
                let bannersArr = bannerRes?.banners || bannerRes || [];
                if (selectedMaterial !== "all") {
                    bannersArr = bannersArr.filter(
                        (b) => b.material?.toLowerCase() === selectedMaterial
                    );
                }
                setBanners(bannersArr);
            })
            .catch((err) => {
                setError(err.message || "Error fetching products/banners");
                setProducts([]);
                setBanners([]);
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
        <div className="max-w-4xl mx-auto">
            {/* Banner(s) */}
            {banners.length > 0 && <Banners banners={banners} />}

            <div className="flex gap-4 mb-4 items-center">
                <select
                    className="border px-2 py-1 rounded"
                    value={sort}
                    onChange={handleSort}
                >
                    <option value="">Sort by</option>
                    <option value="price">Price (Low to High)</option>
                    <option value="-price">Price (High to Low)</option>
                </select>
                <div className="flex gap-2 items-center">
                    <span className="text-sm">Price:</span>
                    {priceRanges.map((range, idx) => (
                        <label
                            key={range.label}
                            className="flex items-center gap-1 cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                checked={selectedPrice === idx}
                                onChange={() => handlePrice(idx)}
                                className="accent-blue-500"
                            />
                            <span className="text-xs">{range.label}</span>
                        </label>
                    ))}
                </div>
                {/* Material filter */}
                <div className="flex gap-2 items-center">
                    <span className="text-sm">Material:</span>
                    <select
                        className="border px-2 py-1 rounded"
                        value={selectedMaterial}
                        onChange={handleMaterial}
                    >
                        {materialOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>
            <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {products.map((p) => (
                    <li
                        key={p._id}
                        className="border rounded p-4 flex flex-col gap-2 bg-white"
                    >
                        <Link
                            to={`/products/${p._id}`}
                            className="font-semibold text-blue-600 hover:underline"
                        >
                            {p.name}
                        </Link>
                        <div className="text-gray-700">₹{p.price}</div>
                    </li>
                ))}
            </ul>
            {/* Pagination */}
            {total > DEFAULT_LIMIT && (
                <div className="flex justify-center mt-6 gap-2">
                    {Array.from(
                        { length: Math.ceil(total / DEFAULT_LIMIT) },
                        (_, i) => (
                            <button
                                key={i + 1}
                                className={`px-3 py-1 rounded border ${
                                    page === i + 1
                                        ? "bg-blue-500 text-white"
                                        : "bg-white text-blue-500"
                                }`}
                                onClick={() => handlePageChange(i + 1)}
                                disabled={page === i + 1}
                            >
                                {i + 1}
                            </button>
                        )
                    )}
                </div>
            )}
        </div>
    );
};

export default Products;
