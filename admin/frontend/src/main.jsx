import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.jsx';
import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import GlobalProvider from "./context/GlobalProvider.jsx";

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <Router> {/* ✅ Must be outside everything that uses useNavigate */}
      <GlobalProvider>
        <App />
      </GlobalProvider>
    </Router>
  </StrictMode>
);
