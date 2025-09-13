import React, { useState, useEffect } from "react";
import { getSubcategories } from "../../api/category.js";

const SubcategoryFilter = ({
    selectedCategories = [],
    selectedSubcategories = [],
    onSubcategoriesChange,
    layout = "vertical",
}) => {
    const [availableSubcategories, setAvailableSubcategories] = useState([]);
    const [loading, setLoading] = useState(false);

    // Fetch subcategories when selected categories change
    useEffect(() => {
        const fetchSubcategories = async () => {
            if (!selectedCategories || selectedCategories.length === 0) {
                setAvailableSubcategories([]);
                return;
            }

            setLoading(true);
            try {
                // Fetch subcategories for all selected categories
                const subcategoryPromises = selectedCategories.map(
                    (categoryId) => getSubcategories(categoryId)
                );

                const results = await Promise.all(subcategoryPromises);

                // Combine all subcategories and remove duplicates
                const allSubcategories = results.flatMap(
                    (result) => result.subcategories || []
                );
                const uniqueSubcategories = allSubcategories.filter(
                    (subcat, index, self) =>
                        index === self.findIndex((s) => s._id === subcat._id)
                );

                setAvailableSubcategories(uniqueSubcategories);
            } catch (error) {
                console.error("Error fetching subcategories:", error);
                setAvailableSubcategories([]);
            } finally {
                setLoading(false);
            }
        };

        fetchSubcategories();
    }, [selectedCategories]);

    // Clear invalid subcategory selections when available subcategories change
    useEffect(() => {
        if (
            selectedSubcategories.length > 0 &&
            availableSubcategories.length > 0
        ) {
            const validSelections = selectedSubcategories.filter((subcatId) =>
                availableSubcategories.some((subcat) => subcat._id === subcatId)
            );

            if (validSelections.length !== selectedSubcategories.length) {
                onSubcategoriesChange(validSelections);
            }
        } else if (
            selectedSubcategories.length > 0 &&
            availableSubcategories.length === 0
        ) {
            // Clear all selections if no subcategories are available
            onSubcategoriesChange([]);
        }
    }, [availableSubcategories, selectedSubcategories, onSubcategoriesChange]);

    const handleSubcategoryChange = (subcategoryId) => {
        const isSelected = selectedSubcategories.includes(subcategoryId);

        if (isSelected) {
            // Remove from selection
            onSubcategoriesChange(
                selectedSubcategories.filter((id) => id !== subcategoryId)
            );
        } else {
            // Add to selection
            onSubcategoriesChange([...selectedSubcategories, subcategoryId]);
        }
    };

    // Don't render if no categories are selected or no subcategories available
    if (
        !selectedCategories ||
        selectedCategories.length === 0 ||
        availableSubcategories.length === 0
    ) {
        return null;
    }

    return (
        <div className="montserrat-global">
            <h3 className="text-md font-semibold mb-3 text-gray-800">
                Subcategories
            </h3>

            {loading ? (
                <div className="text-sm text-gray-500">
                    Loading subcategories...
                </div>
            ) : (
                <div
                    className={
                        layout === "vertical"
                            ? "flex flex-col gap-2"
                            : "flex flex-wrap gap-4"
                    }
                >
                    {availableSubcategories.map((subcategory) => (
                        <label
                            key={subcategory._id}
                            className="flex items-center gap-2 text-sm cursor-pointer"
                        >
                            <input
                                type="checkbox"
                                style={{ accentColor: "#B76E79" }}
                                className="w-4 h-4"
                                checked={selectedSubcategories.includes(
                                    subcategory._id
                                )}
                                onChange={() =>
                                    handleSubcategoryChange(subcategory._id)
                                }
                            />
                            {subcategory.name}
                        </label>
                    ))}
                </div>
            )}
        </div>
    );
};

export default SubcategoryFilter;
