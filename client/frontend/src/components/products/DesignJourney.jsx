import React from "react";

const designPoints = [
    {
        title: "Concept & Inspiration",
        desc: "Our designers draw inspiration from traditional Indian motifs and contemporary trends to create unique designs.",
    },
    {
        title: "Material Selection",
        desc: "Only the finest 92.5 sterling silver and ethically sourced gemstones are selected for our rakhis.",
    },
    {
        title: "Artisan Craftsmanship",
        desc: "Each rakhi is meticulously handcrafted by our skilled artisans using techniques passed down through generations.",
    },
    {
        title: "Quality Assurance",
        desc: "Every piece undergoes rigorous quality checks to ensure it meets our exacting standards.",
    },
];

const DesignJourney = () => {
    return (
        <div className="bg-white py-16 px-4 md:px-12 text-[#404040]">
            <h2 className="text-3xl font-semibold text-center mb-10">
                The Design Journey
            </h2>
            <div className="relative max-w-4xl mx-auto">
                <div className="space-y-6 relative z-10">
                    {designPoints.map((point, index) => (
                        <div
                            key={index}
                            className="flex items-start gap-4 relative"
                        >
                            <div className="min-w-8 h-8 w-8 bg-[#C1B776] text-white flex items-center justify-center rounded-full font-semibold">
                                {index + 1}
                            </div>
                            <div>
                                <h4 className="font-semibold text-lg">
                                    {point.title}
                                </h4>
                                <p className="text-gray-600 text-sm">
                                    {point.desc}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DesignJourney;
