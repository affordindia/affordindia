import React, { useState, useEffect } from "react";
import { useAppData } from "../../context/AppDataContext.jsx";

function ProductFilters({
    priceRanges,
    selectedPriceRanges = [],
    categoryOptions,
    selectedCategories = [],
    selectedSubcategories = [],
    onApplyFilters,
    layout = "vertical",
}) {
    const { subcategories: allSubcategories } = useAppData();

    // Pending state (what user is selecting before applying)
    const [pendingCategories, setPendingCategories] =
        useState(selectedCategories);
    const [pendingSubcategories, setPendingSubcategories] = useState(
        selectedSubcategories
    );
    const [pendingPriceRanges, setPendingPriceRanges] =
        useState(selectedPriceRanges);
    // Sync pending state when props change (e.g., from URL)
    useEffect(() => {
        setPendingCategories(selectedCategories);
        setPendingSubcategories(selectedSubcategories);
        setPendingPriceRanges(selectedPriceRanges);
    }, [selectedCategories, selectedSubcategories, selectedPriceRanges]);

    // Get available subcategories based on selected categories
    const getAvailableSubcategories = () => {
        if (!pendingCategories || pendingCategories.length === 0) {
            return [];
        }

        return allSubcategories.filter((subcat) =>
            pendingCategories.includes(
                subcat.parentCategory?._id || subcat.parentCategory
            )
        );
    };

    const handleCategoryChange = (categoryId) => {
        const isSelected = pendingCategories.includes(categoryId);

        if (isSelected) {
            // Remove category and clear related subcategories
            const newCategories = pendingCategories.filter(
                (id) => id !== categoryId
            );
            setPendingCategories(newCategories);

            // Remove subcategories that belong to this category
            const availableSubcatsForRemainingCats = allSubcategories
                .filter((subcat) =>
                    newCategories.includes(
                        subcat.parentCategory?._id || subcat.parentCategory
                    )
                )
                .map((subcat) => subcat._id);

            setPendingSubcategories((prev) =>
                prev.filter((subcatId) =>
                    availableSubcatsForRemainingCats.includes(subcatId)
                )
            );
        } else {
            // Add category
            setPendingCategories([...pendingCategories, categoryId]);
        }
    };

    const handleSubcategoryChange = (subcategoryId) => {
        const isSelected = pendingSubcategories.includes(subcategoryId);

        if (isSelected) {
            setPendingSubcategories((prev) =>
                prev.filter((id) => id !== subcategoryId)
            );
        } else {
            setPendingSubcategories((prev) => [...prev, subcategoryId]);
        }
    };

    const handlePriceRangeChange = (rangeIndex) => {
        const isSelected = pendingPriceRanges.includes(rangeIndex);

        if (isSelected) {
            setPendingPriceRanges((prev) =>
                prev.filter((idx) => idx !== rangeIndex)
            );
        } else {
            setPendingPriceRanges((prev) => [...prev, rangeIndex]);
        }
    };

    const handleApplyFilters = () => {
        onApplyFilters(
            pendingCategories,
            pendingSubcategories,
            pendingPriceRanges
        );
    };

    const handleClearFilters = () => {
        setPendingCategories([]);
        setPendingSubcategories([]);
        setPendingPriceRanges([]);
        // Immediately apply the clear action
        onApplyFilters([], [], []);
    };

    const hasChanges = () => {
        return (
            JSON.stringify(pendingCategories) !==
                JSON.stringify(selectedCategories) ||
            JSON.stringify(pendingSubcategories) !==
                JSON.stringify(selectedSubcategories) ||
            JSON.stringify(pendingPriceRanges) !==
                JSON.stringify(selectedPriceRanges)
        );
    };

    const availableSubcategories = getAvailableSubcategories();

    return (
        <div
            className={`space-y-6 ${
                layout === "horizontal" ? "flex gap-8" : ""
            }`}
        >
            <div className="montserrat-global">
                <h3 className="text-md font-bold mb-3 text-gray-800">
                    Filter By
                </h3>

                {/* Categories Section */}
                <div className="mb-6">
                    <h3 className="text-md font-semibold mb-3 text-gray-800">
                        Categories
                    </h3>
                    <div className="flex flex-col gap-2">
                        {categoryOptions.map((category) => (
                            <label
                                key={category._id}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    style={{ accentColor: "#B76E79" }}
                                    className="w-4 h-4"
                                    checked={pendingCategories.includes(
                                        category._id
                                    )}
                                    onChange={() =>
                                        handleCategoryChange(category._id)
                                    }
                                />
                                <span className="capitalize">
                                    {category.name}
                                </span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Subcategories Section */}
                {availableSubcategories.length > 0 && (
                    <div className="mb-6">
                        <h3 className="text-md font-semibold mb-3 text-gray-800">
                            Subcategories
                        </h3>
                        <div className="flex flex-col gap-2">
                            {availableSubcategories.map((subcategory) => (
                                <label
                                    key={subcategory._id}
                                    className="flex items-center gap-2 text-sm cursor-pointer"
                                >
                                    <input
                                        type="checkbox"
                                        style={{ accentColor: "#B76E79" }}
                                        className="w-4 h-4"
                                        checked={pendingSubcategories.includes(
                                            subcategory._id
                                        )}
                                        onChange={() =>
                                            handleSubcategoryChange(
                                                subcategory._id
                                            )
                                        }
                                    />
                                    <span className="capitalize">
                                        {subcategory.name}
                                    </span>
                                </label>
                            ))}
                        </div>
                    </div>
                )}

                {/* Price Ranges Section */}
                <div className="mb-6">
                    <h3 className="text-md font-semibold mb-3 text-gray-800">
                        Price Range
                    </h3>
                    <div className="flex flex-col gap-2">
                        {priceRanges.map((range, index) => (
                            <label
                                key={index}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    style={{ accentColor: "#B76E79" }}
                                    className="w-4 h-4"
                                    checked={pendingPriceRanges.includes(index)}
                                    onChange={() =>
                                        handlePriceRangeChange(index)
                                    }
                                />
                                <span>{range.label}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col gap-3">
                    <button
                        onClick={handleApplyFilters}
                        disabled={!hasChanges()}
                        className={`px-4 py-2 rounded-md text-white font-medium transition-colors ${
                            hasChanges()
                                ? "bg-[#B76E79] hover:bg-[#A55A6A]"
                                : "bg-gray-300 cursor-not-allowed"
                        }`}
                    >
                        Apply Filters
                    </button>
                    <button
                        onClick={handleClearFilters}
                        className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                        Clear All
                    </button>
                </div>
            </div>
        </div>
    );
}

export default ProductFilters;
