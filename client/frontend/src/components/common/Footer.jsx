import React from "react";
import {
  FaFacebookF,
  FaInstagram,
  FaTwitter,
  FaLinkedinIn,
} from "react-icons/fa";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-[#F5F1E8] mt-12 relative z-10">
      <div className="py-4 px-4 md:px-12">
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
          {/* HELP */}
          <div>
            <h3 className="font-semibold mb-1 text-sm">HELP</h3>
            <ul className="space-y-0.5 text-xs">
              <li><Link to="/terms" className="hover:underline">Terms and Conditions</Link></li>
              <li><Link to="/privacy" className="hover:underline">Privacy Policy</Link></li>
              <li><Link to="/returns" className="hover:underline">Returns and Refunds Policy</Link></li>
              <li><Link to="/shipping" className="hover:underline">Shipping Policy</Link></li>
              <li><Link to="/cancellation" className="hover:underline">Cancellation Policy</Link></li>
            </ul>
          </div>

          {/* COMPANY */}
          <div>
            <h3 className="font-semibold mb-1 text-sm">COMPANY</h3>
            <ul className="space-y-0.5 text-xs">
              <li>About Us</li>
              <li>Contact Us</li>
            </ul>
          </div>

          {/* PRODUCTS */}
          <div>
            <h3 className="font-semibold mb-1 text-sm">SHOP PRODUCTS</h3>
            <ul className="space-y-0.5 text-xs">
              {[1, 2, 3, 4].map((item) => (
                <li key={item}>Product {item}</li>
              ))}
            </ul>
          </div>

          {/* SOCIAL */}
          <div>
            <h3 className="font-semibold mb-1 text-sm">SOCIAL MEDIA</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-1 text-xs">
                <FaFacebookF className="text-[#1877F2]" />
                <span>Facebook</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <FaInstagram className="text-[#E1306C]" />
                <span>Instagram</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <FaTwitter className="text-[#1DA1F2]" />
                <span>Twitter</span>
              </div>
              <div className="flex items-center gap-1 text-xs">
                <FaLinkedinIn className="text-[#0A66C2]" />
                <span>LinkedIn</span>
              </div>
            </div>
          </div>

          {/* LOCATION */}
          <div>
            <h3 className="font-semibold mb-1 text-sm">LOCATION</h3>
            <p className="text-xs">123, Main Street, City, Country</p>
          </div>
        </div>
      </div>

      <div className="text-center text-xs py-2">
        © {new Date().getFullYear()}. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
