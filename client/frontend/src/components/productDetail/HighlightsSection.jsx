import React from "react";

import { GiRoundStar } from "react-icons/gi";
import { GiStoneCrafting } from "react-icons/gi";
import { FaTruck } from "react-icons/fa";
import { FaArrowRotateLeft } from "react-icons/fa6";

const HighlightsSection = () => {
    return (
        <div className="max-w-7xl mx-auto px-4 md:px-4 mt-8 mb-8">
            <div className="grid grid-cols-2 sm:flex sm:flex-row justify-between items-stretch gap-4 text-center text-xs text-[#404040]">
                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/70 rounded-lg shadow-sm">
                    <GiRoundStar className="text-4xl mb-1" />
                    <div className="text-base font-semibold">
                        Authentic Product
                    </div>
                    <div className="text-sm">Certified Purity</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/70 rounded-lg shadow-sm">
                    <GiStoneCrafting className="text-4xl mb-1" />
                    <div className="text-base font-semibold">
                        Artisan Crafted
                    </div>
                    <div className="text-sm">Traditional Craftsmanship</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/70 rounded-lg shadow-sm">
                    <FaTruck className="text-4xl mb-1" />
                    <div className="text-base font-semibold">Free Shipping</div>
                    <div className="text-sm">On every orders</div>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center p-3 bg-white/70 rounded-lg shadow-sm">
                    <FaArrowRotateLeft className="text-4xl mb-1" />
                    <div className="text-base font-semibold">Easy Returns</div>
                    <div className="text-sm">Hassle-free return policy</div>
                </div>
            </div>
        </div>
    );
};

export default HighlightsSection;
