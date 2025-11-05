import React, { useState, useEffect } from "react";
import {
    FaTruck,
    FaPlus,
    FaEdit,
    FaTrash,
    FaChevronDown,
    FaChevronUp,
} from "react-icons/fa";
import { useProfile } from "../../context/ProfileContext.jsx";
import AddressModal from "../common/AddressModal.jsx";
import ConfirmationModal from "../common/ConfirmationModal.jsx";

const AddressSelector = ({
    selectedAddress,
    onAddressSelect,
    onAddressChange,
}) => {
    const { addresses, getDefaultAddress, setDefaultAddress, deleteAddress } =
        useProfile();
    const [isOtherAddressesExpanded, setIsOtherAddressesExpanded] =
        useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);
    const [deletingAddress, setDeletingAddress] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    const defaultAddress = getDefaultAddress();
    const otherAddresses = addresses.filter((addr) => !addr.isDefault);

    // Auto-select default address on load
    useEffect(() => {
        if (defaultAddress && (!selectedAddress || !selectedAddress._id)) {
            onAddressSelect(defaultAddress);
            onAddressChange({ ...defaultAddress, country: "India" });
        }
    }, [defaultAddress, selectedAddress, onAddressSelect, onAddressChange]);

    const handleAddressSelect = (address) => {
        onAddressSelect(address);
        onAddressChange({ ...address, country: "India" });
    };

    const handleSetDefault = async (addressId) => {
        try {
            await setDefaultAddress(addressId);
            // Find and select the newly set default address
            const newDefaultAddress = addresses.find(
                (addr) => addr._id === addressId
            );
            if (newDefaultAddress) {
                handleAddressSelect(newDefaultAddress);
            }
        } catch (error) {
            console.error("Failed to set default address:", error);
        }
    };

    const formatAddress = (address) => {
        const parts = [
            address.houseNumber,
            address.street,
            address.area,
            address.city,
        ].filter(Boolean);

        return parts.join(", ");
    };

    const formatFullAddress = (address) => {
        const addressLine = formatAddress(address);
        const locationLine = [address.state, address.pincode]
            .filter(Boolean)
            .join(" - ");
        return [addressLine, locationLine].filter(Boolean).join(", ");
    };

    const handleEditClick = (address) => {
        setEditingAddress(address);
        setShowEditModal(true);
    };

    const handleDeleteClick = (address) => {
        setDeletingAddress(address);
        setShowDeleteModal(true);
    };

    const handleDeleteConfirm = async () => {
        if (!deletingAddress) return;

        setIsDeleting(true);
        try {
            await deleteAddress(deletingAddress._id);

            // If we deleted the currently selected address, select the new default
            if (selectedAddress?._id === deletingAddress._id) {
                const newDefaultAddress = getDefaultAddress();
                if (newDefaultAddress) {
                    handleAddressSelect(newDefaultAddress);
                }
            }

            setShowDeleteModal(false);
            setDeletingAddress(null);
        } catch (error) {
            console.error("Failed to delete address:", error);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setShowEditModal(false);
        setShowDeleteModal(false);
        setEditingAddress(null);
        setDeletingAddress(null);
    };

    return (
        <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
            {/* Header */}
            <div className="flex items-center gap-2 mb-6">
                <FaTruck className="text-[#404040]" />
                <h3 className="text-lg font-semibold text-[#404040]">
                    Shipping Address
                </h3>
            </div>

            {/* Default Address Section */}
            <div className="mb-6">
                <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-[#404040]">
                        Default Address
                    </h4>
                    <button
                        onClick={() => setShowAddModal(true)}
                        className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg text-sm text-[#404040] hover:bg-gray-50 transition-colors"
                    >
                        <FaPlus className="text-xs" />
                        ADD NEW ADDRESS
                    </button>
                </div>

                {defaultAddress ? (
                    <div
                        className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                            selectedAddress?._id === defaultAddress._id
                                ? "border-[#b76e79a0]"
                                : "border-gray-200 hover:border-gray-300"
                        }`}
                        onClick={() => handleAddressSelect(defaultAddress)}
                    >
                        <div className="flex items-start justify-between">
                            <div className="flex-1">
                                <div className="flex items-center gap-2 mb-1">
                                    <input
                                        type="radio"
                                        name="selectedAddress"
                                        checked={
                                            selectedAddress?._id ===
                                            defaultAddress._id
                                        }
                                        onChange={() =>
                                            handleAddressSelect(defaultAddress)
                                        }
                                        className="text-[#b76e79] focus:ring-gray-400 accent-[#b76e79]"
                                    />
                                    <span className="font-medium text-[#404040]">
                                        {defaultAddress.label}
                                    </span>
                                </div>
                                <p className="text-sm text-[#404040] ml-5">
                                    {formatAddress(defaultAddress)}
                                </p>
                                <p className="text-sm text-[#404040] ml-5">
                                    {defaultAddress.state} -{" "}
                                    {defaultAddress.pincode}
                                </p>
                            </div>
                            <div className="flex gap-2 ml-4">
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleEditClick(defaultAddress);
                                    }}
                                    className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                    title="Edit"
                                >
                                    <FaEdit className="text-base" />
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleDeleteClick(defaultAddress);
                                    }}
                                    className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                    title="Delete"
                                >
                                    <FaTrash className="text-base" />
                                </button>
                            </div>
                        </div>
                    </div>
                ) : (
                    <div className="p-4 border-2 border-dashed border-gray-200 rounded-lg text-center">
                        <p className="text-sm text-gray-500 mb-2">
                            No default address set
                        </p>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="text-[#b76e79] text-sm hover:opacity-80 transition-colors"
                        >
                            Add your first address
                        </button>
                    </div>
                )}
            </div>

            {/* Other Addresses Section */}
            {otherAddresses.length > 0 && (
                <div>
                    <button
                        onClick={() =>
                            setIsOtherAddressesExpanded(
                                !isOtherAddressesExpanded
                            )
                        }
                        className="flex items-center justify-between w-full p-3 bg-gray-50 border border-gray-200 rounded-lg mb-3 hover:bg-gray-100 transition-colors"
                    >
                        <span className="text-sm font-medium text-[#404040]">
                            Other Address ({otherAddresses.length})
                        </span>
                        {isOtherAddressesExpanded ? (
                            <FaChevronUp className="text-gray-500 text-sm" />
                        ) : (
                            <FaChevronDown className="text-gray-500 text-sm" />
                        )}
                    </button>

                    {isOtherAddressesExpanded && (
                        <div className="space-y-3">
                            {otherAddresses.map((address) => (
                                <div
                                    key={address._id}
                                    className={`p-4 border-2 rounded-lg cursor-pointer transition-all ${
                                        selectedAddress?._id === address._id
                                            ? "border-[#b76e79]"
                                            : "border-gray-200 hover:border-gray-300"
                                    }`}
                                    onClick={() => handleAddressSelect(address)}
                                >
                                    <div className="flex items-start justify-between">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-1">
                                                <input
                                                    type="radio"
                                                    name="selectedAddress"
                                                    checked={
                                                        selectedAddress?._id ===
                                                        address._id
                                                    }
                                                    onChange={() =>
                                                        handleAddressSelect(
                                                            address
                                                        )
                                                    }
                                                    className="text-[#b76e79] focus:ring-gray-400 accent-[#b76e79]"
                                                />
                                                <span className="font-medium text-[#404040]">
                                                    {address.label}
                                                </span>
                                            </div>
                                            <p className="text-sm text-[#404040] ml-5">
                                                {formatAddress(address)}
                                            </p>
                                            <p className="text-sm text-[#404040] ml-5">
                                                {address.state} -{" "}
                                                {address.pincode}
                                            </p>
                                        </div>
                                        <div className="flex gap-2 ml-4">
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleEditClick(address);
                                                }}
                                                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
                                                title="Edit"
                                            >
                                                <FaEdit className="text-base" />
                                            </button>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDeleteClick(address);
                                                }}
                                                className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                                                title="Delete"
                                            >
                                                <FaTrash className="text-base" />
                                            </button>
                                        </div>
                                    </div>

                                    {/* Set as Default Button */}
                                    <div className="mt-3 ml-5">
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                handleSetDefault(address._id);
                                            }}
                                            className="text-xs text-[#b76e79] hover:opacity-80 transition-colors font-semibold"
                                        >
                                            Set as default
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            )}

            {/* Modals */}
            <AddressModal
                isOpen={showAddModal}
                onClose={handleModalClose}
                editingAddress={null}
            />

            <AddressModal
                isOpen={showEditModal}
                onClose={handleModalClose}
                editingAddress={editingAddress}
            />

            <ConfirmationModal
                isOpen={showDeleteModal}
                onClose={handleModalClose}
                onConfirm={handleDeleteConfirm}
                title="Delete Address"
                message={`Are you sure you want to delete the address "${deletingAddress?.label}"? This action cannot be undone.`}
                confirmText="Delete"
                cancelText="Cancel"
                type="danger"
                loading={isDeleting}
            />
        </div>
    );
};

export default AddressSelector;
