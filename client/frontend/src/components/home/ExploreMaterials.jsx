import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";

const ExploreMaterials = () => {
    const { categories } = useAppData();
    const navigate = useNavigate();
    const [activeIndex, setActiveIndex] = useState(null);

    const handleClick = (category, index) => {
        setActiveIndex(index);
        setTimeout(() => {
            navigate(`/products/${category.name.toLowerCase()}`);
        }, 200);
    };

    return (
        <section className="bg-[#F5F5F5] py-10">
            {/* Section Header - visible on all devices */}
            <div className="flex items-center justify-center mb-9 px-4">
                <div className="w-8 border-t border-gray-400 mx-2 md:mx-4" />
                <h2 className="text-center text-xl md:text-3xl font-semibold text-gray-800 uppercase whitespace-nowrap font-[playfair-display]">
                    EXPLORE OUR MATERIALS
                </h2>
                <div className="w-8 border-t border-gray-400 mx-2 md:mx-4" />
            </div>

            {/* Category Cards Container */}
            <div className="flex flex-row md:flex-wrap gap-4 md:gap-8 px-4 justify-center md:justify-center overflow-x-auto md:overflow-visible no-scrollbar">
                {categories.map((category, index) => (
                    <div
                        key={category._id}
                        onClick={() => handleClick(category, index)}
                        className={`relative overflow-hidden rounded-lg shadow-md flex-shrink-0 
              h-[120px] w-[125px] 
              md:h-[300px] md:w-[230px] 
              cursor-pointer transform transition-transform duration-200 ease-in-out 
              ${activeIndex === index ? "scale-90" : "hover:scale-105"}`}
                    >
                        <img
                            src={category.image || "/placeholder.jpg"}
                            alt={category.name}
                            className="w-full h-full object-cover blur-sm"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span className="text-white text-center text-sm md:text-3xl font-black montserrat-global">
                                {category.name.toUpperCase()}
                            </span>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    );
};

export default ExploreMaterials;
