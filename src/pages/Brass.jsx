import React from "react";
import { Link } from "react-router-dom";

const Brass = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f5f1e8] px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-4">
        Coming Soon
      </h1>
      <p className="text-lg md:text-xl text-gray-600 mb-6 text-center">
        Our exquisite <span className="font-semibold">Brass Collection</span> is
        being crafted with care. Stay tuned for something beautiful!
      </p>
      <Link to="/">
        <button className="bg-[#1f1c2c] text-white px-6 py-2 rounded-md hover:bg-[#3b3754] transition">
          Back to Home
        </button>
      </Link>
    </div>
  );
};

export default Brass;
