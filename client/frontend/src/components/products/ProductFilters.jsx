import React from "react";

const ProductFilters = ({
    priceRanges,
    selectedPrice,
    onPrice,
    materialOptions,
    selectedMaterial,
    onMaterial,
    layout = "vertical",
}) => {
    const isVertical = layout === "vertical";

    return (
        <div
            className={`${
                isVertical
                    ? "flex flex-col gap-8"
                    : "flex flex-wrap gap-4 mb-4 items-center"
            }`}
        >
            {/* Mobile Dropdown Filters */}
            <div className="md:hidden flex flex-col gap-4">
                {/* Material Dropdown */}
                <div>
                    <label className="text-sm font-semibold block mb-1 text-gray-700">
                        Material
                    </label>
                    <select
                        value={selectedMaterial}
                        onChange={onMaterial}
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        {materialOptions.map((opt) => (
                            <option key={opt.value} value={opt.value}>
                                {opt.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Price Dropdown */}
                <div>
                    <label className="text-sm font-semibold block mb-1 text-gray-700">
                        Price
                    </label>
                    <select
                        value={selectedPrice !== null ? selectedPrice : ""}
                        onChange={(e) =>
                            onPrice(
                                e.target.value === ""
                                    ? null
                                    : parseInt(e.target.value)
                            )
                        }
                        className="w-full border rounded px-3 py-2 text-sm"
                    >
                        <option value="">All</option>
                        {priceRanges.map((range, idx) => (
                            <option key={range.label} value={idx}>
                                {range.label}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Desktop Checkbox Filters */}
            <div className="hidden md:flex flex-col gap-8">
                {/* Material Checkboxes */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-800">
                        Material
                    </h3>
                    <div className="flex flex-col gap-2">
                        {materialOptions.map((opt) => (
                            <label
                                key={opt.value}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    value={opt.value}
                                    checked={selectedMaterial === opt.value}
                                    onChange={(e) =>
                                        onMaterial({
                                            target: { value: e.target.value },
                                        })
                                    }
                                    className="accent-blue-500 w-4 h-4"
                                />
                                {opt.label}
                            </label>
                        ))}
                    </div>
                </div>

                {/* Price Checkboxes */}
                <div>
                    <h3 className="text-sm font-semibold mb-3 text-gray-800">
                        Price
                    </h3>
                    <div className="flex flex-col gap-2">
                        {priceRanges.map((range, idx) => (
                            <label
                                key={range.label}
                                className="flex items-center gap-2 text-sm cursor-pointer"
                            >
                                <input
                                    type="checkbox"
                                    checked={selectedPrice === idx}
                                    onChange={() => onPrice(idx)}
                                    className="accent-blue-500 w-4 h-4"
                                />
                                {range.label}
                            </label>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductFilters;
