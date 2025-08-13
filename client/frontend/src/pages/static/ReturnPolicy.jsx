import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Return Policy – Afford India
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">

          {/* Intro */}
          <div className="p-6">
            <p className="text-sm leading-relaxed">
              We understand that sometimes things don’t go as planned, and we’re here to help you with an easy and transparent return process.
            </p>
          </div>

          {/* How to Return */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. How do I return my order?</h2>
            <ul className="list-decimal list-inside text-sm leading-relaxed space-y-2">
              <li>Contact us within <strong>3 days</strong> of receiving your product via phone or email.</li>
              <li>Pack the item securely in its original box along with the invoice, product tags, and any authenticity cards.</li>
              <li>While packing the product, please record a <strong>clear video</strong> showing the item condition and the complete repacking process. This video must be shared with the Afford India team and is mandatory for return processing.</li>
              <li>Our logistics partner will coordinate the pickup from your location.</li>
              <li>Once the item passes our <strong>Quality Check</strong>, we will initiate a refund or replacement, as per your preference.</li>
            </ul>
          </div>

          {/* International Orders */}
          <div className="p-6">
            <p className="text-sm leading-relaxed">
              <strong>Note for International Customers:</strong> Please refer to the “International Orders” section for return eligibility and process.
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
