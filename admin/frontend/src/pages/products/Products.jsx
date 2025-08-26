import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaPlus, FaSearch, FaFilter } from "react-icons/fa";
import { getProducts } from "../../api/products.api.js";
import { getCategories } from "../../api/categories.api.js";
import Loader from "../../components/common/Loader.jsx";
import ProtectedComponent from "../../components/common/ProtectedComponent.jsx";

const Products = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState("");
    const [searchInput, setSearchInput] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [totalProducts, setTotalProducts] = useState(0);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

    // Advanced filter states
    const [filters, setFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        isFeatured: "",
        inStock: "",
        lowStock: false,
        minStock: "",
        maxStock: "",
        minRating: "",
        maxRating: "",
        hasReviews: "",
        minReviews: "",
        minSales: "",
        maxSales: "",
        minViews: "",
        hasDiscount: "",
        minDiscount: "",
        maxDiscount: "",
    });

    // Applied filters (what's actually sent to API)
    const [appliedFilters, setAppliedFilters] = useState({
        category: "",
        minPrice: "",
        maxPrice: "",
        isFeatured: "",
        inStock: "",
        lowStock: false,
        minStock: "",
        maxStock: "",
        minRating: "",
        maxRating: "",
        hasReviews: "",
        minReviews: "",
        minSales: "",
        maxSales: "",
        minViews: "",
        hasDiscount: "",
        minDiscount: "",
        maxDiscount: "",
    });

    const productsPerPage = 12;

    // Handle URL parameters on component mount
    useEffect(() => {
        const searchParams = new URLSearchParams(location.search);
        const filterParam = searchParams.get("filter");

        if (filterParam === "lowStock") {
            // Set low stock filter
            setFilters((prev) => ({
                ...prev,
                lowStock: true,
            }));
            setAppliedFilters((prev) => ({
                ...prev,
                lowStock: true,
            }));
            setShowAdvancedFilters(true); // Show filters so user can see what's applied
        }
    }, [location.search]);

    useEffect(() => {
        fetchProducts();
        fetchCategories();
    }, [currentPage, searchTerm, appliedFilters]);

    const fetchProducts = async () => {
        setLoading(true);
        setError(null);
        try {
            const params = {
                skip: (currentPage - 1) * productsPerPage,
                limit: productsPerPage,
            };

            // Add search filter
            if (searchTerm) params.search = searchTerm;

            // Add applied filters
            Object.keys(appliedFilters).forEach((key) => {
                const value = appliedFilters[key];
                if (value !== "" && value !== false) {
                    // Convert boolean true to string for backend
                    if (value === true) {
                        params[key] = "true";
                    } else {
                        params[key] = value;
                    }
                }
            });

            console.log("Fetching products with params:", params);
            const result = await getProducts(params);
            console.log("Products API result:", result);

            if (result.success) {
                // Backend now returns {products: [], total: number, skip: number, limit: number}
                setProducts(result.data.products || []);
                setTotalProducts(result.data.total || 0);
                console.log(
                    "Products loaded:",
                    result.data.products?.length || 0
                );
                console.log("Total products:", result.data.total || 0);
            } else {
                console.error("Failed to fetch products:", result.error);
                setError(result.error);
            }
        } catch (error) {
            console.error("Error fetching products:", error);
            setError("Failed to load products");
        } finally {
            setLoading(false);
        }
    };

    const fetchCategories = async () => {
        try {
            console.log("Fetching categories...");
            const result = await getCategories();
            console.log("Categories API result:", result);

            if (result.success) {
                setCategories(result.data || []);
                console.log("Categories loaded:", result.data?.length || 0);
            } else {
                console.error("Failed to fetch categories:", result.error);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        }
    };

    const handleSearch = () => {
        setSearchTerm(searchInput);
        setCurrentPage(1); // Reset to first page when searching
    };

    const handleFilterChange = (key, value) => {
        setFilters((prev) => ({
            ...prev,
            [key]: value,
        }));
        // Don't reset page here since filters haven't been applied yet
    };

    const applyFilters = () => {
        setAppliedFilters(filters);
        setCurrentPage(1); // Reset to first page when applying filters
    };

    const clearAllFilters = () => {
        const clearedFilters = {
            category: "",
            minPrice: "",
            maxPrice: "",
            isFeatured: "",
            inStock: "",
            lowStock: false,
            minStock: "",
            maxStock: "",
            minRating: "",
            maxRating: "",
            hasReviews: "",
            minReviews: "",
            minSales: "",
            maxSales: "",
            minViews: "",
            hasDiscount: "",
            minDiscount: "",
            maxDiscount: "",
        };
        setFilters(clearedFilters);
        setAppliedFilters(clearedFilters);
        setSearchTerm("");
        setSearchInput("");
        setCurrentPage(1);
    };

    const getActiveFiltersCount = () => {
        let count = 0;
        Object.values(appliedFilters).forEach((value) => {
            if (value !== "" && value !== false) count++;
        });
        if (searchTerm) count++;
        return count;
    };

    const handleKeyPress = (e) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    const totalPages = Math.ceil(totalProducts / productsPerPage);

    if (loading) {
        return <Loader fullScreen={true} />;
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-96">
                <div className="text-center">
                    <div className="text-red-500 text-lg mb-4">⚠️ {error}</div>
                    <button
                        onClick={() => {
                            setError(null);
                            fetchProducts();
                        }}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                    >
                        Retry
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h1 className="text-2xl font-bold text-admin-text">
                        Products
                    </h1>
                    <p className="text-admin-text-secondary">
                        Manage your product inventory ({totalProducts} products)
                    </p>
                </div>
                <ProtectedComponent permission="products.create" view={true}>
                    <Link
                        to="/products/add"
                        className="bg-admin-primary text-white px-4 py-2 rounded-lg hover:bg-admin-primary-dark transition-colors flex items-center gap-2"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add Product
                    </Link>
                </ProtectedComponent>
            </div>

            {/* Filters */}
            <div className="bg-admin-card rounded-lg p-6 border border-admin-border">
                <div className="flex flex-col md:flex-row gap-4">
                    {/* Search */}
                    <div className="flex-1 flex gap-2">
                        <div className="relative flex-1">
                            <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-admin-text-secondary w-4 h-4" />
                            <input
                                type="text"
                                placeholder="Search products..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                className="w-full pl-10 pr-4 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent"
                            />
                        </div>
                        <button
                            onClick={handleSearch}
                            className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors"
                        >
                            Search
                        </button>
                    </div>

                    {/* Filters Toggle */}
                    <button
                        onClick={() =>
                            setShowAdvancedFilters(!showAdvancedFilters)
                        }
                        className={`px-4 py-2 border border-admin-border rounded-lg transition-colors whitespace-nowrap ${
                            showAdvancedFilters
                                ? "bg-admin-primary text-white"
                                : "text-admin-text-secondary hover:text-admin-text hover:bg-admin-bg"
                        }`}
                    >
                        <FaFilter className="w-4 h-4 inline mr-2" />
                        Filters ({getActiveFiltersCount()})
                    </button>

                    {/* Clear Filters */}
                    <button
                        onClick={clearAllFilters}
                        className="px-4 py-2 text-admin-text-secondary hover:text-admin-text border border-admin-border rounded-lg hover:bg-admin-bg transition-colors whitespace-nowrap"
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Advanced Filters Panel */}
                {showAdvancedFilters && (
                    <div className="mt-6 pt-6 border-t border-admin-border">
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                            {/* Category Filter */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Category
                                </label>
                                <select
                                    value={filters.category}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "category",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Categories</option>
                                    {categories.map((category) => (
                                        <option
                                            key={category._id}
                                            value={category._id}
                                        >
                                            {category.name}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Price Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Price Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minPrice}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "minPrice",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxPrice}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "maxPrice",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Stock Filters */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Stock Status
                                </label>
                                <select
                                    value={filters.inStock}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "inStock",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Stock</option>
                                    <option value="true">In Stock</option>
                                    <option value="false">Out of Stock</option>
                                </select>
                                <label className="flex items-center text-sm">
                                    <input
                                        type="checkbox"
                                        checked={filters.lowStock}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "lowStock",
                                                e.target.checked
                                            )
                                        }
                                        className="mr-2"
                                    />
                                    Low Stock Only (≤10)
                                </label>
                            </div>

                            {/* Stock Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Stock Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        value={filters.minStock}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "minStock",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        value={filters.maxStock}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "maxStock",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Rating Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Rating Range
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={filters.minRating}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "minRating",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max"
                                        min="0"
                                        max="5"
                                        step="0.1"
                                        value={filters.maxRating}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "maxRating",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Reviews */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Reviews
                                </label>
                                <select
                                    value={filters.hasReviews}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "hasReviews",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">All Products</option>
                                    <option value="true">With Reviews</option>
                                    <option value="false">No Reviews</option>
                                </select>
                                <input
                                    type="number"
                                    placeholder="Min Reviews"
                                    value={filters.minReviews}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "minReviews",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                />
                            </div>

                            {/* Sales Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Sales Count
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min Sales"
                                        value={filters.minSales}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "minSales",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max Sales"
                                        value={filters.maxSales}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "maxSales",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>

                            {/* Featured & Discount */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Special Filters
                                </label>
                                <select
                                    value={filters.isFeatured}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "isFeatured",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">Featured Status</option>
                                    <option value="true">Featured Only</option>
                                    <option value="false">Not Featured</option>
                                </select>
                                <select
                                    value={filters.hasDiscount}
                                    onChange={(e) =>
                                        handleFilterChange(
                                            "hasDiscount",
                                            e.target.value
                                        )
                                    }
                                    className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                >
                                    <option value="">Discount Status</option>
                                    <option value="true">With Discount</option>
                                    <option value="false">No Discount</option>
                                </select>
                            </div>

                            {/* Discount Range */}
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-admin-text">
                                    Discount Range (%)
                                </label>
                                <div className="flex gap-2">
                                    <input
                                        type="number"
                                        placeholder="Min %"
                                        min="0"
                                        max="100"
                                        value={filters.minDiscount}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "minDiscount",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                    <input
                                        type="number"
                                        placeholder="Max %"
                                        min="0"
                                        max="100"
                                        value={filters.maxDiscount}
                                        onChange={(e) =>
                                            handleFilterChange(
                                                "maxDiscount",
                                                e.target.value
                                            )
                                        }
                                        className="w-full px-3 py-2 border border-admin-border rounded-lg focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Apply Filters Button */}
                        <div className="mt-6 flex justify-center">
                            <button
                                onClick={applyFilters}
                                className="px-6 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors font-medium"
                            >
                                Apply Filters
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Products Table */}
            <div className="bg-admin-card rounded-lg border border-admin-border overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full">
                        <thead className="bg-admin-bg border-b border-admin-border">
                            <tr>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Product
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Category
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Price
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Discounted Price
                                </th>
                                <th className="text-left px-6 py-4 font-semibold text-admin-text">
                                    Stock
                                </th>
                                <th className="text-right px-6 py-4 font-semibold text-admin-text">
                                    Actions
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-admin-border">
                            {products.map((product) => (
                                <tr
                                    key={product._id}
                                    className="hover:bg-admin-bg transition-colors"
                                >
                                    {/* Product Info */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-4">
                                            <div className="w-16 h-16 bg-admin-bg rounded-lg flex items-center justify-center overflow-hidden">
                                                {product.images &&
                                                product.images[0] ? (
                                                    <img
                                                        src={product.images[0]}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover"
                                                    />
                                                ) : (
                                                    <span className="text-admin-text-secondary text-xs">
                                                        No Image
                                                    </span>
                                                )}
                                            </div>
                                            <div>
                                                <h3 className="font-medium text-admin-text">
                                                    {product.name}
                                                </h3>
                                                {product.brand && (
                                                    <p className="text-sm text-admin-text-secondary">
                                                        {product.brand}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    </td>

                                    {/* Category */}
                                    <td className="px-6 py-4">
                                        <span className="text-admin-text">
                                            {product.category?.name ||
                                                "Uncategorized"}
                                        </span>
                                    </td>

                                    {/* Price */}
                                    <td className="px-6 py-4">
                                        <span className="font-medium text-admin-text">
                                            ₹{product.price?.toLocaleString()}
                                        </span>
                                    </td>

                                    {/* Discounted Price */}
                                    <td className="px-6 py-4">
                                        {product.discount &&
                                        product.discount > 0 ? (
                                            <div className="flex items-center gap-2">
                                                <span className="font-medium text-admin-text">
                                                    ₹
                                                    {Math.round(
                                                        product.price *
                                                            (1 -
                                                                product.discount /
                                                                    100)
                                                    ).toLocaleString()}
                                                </span>
                                                <span className="text-sm text-admin-text-secondary">
                                                    ({product.discount}% off)
                                                </span>
                                            </div>
                                        ) : (
                                            <span className="text-admin-text-secondary text-sm">
                                                No discount
                                            </span>
                                        )}
                                    </td>

                                    {/* Stock */}
                                    <td className="px-6 py-4">
                                        <span
                                            className={`font-medium ${
                                                product.stock <= 5
                                                    ? "text-red-500"
                                                    : product.stock <= 20
                                                    ? "text-yellow-500"
                                                    : "text-green-500"
                                            }`}
                                        >
                                            {product.stock}
                                        </span>
                                    </td>

                                    {/* Actions */}
                                    <td className="px-6 py-4">
                                        <div className="flex items-center justify-end">
                                            <Link
                                                to={`/products/view/${product._id}`}
                                                className="px-4 py-2 bg-admin-primary text-white rounded-lg hover:bg-admin-primary-dark transition-colors text-sm"
                                            >
                                                View Details
                                            </Link>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Empty State */}
            {products.length === 0 && (
                <div className="text-center py-12">
                    <div className="text-admin-text-secondary mb-4">
                        <FaSearch className="w-16 h-16 mx-auto mb-4 opacity-50" />
                        <p className="text-lg">No products found</p>
                        <p>Try adjusting your search or filters</p>
                    </div>
                    <Link
                        to="/products/add"
                        className="inline-flex items-center gap-2 bg-admin-primary text-white px-6 py-3 rounded-lg hover:bg-admin-primary-dark transition-colors"
                    >
                        <FaPlus className="w-4 h-4" />
                        Add First Product
                    </Link>
                </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-8">
                    <button
                        onClick={() =>
                            setCurrentPage(Math.max(1, currentPage - 1))
                        }
                        disabled={currentPage === 1}
                        className="px-4 py-2 border border-admin-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-admin-bg transition-colors"
                    >
                        Previous
                    </button>

                    <span className="px-4 py-2 text-admin-text-secondary">
                        Page {currentPage} of {totalPages}
                    </span>

                    <button
                        onClick={() =>
                            setCurrentPage(
                                Math.min(totalPages, currentPage + 1)
                            )
                        }
                        disabled={currentPage === totalPages}
                        className="px-4 py-2 border border-admin-border rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-admin-bg transition-colors"
                    >
                        Next
                    </button>
                </div>
            )}
        </div>
    );
};

export default Products;
