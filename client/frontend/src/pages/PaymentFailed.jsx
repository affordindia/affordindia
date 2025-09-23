import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import {
    FaTimesCircle,
    FaExclamationTriangle,
    FaSpinner,
} from "react-icons/fa";

const PaymentFailed = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const [loading, setLoading] = useState(true);
    const [orderId, setOrderId] = useState(null);

    useEffect(() => {
        // Get order ID from URL params or localStorage
        const orderIdFromUrl = searchParams.get("orderId");
        const orderIdFromStorage = localStorage.getItem("pendingOrderId");

        const finalOrderId = orderIdFromUrl || orderIdFromStorage;

        if (finalOrderId) {
            setOrderId(finalOrderId);
        }

        // Brief loading for better UX
        setTimeout(() => {
            setLoading(false);
        }, 1000);
    }, [searchParams]);

    const handleRetryPayment = () => {
        if (orderId) {
            // Navigate to order detail page where user can retry payment
            navigate(`/orders/${orderId}`);
        } else {
            // Navigate to orders page
            navigate("/orders");
        }
    };

    const handleViewCart = () => {
        navigate("/cart");
    };

    const handleContinueShopping = () => {
        navigate("/products");
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <div className="text-center">
                    <div className="w-16 h-16 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSpinner className="text-orange-500 text-2xl animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#404040] mb-2">
                        Checking payment status...
                    </h1>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                {/* Failed Icon */}
                <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaTimesCircle className="text-red-500 text-3xl" />
                </div>

                {/* Failed Message */}
                <h1 className="text-3xl font-bold text-[#404040] mb-4">
                    Payment Failed
                </h1>

                <p className="text-lg text-gray-600 mb-2">
                    Your payment could not be processed at this time.
                </p>

                {orderId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Order ID: #{orderId.slice(-8)}
                    </p>
                )}

                {/* Failure Details */}
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-red-700">
                        <p className="font-medium mb-2 flex items-center justify-center gap-2">
                            <FaExclamationTriangle />
                            Payment was not completed
                        </p>
                        <p>• Your order is on hold pending payment</p>
                        <p>• No amount has been charged to your account</p>
                        <p>
                            • You can try paying again or choose a different
                            payment method
                        </p>
                    </div>
                </div>

                {/* Possible Reasons */}
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-yellow-700">
                        <p className="font-medium mb-2">
                            Common reasons for payment failure:
                        </p>
                        <ul className="text-left space-y-1">
                            <li>• Insufficient funds in your account</li>
                            <li>• Network connectivity issues</li>
                            <li>• Card limit exceeded</li>
                            <li>• Incorrect card details</li>
                            <li>• Payment gateway timeout</li>
                        </ul>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {orderId && (
                        <button
                            onClick={handleRetryPayment}
                            className="bg-[#C1B086] text-white px-6 py-3 rounded-lg hover:bg-[#B8A474] transition-colors font-medium"
                        >
                            Retry Payment
                        </button>
                    )}

                    <button
                        onClick={handleViewCart}
                        className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        View Cart
                    </button>

                    <button
                        onClick={handleContinueShopping}
                        className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-medium"
                    >
                        Continue Shopping
                    </button>
                </div>

                {/* Help Text */}
                <div className="mt-8 text-xs text-gray-500">
                    <p>
                        Still facing issues? Contact us at
                        support@affordindia.com
                    </p>
                    <p>Or call us at +91-XXXX-XXXX-XX</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentFailed;
