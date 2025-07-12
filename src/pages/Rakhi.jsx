import React from 'react';
import { Link } from 'react-router-dom';
import { FaHeart, FaStar } from 'react-icons/fa';

import rakhiBanner from '../assets/Rakhi/Screenshot (153).png';
import rakhi1 from '../assets/Rakhi/rakhi1.png';
import rakhiVideo from '../assets/Rakhi/8811191-hd_1920_1080_25fps.mp4';

const products = [
  {
    id: 1,
    title: "Royal Silver Rakhi with Ruby",
    price: "₹2,499",
    rating: 4.8,
    reviews: 380,
    image: rakhi1,
    description: "Elegant royal Rakhi with intricate silver and ruby embellishments.",
    stock: 10,
    tags: ["Royal", "Ruby", "Premium"]
  },
  {
    id: 2,
    title: "Antique Silver Rakhi",
    price: "₹1,799",
    rating: 4.6,
    reviews: 250,
    image: rakhi1,
    description: "Antique style Rakhi with classic silver motifs.",
    stock: 15,
    tags: ["Antique", "Traditional"]
  },
  {
    id: 3,
    title: "Silver Rakhi with Emerald",
    price: "₹2,999",
    rating: 4.9,
    reviews: 420,
    image: rakhi1,
    description: "Premium Rakhi adorned with genuine emerald stones.",
    stock: 8,
    tags: ["Emerald", "Luxury"]
  },
  {
    id: 4,
    title: "Traditional Silver Rakhi",
    price: "₹1,899",
    rating: 4.7,
    reviews: 310,
    image: rakhi1,
    description: "Classic traditional design with intricate silver work.",
    stock: 12,
    tags: ["Traditional", "Classic"]
  },
  {
    id: 5,
    title: "Minimalist Silver Rakhi",
    price: "₹1,299",
    rating: 4.3,
    reviews: 180,
    image: rakhi1,
    description: "Simple yet elegant silver Rakhi for a minimal look.",
    stock: 20,
    tags: ["Minimalist", "Modern"]
  },
  {
    id: 6,
    title: "Contemporary Silver Rakhi",
    price: "₹1,599",
    rating: 4.4,
    reviews: 200,
    image: rakhi1,
    description: "Modern design Rakhi with geometric patterns.",
    stock: 18,
    tags: ["Contemporary", "Stylish"]
  },
];

