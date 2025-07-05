import React, { useState } from "react";
import { useProducts } from "../context/ProductsContext";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const Products = () => {
  const { products, deleteProduct, updateProduct, loading, error } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [isFeatured, setIsFeatured] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [skip, setSkip] = useState(0);
  const [limit, setLimit] = useState(5);

  const [isEditOpen, setIsEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [message, setMessage] = useState("");

  const handleEdit = (product) => {
    setSelectedProduct({
      id: product._id || product.id,
      name: product.name || "",
      description: product.description || "",
      price: product.price || "",
      bestseller: product.bestseller || false,
      images: [],
    });
    setPreviewImages(product.images || []);
    setIsEditOpen(true);
  };

  const handleEditChange = (e) => {
    const { name, value, type, checked, files } = e.target;
    if (type === "checkbox") {
      setSelectedProduct((prev) => ({ ...prev, [name]: checked }));
    } else if (type === "file") {
      const fileList = Array.from(files);
      setSelectedProduct((prev) => ({ ...prev, images: fileList }));
      const previews = fileList.map((file) => URL.createObjectURL(file));
      setPreviewImages(previews);
    } else {
      setSelectedProduct((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleUpdate = async () => {
    const id = selectedProduct.id;
    try {
      await updateProduct({ id, ...selectedProduct });
      setMessage("Product updated successfully!");
    } catch {
      setMessage("Error updating product.");
    } finally {
      setIsEditOpen(false);
      setSelectedProduct(null);
      setPreviewImages([]);
      setTimeout(() => setMessage(""), 3000);
    }
  };

  const filteredProducts = products
    .filter((product) =>
      product.name?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .filter((product) => {
      const price = parseInt(product.price?.toString().replace(/[^\d]/g, "") || "0");
      return minPrice ? price >= minPrice : true;
    })
    .filter((product) => {
      const price = parseInt(product.price?.toString().replace(/[^\d]/g, "") || "0");
      return maxPrice ? price <= maxPrice : true;
    })
    .filter((product) =>
      isFeatured === "" ? true : product.bestseller === (isFeatured === "true")
    )
    .sort((a, b) => {
      const priceA = parseInt(a.price?.toString().replace(/[^\d]/g, "") || "0");
      const priceB = parseInt(b.price?.toString().replace(/[^\d]/g, "") || "0");
      return sortOrder === "asc" ? priceA - priceB : sortOrder === "desc" ? priceB - priceA : 0;
    })
    .slice(skip, skip + limit);

  if (loading) return <div className="p-4 text-center">Loading products...</div>;
  if (error) return <div className="p-4 text-red-500 text-center">{error}</div>;

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4 text-[#2c2a4a]">All Products</h2>

      {message && <div className="text-center text-green-600 font-medium mb-4">{message}</div>}

      {/* Filters */}
      <div className="mb-4 grid md:grid-cols-3 lg:grid-cols-4 gap-4">
        <input
          type="text"
          placeholder="Search product by name..."
          className="border p-2 rounded"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <input
          type="number"
          placeholder="Min Price"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <input
          type="number"
          placeholder="Max Price"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="border p-2 rounded"
        />
        <select
          value={isFeatured}
          onChange={(e) => setIsFeatured(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">All</option>
          <option value="true">Featured</option>
          <option value="false">Not Featured</option>
        </select>
        <select
          value={sortOrder}
          onChange={(e) => setSortOrder(e.target.value)}
          className="border p-2 rounded"
        >
          <option value="">Sort</option>
          <option value="asc">Price: Low to High</option>
          <option value="desc">Price: High to Low</option>
        </select>
      </div>

      {/* Product Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border text-left">
          <thead>
            <tr className="bg-gray-100 text-sm text-[#2c2a4a]">
              <th className="py-2 px-3 border-b">Images</th>
              <th className="py-2 px-3 border-b">Name</th>
              <th className="py-2 px-3 border-b">Description</th>
              <th className="py-2 px-3 border-b">Price</th>
              <th className="py-2 px-3 border-b">Bestseller</th>
              <th className="py-2 px-3 border-b text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map((product) => (
              <tr key={product.id || product._id} className="hover:bg-gray-50 text-sm">
                <td className="py-2 px-3 border-b">
                  <div className="flex gap-1 overflow-x-auto">
                    {product.images?.slice(0, 5).map((img, index) => (
                      <img
                        key={index}
                        src={img}
                        alt={`product ${index}`}
                        className="w-12 h-12 object-cover rounded"
                      />
                    ))}
                  </div>
                </td>
                <td className="py-2 px-3 border-b">{product.name}</td>
                <td className="py-2 px-3 border-b">{product.description}</td>
                <td className="py-2 px-3 border-b">{product.price}</td>
                <td className="py-2 px-3 border-b">
                  {product.bestseller ? "Yes" : "No"}
                </td>
                <td className="py-2 px-3 border-b text-center">
                  <div className="flex justify-center gap-3">
                    <button
                      onClick={() => handleEdit(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit size={18} />
                    </button>
                    <button
                      onClick={() => {
                        if (window.confirm("Are you sure you want to delete this product?")) {
                          deleteProduct(product.id || product._id);
                        }
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FiTrash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filteredProducts.length === 0 && (
              <tr>
                <td colSpan="6" className="text-center py-4 text-gray-500">
                  No products found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="flex justify-center gap-4 mt-6">
        <button
          onClick={() => setSkip(Math.max(skip - limit, 0))}
          disabled={skip === 0}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Previous
        </button>
        <button
          onClick={() => setSkip(skip + limit)}
          className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
        >
          Next
        </button>
      </div>

      {/* Edit Modal */}
      {isEditOpen && selectedProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50 px-4">
          <div className="bg-white p-6 rounded shadow-xl w-full max-w-lg">
            <h3 className="text-xl font-semibold mb-4 text-[#2c2a4a]">Edit Product</h3>

            <div className="space-y-4">
              <div className="grid grid-cols-5 gap-2">
                {previewImages.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i}`}
                    className="w-20 h-20 object-cover rounded"
                  />
                ))}
              </div>
              <input
                type="file"
                name="images"
                multiple
                onChange={handleEditChange}
              />
              <input
                type="text"
                name="name"
                value={selectedProduct.name || ""}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
                placeholder="Product Name"
              />
              <textarea
                name="description"
                value={selectedProduct.description || ""}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
                placeholder="Description"
              />
              <input
                type="text"
                name="price"
                value={selectedProduct.price || ""}
                onChange={handleEditChange}
                className="border p-2 w-full rounded"
                placeholder="Price"
              />
              <label className="inline-flex items-center">
                <input
                  type="checkbox"
                  name="bestseller"
                  checked={selectedProduct.bestseller}
                  onChange={handleEditChange}
                  className="form-checkbox h-4 w-4"
                />
                <span className="ml-2">Bestseller</span>
              </label>
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => {
                  setIsEditOpen(false);
                  setSelectedProduct(null);
                  setPreviewImages([]);
                }}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Products;
