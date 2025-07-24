import React from "react";
import { ThreeDot } from "react-loading-indicators";

const Loader = ({ size = "medium", fullScreen = false }) => {
    const containerClasses = fullScreen
        ? "min-h-screen flex items-center justify-center bg-gray-50"
        : "flex items-center justify-center py-8";

    return (
        <div className={containerClasses}>
            <ThreeDot variant="bounce" color="#C1B086" size={size} />
        </div>
    );
};

export default Loader;
