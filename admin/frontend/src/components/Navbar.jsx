import React from "react";
import { assets } from "../assets/assets";
import { useAuth } from "../context/AuthContext"; // ✅ import useAuth
import { useNavigate } from "react-router-dom"; // ✅ import useNavigate

const Navbar = () => {
  const { logout, isAuthenticated } = useAuth(); // ✅ get logout and auth status
  const navigate = useNavigate(); // ✅ for redirect

  const handleLogout = () => {
    logout();            // ✅ clear token and set auth to false
    navigate("/login");  // ✅ redirect to login page
  };

  return (
    <div className="flex flex-col sm:flex-row justify-between items-center bg-[#2c2a4a] px-4 py-3 shadow-md gap-3 sm:gap-0">
      {/* Logo */}
      <div className="flex justify-center sm:justify-start w-full sm:w-auto">
        <img src={assets.logo} alt="Logo" className="h-10 object-contain" />
      </div>

      {/* Logout Button */}
      {isAuthenticated && ( // ✅ only show logout when user is authenticated
        <div className="flex justify-center sm:justify-end w-full sm:w-auto">
          <button
            onClick={handleLogout}
            className="bg-[#e8e0d0] text-[#000] text-sm sm:text-md border rounded-md h-10 px-5 hover:bg-[#d6ccbb] transition"
          >
            Logout
          </button>
        </div>
      )}
    </div>
  );
};

export default Navbar;
