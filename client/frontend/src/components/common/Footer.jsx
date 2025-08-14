import React from "react";
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

  return (
    <footer className="bg-[#ecece8] text-sm text-gray-800 py-10 px-4 mt-12">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold mb-3">QUICK LINKS</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/about" onClick={scrollToTop} className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" onClick={scrollToTop} className="hover:underline">
                Contact Us
              </Link>
            </li>
          </ul>
        </div>

        {/* INFO */}
        <div>
          <h4 className="font-semibold mb-3">INFO</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/exchange" onClick={scrollToTop} className="hover:underline">
                Exchanges Policy
              </Link>
            </li>
             <li>
              <Link to="/returnpolicy" onClick={scrollToTop} className="hover:underline">
                Returns Policy
              </Link>
            </li>
            <li>
              <Link to="/cancel" onClick={scrollToTop} className="hover:underline">
                Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/ordering" onClick={scrollToTop} className="hover:underline">
                Ordering & Product Information
              </Link>
            </li>
           
            <li>
              <Link to="/payment" onClick={scrollToTop} className="hover:underline">
                Payments Policy
              </Link>
            </li>
           
            <li>
              <Link to="/productcare" onClick={scrollToTop} className="hover:underline">
                Product Care
              </Link>
            </li>
            
            <li>
              <Link to="/faqs" onClick={scrollToTop} className="hover:underline">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* SHOP PRODUCTS */}
        <div>
          <h4 className="font-semibold mb-3">SHOP PRODUCTS</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/products/1" onClick={scrollToTop} className="hover:underline">
                1
              </Link>
            </li>
            <li>
              <Link to="/products/2" onClick={scrollToTop} className="hover:underline">
                2
              </Link>
            </li>
            <li>
              <Link to="/products/3" onClick={scrollToTop} className="hover:underline">
                3
              </Link>
            </li>
            <li>
              <Link to="/products/4" onClick={scrollToTop} className="hover:underline">
                4
              </Link>
            </li>
            <li>
              <Link to="/products/5" onClick={scrollToTop} className="hover:underline">
                5
              </Link>
            </li>
          </ul>
        </div>

        {/* FOLLOW US + Logo */}
        <div className="flex flex-col items-start">
          <h4 className="font-semibold mb-3">FOLLOW US</h4>
          <div className="flex space-x-3 text-lg mb-4">
            <FaFacebookF />
            <FaInstagram />
            <FaXTwitter />
            <FaLinkedinIn />
          </div>
          <img src={logo} alt="Afford India Logo" className="h-12 mb-2 mt-16" />
          <p className="text-xs text-gray-600">
            Copyright © 2025. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
