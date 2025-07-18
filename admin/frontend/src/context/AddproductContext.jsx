// src/context/AddproductContext.jsx

import React, { createContext, useState, useContext } from "react";
import axiosInstance from "../api/axiosInstance";

const AddproductContext = createContext();

export const AddproductProvider = ({ children }) => {
  const initialState = {
    productName: "",
    description: "",
    price: "",
    stock: "",
    bestseller: false,
    images: [],
    previews: Array(5).fill(null),
  };

  const [formData, setFormData] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  const handleImageChange = (e, index) => {
    const file = e.target.files[0];
    if (file) {
      const updatedImages = [...formData.images];
      const updatedPreviews = [...formData.previews];

      // Replace image and preview
      updatedImages[index] = file;
      updatedPreviews[index] = URL.createObjectURL(file);

      setFormData({
        ...formData,
        images: updatedImages,
        previews: updatedPreviews,
      });
    }
  };

  const handleSubmit = async () => {
    if (
      !formData.productName ||
      !formData.description ||
      !formData.price ||
      !formData.stock
    ) {
      alert("Please fill in all required fields.");
      return;
    }

    setIsLoading(true);

    try {
      const data = new FormData();
      data.append("name", formData.productName); // backend expects 'name'
      data.append("description", formData.description);
      data.append("price", Number(formData.price));
      data.append("stock", Number(formData.stock));
      data.append("isFeatured", formData.bestseller); // backend expects 'isFeatured'

      formData.images.forEach((file) => {
        if (file) data.append("images", file);
      });

      const response = await axiosInstance.post("/products", data);

      alert("✅ Product added successfully!");
      setFormData(initialState); // reset form
    } catch (err) {
      console.error("❌ Error adding product:", err.response?.data || err.message);
      alert(err.response?.data?.message || "Something went wrong.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AddproductContext.Provider
      value={{
        formData,
        setFormData,
        handleImageChange,
        handleSubmit,
        isLoading,
      }}
    >
      {children}
    </AddproductContext.Provider>
  );
};

export const useAddproduct = () => useContext(AddproductContext);
