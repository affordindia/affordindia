import React from "react";
import { useNavigate } from "react-router-dom";
import { FiArrowLeft, FiTag, FiEdit3, FiZap, FiSettings } from "react-icons/fi";

const AddCouponChoice = () => {
    const navigate = useNavigate();

    const options = [
        {
            id: "templates",
            title: "Use Template",
            description:
                "Choose from pre-designed coupon templates for quick setup",
            icon: FiTag,
            color: "purple",
            gradient: "from-purple-500 to-violet-600",
            bgColor: "bg-purple-50",
            textColor: "text-purple-700",
            action: () => navigate("/coupons/templates"),
            features: [
                "Pre-configured settings",
                "Quick setup",
                "Best practices included",
            ],
        },
        {
            id: "custom",
            title: "Create Custom",
            description:
                "Build a coupon from scratch with full customization options",
            icon: FiEdit3,
            color: "blue",
            gradient: "from-blue-500 to-indigo-600",
            bgColor: "bg-blue-50",
            textColor: "text-blue-700",
            action: () => navigate("/coupons/add-custom"),
            features: [
                "Full customization",
                "Advanced options",
                "Complete control",
            ],
        },
    ];

    return (
        <div className="min-h-screen bg-gray-50 p-6">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <div className="mb-8">
                    <button
                        onClick={() => navigate("/coupons")}
                        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors"
                    >
                        <FiArrowLeft className="w-4 h-4" />
                        Back to Coupons
                    </button>
                    <div className="text-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">
                            Add New Coupon
                        </h1>
                        <p className="text-gray-600 text-lg">
                            Choose how you'd like to create your coupon
                        </p>
                    </div>
                </div>

                {/* Options Grid */}
                <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
                    {options.map((option) => {
                        const IconComponent = option.icon;
                        return (
                            <div
                                key={option.id}
                                onClick={option.action}
                                className="group cursor-pointer bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1 border border-gray-200"
                            >
                                <div className="p-8">
                                    {/* Icon Section */}
                                    <div
                                        className={`w-16 h-16 ${option.bgColor} rounded-full flex items-center justify-center mb-6 mx-auto group-hover:scale-110 transition-transform duration-300`}
                                    >
                                        <IconComponent
                                            className={`w-8 h-8 ${option.textColor}`}
                                        />
                                    </div>

                                    {/* Content */}
                                    <div className="text-center mb-6">
                                        <h3 className="text-xl font-bold text-gray-900 mb-3">
                                            {option.title}
                                        </h3>
                                        <p className="text-gray-600 leading-relaxed">
                                            {option.description}
                                        </p>
                                    </div>

                                    {/* Features */}
                                    <div className="space-y-2 mb-6">
                                        {option.features.map(
                                            (feature, index) => (
                                                <div
                                                    key={index}
                                                    className="flex items-center gap-2 text-sm text-gray-600"
                                                >
                                                    <div
                                                        className={`w-1.5 h-1.5 rounded-full bg-gradient-to-r ${option.gradient}`}
                                                    ></div>
                                                    <span>{feature}</span>
                                                </div>
                                            )
                                        )}
                                    </div>

                                    {/* Action Button */}
                                    <button
                                        className={`w-full py-3 px-6 rounded-lg font-medium text-white bg-gradient-to-r ${option.gradient} hover:shadow-lg transition-all duration-300 transform group-hover:scale-105`}
                                    >
                                        {option.id === "templates"
                                            ? "Browse Templates"
                                            : "Start Creating"}
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Additional Info */}
                <div className="mt-12 max-w-2xl mx-auto">
                    <div className="bg-white rounded-lg p-6 border border-gray-200">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                                <FiZap className="w-4 h-4 text-gray-600" />
                            </div>
                            <h4 className="font-semibold text-gray-900">
                                Quick Tips
                            </h4>
                        </div>
                        <div className="grid md:grid-cols-2 gap-4 text-sm text-gray-600">
                            <div>
                                <strong className="text-gray-900">
                                    Templates:
                                </strong>{" "}
                                Perfect for common discount types like welcome
                                offers, seasonal sales, or first-time buyer
                                discounts.
                            </div>
                            <div>
                                <strong className="text-gray-900">
                                    Custom:
                                </strong>{" "}
                                Ideal when you need specific conditions, unique
                                discount structures, or complex rules.
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AddCouponChoice;
