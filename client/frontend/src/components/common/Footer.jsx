import React from "react";
import { useAppData } from "../../context/AppDataContext.jsx";
import {
    FaFacebookF,
    FaInstagram,
    FaXTwitter,
    FaLinkedinIn,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // Replace with actual path

const Footer = () => {
    const scrollToTop = () => window.scrollTo(0, 0);

    const { categories } = useAppData();
    return (
        <footer className="bg-[#ecece8] text-sm text-gray-800 py-10 px-4 mt-12">
            <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">

                
                {/* INFO */}
                <div>
                    <h4 className="font-semibold mb-3">INFO</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/exchange"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Exchanges Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/returnpolicy"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Returns Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/cancel"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Cancellation Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/ordering"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Ordering & Product Information
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/payment"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Payments Policy
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/productcare"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Product Care
                            </Link>
                        </li>

                        <li>
                            <Link
                                to="/faqs"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                FAQs
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/privacy-policy"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Privacy Policy
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/terms-and-conditions"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Terms & Conditions
                            </Link>
                        </li>
                    </ul>
                </div>
                {/* QUICK LINKS */}
                <div>
                    <h4 className="font-semibold mb-3">QUICK LINKS</h4>
                    <ul className="space-y-1">
                        <li>
                            <Link
                                to="/about"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                About Us
                            </Link>
                        </li>
                        <li>
                            <Link
                                to="/contact"
                                onClick={scrollToTop}
                                className="hover:underline"
                            >
                                Contact Us
                            </Link>
                        </li>
                    </ul>
                </div>

                 {/* SHOP PRODUCTS */}
                <div>
                    <h4 className="font-semibold mb-3">SHOP PRODUCTS</h4>
                    <ul className="space-y-1">
                        {categories && categories.length > 0 ? (
                            categories.map((cat) => (
                                <li key={cat._id || cat.name}>
                                    <Link
                                        to={`/products?categories=${cat._id}`}
                                        onClick={scrollToTop}
                                        className="hover:underline capitalize"
                                    >
                                        {cat.name}
                                    </Link>
                                </li>
                            ))
                        ) : (
                            <li>No products available</li>
                        )}
                    </ul>
                </div>


               

                {/* FOLLOW US + Logo */}
                <div className="flex flex-col items-start">
                    <h4 className="font-semibold mb-3">FOLLOW US</h4>
                    <div className="flex space-x-3 text-lg mb-4">
                        {/* Facebook icon left as placeholder, add link if needed */}
                        <a href="https://www.instagram.com/teamaffordindia/" target="_blank" rel="noopener noreferrer" aria-label="Instagram">
                            <FaInstagram />
                        </a>
                        <a href="https://x.com/teamAffordIndia" target="_blank" rel="noopener noreferrer" aria-label="X (Twitter)">
                            <FaXTwitter />
                        </a>
                        <a href="https://www.linkedin.com/in/teamaffordindia-969a23386/" target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
                            <FaLinkedinIn />
                        </a>
                    </div>
                    <img
                        src={logo}
                        alt="Afford India Logo"
                        className="h-12 mb-2 mt-16"
                    />
                    <p className="text-xs text-gray-600">
                        Copyright © 2025. All rights reserved.
                    </p>
                </div>
            </div>
            <p className="text-lg text-center mt-4 text-gray-500 font-light">
                Developed and Maintained by{" "}
                <a
                    href="https://etideas.com"
                    className="font-light text-gray-500"
                >
                    ET Ideas
                </a>
            </p>
        </footer>
    );
};

export default Footer;
