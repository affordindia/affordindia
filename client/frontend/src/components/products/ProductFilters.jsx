import React from "react";

function ProductFilters({
  priceRanges,
  selectedPrice,
  onPrice,
  materialOptions,
  selectedMaterial,
  onMaterial,
  layout = "vertical",
}) {
  return (
    <div
      className={
        layout === "vertical"
          ? "flex flex-col gap-8"
          : "flex flex-wrap gap-4 mb-4 items-center"
      }
    >
      {/* Material Checkboxes */}
      <div className="montserrat-global">
        <h3 className="text-md font-bold mb-3 text-gray-800">Filter By</h3>
        <h3 className="text-md font-semibold mb-3 text-gray-800">Material</h3>
        <div className="flex flex-col gap-2">
          {materialOptions.map((opt) => (
            <label
              key={opt.value}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                style={{ accentColor: "#B76E79" }}
                className="w-4 h-4"
                value={opt.value}
                checked={selectedMaterial === opt.value}
                onChange={(e) =>
                  onMaterial({
                    target: { value: e.target.value },
                  })
                }
              />
              {opt.label}
            </label>
          ))}
        </div>
      </div>
      {/* Price Checkboxes */}
      <div>
        <h3 className="text-md font-semibold mb-3 text-gray-800">Price</h3>
        <div className="flex flex-col gap-2">
          {priceRanges.map((range, idx) => (
            <label
              key={range.label}
              className="flex items-center gap-2 text-sm cursor-pointer"
            >
              <input
                type="checkbox"
                style={{ accentColor: "#B76E79" }}
                className="w-4 h-4"
                checked={selectedPrice === idx}
                onChange={() => onPrice(idx)}
              />
              {range.label}
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductFilters;
