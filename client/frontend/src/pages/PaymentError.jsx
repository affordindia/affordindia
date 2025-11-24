import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaExclamationCircle, FaHome, FaShoppingBag } from "react-icons/fa";

const PaymentError = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Clear any pending order data
        localStorage.removeItem("pendingOrderId");
    }, []);

    const handleGoHome = () => {
        navigate("/", { replace: true });
    };

    const handleGoToCart = () => {
        navigate("/cart", { replace: true });
    };

    const handleContactSupport = () => {
        navigate("/contact-us");
    };

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                {/* Error Icon */}
                <div className="w-20 h-20 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaExclamationCircle className="text-orange-500 text-3xl" />
                </div>

                {/* Error Message */}
                <h1 className="text-3xl font-bold text-[#404040] mb-4">
                    Something Went Wrong
                </h1>

                <p className="text-lg text-gray-600 mb-6">
                    We encountered an unexpected error while processing your
                    payment.
                </p>

                {/* Error Details */}
                <div className="bg-orange-50 border border-orange-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-orange-700">
                        <p className="font-medium mb-2">What happened?</p>
                        <p>
                            • There was a technical issue during payment
                            processing
                        </p>
                        <p>• Your payment may or may not have been processed</p>
                        <p>
                            • Please check your bank statement or contact us for
                            clarification
                        </p>
                    </div>
                </div>

                {/* What to do */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-blue-700">
                        <p className="font-medium mb-2">What should you do?</p>
                        <ul className="text-left space-y-1">
                            <li>• Check your email for order confirmation</li>
                            <li>
                                • Verify your bank statement for any charges
                            </li>
                            <li>
                                • Contact our support team if you were charged
                            </li>
                            <li>• Try placing the order again if needed</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleContactSupport}
                        className="bg-[#B76E79] text-white px-6 py-3 rounded-lg hover:bg-white hover:text-[#B76E79] hover:border-2 hover:border-[#B76E79] transition-colors font-medium"
                    >
                        Contact Support
                    </button>

                    <button
                        onClick={handleGoToCart}
                        className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-6 py-3 rounded-lg hover:bg-[#B76E79] hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FaShoppingBag />
                        View Cart
                    </button>

                    <button
                        onClick={handleGoHome}
                        className="border-2 border-[#B76E79] text-[#B76E79] bg-white px-6 py-3 rounded-lg hover:bg-[#B76E79] hover:text-white transition-colors font-medium flex items-center justify-center gap-2"
                    >
                        <FaHome />
                        Go Home
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-8 p-4 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700 font-medium mb-2">
                        Need immediate help?
                    </p>
                    <p className="text-xs text-gray-600">
                        Email: support@affordindia.com
                        <br />
                        Phone: +91-XXXX-XXXX-XX
                        <br />
                        Support Hours: 9 AM - 6 PM (Mon-Sat)
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PaymentError;
