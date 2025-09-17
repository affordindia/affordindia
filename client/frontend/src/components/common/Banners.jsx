import React, { useMemo, useState, useCallback, useEffect } from "react";
import { Link } from "react-router-dom";
import { useAppData } from "../../context/AppDataContext.jsx";
import { useKeenSlider } from "keen-slider/react";
import "keen-slider/keen-slider.min.css";

// Improved Keen-slider autoplay plugin with better cleanup
function Autoplay({ interval = 3000, pauseOnHover = true } = {}) {
    return (slider) => {
        let timeout;
        let mouseOver = false;
        let isDestroyed = false;

        function clearNextTimeout() {
            if (timeout) {
                clearTimeout(timeout);
                timeout = null;
            }
        }

        function nextTimeout() {
            clearNextTimeout();
            if (isDestroyed || (mouseOver && pauseOnHover)) return;

            timeout = setTimeout(() => {
                if (
                    !isDestroyed &&
                    slider &&
                    typeof slider.next === "function"
                ) {
                    slider.next();
                }
            }, interval);
        }

        function handleMouseOver() {
            mouseOver = true;
            clearNextTimeout();
        }

        function handleMouseOut() {
            mouseOver = false;
            nextTimeout();
        }

        function handleDragStarted() {
            clearNextTimeout();
        }

        function handleAnimationEnded() {
            // Only restart timeout if not hovering and not destroyed
            if (!isDestroyed && !mouseOver) {
                clearNextTimeout();
                nextTimeout();
            }
        }

        function handleUpdated() {
            nextTimeout();
        }

        // Initialize autoplay
        slider.on("created", () => {
            if (isDestroyed) return;

            const container = slider.container;
            if (container) {
                container.addEventListener("mouseover", handleMouseOver);
                container.addEventListener("mouseout", handleMouseOut);
            }

            // Start autoplay after a reasonable delay
            setTimeout(() => {
                if (!isDestroyed) {
                    nextTimeout();
                }
            }, 300);
        });

        // Handle updates more carefully to avoid conflicts
        slider.on("updated", () => {
            if (!isDestroyed && !mouseOver) {
                // Clear any existing timeout first
                clearNextTimeout();
                // Only restart if not hovering
                setTimeout(() => {
                    if (!isDestroyed && !mouseOver) {
                        nextTimeout();
                    }
                }, 150);
            }
        });

        slider.on("dragStarted", handleDragStarted);
        slider.on("animationEnded", handleAnimationEnded);

        // Cleanup function
        slider.on("destroyed", () => {
            isDestroyed = true;
            clearNextTimeout();

            const container = slider.container;
            if (container) {
                container.removeEventListener("mouseover", handleMouseOver);
                container.removeEventListener("mouseout", handleMouseOut);
            }
        });

        // Return cleanup function for manual cleanup
        return () => {
            isDestroyed = true;
            clearNextTimeout();
        };
    };
}

