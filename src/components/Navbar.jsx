import React, { useState } from "react";
import { CircleUser, ShoppingCart, Heart, Search, Menu, X } from "lucide-react";
import logo from "../assets/Home/logo.png";
import { Link } from "react-router-dom";
import { useCartContext } from "../context/CartContext"; // 👈 import cart context

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { cart } = useCartContext(); // 👈 get cart state

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#f6f1eb] h-20 px-6 flex items-center justify-between relative">
      {/* Left: Logo and Links */}
      <div className="flex items-center space-x-8">
        <Link to="/">
          <img src={logo} alt="Afford India" className="h-12 w-auto" />
        </Link>

        <div className="hidden md:flex items-center space-x-8">
          <Link to="/silver" className="text-gray-700 hover:underline">Silver</Link>
          <Link to="/brass" className="text-gray-700 hover:underline">Brass</Link>
          <Link to="/wood" className="text-gray-700 hover:underline">Wood</Link>
        </div>
      </div>

      {/* Right: Search + Icons */}
      <div className="hidden md:flex items-center space-x-6">
        <div className="flex items-center border border-black rounded-md px-3 py-1">
          <input
            type="text"
            placeholder="Search Here"
            className="bg-transparent focus:outline-none text-sm placeholder-gray-500"
          />
          <Search className="text-gray-500 ml-2" size={18} />
        </div>

        <div className="flex items-center space-x-4 text-2xl text-gray-800 relative">
          <Heart className="hover:text-gray-600 cursor-pointer" />

          {/* Cart Icon with Link and Badge */}
          <Link to="/cart" className="relative">
            <ShoppingCart className="hover:text-gray-600 cursor-pointer" />
            {cart.length > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                {cart.length}
              </span>
            )}
          </Link>

          <CircleUser className="hover:text-gray-600 cursor-pointer" />
        </div>
      </div>

      {/* Hamburger Button */}
      <div className="md:hidden">
        <button onClick={toggleMenu}>
          {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="absolute top-20 left-0 w-full bg-[#f6f1eb] py-4 px-6 md:hidden space-y-4">
          <div className="flex flex-col space-y-2">
            <Link to="/silver" onClick={toggleMenu}>Silver</Link>
            <Link to="/brass" onClick={toggleMenu}>Brass</Link>
            <Link to="/wood" onClick={toggleMenu}>Wood</Link>
          </div>

          <div className="flex items-center border border-black rounded-md px-3 py-1">
            <input
              type="text"
              placeholder="Search Here"
              className="bg-transparent focus:outline-none text-sm placeholder-gray-500 w-full"
            />
            <Search className="text-gray-500 ml-2" size={18} />
          </div>

          <div className="flex items-center space-x-4 text-2xl text-gray-800 relative">
            <Heart className="hover:text-gray-600 cursor-pointer" />

            {/* Cart Icon in Mobile Menu */}
            <Link to="/cart" className="relative">
              <ShoppingCart className="hover:text-gray-600 cursor-pointer" />
              {cart.length > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 flex items-center justify-center rounded-full">
                  {cart.length}
                </span>
              )}
            </Link>

            <CircleUser className="hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
