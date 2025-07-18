import React, { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../api/axiosInstance";

const ProductsContext = createContext();

export const ProductsProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch all products from the backend
  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/products");
      setProducts(response.data);
    } catch (err) {
      console.error("Fetch error:", err);
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  // Create a new product
  const createProduct = async (newProduct) => {
    try {
      const formData = new FormData();

      for (const key in newProduct) {
        if (key === "images" && Array.isArray(newProduct.images)) {
          newProduct.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, newProduct[key]);
        }
      }

      const response = await axiosInstance.post("/products", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      // Add the new product to the state
      setProducts((prev) => [response.data, ...prev]);
    } catch (err) {
      console.error("Create error:", err);
      setError("Failed to create product");
      throw err;
    }
  };

  // Delete a product by ID
  const deleteProduct = async (id) => {
    try {
      await axiosInstance.delete(`/products/${id}`);
      setProducts((prev) => prev.filter((p) => p.id !== id && p._id !== id));
    } catch (err) {
      console.error("Delete error:", err);
      setError("Failed to delete product");
    }
  };

  // Update a product with multipart/form-data
  const updateProduct = async (updatedProduct) => {
    try {
      const { id, ...data } = updatedProduct;
      const formData = new FormData();

      for (const key in data) {
        if (key === "images" && Array.isArray(data.images)) {
          data.images.forEach((img) => formData.append("images", img));
        } else {
          formData.append(key, data[key]);
        }
      }

      const response = await axiosInstance.put(`/products/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setProducts((prev) =>
        prev.map((p) => (p.id === id || p._id === id ? response.data : p))
      );
    } catch (err) {
      console.error("Update error:", err.message || err);
      throw err;
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <ProductsContext.Provider
      value={{
        products,
        createProduct, // ✅ Make sure it's exposed
        deleteProduct,
        updateProduct,
        loading,
        error,
      }}
    >
      {children}
    </ProductsContext.Provider>
  );
};

export const useProducts = () => useContext(ProductsContext);
