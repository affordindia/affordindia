import React from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";

const ExploreMaterials = () => {
    const { categories } = useAppData(); // Get categories from context instantly!

    return (
        <section className="bg-secondary py-10">
            <h2 className="text-3xl font-bold text-center text-[#262738] mb-8">
                <span className="">EXPLORE OUR MATERIALS</span>
            </h2>

            <div className="flex flex-row flex-wrap gap-4 px-4 justify-center">
                {categories.map((category) => (
                    <Link
                        to={`/products/${category.name.toLowerCase()}`}
                        key={category._id}
                        className="relative overflow-hidden rounded-lg shadow-md flex-shrink-0 h-[160px] min-w-16 w-16 md:h-[300px] md:min-w-[160px] md:w-[150px]"
                        onClick={(e) => {
                            e.preventDefault();
                            window.location.href = `/products/${category.name.toLowerCase()}`;
                        }}
                    >
                        <img
                            src={category.image || "/placeholder.jpg"}
                            alt={category.name}
                            className="w-full h-full object-cover blur-xs"
                        />

                        {/* Overlay - always vertical text, all screens */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            <span
                                className="text-white text-sm md:text-2xl font-extrabold"
                                style={{
                                    position: "absolute",
                                    top: "50%",
                                    left: "50%",
                                    transform:
                                        "translate(-50%, -50%) rotate(-90deg)",
                                    whiteSpace: "nowrap",
                                }}
                            >
                                {category.name.toUpperCase()}
                            </span>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
};

export default ExploreMaterials;
