import React, { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

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
    const [currentSlide, setCurrentSlide] = useState(0);
    const { getBannersByMaterial } = useAppData();
    const banners = getBannersByMaterial(material);
    const isReady = Array.isArray(banners) && banners.length > 0;
    const autoplayPlugin = useMemo(() => Autoplay({ interval: 3500 }), []);
    const plugins = useMemo(
        () => (isReady && banners.length > 1 ? [autoplayPlugin] : []),
        [isReady, banners, autoplayPlugin]
    );
    const [sliderRef, instanceRef] = useKeenSlider(
        isReady
            ? {
                  loop: true,
                  slides: { perView: 1 },
                  slideChanged(s) {
                      setCurrentSlide(s.track.details.rel);
                  },
              }
            : undefined,
        isReady ? plugins : []
    );
    const goTo = (idx) =>
        instanceRef.current && instanceRef.current.moveToIdx(idx);

    return (
        <section className="relative w-full">
            {isReady && (
                <div className="relative w-full">
                    <div key={banners.map((b) => b._id).join("-")}>
                        <div
                            ref={sliderRef}
                            className="keen-slider rounded-none overflow-hidden w-full"
                        >
                            {banners.map((banner) => (
                                <div
                                    key={banner._id}
                                    className="keen-slider__slide flex bg-gray-100 w-full"
                                >
                                    {banner.link ? (
                                        <Link
                                            to={banner.link}
                                            style={{
                                                width: "100%",
                                                display: "block",
                                            }}
                                        >
                                            {banner.image ? (
                                                <img
                                                    src={banner.image}
                                                    alt={
                                                        banner.title || "Banner"
                                                    }
                                                    className="w-full object-cover"
                                                />
                                            ) : (
                                                <div className="w-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>
                                    ) : banner.image ? (
                                        <img
                                            src={banner.image}
                                            alt={banner.title || "Banner"}
                                            className="w-full object-cover"
                                        />
                                    ) : (
                                        <div className="w-full flex items-center justify-center text-gray-400 bg-gray-200">
                                            No Image
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>
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
