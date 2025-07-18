// src/context/LoginContext.jsx

import React, { createContext, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import axiosInstance from "../api/axiosInstance"; // ⬅️ Make sure this is imported

const LoginContext = createContext();

export const LoginProvider = ({ children }) => {
  const navigate = useNavigate();
  const { setIsAuthenticated } = useAuth();

  const login = async ({ email, password }) => {
    try {
      console.log("🔐 Sending login request with:", email, password); // debug

      const response = await axiosInstance.post("/admin/login", { email, password });

      console.log("✅ Login response:", response.data); // debug

      const token = response.data.token;

      if (token) {
        localStorage.setItem("token", token);
        console.log("📦 Token stored in localStorage:", localStorage.getItem("token")); // debug

        setIsAuthenticated(true);
        navigate("/");
      } else {
        alert("Login failed");
      }
    } catch (err) {
      console.error("❌ Login error:", err.response?.data || err.message); // debug
      alert("Invalid email or password");
    }
  };

  return (
    <LoginContext.Provider value={{ login }}>
      {children}
    </LoginContext.Provider>
  );
};

export const useLogin = () => useContext(LoginContext);
