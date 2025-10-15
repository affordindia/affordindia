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
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-[#B76E79] text-xl" />
                <h3 className="text-base sm:text-lg font-bold text-[#B76E79] tracking-wide">
                    Choose Payment Method
                </h3>
            </div>

            {/* Maintenance Notice - REMOVED FOR RAZORPAY MIGRATION */}
            {/* 
            <div className="mb-4 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-orange-800">
                    <span>
                        <strong>Notice:</strong> Online payment is temporarily
                        under maintenance due to technical issues. Only Cash on
                        Delivery is available at the moment.
                    </span>
                </div>
            </div>
            */}

            {/* Payment Gateway Migration Notice */}
            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                <div className="flex items-center gap-2 text-sm text-green-800">
                    <FaLock className="text-green-600" />
                    <span>
                        <strong>Enhanced Security:</strong> We've upgraded to
                        Razorpay for faster, more secure online payments with
                        support for all major cards, UPI, and net banking.
                    </span>
                </div>
            </div>

            {/* Tabbed Payment Options */}
            <div className="flex gap-2 mb-4">
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
            </div>

            {/* Tab Content */}
            {selected === "ONLINE" && (
                <div className="p-3 sm:p-4 bg-[#F8E9ED] border border-[#B76E79] rounded-xl">
                    <div className="flex items-center gap-2 text-[#B76E79] mb-2">
                        <FaCreditCard />
                        <span className="font-semibold">
                            Online Payment Selected
                        </span>
                    </div>
                    <div className="text-xs sm:text-sm text-[#B76E79]">
                        <p>• Secure payment via Razorpay Gateway</p>
                        <p>
                            • Supports Credit/Debit Cards, UPI, Net Banking,
                            Wallets
                        </p>
                        <p>• 256-bit SSL encryption for maximum security</p>
                        <p>
                            • Instant payment confirmation and order processing
                        </p>
                        <p>• Pay safely without leaving this page</p>
                    </div>
                </div>
            )}

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

            {/* Security Notice */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-500">
                <FaLock />
                <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Future Payment Methods Preview */}
            <div className="mt-2 text-xs text-gray-400">
                {/* COMMENTED OUT FOR MAINTENANCE - UNCOMMENT WHEN ONLINE PAYMENTS ARE RESTORED
                {selected === "ONLINE" && (
                    <p>
                        Powered by HDFC SmartGateway - Your payments are secure
                    </p>
                )}
                */}
                <p>
                    Currently only Cash on Delivery is available. Online
                    payments will be restored soon.
                </p>
            </div>
        </div>
    );
};

export default PaymentMethod;
