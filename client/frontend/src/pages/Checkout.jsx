import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { createOrder } from "../api/order.js";
import OrderSummary from "../components/checkout/OrderSummary.jsx";
import ShippingForm from "../components/checkout/ShippingForm.jsx";
import PaymentMethod from "../components/checkout/PaymentMethod.jsx";
import CheckoutProgress from "../components/checkout/CheckoutProgress.jsx";

const Checkout = () => {
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const { addresses, addAddress } = useProfile();
    const navigate = useNavigate();

    // State management
    const [shippingAddress, setShippingAddress] = useState({
        houseNumber: "",
        street: "",
        landmark: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("shipping");
    const [orderProcessing, setOrderProcessing] = useState(false);

    // Redirect if cart is empty (but not during order processing)
    useEffect(() => {
        if (!orderProcessing && (!cart?.items || cart.items.length === 0)) {
            navigate("/cart");
        }
    }, [cart, navigate, orderProcessing]);

    // Order calculations
    const items = cart?.items || [];
    const subtotal = items.reduce(
        (sum, item) => sum + item.product.price * item.quantity,
        0
    );
    const shippingFee = subtotal >= 500 ? 0 : 50; // Free shipping above ₹500
    const total = subtotal + shippingFee;

    // Validation
    const validateAddress = (address) => {
        const errors = {};

        if (!address.houseNumber?.trim())
            errors.houseNumber = "House number is required";
        if (!address.street?.trim()) errors.street = "Street is required";
        if (!address.city?.trim()) errors.city = "City is required";
        if (!address.state?.trim()) errors.state = "State is required";
        if (!address.pincode?.match(/^\d{6}$/))
            errors.pincode = "Valid 6-digit pincode is required";

        return errors;
    };

    // Handle order placement
    const handlePlaceOrder = async () => {
        try {
            setLoading(true);
            setError("");
            setOrderProcessing(true); // Prevent cart redirect during order process

            // Validate address
            const addressErrors = validateAddress(shippingAddress);
            if (Object.keys(addressErrors).length > 0) {
                throw new Error(
                    "Please fill all required address fields correctly"
                );
            }

            // Validate cart
            if (!cart?.items || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            // Check if this is a new address and save it
            const isNewAddress = !addresses.some(
                (addr) =>
                    addr.houseNumber === shippingAddress.houseNumber &&
                    addr.street === shippingAddress.street &&
                    addr.city === shippingAddress.city &&
                    addr.pincode === shippingAddress.pincode
            );

            if (
                isNewAddress &&
                shippingAddress.houseNumber &&
                shippingAddress.street &&
                shippingAddress.city &&
                shippingAddress.state &&
                shippingAddress.pincode?.match(/^\d{6}$/)
            ) {
                await addAddress({
                    houseNumber: shippingAddress.houseNumber,
                    street: shippingAddress.street,
                    landmark: shippingAddress.landmark,
                    area: shippingAddress.area,
                    city: shippingAddress.city,
                    state: shippingAddress.state,
                    pincode: shippingAddress.pincode,
                    country: shippingAddress.country || "India",
                });
            }

            // Create order
            const orderData = {
                shippingAddress,
                paymentMethod,
                paymentInfo: {},
            };

            const order = await createOrder(orderData);

            if (!order || !order._id) {
                throw new Error("Invalid order response from server");
            }

            // Clear cart and navigate to confirmation
            await clearCart();

            // Navigate using React Router (preserves console logs)
            navigate(`/order-confirmation/${order._id}`, { replace: true });
            return;
        } catch (error) {
            console.error("Order placement failed:", error);

            // Show user-friendly error messages
            let userMessage =
                "We're having trouble processing your order. Please try again.";

            if (error.message?.includes("address")) {
                userMessage =
                    "Please check your shipping address and try again.";
            } else if (error.message?.includes("Cart is empty")) {
                userMessage =
                    "Your cart appears to be empty. Please add items before checking out.";
            } else if (
                error.message?.includes("network") ||
                error.message?.includes("fetch")
            ) {
                userMessage =
                    "Network error. Please check your connection and try again.";
            }

            setError(userMessage);
            setLoading(false);
            setOrderProcessing(false);
        }
    };

    // Don't render if cart is empty
    if (!cart?.items || cart.items.length === 0) {
        return null;
    }

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Progress Indicator - Commented out temporarily */}
            {/* <CheckoutProgress currentStep={step} /> */}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Main Content */}
            <div className="grid lg:grid-cols-3 gap-8">
                {/* Left Section - Forms */}
                <div className="lg:col-span-2 space-y-6">
                    <ShippingForm
                        address={shippingAddress}
                        onChange={setShippingAddress}
                        onStepChange={setStep}
                    />

                    <PaymentMethod
                        selected={paymentMethod}
                        onChange={setPaymentMethod}
                        onStepChange={setStep}
                    />
                </div>

                {/* Right Section - Order Summary */}
                <div className="lg:col-span-1">
                    <OrderSummary
                        items={items}
                        subtotal={subtotal}
                        shippingFee={shippingFee}
                        total={total}
                        onPlaceOrder={handlePlaceOrder}
                        loading={loading}
                        disabled={
                            !shippingAddress.city || !shippingAddress.pincode
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
