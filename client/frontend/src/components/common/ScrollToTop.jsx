import { useEffect } from "react";

const ScrollToTop = () => {
    useEffect(() => {
        // Scroll to top when component mounts
        window.scrollTo({
            top: 0,
            left: 0,
            // behavior: 'smooth'
        });
    }, []);

    // This component doesn't render anything
    return null;
};

export default ScrollToTop;
