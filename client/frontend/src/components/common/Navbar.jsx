import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    FaHeart,
    FaShoppingCart,
    FaUser,
    FaSearch,
    FaBars,
} from "react-icons/fa";
import { RxCross1 } from "react-icons/rx";
import { useCart } from "../../context/CartContext.jsx";
import { useWishlist } from "../../context/WishlistContext.jsx";
import { getCategories } from "../../api/category.js";
import NavLogo from "../../assets/NavLogo.png";

const Navbar = () => {
    const { cart } = useCart();
    const { wishlist } = useWishlist();
    const [categories, setCategories] = useState([]);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const cartCount = cart?.items?.length || 0;
    const wishlistCount = wishlist?.items?.length || 0;
    const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
    const [searchValue, setSearchValue] = useState("");
    const [mobileSearchValue, setMobileSearchValue] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data.categories || data))
            .catch(() => setCategories([]));
    }, []);

    return (
        <nav className="bg-secondary text-black sticky top-0 z-50">
            <div className="max-w-7xl mx-auto px-2 py-3 flex items-center justify-between">
                {/* Left: Logo, Hamburger, and Categories */}
                <div className="flex items-center space-x-4 md:space-x-8">
                    {/* Hamburger for mobile */}
                    <button
                        className="md:hidden p-2 focus:outline-none"
                        onClick={() => setMobileMenuOpen((open) => !open)}
                        aria-label="Toggle menu"
                    >
                        <FaBars className="w-6 h-6" />
                    </button>
                    <Link to="/" className="flex items-center space-x-2">
                        <img
                            src={NavLogo}
                            alt="Afford India Logo"
                            className="h-8 w-auto object-contain md:h-10"
                        />
                    </Link>
                    {/* Desktop categories */}
                    <div className="hidden md:flex space-x-6 text-lg text-[#363230]">
                        {categories.length > 0 ? (
                            categories.map((cat) => (
                                <Link
                                    key={cat._id || cat.name}
                                    to={`/products/${cat.name.toLowerCase()}`}
                                    className="hover:text-black capitalize"
                                    onClick={(e) => {
                                        e.preventDefault();
                                        // Always clear search param when switching material
                                        window.location.href = `/products/${cat.name.toLowerCase()}`;
                                    }}
                                >
                                    {cat.name}
                                </Link>
                            ))
                        ) : (
                            <span className="text-gray-400">Loading...</span>
                        )}
                    </div>
                </div>

                {/* Right: Search and Icons */}
                <div className="flex items-center space-x-4">
                    {/* Mobile search icon */}
                    <button
                        type="button"
                        className="md:hidden p-2 hover:text-black focus:outline-none"
                        aria-label="Search"
                        onClick={() => setMobileSearchOpen(true)}
                    >
                        <FaSearch className="text-xl" />
                    </button>
                    {/* Desktop search bar */}
                    <form
                        className="relative items-center w-40 md:w-80 hidden md:flex"
                        onSubmit={(e) => {
                            e.preventDefault();
                            if (searchValue.trim()) {
                                // Reset all filters, only keep search
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
                            style={{ minHeight: "24px" }}
                            value={searchValue}
                            onChange={(e) => setSearchValue(e.target.value)}
                        />
                        {searchValue && (
                            <button
                                type="button"
                                className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black focus:outline-none"
                                aria-label="Clear search"
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
                            className="absolute right-2 top-1/2 -translate-y-1/2 text-[#A9A9A9] hover:text-black focus:outline-none cursor-pointer"
                        >
                            <FaSearch className="text-lg" />
                        </button>
                    </form>
                    <Link
                        to="/wishlist"
                        className="relative"
                        aria-label="Wishlist"
                    >
                        <FaHeart className="text-xl hover:text-black" />
                        {wishlistCount > 0 && (
                            <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {wishlistCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/cart" className="relative" aria-label="Cart">
                        <FaShoppingCart className="text-xl hover:text-black" />
                        {cartCount > 0 && (
                            <span className="absolute -top-3 -right-3 bg-green-600 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
                                {cartCount}
                            </span>
                        )}
                    </Link>
                    <Link to="/profile" aria-label="Profile">
                        <FaUser className="text-xl hover:text-black" />
                    </Link>
                </div>
            </div>
            {/* Mobile menu dropdown */}
            <div
                className={`md:hidden bg-secondary px-4 pb-4 pt-2 space-y-2 shadow transition-all duration-300 ease-in-out transform ${
                    mobileMenuOpen
                        ? "opacity-100 translate-y-0 pointer-events-auto"
                        : "opacity-0 -translate-y-4 pointer-events-none"
                }`}
                style={{ position: "absolute", left: 0, right: 0, top: "100%" }}
            >
                {categories.length > 0 ? (
                    categories.map((cat) => (
                        <Link
                            key={cat._id || cat.name}
                            to={`/products/${
                                cat.slug || cat.name.toLowerCase()
                            }`}
                            className="block py-2 text-lg capitalize hover:text-black"
                            onClick={() => setMobileMenuOpen(false)}
                        >
                            {cat.name}
                        </Link>
                    ))
                ) : (
                    <span className="text-gray-400">Loading...</span>
                )}
            </div>

            {/* Mobile search overlay */}
            {mobileSearchOpen && (
                <div className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center md:hidden">
                    <div className="bg-secondary w-full px-4 py-4 flex items-center gap-2 shadow-lg relative">
                        <form
                            className="flex-1 flex gap-2"
                            onSubmit={(e) => {
                                e.preventDefault();
                                if (mobileSearchValue.trim()) {
                                    // Reset all filters, only keep search
                                    navigate(
                                        `/products?search=${encodeURIComponent(
                                            mobileSearchValue.trim()
                                        )}`
                                    );
                                    setMobileSearchOpen(false);
                                }
                            }}
                        >
                            <input
                                type="text"
                                autoFocus
                                placeholder="Search Here"
                                className="flex-1 px-4 py-2 rounded-lg border border-black text-base focus:outline-none bg-primary text-black placeholder:text-black/80"
                                value={mobileSearchValue}
                                onChange={(e) =>
                                    setMobileSearchValue(e.target.value)
                                }
                            />
                            {mobileSearchValue && (
                                <button
                                    type="button"
                                    className="p-2 text-gray-400 hover:text-black focus:outline-none"
                                    aria-label="Clear search"
                                    onClick={() => {
                                        setMobileSearchValue("");
                                        navigate("/products", {
                                            replace: true,
                                        });
                                        window.location.href = "/products";
                                    }}
                                >
                                    <RxCross1 className="" />
                                </button>
                            )}
                            <button
                                type="submit"
                                className="p-2 text-black hover:text-primary focus:outline-none"
                                aria-label="Search"
                            >
                                <FaSearch className="text-lg" />
                            </button>
                            <button
                                type="button"
                                className="p-2 text-black hover:text-primary focus:outline-none"
                                onClick={() => setMobileSearchOpen(false)}
                                aria-label="Close search"
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
