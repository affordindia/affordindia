import React, { useState } from "react";
import ProductFilters from "./ProductFilters";

const MobileProductControls = ({
    priceRanges,
    selectedPrice,
    onPrice,
    materialOptions,
    selectedMaterial,
    onMaterial,
    onApplyMobileFilters,
    sort,
    handleSort,
}) => {
    const [showFilterPanel, setShowFilterPanel] = useState(false);
    const [showSortSheet, setShowSortSheet] = useState(false);

    // Local state for pending filters (only used during filter panel interaction)
    const [pendingPrice, setPendingPrice] = useState(null);
    const [pendingMaterial, setPendingMaterial] = useState("");

    // When opening the filter panel, sync local state with current applied filters
    const openFilterPanel = () => {
        setPendingPrice(selectedPrice);
        setPendingMaterial(selectedMaterial || "");
        setShowFilterPanel(true);
        setShowSortSheet(false);
    };

    // When closing without applying, just close (no state changes needed)
    const closeFilterPanel = () => {
        setShowFilterPanel(false);
    };

    // When user clicks Apply Filters, apply the pending filters
    const applyFilters = () => {
        console.log("Applying mobile filters:", {
            pendingPrice,
            pendingMaterial,
            priceRange:
                pendingPrice !== null ? priceRanges[pendingPrice] : null,
        });

        // Use the new combined handler that applies all filters simultaneously
        if (onApplyMobileFilters) {
            onApplyMobileFilters(pendingPrice, pendingMaterial);
        } else {
            // Fallback to individual handlers if new handler not available
            if (pendingPrice !== null && pendingPrice >= 0) {
                onPrice(pendingPrice);
            } else {
                onPrice(null);
            }
            onMaterial({ target: { value: pendingMaterial } });
        }

        setShowFilterPanel(false);
    };

    return (
        <>
            {/* Fixed Bottom Buttons (z-50 to ensure always on top) */}
            <div className="fixed bottom-0 left-0 right-0 z-50 md:hidden flex">
                <button
                    className="flex-1 py-3 bg-[#F7F4EF] border-t border-r border-gray-300 text-base font-medium"
                    onClick={openFilterPanel}
                >
                    Filters
                </button>
                <button
                    className="flex-1 py-3 bg-[#F7F4EF] border-t border-gray-300 text-base font-medium"
                    onClick={() => {
                        setShowSortSheet((prev) => !prev);
                        setShowFilterPanel(false);
                    }}
                >
                    Sort
                </button>
            </div>

            {/* Filter Panel Overlay (always mounted for animation, but only visually present when active) */}
            <div
                className={`fixed left-0 right-0 z-40 flex md:hidden ${
                    showFilterPanel ? "" : "pointer-events-none"
                }`}
                style={{
                    top: "56px",
                    height: "calc(100vh - 56px - 56px)",
                    visibility: showFilterPanel ? "visible" : "hidden",
                }}
            >
                <div
                    className={`absolute inset-0 bg-white/10 backdrop-blur-sm transition-opacity duration-300 ${
                        showFilterPanel ? "opacity-100" : "opacity-0"
                    }`}
                    onClick={closeFilterPanel}
                ></div>
                <div className="relative w-full h-full flex">
                    <div
                        className={`w-full h-full bg-white overflow-y-auto p-6 transform transition-transform duration-300 ease-out ${
                            showFilterPanel
                                ? "translate-x-0"
                                : "-translate-x-full"
                        } pointer-events-auto`}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-semibold">Filters</h2>
                            <button
                                onClick={closeFilterPanel}
                                className="text-2xl"
                            >
                                ×
                            </button>
                        </div>
                        <ProductFilters
                            priceRanges={priceRanges}
                            selectedPrice={pendingPrice}
                            onPrice={(idx) => {
                                // Toggle price filter: if same price is selected, deselect it
                                setPendingPrice(
                                    pendingPrice === idx ? null : idx
                                );
                            }}
                            materialOptions={materialOptions}
                            selectedMaterial={pendingMaterial}
                            onMaterial={(e) => {
                                setPendingMaterial(e.target.value);
                            }}
                            layout="vertical"
                        />
                        <button
                            className="mt-6 w-full bg-black text-white py-2 rounded"
                            onClick={applyFilters}
                        >
                            Apply Filters
                        </button>
                    </div>
                </div>
            </div>

            {/* Sort Panel Overlay (always mounted for animation, but only visually present when active) */}
            <div
                className={`fixed inset-0 z-40 flex md:hidden items-end ${
                    showSortSheet ? "" : "pointer-events-none"
                }`}
            >
                {/* Blur overlay, now extends fully to the bottom, but buttons are above due to z-50 */}
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
                                className="text-2xl"
                            >
                                ×
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
