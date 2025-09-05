import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { FaCheckCircle, FaSpinner } from "react-icons/fa";
import Loader from "../components/common/Loader.jsx";

const PaymentSuccess = () => {
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

            // Clear pending order from localStorage
            localStorage.removeItem("pendingOrderId");

            // Simulate a brief loading period for better UX
            setTimeout(() => {
                setLoading(false);
            }, 1500);
        } else {
            // No order ID found, redirect to orders page
            setLoading(false);
            setTimeout(() => {
                navigate("/orders", { replace: true });
            }, 2000);
        }
    }, [searchParams, navigate]);

    const handleViewOrder = () => {
        if (orderId) {
            navigate(`/order-confirmation/${orderId}`);
        } else {
            navigate("/orders");
        }
    };

    const handleContinueShopping = () => {
        navigate("/products");
    };

    if (loading) {
        return (
            <div className="max-w-2xl mx-auto px-4 py-16">
                <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <FaSpinner className="text-blue-500 text-2xl animate-spin" />
                    </div>
                    <h1 className="text-2xl font-bold text-[#404040] mb-2">
                        Processing your payment...
                    </h1>
                    <p className="text-gray-600">
                        Please wait while we confirm your payment.
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-2xl mx-auto px-4 py-16">
            <div className="bg-white border border-gray-300 rounded-lg p-8 text-center">
                {/* Success Icon */}
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <FaCheckCircle className="text-green-500 text-3xl" />
                </div>

                {/* Success Message */}
                <h1 className="text-3xl font-bold text-[#404040] mb-4">
                    Payment Successful!
                </h1>

                <p className="text-lg text-gray-600 mb-2">
                    Thank you for your payment. Your order has been confirmed.
                </p>

                {orderId && (
                    <p className="text-sm text-gray-500 mb-6">
                        Order ID: #{orderId.slice(-8)}
                    </p>
                )}

                {/* Success Details */}
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                    <div className="text-sm text-green-700">
                        <p className="font-medium mb-2">
                            ✅ Payment completed successfully
                        </p>
                        <p>• Your order is now being processed</p>
                        <p>• You'll receive email updates on order status</p>
                        <p>• Expected delivery within 3-7 business days</p>
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    <button
                        onClick={handleViewOrder}
                        className="bg-[#C1B086] text-white px-6 py-3 rounded-lg hover:bg-[#B8A474] transition-colors font-medium"
                    >
                        View Order Details
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
                    <p>Need help? Contact us at support@affordindia.com</p>
                </div>
            </div>
        </div>
    );
};

export default PaymentSuccess;
