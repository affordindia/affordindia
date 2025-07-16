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

const Banners = ({ material = "all" }) => {
    const [banners, setBanners] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentSlide, setCurrentSlide] = useState(0);
    const [sliderRef, instanceRef] = useKeenSlider(
        {
            loop: true,
            slides: { perView: 1 },
            slideChanged(s) {
                setCurrentSlide(s.track.details.rel);
            },
        },
        [Autoplay({ interval: 3500 })]
    );

    useEffect(() => {
        const fetchBanners = async () => {
            setLoading(true);
            try {
                const res = await getBanners();
                let arr = res?.banners || res || [];
                // Filter by material if not 'all'
                if (material && material !== "all") {
                    arr = arr.filter(
                        (b) =>
                            b.material?.toLowerCase() === material.toLowerCase()
                    );
                }
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
    }, [material]);

    const goTo = (idx) =>
        instanceRef.current && instanceRef.current.moveToIdx(idx);

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
                    {/* Dots below banner (show only on md and up) */}
                    {banners.length > 1 && (
                        <div className="hidden md:flex justify-center gap-2 my-3">
                            {banners.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => goTo(idx)}
                                    className={`w-2.5 h-2.5 rounded-full border border-gray-400 transition-all duration-200 focus:outline-none ${
                                        currentSlide === idx
                                            ? "bg-[#A89A3D] border-[#A89A3D] scale-110 shadow"
                                            : "bg-gray-200"
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            )}
        </section>
    );
};

export default Banners;
