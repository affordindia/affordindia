import React from "react";
import { Link } from "react-router-dom";
import { FaGift } from "react-icons/fa";

const PromoStrip = () => {
    return (
        <div className="bg-gray-100 border-b border-gray-200 text-gray-700 py-2 px-4">
            <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 text-sm md:text-base">
                <FaGift className="text-[#C1B086]" />
                <span className="font-medium">
                    Raksha Bandhan Sale is LIVE!
                </span>
                <Link
                    to="/rakhi"
                    className="bg-[#C1B086] text-white px-3 py-1 rounded-lg font-semibold hover:bg-[#B5A578] transition-colors text-xs md:text-sm ml-2 text-center"
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
};

export default PromoStrip;
