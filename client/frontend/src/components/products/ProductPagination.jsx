import React from "react";

const ProductPagination = ({ total, limit, page, onPageChange }) => {
    if (total <= limit) return null;
    const pageCount = Math.ceil(total / limit);
    return (
        <div className="flex justify-center mt-6 gap-2">
            {Array.from({ length: pageCount }, (_, i) => (
                <button
                    key={i + 1}
                    className={`px-3 py-1 rounded border ${
                        page === i + 1
                            ? "bg-blue-500 text-white"
                            : "bg-white text-blue-500"
                    }`}
                    onClick={() => onPageChange(i + 1)}
                    disabled={page === i + 1}
                >
                    {i + 1}
                </button>
            ))}
        </div>
    );
};

export default ProductPagination;
