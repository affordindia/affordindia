import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getCategories } from "../../api/category";

const ExploreMaterials = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        getCategories()
            .then((data) => setCategories(data.categories || data))
            .catch(() => setCategories([]));
    }, []);

    return (
        <section className="bg-secondary py-10">
            <h2 className="text-3xl font-bold text-center text-[#262738] mb-8">
                <span className="px-4">EXPLORE OUR MATERIALS</span>
            </h2>

            <div className="grid grid-cols-2 gap-4 px-4 md:flex md:flex-row md:flex-wrap md:overflow-x-auto md:no-scrollbar md:justify-center">
                {categories.map((category) => (
                    <Link
                        to={`/category/${category.slug || category._id}`}
                        key={category._id}
                        className="relative overflow-hidden rounded-lg shadow-md flex-shrink-0 aspect-square w-full md:h-[300px] md:min-w-[160px] md:aspect-auto md:w-[150px]"
                    >
                        <img
                            src={category.image || "/placeholder.jpg"}
                            alt={category.name}
                            className="w-full h-full object-cover blur-xs"
                        />

                        {/* Overlay */}
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                            {/* Desktop: vertical text */}
                            <span
                                className="hidden md:block text-white text-2xl font-extrabold"
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
                            <span
                                className="flex md:hidden text-white text-lg font-bold text-center w-full items-center justify-center h-full"
                                style={{
                                    textShadow: "0 2px 8px rgba(0,0,0,0.5)",
                                    letterSpacing: "0.04em",
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
