import React, { useState, useEffect } from "react";
import { FiChevronDown, FiX } from "react-icons/fi";
import { getCategories } from "../../api/categories.api";

const SubcategorySelector = ({
    selectedCategory,
    selectedSubcategories = [],
    onSubcategoriesChange,
    disabled = false,
    error = null,
    size = "default", // "default" or "compact"
}) => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [dropdownOpen, setDropdownOpen] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    useEffect(() => {
        // Simple logic: when category is selected, load its immediate children
        if (selectedCategory && categories.length > 0) {
            const subcats = categories.filter((cat) => {
                // Handle populated parentCategory: {_id, name} or just ObjectId
                let parentId = null;
                if (cat.parentCategory) {
                    if (
                        typeof cat.parentCategory === "object" &&
                        cat.parentCategory._id
                    ) {
                        parentId = cat.parentCategory._id;
                    } else {
                        parentId = cat.parentCategory;
                    }
                }
                return parentId === selectedCategory;
            });

            setAvailableSubcategories(subcats);

            // Clear invalid selections
            if (selectedSubcategories.length > 0) {
                const validSelections = selectedSubcategories.filter((subId) =>
                    subcats.some((sub) => sub._id === subId)
                );
                if (validSelections.length !== selectedSubcategories.length) {
                    onSubcategoriesChange(validSelections);
                }
            }
        } else {
            setAvailableSubcategories([]);
            if (selectedSubcategories.length > 0) {
                onSubcategoriesChange([]);
            }
        }
    }, [selectedCategory, categories]);

    const fetchCategories = async () => {
        setLoading(true);
        try {
            const result = await getCategories();
            if (result.success) {
                setCategories(result.data || []);
            }
        } catch (error) {
            console.error("Error fetching categories:", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubcategoryToggle = (subcategoryId) => {
        if (selectedSubcategories.includes(subcategoryId)) {
            onSubcategoriesChange(
                selectedSubcategories.filter((id) => id !== subcategoryId)
            );
        } else {
            onSubcategoriesChange([...selectedSubcategories, subcategoryId]);
        }
    };

    const removeSubcategory = (subcategoryId) => {
        onSubcategoriesChange(
            selectedSubcategories.filter((id) => id !== subcategoryId)
        );
    };

    const getSelectedSubcategoryNames = () => {
        return selectedSubcategories
            .map((id) => {
                const subcat = availableSubcategories.find((s) => s._id === id);
                return subcat ? { id, name: subcat.name } : null;
            })
            .filter(Boolean);
    };

    // Size-based styling
    const sizeClasses = {
        default: {
            label: "block text-sm font-medium text-admin-text mb-2",
            button: "w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent",
            chip: "bg-admin-primary/10 text-admin-primary px-3 py-1 rounded-full text-sm flex items-center gap-2",
            chipGap: "flex flex-wrap gap-2 mb-3",
            option: "flex items-center gap-3 px-3 py-2 hover:bg-admin-bg cursor-pointer border-b border-gray-100 last:border-b-0",
            optionText: "text-admin-text text-sm",
            noDataText:
                "text-sm text-admin-text-muted bg-admin-bg p-3 rounded-lg border border-admin-border",
        },
        compact: {
            label: "block text-sm font-medium text-admin-text mt-1 mb-0.5",
            button: "w-full px-3 py-2 border rounded-lg text-left flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-admin-primary focus:border-transparent text-sm",
            chip: "bg-admin-primary/10 text-admin-primary px-2 py-0.5 rounded-full text-xs flex items-center gap-1",
            chipGap: "flex flex-wrap gap-1 mb-2",
            option: "flex items-center gap-2 px-3 py-1.5 hover:bg-admin-bg cursor-pointer border-b border-gray-100 last:border-b-0",
            optionText: "text-admin-text text-sm",
            noDataText:
                "text-sm text-admin-text-muted bg-admin-bg p-2 rounded-lg border border-admin-border",
        },
    };

    const currentSizeClasses = sizeClasses[size];

    if (!selectedCategory) {
        return (
            <div>
                <label className={currentSizeClasses.label}>
                    Subcategories
                </label>
                <div className={currentSizeClasses.noDataText}>
                    Select a main category first
                </div>
            </div>
        );
    }

    return (
        <div>
            <label className={currentSizeClasses.label}>
                Subcategories (Optional)
            </label>

            {/* Selected subcategories chips */}
            {selectedSubcategories.length > 0 && (
                <div className={currentSizeClasses.chipGap}>
                    {getSelectedSubcategoryNames().map((subcat) => (
                        <div
                            key={subcat.id}
                            className={currentSizeClasses.chip}
                        >
                            <span>{subcat.name}</span>
                            <button
                                type="button"
                                onClick={() => removeSubcategory(subcat.id)}
                                className="hover:bg-admin-primary/20 rounded-full p-0.5 transition-colors"
                                disabled={disabled}
                            >
                                <FiX
                                    className={
                                        size === "compact"
                                            ? "w-2.5 h-2.5"
                                            : "w-3 h-3"
                                    }
                                />
                            </button>
                        </div>
                    ))}
                </div>
            )}

            {/* Dropdown */}
            {availableSubcategories.length === 0 ? (
                <div className={currentSizeClasses.noDataText}>
                    No subcategories available
                </div>
            ) : (
                <div className="relative">
                    <button
                        type="button"
                        onClick={() =>
                            !disabled && setDropdownOpen(!dropdownOpen)
                        }
                        disabled={disabled}
                        className={`${currentSizeClasses.button} ${
                            disabled
                                ? "bg-gray-100 text-gray-400 cursor-not-allowed border-admin-border"
                                : "bg-white hover:bg-gray-50 border-admin-border"
                        } ${error ? "border-red-500" : ""}`}
                    >
                        <span className="text-admin-text">
                            {selectedSubcategories.length === 0
                                ? "Select subcategories"
                                : `${selectedSubcategories.length} selected`}
                        </span>
                        <FiChevronDown
                            className={`w-4 h-4 text-admin-text transition-transform ${
                                dropdownOpen ? "rotate-180" : ""
                            }`}
                        />
                    </button>

                    {/* Dropdown menu */}
                    {dropdownOpen && (
                        <div className="absolute z-10 w-full mt-1 bg-white border border-admin-border rounded-lg shadow-lg max-h-60 overflow-y-auto">
                            {availableSubcategories.map((subcategory) => {
                                const isSelected =
                                    selectedSubcategories.includes(
                                        subcategory._id
                                    );
                                return (
                                    <label
                                        key={subcategory._id}
                                        className={currentSizeClasses.option}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={isSelected}
                                            onChange={() =>
                                                handleSubcategoryToggle(
                                                    subcategory._id
                                                )
                                            }
                                            disabled={disabled}
                                            className="w-4 h-4 text-admin-primary bg-gray-100 border-gray-300 rounded focus:ring-admin-primary focus:ring-2"
                                        />
                                        <span
                                            className={
                                                currentSizeClasses.optionText
                                            }
                                        >
                                            {subcategory.name}
                                        </span>
                                    </label>
                                );
                            })}
                        </div>
                    )}
                </div>
            )}

            {/* Error message */}
            {error && <p className="text-red-500 text-sm mt-1">{error}</p>}

            {/* Click outside to close dropdown */}
            {dropdownOpen && (
                <div
                    className="fixed inset-0 z-0"
                    onClick={() => setDropdownOpen(false)}
                />
            )}
        </div>
    );
};

export default SubcategorySelector;
