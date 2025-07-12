import React from "react";
import { ProductProvider } from "./ProductContext";
import { CartProvider } from "./CartContext";
import { WishlistProvider } from "./WishlistContext";


const GlobalProvider = ({ children }) => {
  return (
    <WishlistProvider>
      <CartProvider>
        <ProductProvider>
          {children}
        </ProductProvider>
      </CartProvider>
    </WishlistProvider>
  );
};

export default GlobalProvider;
