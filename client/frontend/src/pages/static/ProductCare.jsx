import React from 'react';

const ProductCare = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Product Care, Packaging, Authenticity & Invoices
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-xl border border-gray-200 divide-y divide-gray-200">
        
        {/* Product Care */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. How do I take care of silver products?</h2>
          <p className="text-sm leading-relaxed">
            Store in a dry place, away from direct sunlight. Use a soft cloth or silver polish to clean occasionally. 
            Avoid water contact to prevent tarnishing.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">2. How do I maintain brass items?</h2>
          <p className="text-sm leading-relaxed">
            Wipe with a dry cloth after use. Use a mix of lemon juice and baking soda or commercial brass cleaner 
            to polish when dull.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. How should I clean wooden handicrafts?</h2>
          <p className="text-sm leading-relaxed">
            Dust with a soft cloth. Do not use water or wet cloths. Use furniture polish occasionally to maintain shine.
          </p>
        </div>

        {/* Packaging & Gifting */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. Is gift wrapping available?</h2>
          <p className="text-sm leading-relaxed">
            Yes, we offer gift wrapping and personalized notes at an additional charge. 
            Select the option at checkout or contact us directly.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">5. Will my order be safely packaged?</h2>
          <p className="text-sm leading-relaxed">
            Absolutely. All our items are packed securely using protective materials 
            to ensure they reach you in perfect condition.
          </p>
        </div>

        {/* Product Authenticity & Materials */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">6. Are your products handmade?</h2>
          <p className="text-sm leading-relaxed">
            Yes, all our items are handcrafted by skilled artisans using traditional techniques.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">7. Do you use pure silver or mixed alloys?</h2>
          <p className="text-sm leading-relaxed">
            We use genuine silver, typically in 92.5% purity unless specified. 
            Brass and wood used are also authentic and responsibly sourced.
          </p>
        </div>

        {/* Invoices & Taxes */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">8. Will I get an invoice with my order?</h2>
          <p className="text-sm leading-relaxed">
            Yes, a GST-compliant invoice is included with every order.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">9. Are taxes included in the product price?</h2>
          <p className="text-sm leading-relaxed">
            Yes, all applicable taxes are included in the listed prices unless stated otherwise.
          </p>
        </div>

      </div>
    </div>
  );
};

export default ProductCare;
