// src/pages/Add.jsx

import React from "react";
import { useAddproduct } from "../context/AddproductContext";

const Add = () => {
  const {
    formData,
    setFormData,
    handleImageChange,
    handleSubmit,
    isLoading,
  } = useAddproduct();

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold text-[#2c2a4a] mb-6">Upload Product</h2>

      {/* Upload Images */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 mb-6">
        {[0, 1, 2, 3, 4].map((item) => (
          <label
            key={item}
            className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 h-24 cursor-pointer hover:bg-gray-50 rounded overflow-hidden"
          >
            {formData.previews[item] ? (
              <img
                src={formData.previews[item]}
                alt="preview"
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-gray-400 text-sm">Upload</span>
            )}
            <input
              type="file"
              className="hidden"
              onChange={(e) => handleImageChange(e, item)}
            />
          </label>
        ))}
      </div>

      {/* Product Name */}
      <div className="mb-6">
        <label className="block text-[#2c2a4a]">
          <span className="text-lg sm:text-xl font-semibold">Product Name</span>
          <input
            type="text"
            placeholder="Enter Product Name..."
            className="border border-gray-300 w-full h-12 p-2 mt-2 rounded hover:bg-gray-50"
            value={formData.productName}
            onChange={(e) =>
              setFormData({ ...formData, productName: e.target.value })
            }
          />
        </label>
      </div>

      {/* Description */}
      <div className="mb-6">
        <label className="block text-[#2c2a4a]">
          <span className="text-lg sm:text-xl font-semibold">Product Description</span>
          <textarea
            placeholder="Enter Product Description..."
            className="border border-gray-300 w-full h-24 p-2 mt-2 rounded hover:bg-gray-50"
            value={formData.description}
            onChange={(e) =>
              setFormData({ ...formData, description: e.target.value })
            }
          ></textarea>
        </label>
      </div>

      {/* Price and Stock */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
        <label className="block text-[#2c2a4a]">
          <span className="text-lg sm:text-xl font-semibold">Price</span>
          <input
            type="number"
            placeholder="Enter Price..."
            className="border border-gray-300 w-full h-12 p-2 mt-2 rounded hover:bg-gray-50"
            value={formData.price}
            onChange={(e) =>
              setFormData({ ...formData, price: e.target.value })
            }
          />
        </label>

        <label className="block text-[#2c2a4a]">
          <span className="text-lg sm:text-xl font-semibold">Stock</span>
          <input
            type="number"
            placeholder="Enter Stock..."
            className="border border-gray-300 w-full h-12 p-2 mt-2 rounded hover:bg-gray-50"
            value={formData.stock}
            onChange={(e) =>
              setFormData({ ...formData, stock: e.target.value })
            }
          />
        </label>
      </div>

      {/* Bestseller Checkbox */}
      <div className="mb-4">
        <label className="inline-flex items-center">
          <input
            type="checkbox"
            className="form-checkbox h-5 w-5 text-blue-600"
            checked={formData.bestseller}
            onChange={(e) =>
              setFormData({ ...formData, bestseller: e.target.checked })
            }
          />
          <span className="ml-2 text-[#2c2a4a] text-lg">Bestseller</span>
        </label>
      </div>

      {/* Submit Button */}
      <div className="mt-6">
        <button
          onClick={handleSubmit}
          disabled={isLoading}
          className={`px-6 py-2 rounded text-white ${
            isLoading
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-[#2c2a4a] hover:bg-[#1f1d38]"
          }`}
        >
          {isLoading ? "Submitting..." : "Submit"}
        </button>
      </div>
    </div>
  );
};

export default Add;
