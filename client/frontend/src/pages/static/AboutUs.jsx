import React from "react";
import craft from "../../assets/crafts.webp"; // Assuming you have a craft image in your assets folder

const AboutUs = () => {
  return (
    <div className="bg-white text-gray-800">
      {/* Heading */}
      <section className="text-center py-12 px-4">
        <h1 className="text-3xl md:text-4xl font-bold">
          Welcome to Afford INDiA
        </h1>
        <p className="text-xl text-gray-600 mt-2">where Art comes Alive</p>
      </section>

      {/* Our Story */}
      <section className="bg-[#f9f7f5] py-10 px-4">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-7">
          <div className="md:w-1/2">
            <h2 className="text-2xl font-semibold mb-4">Our Story</h2>
            <p className="text-gray-700 text-sm leading-6">
              Afford India is more than a brand—it's a celebration of Indian
              craftsmanship made effortless for today. In choosing our
              creations, buyers step into a realm where aesthetic, handcrafted
              luxury meets everyday life, all while upholding the passion and
              traditions of age-old artisanal processes.
              <br />
              <br />
              Every piece in our collection is born of a spirit that embraces
              not just sheer heritage, passion, and design but the enduring
              authenticity of artisanship. From silver jewelry to wooden
              sculptures and brass artifacts, each soul holds timeless elegance,
              one that carries the essence of India’s rich cultural legacy.
              <br />
              <br />
              We believe that luxury should be inclusive. Our mission is to
              redefine “affordability” not as compromise, but as access—to
              indulge in exquisite, handcrafted excellence that speaks to the
              modern Indian soul.
            </p>
          </div>
          <div className="md:w-1/3">
            <img src={craft} alt="Craftsman" className="rounded-lg shadow-lg" />
          </div>
        </div>
      </section>

     {/* Core Values */}
<section className="bg-[#f1f0ed] py-12 px-6 md:px-20 text-center">
  <h2 className="text-2xl font-semibold mb-12">Our Core Values</h2>
  <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
    {[
      {
        icon: "❤️",
        title: "Authenticity",
        desc: "Championing the heritage and skill of Indian artisans through genuine craftsmanship.",
      },
      {
        icon: "⭐",
        title: "Aspirational Accessibility",
        desc: "Beautiful crafted products that feel special yet remain within reach.",
      },
      {
        icon: "💎",
        title: "Modern Indian Soul",
        desc: "Fusing timeless Indian motifs with clean, contemporary design.",
      },
      {
        icon: "🍃",
        title: "Conscious & Connected",
        desc: "Building sustainable connections between creators and consumers.",
      },
    ].map((val, idx) => (
      <div key={idx} className="flex flex-col items-center px-4">
        <div className="bg-[#e3d5d5] w-16 h-16 rounded-full flex items-center justify-center text-2xl text-[#B76E79] mb-4 shadow-sm">
          {val.icon}
        </div>
        <h3 className="font-semibold text-base mb-2">{val.title}</h3>
        <p className="text-sm text-gray-700">{val.desc}</p>
      </div>
    ))}
  </div>
</section>


      {/* Brand Personality */}
      <section className="py-12 px-4 text-center bg-white">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Brand Personality</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Warm & Elegant",
                desc: "Luxury with a welcoming charm rooted in culture-rich values.",
              },
              {
                title: "Rooted & Contemporary",
                desc: "Handcrafted tradition meets modern functionality and global relevance.",
              },
              {
                title: "Story Givers",
                desc: "Every piece has a story, a history, and a soul.",
              },
            ].map((trait, idx) => (
              <div
                key={idx}
                className="bg-[#f9f7f5] p-6 rounded shadow-sm min-h-[220px] w-[250px] mx-auto flex flex-col justify-center"
              >
                <h3 className="font-bold text-lg mb-2">{trait.title}</h3>
                <p className="text-sm text-gray-600">{trait.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Collection */}
      <section className="bg-white py-12 px-6 text-center">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-2xl font-semibold mb-8">Our Collection</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              {
                title: "Silver Jewelry",
                desc: "Elegant designs in silver, crafted with care and detail.",
                img: craft,
              },
              {
                title: "Brass Artifacts",
                desc: "Timeless brass pieces that bring home a touch of art and soul.",
                img: craft,
              },
              {
                title: "Wooden Home Décor",
                desc: "Intricately hand-carved décor pieces that breathe tradition.",
                img: craft,
              },
            ].map((item, idx) => (
              <div key={idx} className="bg-[#f9f7f5] p-4 rounded shadow-md">
                <img
                  src={item.img}
                  alt={item.title}
                  className="w-full h-48 object-cover rounded mb-4"
                />
                <h3 className="font-bold text-lg mb-2">{item.title}</h3>
                <p className="text-sm text-gray-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

{/* Our Mission */}
<section className="bg-[#9D5353] py-10 mx-4 md:mx-20 rounded-lg text-white text-center mt-12">
  <div className="max-w-xl mx-auto px-4">
    <h2 className="text-2xl md:text-3xl font-bold mb-4">Our Mission</h2>
    <p className="text-base md:text-lg font-light leading-relaxed">
      "To bridge the gap between traditional Indian craftsmanship and modern lifestyle, 
      making handcrafted luxury accessible while preserving our rich artisanal heritage 
      for future generations."
    </p>
  </div>
</section>






    </div>
  );
};

export default AboutUs;
