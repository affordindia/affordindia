import React from "react";
import {
  FaFacebook,
  FaSquareInstagram,
  FaSquareXTwitter,
  FaLinkedin,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const Footer = () => {
  return (
    <footer className="bg-[#F5F1E8] text-[#1F1F1F] py-10 pb-12 text-sm mt-12">
      <div className="max-w-[1200px] mx-auto px-9 sm:px-10 lg:px-20">
        {/* Main Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-14 text-left">

          {/* QUICK LINKS */}
          <div>
            <h3 className="font-semibold mb-2">QUICK LINKS</h3>
            <ul className="space-y-1">
              <li><Link to="/about" className="hover:underline">About Us</Link></li>
              <li><Link to="/contact" className="hover:underline">Contact Us</Link></li>
            </ul>
            <div className="mt-14 flex justify-start">
              <img src={logo} alt="Afford India Logo" className="h-10" />
            </div>
          </div>

          {/* INFO */}
          <div>
            <h3 className="font-semibold mb-2">INFO</h3>
            <ul className="space-y-1">
              <li><Link to="/terms" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/returnpolicy" className="hover:underline">Returns and Refunds Policy</Link></li>
              <li><Link to="/shipping" className="hover:underline">Shipping Policy</Link></li>
              <li><Link to="/cancellation" className="hover:underline">Cancellation Policy</Link></li>
              <li><Link to="/faqs" className="hover:underline">FAQs</Link></li>
            </ul>
          </div>

          {/* SHOP PRODUCTS */}
          <div>
            <h3 className="font-semibold mb-2">SHOP PRODUCTS</h3>
            <ul className="space-y-1">
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
            </ul>
            <div className="flex justify-start gap-4 mt-4">
              <FaFacebook className="text-xl hover:text-blue-600 cursor-pointer" />
              <FaSquareInstagram className="text-xl hover:text-pink-500 cursor-pointer" />
              <FaSquareXTwitter className="text-xl hover:text-black cursor-pointer" />
              <FaLinkedin className="text-xl hover:text-blue-700 cursor-pointer" />
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center mt-6 text-xs">
          Copyright © {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
