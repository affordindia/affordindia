import React from "react";
import { AuthProvider } from "./AuthContext";
import { LoginProvider } from "./LoginContext"; // ✅ Add this
import { ProductsProvider } from "./ProductsContext";
import { AddproductProvider } from "./AddproductContext";
import { OrderProvider } from "./OrderContext";

const GlobalProvider = ({ children }) => {
  return (
    <AuthProvider>
      <LoginProvider>
        <OrderProvider>
          <ProductsProvider>
            <AddproductProvider>
              {children}
            </AddproductProvider>
          </ProductsProvider>
        </OrderProvider>
      </LoginProvider>
    </AuthProvider>
  );
};

export default GlobalProvider;
