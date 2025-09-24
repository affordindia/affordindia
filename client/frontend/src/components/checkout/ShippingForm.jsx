import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProfile } from "../../context/ProfileContext.jsx";
import AddressSelector from "./AddressSelector.jsx";

const ShippingForm = ({ address, onChange, onStepChange }) => {
    const { user } = useAuth();
    const { addresses, getDefaultAddress } = useProfile();
    const [selectedAddress, setSelectedAddress] = useState(null);

    // Auto-select default address on initial load
    useEffect(() => {
        const defaultAddress = getDefaultAddress();
        const hasEmptyAddress = Object.keys(address).every(
            (key) => !address[key]
        );

        if (defaultAddress && hasEmptyAddress) {
            setSelectedAddress(defaultAddress);
            onChange({ ...defaultAddress, country: "India" });
        }
    }, [addresses, getDefaultAddress]);

    // Update checkout progress based on address completion
    useEffect(() => {
        const isComplete =
            address.houseNumber &&
            address.street &&
            address.area &&
            address.city &&
            address.state &&
            address.pincode?.match(/^\d{6}$/);

        onStepChange(isComplete ? "payment" : "shipping");
    }, [address, onStepChange]);

    const handleAddressSelect = (selectedAddr) => {
        setSelectedAddress(selectedAddr);
    };

    const handleAddressChange = (addressData) => {
        onChange(addressData);
    };

    return (
        <div className="flex flex-col lg:flex-row gap-6">
            <div className="flex-1">
                <AddressSelector
                    selectedAddress={selectedAddress}
                    onAddressSelect={handleAddressSelect}
                    onAddressChange={handleAddressChange}
                />
            </div>
        </div>
    );
};

export default ShippingForm;
