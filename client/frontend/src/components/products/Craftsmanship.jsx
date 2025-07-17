import React from "react";
import video_thumbnail from "../../assets/video_thumbnail.jpg";

const Craftsmanship = () => {
    return (
        <div className="bg-[#F7F4EF] py-12 px-4 md:px-12">
            <h2 className="text-3xl font-semibold text-center mb-10">
                Craftsmanship Spotlight
            </h2>
            <div className="max-w-6xl mx-auto flex flex-col md:flex-row gap-8 items-center">
                <div className="relative w-full md:w-1/2">
                    <img
                        src={video_thumbnail}
                        alt="Craftsmanship"
                        className="rounded-md shadow object-cover aspect-video "
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <button className="bg-yellow-500 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl shadow-lg">
                            ▶
                        </button>
                    </div>
                </div>
                <div className="w-full md:w-1/2 text-md text-gray-700">
                    <h3 className="text-xl font-semibold mb-3">
                        The Art of Silver Rakhi Making
                    </h3>
                    <p className="mb-2">
                        Each silver rakhi is meticulously handcrafted by our
                        master artisans who have inherited generations of
                        silversmithing expertise. The process begins with
                        selecting the finest 92.5 sterling silver, which is then
                        shaped, engraved, and polished using traditional
                        techniques.
                    </p>
                    <p className="mb-2">
                        Our artisans pay special attention to every detail, from
                        the intricate patterns to the gemstone settings,
                        ensuring that each piece is not just a rakhi but a
                        timeless work of art that symbolizes the sacred bond
                        between siblings.
                    </p>
                    <a
                        href=""
                        className="text-sm text-[#404040] font-medium hover:underline"
                    >
                        Learn more about our craftsmanship →
                    </a>
                </div>
            </div>
        </div>
    );
};

export default Craftsmanship;
