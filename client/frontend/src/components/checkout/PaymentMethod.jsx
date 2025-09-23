import React, { useEffect } from "react";
import { FaCreditCard, FaMoneyBillWave, FaLock } from "react-icons/fa";

const PaymentMethod = ({ selected, onChange, onStepChange }) => {
    // Update step when payment method is selected
    useEffect(() => {
        if (selected) {
            onStepChange("review");
        }
    }, [selected, onStepChange]);

    return (
        <div className="bg-white p-2 sm:p-6 rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-[#B76E79] text-xl" />
                <h3 className="text-base sm:text-lg font-bold text-[#B76E79] tracking-wide">
                    Choose Payment Method
                </h3>
            </div>

            {/* Tabbed Payment Options */}
            <div className="flex gap-2 mb-4">
                <button
                    type="button"
                    className={`flex-1 py-2 rounded-t-xl border-b-2 font-semibold transition-colors text-sm sm:text-base ${
                        selected === "COD"
                            ? "border-[#B76E79] text-[#B76E79] bg-[#F8E9ED]"
                            : "border-gray-200 text-gray-500 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => onChange("COD")}
                >
                    <span className="inline-flex items-center gap-1">
                        <FaMoneyBillWave className="text-lg" /> Cash on Delivery
                    </span>
                </button>
                <button
                    type="button"
                    className={`flex-1 py-2 rounded-t-xl border-b-2 font-semibold transition-colors text-sm sm:text-base ${
                        selected === "ONLINE"
                            ? "border-[#B76E79] text-[#B76E79] bg-[#F8E9ED]"
                            : "border-gray-200 text-gray-500 bg-white hover:bg-gray-50"
                    }`}
                    onClick={() => onChange("ONLINE")}
                >
                    <span className="inline-flex items-center gap-1">
                        <FaCreditCard className="text-lg" /> Online Payment
                    </span>
                </button>
            </div>

            {/* Tab Content */}
            {selected === "COD" && (
                <div className="p-3 sm:p-4 bg-[#F8E9ED] border border-[#B76E79] rounded-xl">
                    <div className="flex items-center gap-2 text-[#B76E79] mb-2">
                        <FaMoneyBillWave />
                        <span className="font-semibold">
                            Cash on Delivery Selected
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#B76E79]">
                        <p>• Pay in cash when your order is delivered</p>
                        <p>• No advance payment required</p>
                        <p>• Please keep exact change ready</p>
                    </div>
                </div>
            )}
            {selected === "ONLINE" && (
                <div className="p-3 sm:p-4 bg-[#F8E9ED] border border-[#B76E79] rounded-xl">
                    <div className="flex items-center gap-2 text-[#B76E79] mb-2">
                        <FaCreditCard />
                        <span className="font-semibold">
                            Online Payment Selected
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#B76E79]">
                        <p>• Secure payment via HDFC SmartGateway</p>
                        <p>• Supports Credit/Debit Cards, UPI, Net Banking</p>
                        <p>• Complete payment to confirm your order</p>
                        <p>• You'll be redirected to payment gateway</p>
                    </div>
                </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <FaLock />
                <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Future Payment Methods Preview */}
            <div className="mt-2 text-xs text-gray-400">
                {selected === "ONLINE" && (
                    <p>
                        Powered by HDFC SmartGateway - Your payments are secure
                    </p>
                )}
            </div>
        </div>
    );
};

export default PaymentMethod;