const Rakhi = () => {
  return (
    <>
      {/* Hero Banner */}
      <div className="relative w-full aspect-[1920/560] overflow-hidden">
        <img
          src={rakhiBanner}
          alt="Raksha Bandhan Banner"
          className="w-full h-full object-cover"
        />
      </div>

      {/* Products Grid */}
      <section className="py-6 px-4 max-w-7xl mx-auto mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 justify-items-center">
          {products.map((product) => (
            <Link
              to={`/product/${product.id}`}
              key={product.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition relative w-[280px] cursor-pointer"
            >
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.title}
                  className="w-full h-48 object-cover"
                />
                <button
                  onClick={(e) => e.preventDefault()}
                  className="absolute top-3 right-3 text-gray-500 hover:text-red-600 text-xl"
                >
                  <FaHeart />
                </button>
              </div>

              <div className="p-3">
                <h3 className="text-base font-semibold text-gray-800 mb-1">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                <div className="flex flex-wrap gap-1 mb-2">
                  {product.tags.map((tag, idx) => (
                    <span
                      key={idx}
                      className="text-xs bg-gray-200 px-2 py-0.5 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-gray-700">
                  <span>{product.price}</span>
                  <span className="flex items-center gap-1">
                    <FaStar className="text-yellow-500" />
                    {product.rating} | {product.reviews}
                  </span>
                </div>
                <div className="text-xs text-green-600 mt-1">
                  {product.stock > 0 ? `${product.stock} in stock` : `Out of stock`}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* The Design Journey Section */}
      <section className="max-w-5xl mx-auto mt-16 p-6 border rounded-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-6">
          The Design Journey
        </h2>
        <div className="flex flex-col relative ml-4">
          {[
            {
              title: "Concept & Inspiration",
              desc: "Our designers draw inspiration from traditional Indian motifs and contemporary trends to create unique designs.",
            },
            {
              title: "Material Selection",
              desc: "Only the finest 92.5 sterling silver and ethically sourced gemstones are selected for our rakhis.",
            },
            {
              title: "Artisan Craftsmanship",
              desc: "Each rakhi is meticulously handcrafted by our skilled artisans using techniques passed down through generations.",
            },
            {
              title: "Quality Assurance",
              desc: "Every piece undergoes rigorous quality checks to ensure it meets our exacting standards.",
            },
          ].map((item, index, arr) => (
            <div key={index} className="flex items-start gap-4 mb-8 relative">
              {index !== arr.length - 1 && (
                <div className="absolute left-4 top-8 h-[45px] w-px bg-gray-400 z-0" />
              )}
              <div className="relative z-10">
                <div className="w-8 h-8 rounded-full bg-white border-2 border-gray-400 flex items-center justify-center font-semibold text-gray-800">
                  {index + 1}
                </div>
              </div>
              <div>
                <h3 className="font-bold">{item.title}</h3>
                <p className="text-gray-600 text-sm">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Craftsmanship Spotlight Section */}
      <section className="max-w-5xl mx-auto mt-16 p-6 rounded-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Craftsmanship Spotlight
        </h2>
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="flex-shrink-0 w-full md:w-1/2">
            <div className="relative rounded-md overflow-hidden">
              <video
                src={rakhiVideo}
                controls
                className="w-full h-auto object-cover"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
          <div className="md:w-1/2">
            <h3 className="text-xl font-semibold mb-2">
              The Art of Silver Rakhi Making
            </h3>
            <p className="text-gray-700 text-sm mb-4">
              Each silver rakhi is meticulously handcrafted by our master artisans who have inherited generations of silversmithing expertise. The process begins with selecting the finest 92.5 sterling silver, which is then shaped, engraved, and polished using traditional techniques.
            </p>
            <p className="text-gray-700 text-sm">
              Our artisans pay special attention to every detail, from the intricate patterns to the gemstone settings, ensuring that each piece is not just a rakhi but a timeless work of art that symbolizes the sacred bond between siblings.
            </p>
            <a href="#" className="text-blue-600 text-sm mt-4 inline-block">
              Learn more about our craftsmanship →
            </a>
          </div>
        </div>
      </section>

      {/* Why Choose Silver Rakhis Section */}
      <section className="max-w-5xl mx-auto mt-16 p-6 border rounded-md">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8">
          Why Choose Silver Rakhis
        </h2>
        <div className="flex flex-col md:flex-row justify-center gap-6">
          <div className="bg-[#65647B] text-white rounded-lg shadow-md px-6 py-8 flex-1 max-w-[250px] min-h-[150px] text-center">
            <h3 className="text-lg font-bold mb-2">Lasting Symbol</h3>
            <p className="text-sm">
              Unlike thread rakhis, silver rakhis are durable and can be preserved as a lasting symbol of your bond.
            </p>
          </div>
          <div className="bg-[#65647B] text-white rounded-lg shadow-md px-6 py-8 flex-1 max-w-[250px] min-h-[150px] text-center">
            <h3 className="text-lg font-bold mb-2">Artisan Crafted</h3>
            <p className="text-sm">
              Each piece is meticulously handcrafted by skilled artisans using traditional techniques passed down through generations.
            </p>
          </div>
          <div className="bg-[#65647B] text-white rounded-lg shadow-md px-6 py-8 flex-1 max-w-[250px] min-h-[150px] text-center">
            <h3 className="text-lg font-bold mb-2">Premium Gift</h3>
            <p className="text-sm">
              Silver rakhis make for an elegant and premium gift that your brother will cherish for years to come.
            </p>
          </div>
        </div>
      </section>
    </>
  );
};

export default Rakhi;
