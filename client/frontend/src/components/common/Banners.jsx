import React, { useEffect, useState } from "react";
import { getBanners } from "../../api/banner.js";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

// Keen-slider autoplay plugin
function Autoplay({ interval = 3000, pauseOnHover = true } = {}) {
    return (slider) => {
        let timeout;
        let mouseOver = false;
        function clearNextTimeout() {
            clearTimeout(timeout);
        }
        function nextTimeout() {
            clearTimeout(timeout);
            if (mouseOver && pauseOnHover) return;
            timeout = setTimeout(() => {
                slider.next();
            }, interval);
        }
        slider.on("created", () => {
            slider.container.addEventListener("mouseover", () => {
                mouseOver = true;
                clearNextTimeout();
            });
            slider.container.addEventListener("mouseout", () => {
                mouseOver = false;
                nextTimeout();
            });
            nextTimeout();
        });
        slider.on("dragStarted", clearNextTimeout);
        slider.on("animationEnded", nextTimeout);
        slider.on("updated", nextTimeout);
    };
}

const Banners = () => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: { perView: 1 },
        },
        [Autoplay({ interval: 3500 })]
    );

    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true);
            try {
                const res = await getBanners();
                let arr = res?.banners || res || [];
                // Sort by 'order' field ascending
                arr = arr
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0));
                setBanners(arr);
            } catch {
                setBanners([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBanners();
    }, []);

    const goPrev = () => instanceRef.current && instanceRef.current.prev();
    const goNext = () => instanceRef.current && instanceRef.current.next();

    return (
        <section className="relative w-full">
            {loading ? (
                <div className="text-center py-8 text-gray-500">
                    Loading banners...
                </div>
            ) : !banners.length ? (
                <div className="text-center py-8 text-gray-500">
                    No banners found.
                </div>
            ) : (
                <div className="relative w-full">
                    {/* Left arrow */}
                    <button
                        onClick={goPrev}
                        className="absolute left-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-gray-300 rounded-full w-7 h-7 md:w-9 md:h-9 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors group"
                        aria-label="Previous"
                    >
                        <FaChevronLeft className="text-lg md:text-xl text-gray-700 group-hover:text-[#A89A3D] transition-colors" />
                    </button>

                    {/* keen-slider carousel */}
                    <div
                        ref={sliderRef}
                        className="keen-slider rounded-none overflow-hidden w-full"
                    >
                        {banners.map((banner) => (
                            <div
                                key={banner._id}
                                className="keen-slider__slide flex bg-gray-100 w-full"
                            >
                                {banner.image ? (
                                    <img
                                        src={banner.image}
                                        alt={banner.title || "Banner"}
                                        className="w-full object-fit"
                                    />
                                ) : (
                                    <div className="w-full flex items-center justify-center text-gray-400 bg-gray-200">
                                        No Image
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Right arrow */}
                    <button
                        onClick={goNext}
                        className="absolute right-2 top-1/2 -translate-y-1/2 z-10 bg-white/80 border border-gray-300 rounded-full w-7 h-7 md:w-9 md:h-9 flex items-center justify-center shadow-lg hover:bg-gray-100 transition-colors group"
                        aria-label="Next"
                    >
                        <FaChevronRight className="text-lg md:text-xl text-gray-700 group-hover:text-[#A89A3D] transition-colors" />
                    </button>
                </div>
            )}
        </section>
    );
};

export default Banners;
