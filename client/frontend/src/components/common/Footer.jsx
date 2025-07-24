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
  return (
    <footer className="bg-[#ecece8] text-sm text-gray-800 py-10 px-4">
      <div className="max-w-6xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8">
        {/* QUICK LINKS */}
        <div>
          <h4 className="font-semibold mb-3">QUICK LINKS</h4>
          <ul className="space-y-1">
            <li>
              <Link to="/about" className="hover:underline">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="hover:underline">
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
              <Link to="/terms" className="hover:underline">
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link to="/privacy" className="hover:underline">
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link to="/returnpolicy" className="hover:underline">
                Returns & Refunds Policy
              </Link>
            </li>
            <li>
              <Link to="/shipping" className="hover:underline">
                Shipping Policy
              </Link>
            </li>
            <li>
              <Link to="/cancel" className="hover:underline">
                Cancellation Policy
              </Link>
            </li>
            <li>
              <Link to="/faqs" className="hover:underline">
                FAQs
              </Link>
            </li>
          </ul>
        </div>

        {/* SHOP PRODUCTS */}
        <div>
          <h4 className="font-semibold mb-3">SHOP PRODUCTS</h4>
          <ul className="space-y-1">
            <li>1</li>
            <li>2</li>
            <li>3</li>
            <li>4</li>
            <li>5</li>
          </ul>
        </div>

        {/* FOLLOW US + Logo */}
        <div className="flex flex-col items-start md:items-end">
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
