import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useProfile } from "../context/ProfileContext";
import { FaPlus, FaTimes } from "react-icons/fa";
import ProfileForm from "../components/profile/ProfileForm";
import AddressCard from "../components/profile/AddressCard";
import AddressForm from "../components/profile/AddressForm";

const Profile = () => {
    const { logout } = useAuth();
    const { addresses, loading, error } = useProfile();
    const [showAddressForm, setShowAddressForm] = useState(false);
    const [editingAddress, setEditingAddress] = useState(null);

    const handleEditAddress = (address) => {
        setEditingAddress(address);
        setShowAddressForm(true);
    };

    const handleCloseAddressForm = () => {
        setShowAddressForm(false);
        setEditingAddress(null);
    };

    const handleAddNewAddress = () => {
        setEditingAddress(null);
        setShowAddressForm(true);
    };

    return (
        <div className="flex justify-center items-start py-10 bg-gray-100 min-h-screen">
            <div
                className="p-8 rounded-lg shadow-md w-full max-w-4xl"
                style={{ backgroundColor: "#E0E0E0" }}
            >
                {/* Error Message */}
                {error && (
                    <div className="mb-6 p-4 bg-red-100 border border-red-300 text-red-700 rounded">
                        {error}
                    </div>
                )}

                {/* Profile Information Section */}
                <div className="mb-8">
                    <ProfileForm />
                </div>

                {/* Address Section */}
                <div className="mb-8">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-semibold">
                            Saved Addresses
                        </h2>
                        {!showAddressForm && (
                            <button
                                onClick={handleAddNewAddress}
                                disabled={loading}
                                className="flex items-center gap-2 bg-black text-white px-4 py-2 rounded hover:bg-gray-800 transition-colors disabled:opacity-50"
                            >
                                <FaPlus className="text-sm" />
                                Add Address
                            </button>
                        )}
                    </div>

                    {/* Address Form - Shows inline when needed */}
                    {showAddressForm && (
                        <div
                            className="mb-6 p-6 rounded-lg border border-gray-400"
                            style={{ backgroundColor: "#E0E0E0" }}
                        >
                            <div className="flex items-center justify-between mb-4">
                                <h3 className="text-lg font-semibold">
                                    {editingAddress
                                        ? "Edit Address"
                                        : "Add New Address"}
                                </h3>
                                <button
                                    onClick={handleCloseAddressForm}
                                    className="p-2 hover:bg-gray-300 rounded-full transition-colors"
                                >
                                    <FaTimes />
                                </button>
                            </div>
                            <AddressForm
                                editingAddress={editingAddress}
                                onClose={handleCloseAddressForm}
                                inline={true}
                            />
                        </div>
                    )}

                    {/* Loading State */}
                    {loading && addresses.length === 0 && !showAddressForm && (
                        <div className="space-y-4">
                            {[1, 2].map((i) => (
                                <div key={i} className="animate-pulse">
                                    <div className="h-32 bg-gray-200 rounded"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Address List */}
                    {!loading && addresses.length === 0 && !showAddressForm ? (
                        <div className="text-center py-8 text-gray-600">
                            <p>
                                No addresses saved yet. Use the "Add Address"
                                button above to get started.
                            </p>
                        </div>
                    ) : (
                        !showAddressForm && (
                            <div className="space-y-4">
                                {addresses.map((address) => (
                                    <AddressCard
                                        key={address._id}
                                        address={address}
                                        onEdit={handleEditAddress}
                                    />
                                ))}
                            </div>
                        )
                    )}
                </div>

                {/* Logout Button */}
                <div className="text-center pt-6 border-t border-gray-300">
                    <button
                        onClick={logout}
                        className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors font-medium shadow-sm"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Profile;
