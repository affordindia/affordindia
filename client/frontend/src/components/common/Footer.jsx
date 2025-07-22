import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaXTwitter,
  FaLinkedinIn,
} from "react-icons/fa6";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png"; // replace with your logo path

const Footer = () => {
  return (
    <footer className="bg-[#eee9d7] text-sm text-gray-800 py-8 px-4 mt-12">
      <div className="max-w-6xl mx-auto">
        {/* Mobile View Grid (2x2) */}
        <div className="grid grid-cols-2 gap-y-8 gap-x-4 md:hidden">
          {/* Only visible on mobile, 2 columns */}

          {/* Quick Links (Mobile - Top Left) */}
          <div>
            <h4 className="font-semibold mb-2">QUICK LINKS</h4>
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

          {/* Info (Mobile - Top Right) - REMOVED whitespace-nowrap here */}
          <div>
            <h4 className="font-semibold mb-2">INFO</h4>
            <ul className="space-y-1">
              <li>
                <Link to="/terms" className="hover:underline"> {/* Changed */}
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:underline" /* Changed */
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returnpolicy"
                  className="hover:underline" /* Changed */
                >
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:underline" /* Changed */
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="hover:underline" /* Changed */
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link to="/faqs" className="hover:underline"> {/* Changed */}
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* Shop Products (Mobile - Bottom Left) */}
          <div>
            <h4 className="font-semibold mb-2">SHOP PRODUCTS</h4>
            <ul className="space-y-1">
              <li>1</li>
              <li>2</li>
              <li>3</li>
              <li>4</li>
              <li>5</li>
            </ul>
          </div>

          {/* Follow Us (Mobile - Bottom Right) */}
          <div>
            <h4 className="font-semibold mb-2">FOLLOW US</h4>
            <div className="flex space-x-3 text-lg">
              <FaFacebookF />
              <FaInstagram />
              <FaXTwitter />
              <FaLinkedinIn />
            </div>
          </div>
        </div>{" "}
        {/* End Mobile View Grid */}

        {/* Mobile Logo and Copyright (visible only on mobile) */}
        <div className="block md:hidden mt-8 text-center">
          <img
            src={logo}
            alt="Afford India Logo"
            className="h-12 mb-1 mx-auto"
          />
          <p className="text-xs text-gray-600 mt-2 whitespace-nowrap">
            Copyright © 2025. All rights reserved.
          </p>
        </div>

        {/* Desktop View Grid (4 columns) - Hidden on mobile */}
        <div className="hidden md:grid md:grid-cols-4 md:gap-x-48">
          {" "}
          {/* Only visible on desktop */}
          {/* QUICK LINKS + Desktop Logo */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-2">QUICK LINKS</h4>
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
            {/* Logo + Copyright for DESKTOP ONLY */}
            <div className="mt-16">
              <img src={logo} alt="Logo" className="h-12 mb-1" />
              <p className="text-xs text-gray-600 mt-5 whitespace-nowrap">
                Copyright © 2025. All rights reserved.
              </p>
            </div>
          </div>

          {/* INFO - Added md:whitespace-nowrap for desktop specific behavior */}
          <div>
            <h4 className="font-semibold mb-2">INFO</h4>
            <ul className="space-y-1">
              <li>
                <Link
                  to="/terms"
                  className="hover:underline md:whitespace-nowrap"
                >
                  Terms & Conditions
                </Link>
              </li>
              <li>
                <Link
                  to="/privacy"
                  className="hover:underline md:whitespace-nowrap"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/returnpolicy"
                  className="hover:underline md:whitespace-nowrap"
                >
                  Returns & Refunds Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/shipping"
                  className="hover:underline md:whitespace-nowrap"
                >
                  Shipping Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/cancellation"
                  className="hover:underline md:whitespace-nowrap"
                >
                  Cancellation Policy
                </Link>
              </li>
              <li>
                <Link
                  to="/faqs"
                  className="hover:underline md:whitespace-nowrap"
                >
                  FAQs
                </Link>
              </li>
            </ul>
          </div>

          {/* SHOP PRODUCTS + FOLLOW US */}
          <div className="flex flex-col gap-4">
            <div>
              <h4 className="font-semibold mb-2">SHOP PRODUCTS</h4>
              <ul className="space-y-1">
                <li>1</li>
                <li>2</li>
                <li>3</li>
                <li>4</li>
                <li>5</li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-2">FOLLOW US</h4>
              <div className="flex space-x-3 text-lg">
                <FaFacebookF />
                <FaInstagram />
                <FaXTwitter />
                <FaLinkedinIn />
              </div>
            </div>
          </div>
        </div>{" "}
        {/* End Desktop View Grid */}
      </div>
    </footer>
  );
};

export default Footer;