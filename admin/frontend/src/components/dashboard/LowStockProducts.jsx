import React from "react";
import { useNavigate } from "react-router-dom";
import { FaBox } from "react-icons/fa";

const LowStockProducts = ({ stats }) => {
    const navigate = useNavigate();

    return (
        <div className="bg-admin-card rounded-xl p-6 shadow-admin-sm border border-admin-border">
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-admin-text font-montserrat">
                    Low Stock Alert
                </h3>
                <button
                    onClick={() => navigate("/products?filter=lowStock")}
                    className="text-sm text-admin-primary hover:text-admin-primary-dark transition-colors"
                >
                    View All
                </button>
            </div>
            <div className="space-y-3">
                {stats?.recentActivity?.lowStockProducts?.length > 0 ? (
                    stats.recentActivity.lowStockProducts.map((product) => (
                        <div
                            key={product.id}
                            className="flex items-center justify-between p-3 bg-admin-bg rounded-lg border border-admin-border hover:border-admin-primary cursor-pointer transition-all duration-200 hover:scale-105"
                            onClick={() =>
                                navigate(`/products/view/${product.id}`)
                            }
                        >
                            <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 bg-admin-border rounded-lg flex items-center justify-center overflow-hidden">
                                    {product.image ? (
                                        <img
                                            src={
                                                typeof product.image ===
                                                "string"
                                                    ? product.image
                                                    : product.image.url ||
                                                      product.image
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
                                            display: product.image
                                                ? "none"
                                                : "flex",
                                        }}
                                    />
                                </div>
                                <div>
                                    <p className="font-medium text-admin-text">
                                        {product.name}
                                    </p>
                                    <p className="text-sm text-admin-text-secondary">
                                        Stock: {product.stock}
                                    </p>
                                </div>
                            </div>
                            <div className="text-right">
                                <span className="text-xs px-2 py-1 rounded-full bg-admin-error text-white">
                                    Low Stock
                                </span>
                            </div>
                        </div>
                    ))
                ) : (
                    <p className="text-admin-text-secondary text-center py-4">
                        All products are well stocked
                    </p>
                )}
            </div>
        </div>
    );
};

export default LowStockProducts;
