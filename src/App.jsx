import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import './index.css';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Rakhi from './pages/Rakhi';
import ProductDetail from './pages/ProductDetails';
import Footer from './components/Footer';
import Cart from './pages/Cart';
import Brass from './pages/Brass';
import Wood from './pages/Wood';

function App() {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/silver" element={<Rakhi />} />
  <Route path="/silver/:id" element={<Rakhi />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/brass" element={<Brass />} />
        <Route path="/wood" element={<Wood />} /> {/* Assuming this is a placeholder for the Wood page */}
        {/* Add other routes as needed */}
      </Routes>
      <Footer/>
    </Router>
  );
}

export default App;
