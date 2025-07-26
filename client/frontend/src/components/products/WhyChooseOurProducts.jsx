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
        <div className="bg-white py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-semibold text-center text-[#404040] mb-10">
            Why Choose Silver Rakhis
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Lasting Symbol
              </h3>
              <p className="text-gray-600 text-sm">
                Unlike thread rakhis, silver rakhis are durable and can be
                preserved as a lasting symbol of your bond.
              </p>
            </div>
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Artisan Crafted
              </h3>
              <p className="text-gray-600 text-sm">
                Each piece is meticulously handcrafted by skilled artisans using
                traditional techniques passed down through generations.
              </p>
            </div>
            <div className="bg-[#F5F4EF] p-6 rounded shadow text-center">
              <h3 className="text-lg font-semibold text-[#404040] mb-2">
                Premium Gift
              </h3>
              <p className="text-gray-600 text-sm">
                Silver rakhis make for an elegant and premium gift that your
                brother will cherish for years to come.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
};

export default WhyChooseOurProducts;
