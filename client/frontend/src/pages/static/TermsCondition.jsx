import React from 'react';

const TermsCondition = () => {
  return (
    <div className="max-w-5xl mx-auto px-6 py-12 text-[#1F1F1F]">
      {/* Page Title */}
      <div className="mb-10 text-center">
        <h1 className="text-3xl font-bold border-b-4 border-[#C1B086] inline-block pb-1">
          Terms & Condition
        </h1>
      </div>

      {/* Content Card */}
      <div className="bg-white shadow-md rounded-xl border border-gray-200">
        <div className="divide-y divide-gray-200">
          {/* 1. Introduction */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">1. Introduction</h2>
            <p className="text-sm leading-relaxed">
              This Privacy Policy explains how we collect, use, and protect your personal information when you use our website and services.
            </p>
          </div>

          {/* 2. Information We Collect */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">2. Information We Collect</h2>
            <p className="text-sm leading-relaxed">
              We may collect personal information such as your name, email address, phone number, billing and shipping address, and payment details when you place an order or register on our site.
            </p>
          </div>

          {/* 3. How We Use Your Information */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">3. How We Use Your Information</h2>
            <p className="text-sm leading-relaxed">
              We use your information to process transactions, provide customer support, send updates, and improve our services. Your information is not shared with third parties except as required to fulfill your order or comply with the law.
            </p>
          </div>

          {/* 4. Cookies */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">4. Cookies</h2>
            <p className="text-sm leading-relaxed">
              Our website uses cookies to enhance your browsing experience. You can choose to disable cookies in your browser settings, but this may affect the functionality of the site.
            </p>
          </div>

          {/* 5. Data Security */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">5. Data Security</h2>
            <p className="text-sm leading-relaxed">
              We implement appropriate security measures to protect your personal data from unauthorized access, disclosure, alteration, or destruction.
            </p>
          </div>

          {/* 6. Your Rights */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">6. Your Rights</h2>
            <p className="text-sm leading-relaxed">
              You have the right to access, correct, or delete your personal information. To exercise these rights, please contact us at{' '}
              <span className="font-medium text-blue-600">support@example.com</span>.
            </p>
          </div>

          {/* 7. Changes to This Policy */}
          <div className="p-6">
            <h2 className="font-semibold text-lg mb-2 text-[#4C4326]">7. Changes to This Policy</h2>
            <p className="text-sm leading-relaxed">
              We may update this Privacy Policy from time to time. Any changes will be posted on this page with an updated revision date.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsCondition;
