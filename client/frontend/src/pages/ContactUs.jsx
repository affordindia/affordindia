import React from "react";

const ContactUs = () => {
  return (
    <div className="bg-white text-gray-800 py-8 px-4 md:px-0 max-w-md mx-auto">
      <h1 className="text-xl font-semibold mb-4 text-left">Contact Us</h1>

      <div className="text-center text-sm space-y-1 mb-6">
        <p>📞 Phone: +91 00000 00000</p>
        <p>✉️ Email: support@affordindia.com</p>
        <p>Mon-Sat: 10:00 AM - 05:00 PM</p>
      </div>

      <form className="space-y-4">
        <p className="font-medium">Got Any Questions ?</p>
        <input
          type="text"
          placeholder="Name"
          className="w-full border border-gray-300 px-3 py-2 text-sm"
        />
        <input
          type="email"
          placeholder="Email"
          className="w-full border border-gray-300 px-3 py-2 text-sm"
        />
        <textarea
          placeholder="Comment or Message"
          className="w-full border border-gray-300 px-3 py-2 text-sm"
          rows={3}
        ></textarea>

        <button
          type="submit"
          className="bg-[#4b4a3f] text-white px-4 py-2 text-sm hover:bg-[#333]"
        >
          SUBMIT
        </button>
      </form>
    </div>
  );
};

export default ContactUs;
