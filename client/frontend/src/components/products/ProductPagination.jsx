import React from "react";

const ProductPagination = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const getVisiblePages = () => {
        const delta = 2;
        const range = [];
        const rangeWithDots = [];

        for (
            let i = Math.max(2, currentPage - delta);
            i <= Math.min(totalPages - 1, currentPage + delta);
            i++
        ) {
            range.push(i);
        }

        if (currentPage - delta > 2) {
            rangeWithDots.push(1, "...");
        } else {
            rangeWithDots.push(1);
        }

        rangeWithDots.push(...range);

        if (currentPage + delta < totalPages - 1) {
            rangeWithDots.push("...", totalPages);
        } else {
            rangeWithDots.push(totalPages);
        }

        return rangeWithDots;
    };

    const visiblePages = getVisiblePages();

    return (
        <div className="mt-8 mb-6">
            <div className="flex flex-col items-center gap-4">
                {/* Page Info */}
                <p className="text-sm text-gray-600 font-medium">
                    Page {currentPage} of {totalPages}
                </p>

                {/* Pagination Controls */}
                <div className="flex items-center gap-1 sm:gap-2 flex-wrap justify-center">
                    {/* Previous Button */}
                    {currentPage > 1 && (
                        <button
                            className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-[#F7F4EF] hover:border-[#B76E79] transition-all duration-200 font-medium text-sm"
                            onClick={() => onPageChange(currentPage - 1)}
                        >
                            <span className="hidden sm:inline">Previous</span>
                            <span className="sm:hidden">←</span>
                        </button>
                    )}

                    {/* Page Numbers */}
                    <div className="flex items-center gap-1">
                        {visiblePages.map((page, index) => (
                            <React.Fragment key={index}>
                                {page === "..." ? (
                                    <span className="px-2 sm:px-3 py-2 text-gray-500 font-medium text-sm">
                                        ...
                                    </span>
                                ) : (
                                    <button
                                        className={`min-w-[36px] sm:min-w-[40px] px-2 sm:px-3 py-2 rounded-md font-medium transition-all duration-200 text-sm ${
                                            currentPage === page
                                                ? "bg-[#B76E79] text-white shadow-md"
                                                : "bg-white border border-gray-300 text-gray-700 hover:bg-[#F7F4EF] hover:border-[#B76E79] hover:text-[#B76E79]"
                                        }`}
                                        onClick={() => onPageChange(page)}
                                        disabled={currentPage === page}
                                    >
                                        {page}
                                    </button>
                                )}
                            </React.Fragment>
                        ))}
                    </div>

                    {/* Next Button */}
                    {currentPage < totalPages && (
                        <button
                            className="px-3 sm:px-4 py-2 rounded-md border border-gray-300 bg-white text-gray-700 hover:bg-[#F7F4EF] hover:border-[#B76E79] transition-all duration-200 font-medium text-sm"
                            onClick={() => onPageChange(currentPage + 1)}
                        >
                            <span className="hidden sm:inline">Next</span>
                            <span className="sm:hidden">→</span>
                        </button>
                    )}
                </div>

                {/* Progress indicator */}
                <div className="w-full max-w-xs bg-gray-200 rounded-full h-1.5">
                    <div
                        className="bg-[#B76E79] h-1.5 rounded-full transition-all duration-300"
                        style={{
                            width: `${(currentPage / totalPages) * 100}%`,
                        }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default ProductPagination;
