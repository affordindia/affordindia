import React from 'react';

const ReturnPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Title Section */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Return & Refund Policy
        </h1>
      </div>

      {/* Policy Card Container */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* 1 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. Returns</h2>
            <p className="text-sm leading-relaxed">
              Our return policy lasts 7 days. If 7 days have gone by since your purchase, unfortunately, we can't offer you a refund or exchange.
            </p>
            <p className="text-sm leading-relaxed mt-2">
              To be eligible for a return, your item must be unused and in the same condition that you received it. It must also be in the original packaging.
            </p>
          </div>

          {/* 2 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">2. Non-returnable Items</h2>
            <p className="text-sm leading-relaxed">
              Several types of goods are exempt from being returned, such as perishable goods, gift cards, downloadable software products, and personal care items.
            </p>
          </div>

          {/* 3 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. Refunds (if applicable)</h2>
            <p className="text-sm leading-relaxed">
              Once your return is received and inspected, we will notify you via email. If approved, your refund will be processed, and a credit will automatically be applied to your original method of payment within 7–10 business days.
            </p>
          </div>

          {/* 4 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. Late or Missing Refunds</h2>
            <p className="text-sm leading-relaxed">
              If you haven’t received a refund yet, first check your bank account. Then contact your credit card company. If you’ve done all of this and still haven’t received your refund, please contact us at{' '}
              <span className="font-medium text-blue-600">support@example.com</span>.
            </p>
          </div>

          {/* 5 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">5. Exchanges (if applicable)</h2>
            <p className="text-sm leading-relaxed">
              We only replace items if they are defective or damaged. If you need to exchange it for the same item, send us an email and ship your item to our warehouse address.
            </p>
          </div>

          {/* 6 */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">6. Shipping</h2>
            <p className="text-sm leading-relaxed">
              To return your product, you should mail it to: <br />
              <span className="font-medium">123, Main Street, Your City, Country</span>
            </p>
            <p className="text-sm leading-relaxed mt-2">
              You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReturnPolicy;
