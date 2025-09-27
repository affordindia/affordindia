import React, { useState, useEffect } from "react";
import { validatePhoneNumber } from "../utils/validatePhoneNumber";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext.jsx";
import { useCart } from "../context/CartContext.jsx";
import { useProfile } from "../context/ProfileContext.jsx";
import { createOrder } from "../api/order.js";
import { calculateShipping } from "../api/shipping.js";
import OrderSummary from "../components/checkout/OrderSummary.jsx";
import ShippingForm from "../components/checkout/ShippingForm.jsx";
import BillingForm from "../components/checkout/BillingForm.jsx";
import PaymentMethod from "../components/checkout/PaymentMethod.jsx";
import CheckoutProgress from "../components/checkout/CheckoutProgress.jsx";

const Checkout = () => {
    const { user } = useAuth();
    const { cart, clearCart } = useCart();
    const { addresses, addAddress, refreshUserData } = useProfile();
    const [userName, setUserName] = useState(user?.name || "");
    const [userNameError, setUserNameError] = useState("");
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
    const [billingAddress, setBillingAddress] = useState({
        houseNumber: "",
        street: "",
        landmark: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
    });
    const [billingAddressSameAsShipping, setBillingAddressSameAsShipping] =
        useState(true);
    const [paymentMethod, setPaymentMethod] = useState("COD");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [step, setStep] = useState("shipping");
    const [orderProcessing, setOrderProcessing] = useState(false);
    const [shippingInfo, setShippingInfo] = useState({
        shippingFee: 50,
        isFreeShipping: false,
        minOrderForFree: 1000,
        remainingForFreeShipping: 1000,
    });
    // Receiver info state
    const [isOrderingForSomeoneElse, setIsOrderingForSomeoneElse] =
        useState(false);
    const [receiverName, setReceiverName] = useState("");
    const [receiverNameError, setReceiverNameError] = useState("");
    const [receiverPhone, setReceiverPhone] = useState("");
    const [receiverPhoneError, setReceiverPhoneError] = useState("");
    // Validation for user and receiver fields
    const validateUserName = (value) => {
        if (!value.trim()) return "Please enter your name";
        return "";
    };
    const validateReceiverName = (value) => {
        if (!value.trim()) return "Please enter receiver's name";
        return "";
    };
    const validateReceiverPhone = (value) => {
        if (!validatePhoneNumber(value))
            return "Enter valid 10-digit phone number";
        return "";
    };

    // Redirect if cart is empty (but not during order processing)
    useEffect(() => {
        if (!orderProcessing && (!cart?.items || cart.items.length === 0)) {
            navigate("/cart");
        }
    }, [cart, navigate, orderProcessing]);

    // Sync billing address with shipping address when option is selected
    useEffect(() => {
        if (billingAddressSameAsShipping) {
            setBillingAddress(shippingAddress);
        }
    }, [shippingAddress, billingAddressSameAsShipping]);

    // Order calculations - matching cart logic
    const items = cart?.items || [];

    // Calculate product-level discounts (same as cart)
    const { totalProductDiscount, originalSubtotal, discountedSubtotal } =
        items.reduce(
            (acc, { product, quantity }) => {
                const hasDiscount = product.discount && product.discount > 0;
                const discountedPrice = hasDiscount
                    ? Math.round(product.price * (1 - product.discount / 100))
                    : product.price;

                acc.originalSubtotal += product.price * quantity;
                acc.discountedSubtotal += discountedPrice * quantity;
                acc.totalProductDiscount +=
                    (product.price - discountedPrice) * quantity;
                return acc;
            },
            {
                totalProductDiscount: 0,
                originalSubtotal: 0,
                discountedSubtotal: 0,
            }
        );

    // Get coupon discount from cart
    const couponDiscount = cart?.couponDiscount || 0;

    // Calculate shipping using API
    useEffect(() => {
        const fetchShipping = async () => {
            if (discountedSubtotal > 0) {
                try {
                    const orderAmountAfterCoupon = Math.max(
                        0,
                        discountedSubtotal - couponDiscount
                    );
                    const shipping = await calculateShipping(
                        orderAmountAfterCoupon
                    );
                    setShippingInfo(shipping);
                } catch (error) {
                    console.error("Error calculating shipping:", error);
                    // Keep fallback values in state
                }
            }
        };

        fetchShipping();
    }, [discountedSubtotal, couponDiscount]);

    // Calculate final total
    const total =
        discountedSubtotal - couponDiscount + shippingInfo.shippingFee;

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

            // Validate billing address if different from shipping
            if (!billingAddressSameAsShipping) {
                const billingErrors = validateAddress(billingAddress);
                if (Object.keys(billingErrors).length > 0) {
                    throw new Error(
                        "Please fill all required billing address fields correctly"
                    );
                }
            }

            // Validate user name
            const userNameErr = validateUserName(userName);
            setUserNameError(userNameErr);
            if (userNameErr) {
                throw new Error(userNameErr);
            }

            // Validate receiver fields if ordering for someone else
            if (isOrderingForSomeoneElse) {
                const receiverNameErr = validateReceiverName(receiverName);
                setReceiverNameError(receiverNameErr);
                if (receiverNameErr) throw new Error(receiverNameErr);
                const receiverPhoneErr = validateReceiverPhone(receiverPhone);
                setReceiverPhoneError(receiverPhoneErr);
                if (receiverPhoneErr) throw new Error(receiverPhoneErr);
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
                billingAddress: billingAddressSameAsShipping
                    ? shippingAddress
                    : billingAddress,
                billingAddressSameAsShipping,
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

            const response = await createOrder(orderData);

            // Handle wrapped response from backend
            const order = response.order || response;

            if (!order || !order._id) {
                throw new Error("Invalid order response from server");
            }

            // Refresh user data in both Auth and Profile contexts
            // This ensures the name entered during checkout is reflected immediately
            if (
                userName &&
                userName.trim() &&
                (!user?.name || user.name.trim() === "")
            ) {
                try {
                    await refreshUserData();
                } catch (error) {
                    console.warn(
                        "Failed to refresh user data, but order was successful:",
                        error
                    );
                    // Don't fail the order process if refresh fails
                }
            }

            // Handle different payment methods
            if (paymentMethod === "ONLINE") {
                // For online payment, check if we got a payment URL
                const paymentUrl = order.paymentUrl || response.paymentUrl;
                if (paymentUrl) {
                    console.log(
                        "🔄 Redirecting to payment gateway:",
                        paymentUrl
                    );

                    // Clear cart before redirecting to payment
                    await clearCart();

                    // Store order ID in localStorage for return handling
                    localStorage.setItem("pendingOrderId", order._id);

                    // Redirect to HDFC payment gateway
                    window.location.href = paymentUrl;
                    return; // Stop execution here as we're redirecting
                } else {
                    throw new Error("Payment URL not received from server");
                }
            } else {
                // For COD, proceed normally
                console.log("✅ COD order placed successfully");

                // Clear cart and navigate to confirmation
                await clearCart();
                navigate(`/payment/status/${order._id}`, { replace: true });
                return;
            }
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
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
            {/* Progress Indicator - Commented out temporarily */}
            {/* <CheckoutProgress currentStep={step} /> */}

            {/* Error Display */}
            {error && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
                    <p className="text-red-700">{error}</p>
                </div>
            )}

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
                {/* Left Section - Forms */}
                <div className="lg:col-span-2 space-y-4 sm:space-y-6">
                    <ShippingForm
                        address={shippingAddress}
                        onChange={setShippingAddress}
                        onStepChange={setStep}
                    />

                    {/* Your Details Section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                        <h3 className="text-lg font-semibold text-gray-800 mb-4">
                            Your Details
                        </h3>
                        <div className="flex flex-col gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Name *
                                </label>
                                <input
                                    type="text"
                                    value={userName}
                                    onChange={(e) => {
                                        setUserName(e.target.value);
                                        if (userNameError) setUserNameError("");
                                    }}
                                    onBlur={(e) =>
                                        setUserNameError(
                                            validateUserName(e.target.value)
                                        )
                                    }
                                    placeholder="Enter your name"
                                    className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm ${
                                        userNameError
                                            ? "border-red-300"
                                            : "border-gray-300"
                                    }`}
                                    required
                                />
                                {userNameError && (
                                    <p className="text-red-500 text-xs mt-1">
                                        {userNameError}
                                    </p>
                                )}
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Your Phone
                                </label>
                                <input
                                    type="text"
                                    value={user?.phone || ""}
                                    disabled
                                    className="w-full p-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600 text-sm cursor-not-allowed"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Ordering for someone else section */}
                    <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                        <label className="flex items-center gap-3 cursor-pointer">
                            <input
                                type="checkbox"
                                checked={isOrderingForSomeoneElse}
                                onChange={(e) =>
                                    setIsOrderingForSomeoneElse(
                                        e.target.checked
                                    )
                                }
                                className="w-4 h-4 border-gray-300 rounded focus:ring-gray-400"
                                style={{ accentColor: "#b76e79" }}
                            />
                            <span className="font-medium text-gray-800">
                                Ordering for someone else?
                            </span>
                        </label>
                        {isOrderingForSomeoneElse && (
                            <div className="flex flex-col gap-4 mt-4 pt-4 border-t border-gray-200">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Receiver Name *
                                    </label>
                                    <input
                                        type="text"
                                        value={receiverName}
                                        onChange={(e) => {
                                            setReceiverName(e.target.value);
                                            if (receiverNameError)
                                                setReceiverNameError("");
                                        }}
                                        onBlur={(e) =>
                                            setReceiverNameError(
                                                validateReceiverName(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        placeholder="Enter receiver's name"
                                        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm ${
                                            receiverNameError
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        required
                                    />
                                    {receiverNameError && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {receiverNameError}
                                        </p>
                                    )}
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
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
                                            if (receiverPhoneError)
                                                setReceiverPhoneError("");
                                        }}
                                        onBlur={(e) =>
                                            setReceiverPhoneError(
                                                validateReceiverPhone(
                                                    e.target.value
                                                )
                                            )
                                        }
                                        placeholder="Enter receiver's phone number"
                                        className={`w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm ${
                                            receiverPhoneError
                                                ? "border-red-300"
                                                : "border-gray-300"
                                        }`}
                                        pattern="[0-9]{10}"
                                        maxLength={10}
                                        required
                                    />
                                    {receiverPhoneError && (
                                        <p className="text-red-500 text-xs mt-1">
                                            {receiverPhoneError}
                                        </p>
                                    )}
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Billing Address Section */}
                    <BillingForm
                        billingAddress={billingAddress}
                        onBillingChange={setBillingAddress}
                        billingAddressSameAsShipping={
                            billingAddressSameAsShipping
                        }
                        onSameAsShippingChange={setBillingAddressSameAsShipping}
                        shippingAddress={shippingAddress}
                    />

                    <PaymentMethod
                        selected={paymentMethod}
                        onChange={setPaymentMethod}
                        onStepChange={setStep}
                    />
                </div>

                {/* Right Section - Order Summary */}
                <div className="lg:col-span-1">
                    <div className="lg:sticky lg:top-24">
                        <OrderSummary
                            items={items}
                            originalSubtotal={originalSubtotal}
                            totalProductDiscount={totalProductDiscount}
                            couponDiscount={couponDiscount}
                            shippingFee={shippingInfo.shippingFee}
                            shippingInfo={shippingInfo}
                            total={total}
                            paymentMethod={paymentMethod}
                            onPlaceOrder={handlePlaceOrder}
                            loading={loading}
                            disabled={
                                !shippingAddress.city ||
                                !shippingAddress.pincode ||
                                !userName.trim() ||
                                (!billingAddressSameAsShipping &&
                                    (!billingAddress.city ||
                                        !billingAddress.pincode)) ||
                                (isOrderingForSomeoneElse &&
                                    (!receiverName.trim() ||
                                        !validatePhoneNumber(receiverPhone)))
                            }
                        />
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Checkout;
