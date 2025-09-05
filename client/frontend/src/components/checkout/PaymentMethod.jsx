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

                {/* Online Payment - Now Enabled */}
                <label className="flex items-center gap-4 p-4 border border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50 transition-colors">
                    <input
                        type="radio"
                        name="payment"
                        value="ONLINE"
                        checked={selected === "ONLINE"}
                        onChange={(e) => onChange(e.target.value)}
                        className="w-4 h-4 text-[#C1B086] focus:ring-[#C1B086]"
                    />
                    <div className="flex items-center gap-3 flex-1">
                        <div className="p-2 bg-blue-100 rounded-lg">
                            <FaCreditCard className="text-blue-600" />
                        </div>
                        <div>
                            <div className="font-medium text-[#404040]">
                                Online Payment
                            </div>
                            <div className="text-sm text-gray-600">
                                Credit Card, Debit Card, UPI, Net Banking
                            </div>
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-sm font-medium text-blue-600">
                            Available
                        </div>
                        <div className="text-xs text-gray-500">
                            Secure payment via HDFC
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

            {selected === "ONLINE" && (
                <div className="mt-4 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                    <div className="flex items-center gap-2 text-blue-700 mb-2">
                        <FaCreditCard />
                        <span className="font-medium">
                            Online Payment Selected
                        </span>
                    </div>
                    <div className="text-sm text-blue-600">
                        <p>• Secure payment via HDFC SmartGateway</p>
                        <p>• Supports Credit/Debit Cards, UPI, Net Banking</p>
                        <p>• Complete payment to confirm your order</p>
                        <p>• You'll be redirected to payment gateway</p>
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
                <p>Powered by HDFC SmartGateway - Your payments are secure</p>
            </div>
        </div>
    );
};

export default PaymentMethod;
