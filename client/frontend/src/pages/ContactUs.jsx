import React from "react";
import { FaPhoneAlt, FaEnvelope, FaClock } from "react-icons/fa";

const ContactUs = () => {
  return (
    <div className="bg-gray-50 py-12 px-6 md:px-12 lg:px-20">
      {/* Main Heading */}
      <h1 className="text-xl md:text-2xl font-bold text-center text-[#4b4a3f] mb-10">
        Welcome to afford INDIA, Where Arts Comes Alive
      </h1>

      <div className="max-w-5xl mx-auto bg-white shadow-md rounded-xl overflow-hidden grid grid-cols-1 md:grid-cols-2">
        {/* Left Section - Contact Info */}
        <div className="bg-[#B76E79] text-white p-8 flex flex-col justify-center space-y-6">
          <h2 className="text-2xl font-bold">Get in Touch</h2>
          <p className="text-gray-200 text-sm">
            Have questions or need support? We’re here to help you anytime.
          </p>

          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <FaPhoneAlt className="text-lg" />
              <span>+91 92115 01006</span>
            </div>
            <div className="flex items-center gap-3">
              <FaEnvelope className="text-lg" />
              <span>contact@affordindia.com</span>
            </div>
            <div className="flex items-center gap-3">
              <FaClock className="text-lg" />
              <span>Mon-Sat: 10:00 AM - 05:00 PM</span>
            </div>
          </div>
        </div>

        {/* Right Section - Form */}
        <div className="p-8">
          <h3 className="text-xl font-semibold mb-4 text-gray-800">
            Send Us a Message
          </h3>
          <form className="space-y-4">
            <input
              type="text"
              placeholder="Your Name"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f]"
            />
            <input
              type="email"
              placeholder="Your Email"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f]"
            />
            <textarea
              placeholder="Your Message"
              rows="4"
              className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4b4a3f]"
            ></textarea>

            <button
              type="submit"
              className="bg-[#B76E79] text-white w-full py-2 text-sm font-medium rounded-md hover:bg-[#333] transition"
            >
              Send Message
            </button>
          </form>
        </div>
      </div>

      {/* Bottom Sentence */}
      <p className="text-center text-sm text-gray-600 mt-8">
        Thank you for reaching out to us — we’ll get back to you shortly.
      </p>
    </div>
  );
};

export default ContactUs;
