import React from "react";

const features = [
    {
        title: "Lasting Symbol",
        desc: "Unlike thread rakhis, silver rakhis are durable and can be preserved as a lasting symbol of your bond.",
    },
    {
        title: "Artisan Crafted",
        desc: "Each piece is meticulously handcrafted by skilled artisans using traditional techniques passed down through generations.",
    },
    {
        title: "Premium Gift",
        desc: "Silver rakhis make for an elegant and premium gift that your brother will cherish for years to come.",
    },
];

const WhyChooseOurProducts = () => {
    return (
        <div className="bg-white py-12 px-4 md:px-12">
            <h2 className="text-3xl font-semibold text-center mb-10">
                Why Choose Silver Rakhis
            </h2>
            <div className="max-w-5xl mx-auto grid gap-6 md:grid-cols-3">
                {features.map((feature, index) => (
                    <div
                        key={index}
                        className="bg-[#2C2C2C] text-white rounded-md p-5 text-sm shadow-md"
                    >
                        <h4 className="font-semibold mb-2 text-base">
                            {feature.title}
                        </h4>
                        <p className="text-gray-300">{feature.desc}</p>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default WhyChooseOurProducts;
