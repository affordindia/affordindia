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
        <div className="bg-white p-6 rounded-lg border border-gray-300">
            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
                <FaCreditCard className="text-[#404040]" />
                <h3 className="text-lg font-semibold text-[#404040]">
                    Payment Method
                </h3>
            </div>

            {/* Payment Options */}
            <div className="space-y-3">
                {/* Cash on Delivery */}
                <label className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="payment"
                        value="COD"
                        checked={selected === "COD"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-[#C1B086] focus:ring-[#C1B086]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-green-100 rounded-lg">
                            <FaMoneyBillWave className="text-green-600" />
                        </div>
                        <div>
                            <div className="font-medium text-[#404040]">
                                Cash on Delivery
                            </div>
                            <div className="text-sm text-gray-600">
                                Pay when you receive your order
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-green-600">
                            Available
                        </div>
                        <div className="text-xs text-gray-500">
                            No extra charges
                        </div>
                    </div>
                </label>

                {/* Online Payment - Disabled for now */}
                <label className="flex items-center gap-4 p-4 border border-gray-200 rounded-lg cursor-not-allowed bg-gray-50 opacity-60">
                    <input
                        type="radio"
                        name="payment"
                        value="ONLINE"
                        disabled
                        className="w-4 h-4 text-gray-400"
                    />
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaCreditCard className="text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-gray-400">
                                Online Payment
                            </div>
                            <div className="text-sm text-gray-400">
                                Credit Card, Debit Card, UPI, Net Banking
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-orange-500">
                            Coming Soon
                        </div>
                        <div className="text-xs text-gray-400">
                            Integration in progress
                        </div>
                    </div>
                </label>
            </div>

            {/* Selected Payment Info */}
            {selected === "COD" && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center gap-2 text-green-700 mb-2">
                        <FaMoneyBillWave />
                        <span className="font-medium">
                            Cash on Delivery Selected
                        </span>
                    </div>
                    <div className="text-sm text-green-600">
                        <p>• Pay in cash when your order is delivered</p>
                        <p>• No advance payment required</p>
                        <p>• Please keep exact change ready</p>
                    </div>
                </div>
            )}

            {/* Security Notice */}
            <div className="mt-4 flex items-center gap-2 text-xs text-gray-600">
                <FaLock />
                <span>Your payment information is secure and encrypted</span>
            </div>

            {/* Future Payment Methods Preview */}
            <div className="mt-4 text-xs text-gray-500">
                <p>Coming soon: Razorpay integration for online payments</p>
            </div>
        </div>
    );
};

export default PaymentMethod;
