import React from "react";
import {
    FaFacebookF,
    FaInstagram,
    FaTwitter,
    FaLinkedinIn,
    FaPinterestP,
} from "react-icons/fa";

const Footer = () => {
    return (
        <footer className="bg-[#F5F1E8] mt-12">
            {/* Footer Links */}
            <div className="bg-[#F5F1E8] py-4 px-4 md:px-12">
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-6">
                    <div>
                        <h3 className="font-semibold mb-1 text-sm">HELP</h3>
                        <ul className="space-y-0.5 text-xs">
                            <li>Terms and Conditions</li>
                            <li>Privacy Policy</li>
                            <li>Returns and Refunds Policy</li>
                            <li>Shipping Policy</li>
                            <li>Cancellation Policy</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1 text-sm">COMPANY</h3>
                        <ul className="space-y-0.5 text-xs">
                            <li>About Us</li>
                            <li>Contact Us</li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1 text-sm">
                            SHOP PRODUCTS
                        </h3>
                        <ul className="space-y-0.5 text-xs">
                            {[1, 2, 3, 4, 5, 6, 7, 8].map((item) => (
                                <li key={item}>{item}</li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1 text-sm">
                            SOCIAL MEDIA
                        </h3>
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
                            <div className="flex items-center gap-1 text-xs">
                                <FaPinterestP className="text-[#E60023]" />
                                <span>Pinterest</span>
                            </div>
                        </div>
                    </div>

                    <div>
                        <h3 className="font-semibold mb-1 text-sm">LOCATION</h3>
                        <p className="text-xs">Address</p>
                    </div>
                </div>
            </div>

            {/* Copyright */}
            <div className="text-center text-xs py-2">
                © {new Date().getFullYear()}. All rights reserved.
            </div>
        </footer>
    );
};

export default Footer;
