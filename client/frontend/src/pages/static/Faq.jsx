import React, { useState } from "react";
import { Link } from "react-router-dom";

const Faq = () => {
  const [selectedCategory, setSelectedCategory] = useState("ordering");

  // Map category keys to display names
  const categoryTitles = {
    ordering: "Ordering & Payment",
    shipping: "Shipping & Returns",
    product: "Product Care",
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
              onClick={() => setSelectedCategory("product")}
              className="text-left w-full hover:text-[#B76E79]"
            >
              Product Care
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
                You can place an order by browsing our collections, selecting the
                items you wish to purchase, and adding them to your cart...
              </p>

              <h2 className="font-semibold italic text-gray-800 mb-1">
                What payment methods do you accept?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                We accept all major credit cards (Visa, Mastercard...)...
              </p>

              <h2 className="font-semibold italic text-gray-800 mb-1">
                Is it safe to use my credit card on your website?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Yes, our website uses industry-standard SSL encryption...
              </p>
            </section>
          )}

          {selectedCategory === "shipping" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                Can I modify or cancel my order after it’s been placed?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                You can modify or cancel your order within 24 hours...
              </p>

              <h2 className="font-semibold italic text-gray-800 mb-1">
                Do you offer international shipping?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Yes, we ship to most countries worldwide...
              </p>
            </section>
          )}

          {selectedCategory === "product" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                How should I care for your products?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Detailed care instructions will be included...
              </p>
            </section>
          )}

          {selectedCategory === "materials" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                What materials do you use?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                We use high-quality, sustainable materials...
              </p>
            </section>
          )}

          {selectedCategory === "custom" && (
            <section>
              <h2 className="font-semibold italic text-gray-800 mb-1">
                Can I request a custom order?
              </h2>
              <p className="text-sm text-gray-700 mb-4">
                Yes! We welcome custom order inquiries...
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
