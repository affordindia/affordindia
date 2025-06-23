import React, { useState } from "react";

const Add = () => {
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [bestseller, setBestseller] = useState(false);

  const sizes = ["S", "M", "L", "XL", "XXL"];

  const toggleSize = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size)
        ? prev.filter((s) => s !== size)
        : [...prev, size]
    );
  };

  return (
    <div className="p-4 sm:p-6 w-full max-w-5xl mx-auto">
      <h2 className="text-xl font-semibold mb-6 text-gray-800">Upload Image</h2>

      {/* Upload Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {Array.from({ length: 5 }).map((_, i) => (
          <label
            key={i}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-lg h-24 cursor-pointer hover:bg-gray-50"
          >
            <span className="text-gray-400 text-sm">Upload</span>
            <input type="file" className="hidden" />
          </label>
        ))}
      </div>

      {/* Product Info */}
      <div className="space-y-4">
        {/* Name */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product name
          </label>
          <input
            type="text"
            placeholder="Type here"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product description
          </label>
          <textarea
            rows={3}
            placeholder="Write content here"
            className="w-full border border-gray-300 rounded px-3 py-2"
          />
        </div>

        {/* Category, Subcategory, Price */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product category
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Men</option>
              <option>Women</option>
              <option>Kids</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Sub category
            </label>
            <select className="w-full border border-gray-300 rounded px-3 py-2">
              <option>Topwear</option>
              <option>Bottomwear</option>
              <option>Footwear</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-600 mb-1">
              Product Price
            </label>
            <input
              type="number"
              placeholder="Price"
              className="w-full border border-gray-300 rounded px-3 py-2"
            />
          </div>
        </div>

        {/* Sizes */}
        <div>
          <label className="block text-sm font-medium text-gray-600 mb-1">
            Product Sizes
          </label>
          <div className="flex flex-wrap gap-2">
            {sizes.map((size) => (
              <button
                key={size}
                type="button"
                onClick={() => toggleSize(size)}
                className={`px-4 py-1 border rounded ${
                  selectedSizes.includes(size)
                    ? "bg-gray-700 text-white"
                    : "bg-gray-100 text-gray-700"
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Bestseller */}
        <div className="flex items-center mt-2">
          <input
            type="checkbox"
            checked={bestseller}
            onChange={(e) => setBestseller(e.target.checked)}
            className="mr-2 w-4 h-4"
          />
          <label className="text-sm font-medium text-gray-600">
            Add to bestseller
          </label>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <button className="w-full sm:w-auto bg-black text-white px-6 py-2 rounded shadow hover:bg-gray-900 transition">
            ADD
          </button>
        </div>
      </div>
    </div>
  );
};

export default Add;
