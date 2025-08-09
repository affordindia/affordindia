import React from "react";

const Loader = ({
    size = "medium",
    fullScreen = false,
    text = "Loading...",
}) => {
    const sizeClasses = {
        small: "w-4 h-4",
        medium: "w-8 h-8",
        large: "w-12 h-12",
    };

    const LoadingSpinner = () => (
        <div className="flex flex-col items-center justify-center">
            <div
                className={`${sizeClasses[size]} border-4 border-admin-bg border-t-admin-primary rounded-full animate-spin`}
            ></div>
            {text && (
                <p className="mt-2 text-sm text-gray-600 font-montserrat">
                    {text}
                </p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white bg-opacity-75 flex items-center justify-center z-50">
                <LoadingSpinner />
            </div>
        );
    }

    return <LoadingSpinner />;
};

export default Loader;
