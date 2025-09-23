import React from 'react';

const ShippingDelivery = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Shipping & Delivery
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-xl border border-gray-200 divide-y divide-gray-200">
        
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. What are the shipping charges?</h2>
          <p className="text-sm leading-relaxed">
            Shipping is <strong>free within India.</strong>
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">2. How long will it take to receive my order?</h2>
          <p className="text-sm leading-relaxed">
            Delivery within India usually takes <strong>5–8 business days</strong>.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. Can I track my order?</h2>
          <p className="text-sm leading-relaxed">
            Yes, once your order is dispatched, you will receive a tracking link via email or SMS.
          </p>
        </div>

        

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. What happens if my order is delayed or lost?</h2>
          <p className="text-sm leading-relaxed">
            In case of delays or lost parcels, we initiate a tracking process. If the item is not
            located within <strong>15 days</strong>, we will issue a refund to your original payment
            method.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ShippingDelivery;