const Banners = ({ material = "all" }) => {
    const [currentSlide, setCurrentSlide] = useState(0);
    const [isSliderReady, setIsSliderReady] = useState(false);
    const { getBannersByMaterial, loading } = useAppData();
    const banners = getBannersByMaterial(material);
    const isReady = Array.isArray(banners) && banners.length > 0 && !loading;

    // Create stable autoplay plugin with proper dependencies
    const autoplayPlugin = useMemo(() => {
        if (!isReady || banners.length <= 1) return null;
        return Autoplay({ interval: 3500, pauseOnHover: true });
    }, [isReady, banners.length]);

    // Create plugins array with proper dependencies
    const plugins = useMemo(() => {
        return autoplayPlugin ? [autoplayPlugin] : [];
    }, [autoplayPlugin]);

    // Slider configuration with proper dependencies
    const sliderConfig = useMemo(() => {
        if (!isReady) return undefined;

        return {
            loop: banners.length > 1,
            slides: { perView: 1 },
            created() {
                // Mark slider as ready when created
                setIsSliderReady(true);
            },
            slideChanged(slider) {
                setCurrentSlide(slider.track.details.rel);
            },
        };
    }, [isReady, banners.length]);

    // Initialize slider with proper cleanup
    const [sliderRef, instanceRef] = useKeenSlider(sliderConfig, plugins);

    // Stable goTo function
    const goTo = useCallback((idx) => {
        if (
            instanceRef.current &&
            typeof instanceRef.current.moveToIdx === "function"
        ) {
            instanceRef.current.moveToIdx(idx);
        }
    }, []);

    // Reset current slide when banners change
    useEffect(() => {
        setCurrentSlide(0);
        setIsSliderReady(false);
    }, [banners.length, material]);

    // Force slider update when data becomes ready (only once)
    useEffect(() => {
        if (isReady && instanceRef.current && !isSliderReady) {
            // Single update when data becomes ready
            const timer = setTimeout(() => {
                if (
                    instanceRef.current &&
                    typeof instanceRef.current.update === "function"
                ) {
                    instanceRef.current.update();
                }
            }, 200);

            return () => clearTimeout(timer);
        }
    }, [isReady, isSliderReady]);

    // Create a stable key for the slider container to force reinitialization when needed
    const sliderKey = useMemo(() => {
        return `${material}-${banners.length}-${banners
            .map((b) => b._id)
            .join("-")}-${loading ? "loading" : "ready"}`;
    }, [material, banners, loading]);

    return (
        <section className="relative w-full">
            {isReady && (
                <div className="relative w-full">
                    <div key={sliderKey}>
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
                                            {banner.image ||
                                            banner.mobileImage ? (
                                                <>
                                                    {/* Desktop Image */}
                                                    {banner.image && (
                                                        <img
                                                            src={banner.image}
                                                            alt={
                                                                banner.title ||
                                                                "Banner"
                                                            }
                                                            className="w-full object-cover hidden md:block"
                                                        />
                                                    )}
                                                    {/* Mobile Image */}
                                                    {banner.mobileImage && (
                                                        <img
                                                            src={
                                                                banner.mobileImage
                                                            }
                                                            alt={
                                                                banner.title ||
                                                                "Banner"
                                                            }
                                                            className="w-full object-cover block md:hidden"
                                                        />
                                                    )}
                                                    {/* Fallback: Show desktop image on mobile if no mobile image */}
                                                    {!banner.mobileImage &&
                                                        banner.image && (
                                                            <img
                                                                src={
                                                                    banner.image
                                                                }
                                                                alt={
                                                                    banner.title ||
                                                                    "Banner"
                                                                }
                                                                className="w-full object-cover block md:hidden"
                                                            />
                                                        )}
                                                    {/* Fallback: Show mobile image on desktop if no desktop image */}
                                                    {!banner.image &&
                                                        banner.mobileImage && (
                                                            <img
                                                                src={
                                                                    banner.mobileImage
                                                                }
                                                                alt={
                                                                    banner.title ||
                                                                    "Banner"
                                                                }
                                                                className="w-full object-cover hidden md:block"
                                                            />
                                                        )}
                                                </>
                                            ) : (
                                                <div className="w-full flex items-center justify-center text-gray-400 bg-gray-200">
                                                    No Image
                                                </div>
                                            )}
                                        </Link>
                                    ) : banner.image || banner.mobileImage ? (
                                        <>
                                            {/* Desktop Image */}
                                            {banner.image && (
                                                <img
                                                    src={banner.image}
                                                    alt={
                                                        banner.title || "Banner"
                                                    }
                                                    className="w-full object-cover hidden md:block"
                                                />
                                            )}
                                            {/* Mobile Image */}
                                            {banner.mobileImage && (
                                                <img
                                                    src={banner.mobileImage}
                                                    alt={
                                                        banner.title || "Banner"
                                                    }
                                                    className="w-full object-cover block md:hidden"
                                                />
                                            )}
                                            {/* Fallback: Show desktop image on mobile if no mobile image */}
                                            {!banner.mobileImage &&
                                                banner.image && (
                                                    <img
                                                        src={banner.image}
                                                        alt={
                                                            banner.title ||
                                                            "Banner"
                                                        }
                                                        className="w-full object-cover block md:hidden"
                                                    />
                                                )}
                                            {/* Fallback: Show mobile image on desktop if no desktop image */}
                                            {!banner.image &&
                                                banner.mobileImage && (
                                                    <img
                                                        src={banner.mobileImage}
                                                        alt={
                                                            banner.title ||
                                                            "Banner"
                                                        }
                                                        className="w-full object-cover hidden md:block"
                                                    />
                                                )}
                                        </>
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
                                    key={`dot-${idx}`}
                                    onClick={() => goTo(idx)}
                                    className={`w-2.5 h-2.5 rounded-full border border-gray-400 transition-all duration-200 focus:outline-none ${
                                        currentSlide === idx
                                            ? "bg-[#B76E79] scale-110 shadow"
                                            : "bg-gray-200"
                                    }`}
                                    aria-label={`Go to slide ${idx + 1}`}
                                    disabled={!instanceRef.current}
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
