import React from "react";
import { FaCreditCard, FaMapMarkerAlt } from "react-icons/fa";

const BillingForm = ({
    billingAddress,
    onBillingChange,
    billingAddressSameAsShipping,
    onSameAsShippingChange,
    shippingAddress,
}) => {
    const handleInputChange = (field, value) => {
        const processedValue =
            field === "pincode"
                ? value.replace(/[^0-9]/g, "").slice(0, 6)
                : value;
        onBillingChange((prev) => ({ ...prev, [field]: processedValue }));
    };

    const handleSameAsShippingChange = (e) => {
        const isSame = e.target.checked;
        onSameAsShippingChange(isSame);

        if (isSame) {
            // Copy shipping address to billing address
            onBillingChange(shippingAddress);
        } else {
            // Reset billing address to empty
            onBillingChange({
                houseNumber: "",
                street: "",
                landmark: "",
                area: "",
                city: "",
                state: "",
                pincode: "",
                country: "India",
            });
        }
    };

    const inputClasses = `w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400 focus:border-transparent text-sm ${
        billingAddressSameAsShipping ? "bg-gray-100 cursor-not-allowed" : ""
    }`;

    const requiredFields = [
        "houseNumber",
        "street",
        "area",
        "city",
        "state",
        "pincode",
    ];
    const isFieldEmpty = (field) =>
        !billingAddress[field] || billingAddress[field].trim() === "";

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex items-center gap-3 pb-4 border-b border-gray-200">
                <div
                    className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ backgroundColor: "#f3ece8" }}
                >
                    <FaCreditCard
                        className="text-sm"
                        style={{ color: "#b76e79" }}
                    />
                </div>
                <h3 className="text-lg font-semibold text-gray-800">
                    Billing Address
                </h3>
            </div>

            {/* Same as shipping checkbox */}
            <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                <label className="flex items-center gap-3 cursor-pointer">
                    <input
                        type="checkbox"
                        checked={billingAddressSameAsShipping}
                        onChange={handleSameAsShippingChange}
                        className="w-4 h-4 border-gray-300 rounded focus:ring-gray-400"
                        style={{ accentColor: "#b76e79" }}
                    />
                    <span className="text-sm font-medium text-gray-700">
                        Billing address is same as shipping address
                    </span>
                </label>
                <p className="text-xs text-gray-500 mt-1 ml-7">
                    Check this box if your billing address matches your shipping
                    address
                </p>
            </div>

            {/* Billing Address Form - Only show when different address is selected */}
            {!billingAddressSameAsShipping && (
                <div className="space-y-4 transition-all duration-300 ease-in-out">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                House/Flat Number *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.houseNumber}
                                onChange={(e) =>
                                    handleInputChange(
                                        "houseNumber",
                                        e.target.value
                                    )
                                }
                                className={`${inputClasses}`}
                                placeholder="Enter house/flat number"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Street Address *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.street}
                                onChange={(e) =>
                                    handleInputChange("street", e.target.value)
                                }
                                className={`${inputClasses}`}
                                placeholder="Enter street address"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Landmark (Optional)
                        </label>
                        <input
                            type="text"
                            value={billingAddress.landmark}
                            onChange={(e) =>
                                handleInputChange("landmark", e.target.value)
                            }
                            className={inputClasses}
                            placeholder="Near landmark"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Area/Locality *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.area}
                                onChange={(e) =>
                                    handleInputChange("area", e.target.value)
                                }
                                className={`${inputClasses}`}
                                placeholder="Enter area/locality"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                City *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.city}
                                onChange={(e) =>
                                    handleInputChange("city", e.target.value)
                                }
                                className={`${inputClasses}`}
                                placeholder="Enter city"
                            />
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                State *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.state}
                                onChange={(e) =>
                                    handleInputChange("state", e.target.value)
                                }
                                className={`${inputClasses}`}
                                placeholder="Enter state"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                PIN Code *
                            </label>
                            <input
                                type="text"
                                value={billingAddress.pincode}
                                onChange={(e) =>
                                    handleInputChange("pincode", e.target.value)
                                }
                                className={`${inputClasses}`}
                                placeholder="6-digit PIN code"
                                maxLength="6"
                            />
                        </div>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Country
                        </label>
                        <input
                            type="text"
                            value={billingAddress.country}
                            className={`${inputClasses} bg-gray-100 cursor-not-allowed`}
                            disabled
                        />
                    </div>
                </div>
            )}

            {/* Info message when different address is selected */}
            {!billingAddressSameAsShipping && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 sm:p-6 mb-4 sm:mb-6 shadow-sm">
                    <div className="flex items-center gap-2">
                        <FaMapMarkerAlt className="text-sm" />
                        <span className="text-sm font-medium text-gray-700">
                            Different Billing Address
                        </span>
                    </div>
                    <p className="text-xs mt-1 text-gray-500">
                        Please ensure all billing address fields are correctly
                        filled out
                    </p>
                </div>
            )}
        </div>
    );
};

export default BillingForm;
