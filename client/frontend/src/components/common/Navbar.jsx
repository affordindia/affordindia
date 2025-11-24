import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaShoppingCart,
    FaUser,
    FaSearch,
    FaBars,
    FaSignOutAlt,
    FaClipboardList,
} from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { useAuth } from "../../context/AuthContext.jsx";
import { useAppData } from "../../context/AppDataContext.jsx";
import NavLogo from "../../assets/NavLogo.png";

const Navbar = () => {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const { isAuthenticated, logout } = useAuth();
    const { categories } = useAppData();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
    const cartCount = cart?.items?.length || 0;
    const wishlistCount = wishlist?.items?.length || 0;
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [mobileSearchValue, setMobileSearchValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (
                profileDropdownOpen &&
                !event.target.closest(".profile-dropdown-container")
            ) {
                setProfileDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [profileDropdownOpen]);

    return (
        <nav className="bg-[#EBEBE9]/80 sm:bg-[#EBEBE9]/80 text-black sticky top-0 z-50 backdrop-blur-md">
            <div className="mx-auto px-4 md:px-8 lg:px-12 py-3 flex items-center justify-between">
                {/* Mobile Layout */}
                <div className="md:hidden flex items-center justify-between w-full relative">
                    {/* Hamburger Menu */}
                    <button
                        className="p-2 focus:outline-none"
                        onClick={() => setMobileMenuOpen(true)}
                        aria-label="Toggle menu"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>

                    {/* Absolutely Centered Logo - Favicon for mobile */}
                    <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
                        <Link to="/" className="flex items-center">
                            <img
                                src="/favicon.png"
                                alt="Afford India Logo"
                                className="h-8 w-auto object-contain"
                            />
                        </Link>
                    </div>

                    {/* Right Icons - Search, Wishlist, Cart (NO PROFILE ICON) */}
                    <div className="flex items-center">
                        <button
                            type="button"
                            className="p-2 hover:text-black focus:outline-none"
                            onClick={() => setMobileSearchOpen(true)}
                        >
                            <FaSearch className="text-xl text-[#404040]" />
                        </button>
                        <Link
                            to="/wishlist"
                            className="relative transition-transform transform hover:scale-110 duration-200 p-2"
                        >
                            <FaHeart className="text-xl text-[#404040] hover:text-black" />
                            {wishlistCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-[#DC2626] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {wishlistCount}
                                </span>
                            )}
                        </Link>
                        <Link
                            to="/cart"
                            className="relative transition-transform transform hover:scale-110 duration-200 p-2"
                        >
                            <FaShoppingCart className="text-xl text-[#404040] hover:text-black" />
                            {cartCount > 0 && (
                                <span className="absolute -top-1 -right-1 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                    {cartCount}
                                </span>
                            )}
                        </Link>
                    </div>
                </div>

                {/* Desktop Layout */}
                <div className="hidden md:flex items-center space-x-4 lg:space-x-8">
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={NavLogo}
                            alt="Afford India Logo"
                            className="h-10 w-auto object-contain"
                        />
                    </Link>
                    <div className="flex space-x-6 text-lg text-[#363230]">
                        {categories.length > 0 &&
                            categories.map((cat) => (
                                <Link
                                    key={cat._id || cat.name}
                                    to={`/products?categories=${cat._id}`}
                                    className="relative capitalize hover:text-black transition-all duration-300 after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-[2px] after:w-0 hover:after:w-full after:bg-black after:transition-all after:duration-300"
                                >
                                    {cat.name}
                                </Link>
                            ))}
                    </div>
                </div>

                {/* Desktop Right Icons */}
                <div className="hidden md:flex items-center space-x-4">
                    <form
                        className="relative items-center w-40 lg:w-80 flex"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchValue.trim()) {
                                navigate(
                                    `/products?search=${encodeURIComponent(
                                        searchValue.trim()
                                    )}`
                                );
                            }
                        }}
                    >
                        <input
                            type="text"
                            placeholder="Search Here"
                            className="px-4 py-1.5 rounded-lg text-base w-full focus:outline-none pr-10 bg-primary text-black placeholder:text-[#8c8c8c]/80 shadow-md hover:shadow-lg"
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        {searchValue && (
                            <button
                                type="button"
                                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
                                onClick={() => {
                                    setSearchValue("");
                                    navigate("/products", { replace: true });
                                    window.location.href = "/products";
                                }}
                            >
                                <RxCross1 />
                            </button>
                        )}
                        <button
                            type="submit"
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A9A9A9] hover:text-black"
                        >
                            <FaSearch className="text-lg" />
                        </button>
                    </form>
                    <Link
                        to="/wishlist"
                        className="relative transition-transform transform hover:scale-110 duration-200"
                    >
                        <FaHeart className="text-xl text-[#404040] hover:text-black" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-3 -right-3 bg-[#E35151] text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <Link
                        to="/cart"
                        className="relative transition-transform transform hover:scale-110 duration-200"
                    >
                        <FaShoppingCart className="text-xl text-[#404040] hover:text-black" />
                        {cartCount > 0 && (
                            <span className="absolute -top-3 -right-3 bg-gray-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>

                    {/* Auth Button - Desktop Only */}
                    <div className="relative profile-dropdown-container">
                        <button
                            onClick={() =>
                                setProfileDropdownOpen(!profileDropdownOpen)
                            }
                            className="relative p-2 transition-transform transform hover:scale-110 duration-200"
                        >
                            <FaUser className="text-xl text-[#404040] hover:text-black" />
                        </button>

                        {profileDropdownOpen && (
                            <div className="absolute right-0 mt-3.5 w-56 bg-white border border-gray-200 rounded-sm shadow-lg z-50 text-sm">
                                <div className="py-3 px-4">
                                    {!isAuthenticated ? (
                                        <>
                                            <p className="text-sm text-gray-600 mb-3">
                                                Please login to access your
                                                account
                                            </p>
                                            <Link
                                                to="/login"
                                                className="block w-full bg-[#B76E79] text-white text-center py-2 px-4 rounded hover:bg-gray-800 transition-colors text-sm"
                                                onClick={() =>
                                                    setProfileDropdownOpen(
                                                        false
                                                    )
                                                }
                                            >
                                                Login / Sign Up
                                            </Link>
                                        </>
                                    ) : (
                                        <>
                                            <Link
                                                to="/cart"
                                                className="block py-2 hover:bg-gray-100 px-4"
                                            >
                                                <FaShoppingCart className="inline-block mr-2" />
                                                Cart
                                            </Link>
                                            <Link
                                                to="/wishlist"
                                                className="block py-2 hover:bg-gray-100 px-4"
                                            >
                                                <FaHeart className="inline-block mr-2" />
                                                Wishlist
                                            </Link>
                                            <Link
                                                to="/orders"
                                                className="block py-2 hover:bg-gray-100 px-4"
                                            >
                                                <FaClipboardList className="inline-block mr-2" />
                                                Orders
                                            </Link>
                                            <Link
                                                to="/profile"
                                                className="block py-2 hover:bg-gray-100 px-4"
                                            >
                                                <FaUser className="inline-block mr-2" />
                                                Profile
                                            </Link>
                                            <hr className="my-1" />
                                            <button
                                                onClick={() => {
                                                    logout();
                                                    setProfileDropdownOpen(
                                                        false
                                                    );
                                                }}
                                                className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                                            >
                                                <FaSignOutAlt className="inline-block mr-2" />
                                                Logout
                                            </button>
                                        </>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* SLIDE-IN MOBILE MENU */}
            <div
                className={`fixed inset-0 z-50 bg-black/40 transition-opacity duration-300 ${
                    mobileMenuOpen
                        ? "opacity-100 pointer-events-auto"
                        : "opacity-0 pointer-events-none"
                }`}
                onClick={() => setMobileMenuOpen(false)}
            >
                <div
                    className={`fixed top-0 left-0 w-screen h-screen bg-[#f9f6f1] text-[#111] z-50 transform transition-transform duration-300 ease-in-out ${
                        mobileMenuOpen ? "translate-x-0" : "-translate-x-full"
                    }`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className="relative px-4 py-3 border-b border-gray-300 bg-[#e3dfd7]">
                        <div className="flex justify-center">
                            <img
                                src="/favicon.png"
                                alt="Logo"
                                className="h-8"
                            />
                        </div>
                        <button
                            onClick={() => setMobileMenuOpen(false)}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <RxCross1 className="text-xl text-gray-700" />
                        </button>
                    </div>

                    <div className="p-4 space-y-4 montserrat-global">
                        <h2 className="text-lg font-bold">WELCOME</h2>
                        {categories.length > 0 &&
                            categories.map((cat) => (
                                <Link
                                    key={cat._id || cat.name}
                                    to={`/products?categories=${cat._id}`}
                                    className="block text-base text-gray-700 hover:text-black capitalize"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    {cat.name}
                                </Link>
                            ))}

                        {isAuthenticated && (
                            <div className="space-y-3 mt-6 pt-4 border-t border-gray-300">
                                <Link
                                    to="/profile"
                                    className="block text-base text-gray-700 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Profile
                                </Link>
                                <Link
                                    to="/orders"
                                    className="block text-base text-gray-700 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Orders
                                </Link>
                                <Link
                                    to="/wishlist"
                                    className="block text-base text-gray-700 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Wishlist
                                </Link>
                                <Link
                                    to="/cart"
                                    className="block text-base text-gray-700 hover:text-black"
                                    onClick={() => setMobileMenuOpen(false)}
                                >
                                    Cart
                                </Link>
                            </div>
                        )}

                        <div className="mt-8 text-sm">
                            {!isAuthenticated && (
                                <p className="mb-2">
                                    To access account and manage orders
                                </p>
                            )}
                            {isAuthenticated ? (
                                <button
                                    onClick={() => {
                                        logout();
                                        setMobileMenuOpen(false);
                                    }}
                                    className="block text-base text-[#DC2626] hover:text-red-700"
                                >
                                    Logout
                                </button>
                            ) : (
                                <Link
                                    to="/login"
                                    onClick={() => setMobileMenuOpen(false)}
                                    className="inline-block text-xl font-bold text-[#66333B] px-4 py-1 border border-gray-600 rounded hover:bg-gray-200"
                                >
                                    LOGIN / SIGNUP
                                </Link>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Search Overlay */}
            {mobileSearchOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center md:hidden">
                    <div className="bg-secondary w-full px-4 py-4 flex items-center gap-2 shadow-lg relative">
                        <form
                            className="flex-1 flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (mobileSearchValue.trim()) {
                                    navigate(
                                        `/products?search=${encodeURIComponent(
                                            mobileSearchValue.trim()
                                        )}`
                                    );
                                    setMobileSearchOpen(false);
                                }
                            }}
                        >
                            <div className="flex-1 relative">
                                <input
                                    type="text"
                                    autoFocus
                                    placeholder="Search Here"
                                    className="w-full pl-4 pr-10 py-2 rounded-lg text-base focus:outline-none bg-primary text-[#404040] placeholder:text-[#404040]/80"
                                    value={mobileSearchValue}
                                    onChange={(e) =>
                                        setMobileSearchValue(e.target.value)
                                    }
                                />
                                <FaSearch className="absolute right-3 top-1/2 -translate-y-1/2 text-[#404040]" />
                            </div>
                            {mobileSearchValue && (
                                <button
                                    type="button"
                                    className="p-2 text-gray-400 hover:text-black"
                                    onClick={() => {
                                        setMobileSearchValue("");
                                        navigate("/products", {
                                            replace: true,
                                        });
                                        window.location.href = "/products";
                                    }}
                                >
                                    <RxCross1 />
                                </button>
                            )}
                            <button
                                type="button"
                                className="p-2 text-black"
                                onClick={() => setMobileSearchOpen(false)}
                            >
                                &#10005;
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
