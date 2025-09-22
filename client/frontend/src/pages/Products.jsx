import React, { useEffect, useState } from "react";
import { getProducts } from "../api/product.js";
import { useAppData } from "../context/AppDataContext.jsx";
import { useNavigate, useLocation } from "react-router-dom";
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
    { min: 0, max: 500, label: "₹0 - ₹500" },
    { min: 500, max: 1000, label: "₹500 - ₹1,000" },
    { min: 1000, max: 5000, label: "₹1,000 - ₹5,000" },
    { min: 5000, max: 10000, label: "₹5000 - ₹10,000" },
];

const DEFAULT_LIMIT = 16;

const Products = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { categories: rawCategories, allCategories } = useAppData();
    const categories = rawCategories || []; // Ensure categories is always an array
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const params = new URLSearchParams(location.search);
    const urlSearch = params.get("search") || "";
    const urlSort = params.get("sort") || "";
    const urlCategories = params.get("categories");
    const urlSubcategories = params.get("subcategories");
    const urlPriceRanges = params.get("priceRanges");
    const urlPage = parseInt(params.get("page") || "1", 10);

    const [search, setSearch] = useState(urlSearch);
    const [sort, setSort] = useState(urlSort);
    const [selectedCategories, setSelectedCategories] = useState(() => {
        return urlCategories ? urlCategories.split(",") : [];
    });
    const [selectedSubcategories, setSelectedSubcategories] = useState(() => {
        return urlSubcategories ? urlSubcategories.split(",") : [];
    });
    const [selectedPriceRanges, setSelectedPriceRanges] = useState(() => {
        return urlPriceRanges ? urlPriceRanges.split(",").map(Number) : [];
    });
    const [page, setPage] = useState(urlPage);
    const [total, setTotal] = useState(0);

    // Determine banner material based on selected category
    const getBannerMaterial = () => {
        // If no categories selected or multiple categories, show all banners
        if (!selectedCategories.length || selectedCategories.length > 1) {
            return "all";
        }

        // Find the selected category in allCategories
        const selectedCategoryId = selectedCategories[0];
        const selectedCategory = allCategories?.find(
            (cat) => cat._id === selectedCategoryId
        );

        // Return the category name as material (e.g., "silver", "brass", "wood")
        if (selectedCategory) {
            return selectedCategory.name.toLowerCase();
        }

        return "all";
    };

    const bannerMaterial = getBannerMaterial();

    // Sync state with URL params
    useEffect(() => {
        setSearch(urlSearch);
        setSort(urlSort);
        setPage(urlPage);
        setSelectedCategories(urlCategories ? urlCategories.split(",") : []);
        setSelectedSubcategories(
            urlSubcategories ? urlSubcategories.split(",") : []
        );
        setSelectedPriceRanges(
            urlPriceRanges ? urlPriceRanges.split(",").map(Number) : []
        );
    }, [
        urlSearch,
        urlSort,
        urlCategories,
        urlSubcategories,
        urlPriceRanges,
        urlPage,
    ]);

    // Fetch products
    useEffect(() => {
        setLoading(true);
        setError(null);

        const fetchProducts = async () => {
            try {
                const params = {};

                if (search) params.search = search;
                if (sort) params.sort = sort;
                if (page > 1) params.page = page;
                params.limit = DEFAULT_LIMIT; // Always pass the limit

                // Handle categories
                if (selectedCategories.length > 0) {
                    params.categories = selectedCategories.join(",");
                }

                // Handle subcategories
                if (selectedSubcategories.length > 0) {
                    params.subcategories = selectedSubcategories.join(",");
                }

                // Handle price ranges
                if (selectedPriceRanges.length > 0) {
                    params.priceRanges = selectedPriceRanges.join(",");
                }

                const data = await getProducts(params);
                setProducts(data.products || []);
                setTotal(data.total || 0);
            } catch (err) {
                console.error("Error fetching products:", err);
                setError("Failed to load products. Please try again.");
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [
        search,
        sort,
        selectedCategories,
        selectedSubcategories,
        selectedPriceRanges,
        page,
    ]);

    // Utility function for smooth scroll to top
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };

    // Handlers
    const updateQueryParams = (newParams) => {
        const params = new URLSearchParams(location.search);
        Object.entries(newParams).forEach(([key, value]) => {
            if (
                value === undefined ||
                value === null ||
                value === "" ||
                (Array.isArray(value) && value.length === 0)
            ) {
                params.delete(key);
            } else if (Array.isArray(value)) {
                params.set(key, value.join(","));
            } else {
                params.set(key, value);
            }
        });

        navigate({
            pathname: "/products",
            search: params.toString() ? `?${params.toString()}` : "",
        });
    };

    const handleSearch = (e) => {
        e.preventDefault();
        navigate({
            pathname: "/products",
            search: search ? `?search=${encodeURIComponent(search)}` : "",
        });
        scrollToTop();
    };

    const handleSort = (e) => {
        setSort(e.target.value);
        updateQueryParams({ sort: e.target.value, page: 1 });
        scrollToTop();
    };

    const handleCategoryChange = (categories) => {
        setSelectedCategories(categories);
        setSelectedSubcategories([]); // Reset subcategories when categories change
        updateQueryParams({ categories, subcategories: [], page: 1 });
        scrollToTop();
    };

    const handleSubcategoryChange = (subcategories) => {
        setSelectedSubcategories(subcategories);
        updateQueryParams({ subcategories, page: 1 });
        scrollToTop();
    };

    const handlePriceRangeChange = (priceRanges) => {
        setSelectedPriceRanges(priceRanges);
        updateQueryParams({ priceRanges, page: 1 });
        scrollToTop();
    };

    // New handler for applying filters from desktop
    const handleApplyFilters = (categories, subcategories, priceRanges) => {
        setSelectedCategories(categories);
        setSelectedSubcategories(subcategories);
        setSelectedPriceRanges(priceRanges);

        updateQueryParams({
            categories,
            subcategories,
            priceRanges,
            page: 1,
        });
        scrollToTop();
    };

    const handlePageChange = (newPage) => {
        setPage(newPage);
        updateQueryParams({ page: newPage });
        scrollToTop();
    };

    // New handler for mobile controls to apply multiple filters simultaneously
    const handleApplyMobileFilters = (
        pendingCategories,
        pendingSubcategories,
        pendingPriceRanges
    ) => {
        setSelectedCategories(pendingCategories);
        setSelectedSubcategories(pendingSubcategories);
        setSelectedPriceRanges(pendingPriceRanges);

        updateQueryParams({
            categories: pendingCategories,
            subcategories: pendingSubcategories,
            priceRanges: pendingPriceRanges,
            page: 1,
        });
        scrollToTop();
    };
    if (loading) return <Loader fullScreen={true} />;

    return (
        <div className="min-h-screen ">
            <Banners material={bannerMaterial} />

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
                <div className="max-w-9xl mx-auto">
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
                        <select
                            className="px-3 py-2 rounded-md text-sm outline-none focus:ring-0 focus:outline-none border-none bg-[#EFEEE5] montserrat-global"
                            value={sort}
                            onChange={handleSort}
                        >
                            <option value="">Sort by</option>
                            <option value="price">Price (Low to High)</option>
                            <option value="-price">Price (High to Low)</option>
                        </select>
                    </div>

                    <div className="flex gap-8 items-start">
                        {/* Sidebar Filters (Desktop Only) */}
                        <aside className="hidden md:block w-48 flex-shrink-0 bg-[#F7F4EF] p-4 rounded-md">
                            <ProductFilters
                                categoryOptions={categories}
                                selectedCategories={selectedCategories}
                                selectedSubcategories={selectedSubcategories}
                                priceRanges={priceRanges}
                                selectedPriceRanges={selectedPriceRanges}
                                onApplyFilters={handleApplyFilters}
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
                                    {Math.ceil(total / DEFAULT_LIMIT) > 1 && (
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
                categoryOptions={categories}
                selectedCategories={selectedCategories}
                selectedSubcategories={selectedSubcategories}
                priceRanges={priceRanges}
                selectedPriceRanges={selectedPriceRanges}
                onApplyMobileFilters={handleApplyMobileFilters}
                sort={sort}
                handleSort={handleSort}
            />

            {/* Additional Sections 
            <DesignJourney />
            <Craftsmanship />
            <WhyChooseOurProducts />
            */}
        </div>
    );
};

export default Products;
