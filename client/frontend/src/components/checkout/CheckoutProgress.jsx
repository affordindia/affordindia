import React from "react";
import { FaShoppingCart, FaTruck, FaCreditCard, FaCheck } from "react-icons/fa";

const CheckoutProgress = ({ currentStep }) => {
    const steps = [
        { key: "cart", label: "Cart", icon: FaShoppingCart, completed: true },
        { key: "shipping", label: "Shipping", icon: FaTruck, completed: false },
        {
            key: "payment",
            label: "Payment",
            icon: FaCreditCard,
            completed: false,
        },
        { key: "review", label: "Review", icon: FaCheck, completed: false },
    ];

    // Mark steps as completed based on current step
    const getStepStatus = (stepKey) => {
        const stepIndex = steps.findIndex((step) => step.key === stepKey);
        const currentIndex = steps.findIndex(
            (step) => step.key === currentStep
        );

        if (stepIndex < currentIndex) return "completed";
        if (stepIndex === currentIndex) return "current";
        return "pending";
    };

    return (
        <div className="mb-8">
            <div className="flex items-center justify-between max-w-2xl mx-auto">
                {steps.map((step, index) => {
                    const status = getStepStatus(step.key);
                    const Icon = step.icon;

                    return (
                        <div key={step.key} className="flex items-center">
                            {/* Step Circle */}
                            <div className="flex flex-col items-center">
                                <div
                                    className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-colors ${
                                        status === "completed"
                                            ? "bg-green-500 border-green-500 text-white"
                                            : status === "current"
                                            ? "bg-[#C1B086] border-[#C1B086] text-white"
                                            : "bg-white border-gray-300 text-gray-400"
                                    }`}
                                >
                                    {status === "completed" ? (
                                        <FaCheck size={14} />
                                    ) : (
                                        <Icon size={14} />
                                    )}
                                </div>
                                <span
                                    className={`mt-2 text-xs font-medium ${
                                        status === "current"
                                            ? "text-[#404040]"
                                            : status === "completed"
                                            ? "text-green-600"
                                            : "text-gray-400"
                                    }`}
                                >
                                    {step.label}
                                </span>
                            </div>

                            {/* Connector Line */}
                            {index < steps.length - 1 && (
                                <div
                                    className={`flex-1 h-0.5 mx-4 transition-colors ${
                                        getStepStatus(steps[index + 1].key) ===
                                            "completed" ||
                                        (getStepStatus(steps[index + 1].key) ===
                                            "current" &&
                                            status === "completed")
                                            ? "bg-green-500"
                                            : status === "completed"
                                            ? "bg-[#C1B086]"
                                            : "bg-gray-300"
                                    }`}
                                />
                            )}
                        </div>
                    );
                })}
            </div>

            {/* Step Description */}
            <div className="text-center mt-4">
                <p className="text-sm text-gray-600">
                    {currentStep === "shipping" &&
                        "Enter your delivery address"}
                    {currentStep === "payment" && "Choose your payment method"}
                    {currentStep === "review" &&
                        "Review your order and place it"}
                </p>
            </div>
        </div>
    );
};

export default CheckoutProgress;
