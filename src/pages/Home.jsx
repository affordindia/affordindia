
import React from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import { useProductContext } from "../context/ProductContext";

// Assets
import hero1 from "../assets/Home/hero.png";
import hero2 from "../assets/Home/hero2.jpg";
import hero3 from "../assets/Home/hero3.jpg";
import hero4 from "../assets/Home/hero4.jpg";
import silverImg from "../assets/Home/silver.png";
import brassImg from "../assets/Home/brass.png";
import woodImg from "../assets/Home/wood.png";
import prod1 from "../assets/Home/lady.png";

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
  const { products } = useProductContext();

  const sliderImages = [hero1, hero2, hero3, hero4];

  const materials = [
    { src: silverImg, label: "SILVER", overlayColor: "bg-black" },
    { src: brassImg, label: "BRASS", overlayColor: "bg-yellow-900" },
    { src: woodImg, label: "WOOD", overlayColor: "bg-orange-900" },
  ];

  const suggestedProducts = [
    {
      id: 1,
      name: "Elegant Pearl Necklace",
      price: 500,
      image: prod1,
    },
    {
      id: 2,
      name: "Classic Silver Chain",
      price: 500,
      image: prod1,
    },
    {
      id: 3,
      name: "Golden Drop Earrings",
      price: 500,
      image: prod1,
    },
    {
      id: 4,
      name: "Vintage Gold Necklace",
      price: 500,
      image: prod1,
    },
    {
      id: 5,
      name: "Minimalist Bracelet",
      price: 500,
      image: prod1,
    },
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
    {materials.map((mat) => (
      <Link to="/silver">
  <MaterialCard {...mat} />
</Link>
    ))}
  </div>
</section>


      {/* New Arrivals & Featured Products Heading */}
      <section className="text-center mt-16">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase tracking-wide relative inline-block">
          <span className="inline-block border-t border-gray-400 w-10 mr-4 align-middle" />
          FEATURED PRODUCTS
          <span className="inline-block border-t border-gray-400 w-10 ml-4 align-middle" />
        </h2>
      </section>

      {/* Product Grid */}
      <section className="max-w-screen-xl mx-auto px-6 mb-12 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products[0] && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={products[0].image}
                alt={products[0].title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {products[0].title}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">₹{products[0].price}</p>
                  <p className="text-yellow-500 text-sm">
                    {"★".repeat(Math.floor(products[0].rating))}
                    <span className="text-gray-500 ml-1">
                      ({products[0].rating})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* New Arrivals */}
          <div className="bg-gradient-to-r from-[#1f1c2c] to-[#928dab] text-white rounded-lg shadow-md overflow-hidden flex flex-col justify-center items-center p-4 sm:col-span-2">
            <h1 className="text-3xl font-semibold mb-1">New Arrivals</h1>
            <p className="mb-2 text-xl text-center">
              Discover our latest jewelry pieces,
              <br />
              crafted with excellence
            </p>
            <button className="bg-[#f2ede4] text-black px-6 py-3 text-base font-semibold rounded-md transition duration-300">
              View Collection
            </button>
          </div>

          {/* Second Product */}
          {products[1] && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={products[1].image}
                alt={products[1].title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold text-gray-800">
                  {products[1].title}
                </h3>
                <p className="text-sm text-gray-600">{products[1].price}</p>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(products[1].rating))}{" "}
                  <span className="text-gray-500 ml-1">
                    ({products[1].rating})
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Remaining Products */}
          {products.slice(2, 12).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden mt-6"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3">
                <h3 className="text-sm font-semibold text-gray-800 mb-1">
                  {product.title}
                </h3>
                <div className="flex justify-between items-center">
                  <p className="text-sm text-gray-600">₹{product.price}</p>
                  <p className="text-yellow-500 text-sm">
                    {"★".repeat(Math.floor(product.rating))}
                    <span className="text-gray-500 ml-1">
                      ({product.rating})
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

     

      {/* Product Grid */}
      <section className="max-w-screen-xl mx-auto px-6 mb-12 mt-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {/* First Product */}
          {products[0] && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={products[0].image}
                alt={products[0].title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold text-gray-800">
                  {products[0].title}
                </h3>
                <p className="text-sm text-gray-600">{products[0].price}</p>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(products[0].rating))}{" "}
                  <span className="text-gray-500 ml-1">
                    ({products[0].rating})
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* New Arrivals */}
          <div className="bg-gradient-to-r from-[#1f1c2c] to-[#928dab] text-white rounded-lg shadow-md overflow-hidden flex flex-col justify-center items-center p-4 sm:col-span-2">
            <h1 className="text-3xl font-semibold mb-1">Featured Products</h1>
            <p className="mb-2 text-xl text-center">
              Discover our latest jewelry pieces,
              <br />
              crafted with excellence
            </p>
            <button className="bg-[#f2ede4] text-black px-6 py-3 text-base font-semibold rounded-md transition duration-300">
              View Collection
            </button>
          </div>

          {/* Second Product */}
          {products[1] && (
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <img
                src={products[1].image}
                alt={products[1].title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold text-gray-800">
                  {products[1].title}
                </h3>
                <p className="text-sm text-gray-600">{products[1].price}</p>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(products[1].rating))}{" "}
                  <span className="text-gray-500 ml-1">
                    ({products[1].rating})
                  </span>
                </p>
              </div>
            </div>
          )}

          {/* Remaining Products */}
          {products.slice(2, 12).map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden mt-6"
            >
              <img
                src={product.image}
                alt={product.title}
                className="w-full h-[250px] object-cover hover:scale-105 transition-transform duration-300"
              />
              <div className="p-3 text-left">
                <h3 className="text-sm font-semibold text-gray-800">
                  {product.title}
                </h3>
                <p className="text-sm text-gray-600">{product.price}</p>
                <p className="text-yellow-500 text-sm">
                  {"★".repeat(Math.floor(product.rating))}{" "}
                  <span className="text-gray-500 ml-1">({product.rating})</span>
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* You Might Also Like These Products */}
      <section className="bg-[#f6f1eb] py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          You Might Also Like These Products
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>

        <div className="flex flex-wrap justify-center gap-14 px-5">
          {suggestedProducts.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg shadow-md overflow-hidden w-[160px] sm:w-[180px]"
            >
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-[180px] object-cover"
              />
              <div className="p-2 text-left">
                <h3 className="text-sm font-medium text-gray-800">
                  {product.name}
                </h3>
                <p className="text-sm text-gray-600">₹{product.price}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Brand Video & About Section */}
      <section className="py-12 px-4 flex flex-col md:flex-row justify-center items-center gap-6 max-w-5xl mx-auto">
        {/* Video Placeholder */}
        <div className="w-[220px] h-[250px] bg-gray-400 flex items-center justify-center rounded-md shadow-md">
          <span className="text-white text-lg font-semibold">VIDEO</span>
        </div>

        {/* Brand Description */}
        <div className="bg-white w-[340px] h-[250px] shadow-md rounded-md p-4 max-w-md text-left text-gray-800 text-md leading-relaxed">
          <p>
            <strong>Afford India</strong> stands for accessible luxury rooted in
            traditional Indian craftsmanship. Every piece – be it silver
            jewellery, a brass artifact, or a wooden sculpture – is thoughtfully
            handmade by artisans. The brand celebrates India’s rich artisanal
            heritage while ensuring affordability, making it elegant yet earthy.
          </p>
        </div>
      </section>

      {/* Customer Testimonials */}
      <section className="bg-[#f6f1eb] py-12 text-center">
        <h2 className="text-xl md:text-2xl font-bold text-gray-800 uppercase mb-8 tracking-wide relative">
          <span className="inline-block border-t border-gray-400 w-10 mr-4" />
          What Our Customers Say
          <span className="inline-block border-t border-gray-400 w-10 ml-4" />
        </h2>

        <div className="flex flex-wrap justify-center gap-6 px-4">
          {[1, 2, 3].map((id) => (
            <div
              key={id}
              className="bg-white shadow-md rounded-lg p-4 max-w-xs text-left"
            >
              <p className="text-sm italic mb-2">
                “The silver necklace I purchased from Vrisat is absolutely
                stunning. The craftsmanship is exceptional, and it’s become my
                most treasured piece of jewelry.”
              </p>
              <p className="text-yellow-500 text-sm">★★★★★</p>
              <p className="mt-2 text-sm font-semibold">Akash Singh</p>
              <p className="text-xs text-gray-500">Mumbai</p>
              <p className="text-xs text-gray-400 mt-1">
                Posted on Jun 12, 2025
              </p>
            </div>
          ))}
        </div>
      </section>
    </>
  );
};

export default Home;  