import React from 'react';
import { Link } from 'react-router-dom';

const ExchangePolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Exchange Policy
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          
          {/* Intro */}
          <div className="p-6">
            <p className="text-sm leading-relaxed">
              At Afford India, your satisfaction is our top priority. We want you to feel absolutely delighted with every product you receive. And if something doesn’t feel quite right, we’re here to make your exchange experience smooth and worry-free
            </p>
          </div>

          {/* 1. Ordered the wrong size or changed your mind? */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              1. Ordered the wrong size or changed your mind?
            </h2>
            <p className="text-sm leading-relaxed">
              No worries! You can request a replacement or return of the unused product. Simply follow the instructions provided in our 
              <Link to="/returnpolicy" className="font-medium text-blue-600 underline">
                Return Policy
              </Link>
              section, and the Afford India team will assist you every step of the way.
            </p>
            
          </div>

          {/* 2. Received the wrong product? */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              2. Received the wrong product?
            </h2>
            <p className="text-sm leading-relaxed">
              We're truly sorry for the mix-up. If you've received an incorrect product, please do not use it and notify the Afford India team within 3 days of delivery. 
              We’ll arrange a pickup and ensure the correct product is delivered to your doorstep.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              To ensure a smooth process, please record a clear video while repacking the product for return. This video must show the condition of the item and the packaging process 
              and should be shared with the Afford India team for review before pickup.
            </p>
           
          </div>

          {/* 3. Products not eligible for return */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              3. Products not eligible for return
            </h2>
            <p className="text-sm leading-relaxed">
              Please note that customized and made-to-order jewellery is specially crafted just for you and hence cannot be returned, cancelled, or exchanged.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ExchangePolicy;
