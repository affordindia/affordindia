import React, { useState, useEffect } from "react";
import { validatePhoneNumber } from "../utils/validatePhoneNumber";
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
    const [userName, setUserName] = useState(user?.name || "");
    const navigate = useNavigate();

    // Utility function to check if address already exists
    const isAddressAlreadySaved = (address, savedAddresses) => {
        return savedAddresses.some(
            (addr) =>
                addr.houseNumber === address.houseNumber &&
                addr.street === address.street &&
                addr.city === address.city &&
                addr.pincode === address.pincode
        );
    };

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
    // Receiver info state
    const [isOrderingForSomeoneElse, setIsOrderingForSomeoneElse] =
        useState(false);
    const [receiverName, setReceiverName] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");

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

            // Validate user name
            if (!userName.trim()) {
                throw new Error("Please enter your name");
            }

            // Validate cart
            if (!cart?.items || cart.items.length === 0) {
                throw new Error("Cart is empty");
            }

            // Check if this is a new address and save it
            const isNewAddress = !isAddressAlreadySaved(
                shippingAddress,
                addresses
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
                    label: shippingAddress.label || "Home",
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
                userName,
                receiverName: isOrderingForSomeoneElse
                    ? receiverName
                    : undefined,
                receiverPhone: isOrderingForSomeoneElse
                    ? receiverPhone
                    : undefined,
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

                    {/* Your Details Section */}
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                        <h3 className="text-base font-semibold text-blue-800 mb-2">
                            Your Details
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-blue-800 mb-1">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) =>
                                        setUserName(e.target.value)
                                    }
                                    placeholder="Enter your name"
                                    className="w-full border border-blue-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-200"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-blue-800 mb-1">
                                    Your Phone
                                </label>
                                <input
                                    type="text"
                                    value={user?.phone || ""}
                                    disabled
                                    className="w-full border border-blue-300 rounded-lg px-3 py-2 bg-gray-50 text-gray-700"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ordering for someone else section */}
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                        <label className="flex items-center gap-2">
                            <input
                                type="checkbox"
                                checked={isOrderingForSomeoneElse}
                                onChange={(e) =>
                                    setIsOrderingForSomeoneElse(
                                        e.target.checked
                                    )
                                }
                            />
                            <span className="font-medium text-yellow-800">
                                Ordering for someone else?
                            </span>
                        </label>
                        {isOrderingForSomeoneElse && (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
                                <div>
                                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                                        Receiver Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={receiverName}
                                        onChange={(e) =>
                                            setReceiverName(e.target.value)
                                        }
                                        placeholder="Enter receiver's name"
                                        className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                                        Receiver Phone *
                                    </label>
                                    <input
                                        type="tel"
                                        value={receiverPhone}
                                        onChange={(e) => {
                                            const val = e.target.value;
                                            const cleaned = val
                                                .replace(/[^0-9]/g, "")
                                                .slice(0, 10);
                                            setReceiverPhone(cleaned);
                                        }}
                                        placeholder="Enter receiver's phone number"
                                        className="w-full border border-yellow-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-yellow-200"
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        required
                                    />
                                </div>
                            </div>
                        )}
                    </div>

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
                            !shippingAddress.city ||
                            !shippingAddress.pincode ||
                            !userName.trim() ||
                            (isOrderingForSomeoneElse &&
                                (!receiverName.trim() ||
                                    !validatePhoneNumber(receiverPhone)))
                        }
                    />
                </div>
            </div>
        </div>
    );
};

export default Checkout;
