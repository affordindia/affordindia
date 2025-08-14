import React from 'react';

const PaymentPolicy = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Payments, Cash on Delivery & Refunds
        </h1>
      </div>

      <div className="bg-white shadow-md rounded-xl border border-gray-200 divide-y divide-gray-200">
        
        {/* Payment Methods */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. What payment methods do you accept?</h2>
          <p className="text-sm leading-relaxed">
            We accept the following payment methods:
          </p>
          <ul className="list-disc list-inside text-sm leading-relaxed mt-2">
            <li>Credit/Debit Cards</li>
            <li>Net Banking</li>
            <li>UPI (Google Pay, PhonePe, etc.)</li>
            <li>Wallets</li>
            <li>Cash on Delivery (India only)</li>
          </ul>
        </div>

        {/* COD */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">2. What is Cash on Delivery (COD)?</h2>
          <p className="text-sm leading-relaxed">
            COD lets you pay in cash at the time of delivery. No advance payment is required. 
            It’s available only in India.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. Is there a fee for COD?</h2>
          <p className="text-sm leading-relaxed">
            No, there are no additional charges for COD.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. Is COD available for international orders?</h2>
          <p className="text-sm leading-relaxed">
            No, COD is not available outside India. International orders must be prepaid.
          </p>
        </div>

        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">5. What currencies are accepted for COD?</h2>
          <p className="text-sm leading-relaxed">
            Only Indian Rupees (INR). Notes of ₹500 and ₹1,000 demonetized on 8th November 2016 will not be accepted.
          </p>
        </div>

        {/* Refunds */}
        <div className="p-6">
          <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">6. How will I receive a refund?</h2>
          <p className="text-sm leading-relaxed">
            Refunds for prepaid orders are made to the original payment method within 7–10 business days.
          </p>
          <p className="text-sm leading-relaxed mt-2">For COD refunds:</p>
          <ul className="list-disc list-inside text-sm leading-relaxed mt-2">
            <li>
              If you share a cancelled cheque, we’ll transfer the amount via NEFT within 7–15 business days.
            </li>
            <li>
              If no cancelled cheque is available / provided, we will courier a cheque in your name within 30 business days.
            </li>
          </ul>
        </div>

      </div>
    </div>
  );
};

export default PaymentPolicy;
