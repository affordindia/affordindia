import React, { createContext, useContext, useState } from 'react';
import rakhi1 from '../assets/Rakhi/rakhi1.png';

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products] = useState([
    {
      id: 1,
      title: "Royal Rakhi",
      price: "₹2,499",
      image: rakhi1,
      description: "An elegant royal Rakhi with intricate silver work and beads.",
      rating: 4.8,
      stock: 10,
    },
    {
      id: 2,
      title: "Antique Rakhi",
      price: "₹1,799",
      image: rakhi1,
      description: "A beautifully crafted antique design Rakhi for a traditional look.",
      rating: 4.5,
      stock: 15,
    },
    {
      id: 3,
      title: "Emerald Rakhi",
      price: "₹2,999",
      image: rakhi1,
      description: "Premium Rakhi with emerald stones and fine threadwork.",
      rating: 4.9,
      stock: 8,
    },
    {
      id: 4,
      title: "Traditional Rakhi",
      price: "₹1,899",
      image: rakhi1,
      description: "Classic traditional Rakhi with red & gold motifs.",
      rating: 4.6,
      stock: 12,
    },
    {
      id: 5,
      title: "Minimalist Rakhi",
      price: "₹1,299",
      image: rakhi1,
      description: "Simple yet elegant Rakhi for those who love minimal designs.",
      rating: 4.3,
      stock: 20,
    },
    {
      id: 6,
      title: "Contemporary Rakhi",
      price: "₹1,599",
      image: rakhi1,
      description: "A modern Rakhi with geometric patterns and subtle colors.",
      rating: 4.4,
      stock: 18,
    },
  ]);

  return (
    <ProductContext.Provider value={{ products }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProductContext = () => useContext(ProductContext);
