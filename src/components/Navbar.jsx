import React, { useState } from "react";
import {
  CircleUser,
  ShoppingCart,
  Heart,
  Search,
  Menu,
  X
} from "lucide-react";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  return (
    <nav className="bg-[#f6f1eb] px-6 py-4">
      <div className="flex items-center justify-between">
        {/* Left: Logo and Links */}
        <div className="flex items-center space-x-8">
          <img src={logo} alt="Afford India" className="w-32 sm:w-40 h-auto" />

          {/* Desktop Navigation Links */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/silver" className="text-gray-700 text-md font-normal hover:underline">
              Silver
            </Link>
            <Link to="/brass" className="text-gray-700 text-md font-normal hover:underline">
              Brass
            </Link>
            <Link to="/wood" className="text-gray-700 text-md font-normal hover:underline">
              Wood
            </Link>
          </div>
        </div>

        {/* Right: Search and Icons */}
        <div className="hidden md:flex items-center space-x-6">
          {/* Search Box */}
          <div className="flex items-center border border-black rounded-md px-3 py-1">
            <input
              type="text"
              placeholder="Search Here"
              className="bg-transparent focus:outline-none text-sm placeholder-gray-500"
            />
            <Search className="text-gray-500 ml-2" size={18} />
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-4 text-2xl text-gray-800">
            <Heart className="hover:text-gray-600 cursor-pointer" />
            <ShoppingCart className="hover:text-gray-600 cursor-pointer" />
            <CircleUser className="hover:text-gray-600 cursor-pointer" />
          </div>
        </div>

        {/* Mobile Hamburger Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu}>
            {isMenuOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {isMenuOpen && (
        <div className="md:hidden mt-4 space-y-4 text-gray-700 text-base">
          <div className="flex flex-col space-y-2">
            <Link to="/silver" className="hover:underline" onClick={toggleMenu}>
              Silver
            </Link>
            <Link to="/brass" className="hover:underline" onClick={toggleMenu}>
              Brass
            </Link>
            <Link to="/wood" className="hover:underline" onClick={toggleMenu}>
              Wood
            </Link>
          </div>

          {/* Mobile Search */}
          <div className="flex items-center border border-black rounded-md px-3 py-1">
            <input
              type="text"
              placeholder="Search Here"
              className="bg-transparent focus:outline-none text-sm placeholder-gray-500 w-full"
            />
            <Search className="text-gray-500 ml-2" size={18} />
          </div>

          {/* Icons on Mobile */}
          <div className="flex items-center space-x-4 text-2xl text-gray-800">
            <Heart className="hover:text-gray-600 cursor-pointer" />
            <ShoppingCart className="hover:text-gray-600 cursor-pointer" />
            <CircleUser className="hover:text-gray-600 cursor-pointer" />
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
