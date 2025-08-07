import React from 'react';

const Shipping = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Title Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Shipping Policy
        </h1>
      </div>

      {/* Policy Card Container */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* 1 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. Shipping Coverage</h2>
            <p className="text-sm leading-relaxed">
              We currently ship to all major cities and towns across the country. International shipping is not available at this time.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#B76E79]">2. Processing Time</h2>
            <p className="text-sm leading-relaxed">
              All orders are processed within 1–3 business days. Orders are not shipped or delivered on weekends or holidays.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. Shipping Time</h2>
            <p className="text-sm leading-relaxed">
              Shipping time varies by location but generally takes between 3–7 business days from the date of dispatch.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. Shipping Charges</h2>
            <p className="text-sm leading-relaxed">
              Shipping charges are calculated at checkout and depend on the delivery location and weight of the package. Free shipping may be available for certain orders above a minimum amount.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">5. Order Tracking</h2>
            <p className="text-sm leading-relaxed">
              Once your order has shipped, you will receive an email with tracking details. You can use this information to track the status of your delivery.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">6. Contact Us</h2>
            <p className="text-sm leading-relaxed">
              If you have any questions about your order or shipping, please contact our support team at{' '}
              <span className="font-medium text-blue-600">support@example.com</span>.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Shipping;
