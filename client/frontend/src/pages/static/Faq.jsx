import React, { useState } from "react";
import { Link } from "react-router-dom";

const Faq = () => {
  const [selectedCategory, setSelectedCategory] = useState("ordering");

  // Map category keys to display names
  const categoryTitles = {
  ordering: "Ordering & Payment",
  shipping: "Shipping & Returns",
  materials: "Materials & Craftsmanship",
  custom: "Custom Orders",
  };

  return (
    <div className="bg-[#f7f7f5] min-h-screen py-10 px-6 md:px-24 flex flex-col md:flex-row gap-10 justify-center items-start">
      {/* Left Box (Categories) */}
      <div className="bg-[#f4f1ea] w-full md:w-1/4 p-6 rounded shadow max-h-64 overflow-auto">
        <h2 className="font-semibold text-gray-700 text-lg mb-4">Categories</h2>
        <ul className="space-y-3 text-sm text-gray-800">
          <li>
            <button
              onClick={() => setSelectedCategory("ordering")}
              className="text-left w-full hover:underline font-medium text-black"
            >
              Ordering & Payment
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("shipping")}
              className="text-left w-full hover:text-[#B76E79]"
            >
              Shipping & Returns
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("materials")}
              className="text-left w-full hover:text-[#B76E79]"
            >
              Materials & Craftsmanship
            </button>
          </li>
          <li>
            <button
              onClick={() => setSelectedCategory("custom")}
              className="text-left w-full hover:text-[#B76E79]"
            >
              Custom Orders
            </button>
          </li>
        </ul>
      </div>

      {/* Right Box (FAQ Content) */}
      <div className="bg-white w-full md:w-3/4 p-6 rounded shadow">
        <h1 className="text-center text-xl font-semibold text-gray-800 mb-2">
          — FREQUENTLY ASKED QUESTIONS —
        </h1>

        {/* 🆕 Selected Category Title */}
        <h2 className="text-center text-lg font-bold text-gray-700 mb-6">
          {categoryTitles[selectedCategory]}
        </h2>

        <div className="space-y-6">
          {selectedCategory === "ordering" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                How do I place an order on your website?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Placing an order is simple! Browse our collections and select the items you wish to purchase. Click “Add to Cart” for each product. Once you’re ready, go to your cart and click “Checkout.” You’ll be guided through entering your shipping details and payment information. After confirming your order, you’ll receive an email confirmation with your order details and tracking information once shipped.
              </p>

              <h2 className="font-semibold italic text-gray-800 mb-1">
                What payment methods do you accept?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                We accept all major credit and debit cards (Visa, Mastercard, American Express, RuPay), UPI, Net Banking, and popular digital wallets. All payments are processed securely through trusted payment gateways.
              </p>

              <h2 className="font-semibold italic text-gray-800 mb-1">
                Is it safe to use my credit card on your website?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Absolutely! Our website uses industry-standard SSL encryption to protect your personal and payment information. We do not store your card details, and all transactions are processed through secure, PCI-compliant payment gateways.
              </p>
            </section>
          )}

          {selectedCategory === "shipping" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                Can I modify or cancel my order after it’s been placed?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                You may modify or cancel your order within 24 hours of placing it by contacting our customer support team. After this window, we begin processing your order to ensure timely delivery, and changes or cancellations may not be possible. For custom or made-to-order items, modifications or cancellations are not allowed once production has started.
              </p>

             
            </section>
          )}

          {selectedCategory === "product" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                How should I care for your products?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Each product comes with detailed care instructions. In general, we recommend storing your jewelry in a dry, cool place away from direct sunlight. Avoid contact with water, perfumes, and harsh chemicals. Clean your pieces gently with a soft cloth. For specific care tips, refer to the product page or the care card included with your order.
              </p>
            </section>
          )}

          {selectedCategory === "materials" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                What materials do you use?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                We use only high-quality, ethically sourced materials, including 925 sterling silver, brass. Our artisans are committed to sustainable practices and exceptional craftsmanship. Each product description lists the specific materials used.
              </p>
            </section>
          )}

          {selectedCategory === "custom" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                Can I request a custom order?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Yes! We love bringing your unique ideas to life. Please contact us with your design inspiration, preferred materials, and any special requests. Our team will work with you to create a one-of-a-kind piece, provide a quote, and guide you through the process from concept to delivery. Custom orders may require additional time for design and production.
              </p>
            </section>
          )}

          {/* Contact Box */}
          <div className="bg-[#f4f1ea] p-4 mt-8 rounded">
            <p className="text-sm text-gray-800 mb-2">
              <span className="italic">Still have questions?</span>
              <br />
              Our customer service team is here to help you with any inquiries
              you may have.
            </p>
            <Link
              to="/contact"
              className="bg-[#AB5461] text-white text-sm px-4 py-2 rounded inline-block text-center"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Faq;
