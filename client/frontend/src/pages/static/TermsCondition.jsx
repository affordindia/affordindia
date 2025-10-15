import React from "react";

const TermsCondition = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#B76E79] inline-block pb-1">
          Terms & Conditions
        </h1>
      </div>

      {/* Content Container */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* 1. Company Information */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              1. Company Information
            </h2>
            <p className="text-sm leading-relaxed mb-2">
              Afford India is a partnership firm based in Delhi, India, engaged in
              the sale of brass, silver, and aluminium products.
            </p>
            <p className="text-sm leading-relaxed">
              <strong>Contact Information:</strong>
              <br />
              Email:{" "}
              <a
                href="mailto:contact@affordindia.com"
                className="text-[#B76E79] underline"
              >
                contact@affordindia.com
              </a>
            </p>
          </div>

          {/* 2. Eligibility */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              2. Eligibility
            </h2>
            <p className="text-sm leading-relaxed">
              By using our Website, you confirm that you are at least 18 years
              old and capable of entering into a legally binding contract under
              Indian law.
            </p>
          </div>

          {/* 3. Product Information */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              3. Product Information
            </h2>
            <p className="text-sm leading-relaxed mb-2">
              We strive to display our products accurately. However, slight
              variations in color, texture, or finish may occur due to lighting,
              screen settings, or the handcrafted nature of certain items.
            </p>
            <p className="text-sm leading-relaxed">Silver Products: Genuine silver items made from 999 or 925 sterling silver.</p>
            <p className="text-sm leading-relaxed">Brass Products: High-quality handcrafted brass products.</p>
            <p className="text-sm leading-relaxed">Aluminium Products: Durable aluminium items.</p>
            <p className="text-sm leading-relaxed mt-2">
              Product descriptions, prices, and availability are subject to change without prior notice.
            </p>
          </div>

          {/* 4. Orders & Payments */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              4. Orders & Payments
            </h2>
            <p className="text-sm leading-relaxed">
              Orders can be placed directly through our Website. We accept Cash
              on Delivery (COD) and online payments through secure payment
              gateways. After placing an order, you will receive a confirmation
              email. We reserve the right to cancel or refuse any order if the
              product is unavailable, payment fails, or fraudulent activity is
              suspected.
            </p>
          </div>

          {/* 5. Shipping & Delivery */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              5. Shipping & Delivery
            </h2>
            <p className="text-sm leading-relaxed">
              We currently ship across India only. Orders are usually dispatched
              within 2–5 business days and delivered within 5–10 business days,
              depending on location. Delivery times may vary due to logistics,
              public holidays, or weather conditions. Please ensure shipping
              details are accurate. Afford India is not responsible for delays or
              losses due to incorrect addresses.
            </p>
          </div>

          {/* 6. Returns, Refunds & Exchanges */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              6. Returns, Refunds & Exchanges
            </h2>
            <p className="text-sm leading-relaxed">
              We value your satisfaction and take great care in quality and
              packaging. Returns or exchanges are accepted only for damaged,
              defective, or incorrect items received. Please notify us within 48
              hours of delivery by emailing{" "}
              <a
                href="mailto:contact@affordindia.com"
                className="text-[#B76E79] underline"
              >
                contact@affordindia.com
              </a>.
            </p>
          </div>

          {/* 7. Pricing & Taxes */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              7. Pricing & Taxes
            </h2>
            <p className="text-sm leading-relaxed">
              All prices are listed in Indian Rupees (INR) and include applicable
              taxes unless stated otherwise. Shipping charges (if applicable)
              will be displayed at checkout. Prices, discounts, and offers are
              subject to change without prior notice.
            </p>
          </div>

          {/* 8. Authenticity & Warranty */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              8. Authenticity & Warranty
            </h2>
            <p className="text-sm leading-relaxed">
              Silver Products: Guaranteed to be of 999 or 925 purity as mentioned.
              Brass & Aluminium Products: Crafted from genuine, high-quality
              materials. No extended warranties are provided unless explicitly
              mentioned on the product page.
            </p>
          </div>

          {/* 9. Intellectual Property */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              9. Intellectual Property
            </h2>
            <p className="text-sm leading-relaxed">
              All Website content—including text, graphics, product images,
              designs, and logos—is the intellectual property of Afford India.
              You may not reproduce, copy, distribute, or use any content without
              prior written permission.
            </p>
          </div>

          {/* 10. Limitation of Liability */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              10. Limitation of Liability
            </h2>
            <p className="text-sm leading-relaxed">
              Afford India shall not be held liable for any indirect, incidental,
              special, or consequential damages arising from the use or inability
              to use our Website or products, or for delays, errors, or
              interruptions in Website operations. Our total liability shall not
              exceed the total amount paid by you for the specific product in
              question.
            </p>
          </div>

          {/* 11. Governing Law & Jurisdiction */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              11. Governing Law & Jurisdiction
            </h2>
            <p className="text-sm leading-relaxed">
              These Terms are governed by and construed in accordance with the
              laws of India. All disputes are subject to the exclusive
              jurisdiction of the courts of Delhi, India.
            </p>
          </div>

          {/* 12. Changes to Terms */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              12. Changes to Terms
            </h2>
            <p className="text-sm leading-relaxed">
              We may update or revise these Terms periodically to reflect changes
              in our operations, products, or legal obligations. Updated Terms
              will be posted on this page with the latest Effective Date.
              Continued use of the Website constitutes acceptance of the revised
              Terms.
            </p>
          </div>

          {/* 13. Contact Us */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">
              13. Contact Us
            </h2>
            <p className="text-sm leading-relaxed">
              If you have any questions, feedback, or concerns, please contact us
              at:{" "}
              <a
                href="mailto:contact@affordindia.com"
                className="text-[#B76E79] underline"
              >
                contact@affordindia.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
