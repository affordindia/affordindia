import React, { useState, useEffect } from "react";
import { FaTimes } from "react-icons/fa";
import ProductFilters from "./ProductFilters";

const MobileProductControls = ({
    priceRanges,
    selectedPriceRanges,
    categoryOptions,
    selectedCategories,
    selectedSubcategories,
    onApplyMobileFilters,
    sort,
    handleSort,
    mobileMenuOpen,
}) => {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showSortSheet, setShowSortSheet] = useState(false);
    const [navbarHeight, setNavbarHeight] = useState(56); // Default fallback

    // Calculate actual navbar height dynamically
    useEffect(() => {
        const updateNavbarHeight = () => {
            const navbar = document.querySelector('nav[class*="sticky"]');
            if (navbar) {
                const rect = navbar.getBoundingClientRect();
                setNavbarHeight(rect.bottom); // This gives us the bottom position from viewport top
            }
        };

        // Update on mount
        updateNavbarHeight();

        // Update on resize or scroll (in case promo strip disappears)
        window.addEventListener("resize", updateNavbarHeight);
        window.addEventListener("scroll", updateNavbarHeight);

        return () => {
            window.removeEventListener("resize", updateNavbarHeight);
            window.removeEventListener("scroll", updateNavbarHeight);
        };
    }, []);

    const toggleFilterPanel = () => {
        setShowFilterPanel((prev) => !prev);
        setShowSortSheet(false);
    };

    const closeFilterPanel = () => {
        setShowFilterPanel(false);
    };

    const handleMobileApplyFilters = (
        categories,
        subcategories,
        priceRanges
    ) => {
        onApplyMobileFilters(categories, subcategories, priceRanges);
        closeFilterPanel();
    };

    return (
        <>
            {/* Fixed Bottom Buttons */}
            <div
                className={`fixed bottom-0 left-0 right-0 z-50 md:hidden flex bg-[#F7F4EF] ${
                    mobileMenuOpen ? "hidden" : ""
                }`}
            >
                <button
                    className="flex-1 py-3 border-t border-r border-gray-300 text-base font-medium"
                    onClick={toggleFilterPanel}
                >
                    Filters
                </button>
                <button
                    className="flex-1 py-3 border-t border-gray-300 text-base font-medium"
                    onClick={() => {
                        setShowSortSheet((prev) => !prev);
                        setShowFilterPanel(false);
                    }}
                >
                    Sort
                </button>
            </div>

            {/* Filter Panel */}
            <div
                className={`fixed left-0 right-0 bottom-0 z-40 flex md:hidden transition-opacity duration-300 ease-in-out ${
                    showFilterPanel
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                style={{
                    top: `${navbarHeight}px`,
                }}
            >
                <div
                    className={`absolute inset-0 bg-black/20 backdrop-blur-sm transition-opacity duration-300 ease-in-out ${
                        showFilterPanel ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={closeFilterPanel}
                ></div>
                <div className="relative w-full h-full flex">
                    <div
                        className={`w-full h-full bg-white overflow-y-auto transform transition-transform duration-300 ease-in-out ${
                            showFilterPanel
                                ? "translate-x-0"
                                : "-translate-x-full"
                        } pointer-events-auto`}
                        style={{
                            paddingBottom: "72px", // Add padding for bottom buttons (56px + some extra)
                        }}
                    >
                        <div className="p-6">
                            <div className="flex justify-between items-center mb-4">
                                <h2 className="text-lg font-semibold">
                                    Filters
                                </h2>
                                <button
                                    onClick={closeFilterPanel}
                                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                    aria-label="Close filters"
                                >
                                    <FaTimes className="text-gray-600 text-lg" />
                                </button>
                            </div>
                            <ProductFilters
                                priceRanges={priceRanges}
                                selectedPriceRanges={selectedPriceRanges}
                                categoryOptions={categoryOptions}
                                selectedCategories={selectedCategories}
                                selectedSubcategories={selectedSubcategories}
                                onApplyFilters={handleMobileApplyFilters}
                                layout="vertical"
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sort Panel */}
            <div
                className={`fixed inset-0 z-40 flex md:hidden items-end ${
                    showSortSheet ? "" : "pointer-events-none"
                }`}
            >
                <div
                    className={`absolute left-0 right-0 top-0 bottom-0 bg-white/10 backdrop-blur-sm transition-opacity duration-300 ${
                        showSortSheet
                            ? "opacity-100 pointer-events-auto"
                            : "opacity-0 pointer-events-none"
                    }`}
                    onClick={() => setShowSortSheet(false)}
                ></div>
                <div className="absolute left-0 right-0 bottom-0 flex justify-center">
                    <div
                        className={`bg-white w-full max-w-md rounded-t-2xl shadow-lg p-6 pb-20 transform transition-transform duration-300 ease-out ${
                            showSortSheet ? "translate-y-0" : "translate-y-full"
                        } pointer-events-auto`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Sort By</h2>
                            <button
                                onClick={() => setShowSortSheet(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                                aria-label="Close sort options"
                            >
                                <FaTimes className="text-gray-600 text-lg" />
                            </button>
                        </div>
                        <form className="flex flex-col gap-3">
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="sort"
                                    value=""
                                    checked={sort === ""}
                                    onChange={(e) => {
                                        handleSort(e);
                                        setShowSortSheet(false);
                                    }}
                                />
                                Default
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="price"
                                    checked={sort === "price"}
                                    onChange={(e) => {
                                        handleSort(e);
                                        setShowSortSheet(false);
                                    }}
                                />
                                Price (Low to High)
                            </label>
                            <label className="flex items-center gap-2">
                                <input
                                    type="radio"
                                    name="sort"
                                    value="-price"
                                    checked={sort === "-price"}
                                    onChange={(e) => {
                                        handleSort(e);
                                        setShowSortSheet(false);
                                    }}
                                />
                                Price (High to Low)
                            </label>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default MobileProductControls;
