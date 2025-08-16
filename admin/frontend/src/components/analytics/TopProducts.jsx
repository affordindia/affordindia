import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBox } from "react-icons/fa";
import AnalyticsCard from "./AnalyticsCard";

const TopProducts = ({ data, loading = false }) => {
    const navigate = useNavigate();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-IN", {
            style: "currency",
            currency: "INR",
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <AnalyticsCard title="Top Performing Products">
                <div className="animate-pulse space-y-4">
                    {[1, 2, 3, 4, 5].map((i) => (
                        <div key={i} className="flex items-center space-x-3">
                            <div className="w-12 h-12 bg-admin-border rounded-lg"></div>
                            <div className="flex-1">
                                <div className="h-4 bg-admin-border rounded w-3/4 mb-2"></div>
                                <div className="h-3 bg-admin-border rounded w-1/2"></div>
                            </div>
                        </div>
                    ))}
                </div>
            </AnalyticsCard>
        );
    }

    if (!data?.length) {
        return (
            <AnalyticsCard title="Top Performing Products">
                <div className="flex items-center justify-center py-8 text-admin-text-secondary">
                    No product data available
                </div>
            </AnalyticsCard>
        );
    }

    return (
        <AnalyticsCard title="Top Performing Products">
            <div className="space-y-4">
                {data.slice(0, 10).map((product, index) => (
                    <div
                        key={product.id}
                        className="flex items-center space-x-4 p-3 bg-admin-bg rounded-lg border border-admin-border hover:border-admin-primary cursor-pointer transition-all duration-200 hover:scale-105"
                        onClick={() => navigate(`/products/view/${product.id}`)}
                    >
                        {/* Rank */}
                        <div className="flex-shrink-0 w-8 h-8 bg-admin-primary text-white rounded-full flex items-center justify-center text-sm font-bold">
                            {index + 1}
                        </div>

                        {/* Product Image */}
                        <div className="flex-shrink-0 w-12 h-12 bg-admin-border rounded-lg flex items-center justify-center overflow-hidden">
                            {product.image ? (
                                <img
                                    src={
                                        typeof product.image === "string"
                                            ? product.image
                                            : product.image.url || product.image
                                    }
                                    alt={product.name}
                                    className="w-full h-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = "none";
                                        e.target.nextSibling.style.display =
                                            "flex";
                                    }}
                                />
                            ) : null}
                            <FaBox
                                className="w-5 h-5 text-admin-text-muted"
                                style={{
                                    display: product.image ? "none" : "flex",
                                }}
                            />
                        </div>

                        {/* Product Info */}
                        <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-admin-text truncate">
                                {product.name}
                            </h4>
                            <p className="text-sm text-admin-text-secondary">
                                Category: {product.category || "Uncategorized"}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="text-right">
                            <div className="font-semibold text-admin-text">
                                {formatCurrency(product.revenue)}
                            </div>
                            <div className="text-sm text-admin-text-secondary">
                                {product.sales} sales
                            </div>
                            <div className="text-xs text-admin-text-secondary">
                                ₹{product.price} each
                            </div>
                        </div>

                        {/* Performance Indicator */}
                        <div className="flex-shrink-0">
                            <div className="w-2 h-12 bg-admin-border rounded-full overflow-hidden">
                                <div
                                    className="bg-gradient-to-t from-admin-primary to-admin-primary-light w-full rounded-full"
                                    style={{
                                        height: `${Math.min(
                                            (product.sales /
                                                (data[0]?.sales || 1)) *
                                                100,
                                            100
                                        )}%`,
                                    }}
                                ></div>
                            </div>
                        </div>
                    </div>
                ))}

                {/* View All Button */}
                <div className="pt-4 border-t border-admin-border">
                    <button
                        onClick={() => navigate("/products")}
                        className="w-full text-center text-admin-primary hover:text-admin-primary-dark transition-colors font-medium"
                    >
                        View All Products →
                    </button>
                </div>
            </div>
        </AnalyticsCard>
    );
};

export default TopProducts;
