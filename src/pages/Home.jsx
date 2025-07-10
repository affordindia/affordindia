import React from "react";
import Slider from "react-slick";

// Assets
import hero1 from "../assets/hero.png";
import hero2 from "../assets/hero2.jpg";
import hero3 from "../assets/hero3.jpg";
import hero4 from "../assets/hero4.jpg";
import silverImg from "../assets/silver.png";
import brassImg from "../assets/brass.png";
import woodImg from "../assets/wood.png";
import productImg from "../assets/product1.png";
import lady from "../assets/lady.png";

// Styles
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import "../index.css";

// Reusable Material Card
const MaterialCard = ({ src, label, overlayColor }) => (
  <div className="relative w-[100px] h-[250px] overflow-hidden">
    <img src={src} alt={label} className="w-full h-full object-cover" />
    <div className={`absolute inset-0 ${overlayColor} opacity-40`} />
    <span className="absolute left-2 top-1/2 -translate-y-1/2 rotate-90 origin-right text-white text-lg font-semibold tracking-wide">
      {label}
    </span>
  </div>
);

const Home = () => {
  const sliderImages = [hero1, hero2, hero3, hero4];

  const materials = [
    { src: silverImg, label: "SILVER", overlayColor: "bg-black" },
    { src: brassImg, label: "BRASS", overlayColor: "bg-yellow-900" },
    { src: woodImg, label: "WOOD", overlayColor: "bg-orange-900" },
  ];

  const settings = {
    dots: true,
    infinite: true,
    autoplay: true,
    speed: 800,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    pauseOnHover: false,
  };

  return (
    <>
      {/* Hero Slider */}
      <div className="w-full aspect-[1920/560] relative pb-8 overflow-hidden">
        <Slider {...settings} className="w-full h-full custom-dots">
          {sliderImages.map((img, index) => (
            <div key={index} className="w-full h-full relative">
              <img
                src={img}
                alt={`Slide ${index + 1}`}
                className="w-full h-full object-cover"
              />
              {index === 0 && (
                <div className="absolute inset-0 flex flex-col justify-center px-4 lg:px-6 text-white">
                  <h1 className="text-3xl md:text-5xl font-semibold leading-tight">
                    Accessible <span className="font-bold">Luxury</span>
                    <br />
                    <span className="italic font-bold">
                      Rooted in Tradition
                    </span>
                  </h1>
                  <p className="mt-4 text-base md:text-lg max-w-2xl">
                    Every piece is thoughtfully handmade by skilled artisans,
                    celebrating India's rich heritage while ensuring
                    affordability. Discover elegant yet earthy treasures that
                    tell stories of generations-old craftsmanship.
                  </p>
                  <button className="mt-6 bg-[#f2ede4] text-black px-5 py-2 text-base font-semibold rounded-md transition duration-300 w-fit">
                    View Collection
                  </button>
                </div>
              )}
            </div>
          ))}
        </Slider>
      </div>

      {/* Explore Materials */}
      <section className="bg-[#fdf6e9] py-12 mt-12 text-center px-4">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          Explore Our Materials
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>
        <div className="flex flex-wrap gap-8 justify-center">
          {materials.map((mat, idx) => (
            <MaterialCard key={idx} {...mat} />
          ))}
        </div>
      </section>

      {/* Featured Section 1 */}
      <div className="py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          Explore Our Materials
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>
      </div>

      <section className="max-w-screen-xl mx-auto px-4 mt-6 mb-8 flex flex-col sm:flex-row flex-wrap justify-center gap-6 items-center">
        <div className="bg-white w-full sm:w-[160px] md:w-[180px] lg:w-[200px] h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden">
          <img
            src={productImg}
            alt="Left Product"
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="bg-gradient-to-r from-[#1f1c2c] to-[#928dab] text-white w-full sm:w-[500px] lg:w-[640px] h-[250px] flex items-center justify-center rounded-lg">
          <div className="text-center px-4 max-h-[250px] h-full flex flex-col justify-center items-center overflow-hidden">
            <h3 className="text-2xl font-semibold mb-2">New Arrivals</h3>
            <p className="mb-4 text-base">
              Discover our latest jewelry pieces,
              <br />
              crafted with excellence
            </p>
            <button className="bg-[#f2ede4] text-black px-4 py-1.5 text-sm font-semibold rounded-md transition duration-300">
              View Collection
            </button>
          </div>
        </div>
        <div className="bg-white w-full sm:w-[160px] md:w-[180px] lg:w-[200px] h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden">
          <img
            src={productImg}
            alt="Right Product"
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Grid Products 1 */}
      <section className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden"
          >
            <img
              src={productImg}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </section>

      {/* Featured Section 2 */}
      <div className="py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          Explore Our Materials
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>
      </div>

      <section className="max-w-screen-xl mx-auto px-4 mt-6 mb-8 flex flex-col sm:flex-row flex-wrap justify-center gap-6 items-center">
        <div className="bg-white w-full sm:w-[160px] md:w-[180px] lg:w-[200px] h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden">
          <img
            src={productImg}
            alt="Left Product"
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
        </div>
        <div className="bg-gradient-to-r from-[#1f1c2c] to-[#928dab] text-white w-full sm:w-[500px] lg:w-[640px] h-[250px] flex items-center justify-center rounded-lg">
          <div className="text-center px-4 max-h-[250px] h-full flex flex-col justify-center items-center overflow-hidden">
            <h3 className="text-2xl font-semibold mb-2">New Arrivals</h3>
            <p className="mb-4 text-base">
              Discover our latest jewelry pieces,
              <br />
              crafted with excellence
            </p>
            <button className="bg-[#f2ede4] text-black px-4 py-1.5 text-sm font-semibold rounded-md transition duration-300">
              View Collection
            </button>
          </div>
        </div>
        <div className="bg-white w-full sm:w-[160px] md:w-[180px] lg:w-[200px] h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden">
          <img
            src={productImg}
            alt="Right Product"
            className="w-full h-full object-contain p-3 hover:scale-105 transition-transform duration-300"
          />
        </div>
      </section>

      {/* Grid Products 2 */}
      <section className="max-w-screen-xl mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 pb-16">
        {[...Array(4)].map((_, index) => (
          <div
            key={index}
            className="bg-white h-[250px] flex items-center justify-center shadow-md rounded-lg mx-auto overflow-hidden"
          >
            <img
              src={productImg}
              alt={`Product ${index + 1}`}
              className="w-full h-full object-contain p-3 transition-transform duration-300 hover:scale-105"
            />
          </div>
        ))}
      </section>

      {/* Lady Products Section */}
      <section className="bg-[#f6f1eb] py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          You Might Also Like These Products
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>
        <div className="max-w-screen-xl mx-auto px-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {[
            { name: "Elegant Bangle", price: "₹799" },
            { name: "Classic Ring", price: "₹499" },
            { name: "Wooden Pendant", price: "₹649" },
            { name: "Silver Anklet", price: "₹899" },
            { name: "Brass Earrings", price: "₹599" },
          ].map((item, i) => (
            <div key={i} className="flex flex-col items-center">
              <img
                src={lady}
                alt={item.name}
                className="w-full h-[200px] object-cover rounded-md"
              />
              <p className="mt-2 text-sm font-medium text-gray-700">
                {item.name}
              </p>
              <p className="text-sm font-semibold text-black">{item.price}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Video & About Section */}
      <section className="py-12 px-4 flex flex-col md:flex-row justify-center items-center gap-8 max-w-[900px] mx-auto">
        {/* Video Placeholder */}
        <div className="w-[450px] h-[300px] bg-gray-400 flex items-center justify-center rounded-md shadow-md">
          <span className="text-white text-2xl font-semibold">VIDEO</span>
        </div>

        {/* About Text Box */}
        <div className="w-[550px] h-[300px] bg-white p-6 rounded-md shadow-md text-left">
          <p className="text-gray-800 text-base md:text-lg leading-relaxed">
            <strong>Afford India</strong> stands for accessible luxury rooted in
            traditional Indian craftsmanship. Every piece – be it silver
            jewellery, a brass artifact, or a wooden sculpture – is thoughtfully
            handmade by artisans. The brand celebrates India's rich artisanal
            heritage while ensuring affordability, making it elegant yet earthy.
          </p>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-[#e9e4dd] py-12 px-4 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-10 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          What Our Customers Say
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-screen-xl mx-auto">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-md shadow-md text-left"
            >
              <p className="text-sm mb-4">
                “The silver necklace I purchased from Vrisat is absolutely
                stunning. The craftsmanship is exceptional, and it has become my
                most treasured piece of jewelry.”
              </p>
              <p className="text-sm font-semibold text-gray-800 mb-1">
                ★ ★ ★ ★ ★
              </p>
              <p className="text-sm text-gray-600">
                Akash Singh
                <br />
                Mumbai
              </p>
              <p className="text-xs text-gray-500 mt-2">
                Posted on Jun 13, 2025
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;
