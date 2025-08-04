import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext.jsx";
import { useProfile } from "../../context/ProfileContext.jsx";
import {
  FaTruck,
  FaPlus,
  FaTimes,
  FaSave,
} from "react-icons/fa";

const ShippingForm = ({ address, onChange, onStepChange }) => {
  const { user } = useAuth();
  const { addresses, getDefaultAddress, updateAddress } = useProfile();

  const [selectedAddressId, setSelectedAddressId] = useState("");
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editData, setEditData] = useState(null);

  useEffect(() => {
    const defaultAddress = getDefaultAddress();
    const hasEmptyAddress = Object.keys(address).every((key) => !address[key]);
    const hasNoSelectedAddress = !selectedAddressId;

    if (defaultAddress && (hasEmptyAddress || hasNoSelectedAddress)) {
      setSelectedAddressId(defaultAddress._id);
      onChange({ ...defaultAddress, country: "India" });
    }
  }, [addresses, user]);

  useEffect(() => {
    const isLabelValid = selectedAddressId === "new"
      ? address.label && ["Home", "Work", "Other"].includes(address.label)
      : true;

    const isComplete =
      isLabelValid &&
      address.houseNumber &&
      address.street &&
      address.area &&
      address.city &&
      address.state &&
      address.pincode?.match(/^\d{6}$/);

    onStepChange(isComplete ? "payment" : "shipping");
  }, [address, selectedAddressId]);

  const handleAddressSelect = (addressId) => {
    if (addressId === "new") {
      setSelectedAddressId("new");
      onChange({
        label: "Home",
        houseNumber: "",
        street: "",
        landmark: "",
        area: "",
        city: "",
        state: "",
        pincode: "",
        country: "India",
      });
    } else {
      setSelectedAddressId(addressId);
      const selected = addresses.find((addr) => addr._id === addressId);
      if (selected) {
        onChange({ ...selected, country: "India" });
      }
    }
  };

  const handleInputChange = (field, value) => {
    const processedValue = field === "pincode"
      ? value.replace(/[^0-9]/g, "").slice(0, 6)
      : value;
    onChange((prev) => ({ ...prev, [field]: processedValue }));
  };

  const handleEditAddress = (addr) => {
    setEditData({ ...addr });
    setIsEditModalOpen(true);
  };

  const handleEditChange = (field, value) => {
    setEditData((prev) => ({
      ...prev,
      [field]: field === "pincode" ? value.replace(/[^0-9]/g, "").slice(0, 6) : value,
    }));
  };

  const handleEditSave = async () => {
    try {
      await updateAddress(editData._id, editData);
      setIsEditModalOpen(false);
    } catch (err) {
      console.error("Failed to update address", err);
    }
  };

  return (
    <div className="flex flex-col lg:flex-row gap-6">
      <div className="flex-1">
        <div className="bg-white p-6 rounded-lg border border-gray-300 mb-6">
          <div className="flex items-center gap-2 mb-4">
            <FaTruck className="text-[#404040]" />
            <h3 className="text-lg font-semibold text-[#404040]">Shipping Address</h3>
          </div>

          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-4 mb-6">
            {addresses.map((addr) => {
              const isSelected = selectedAddressId === addr._id;
              return (
                <div
                  key={addr._id}
                  onClick={() => handleAddressSelect(addr._id)}
                  className={`cursor-pointer border rounded-lg p-4 transition ${
                    isSelected ? "border-[#C1B086] shadow-md" : "border-gray-300"
                  } ${addr.isDefault ? "bg-[#fef9ef]" : "bg-white"}`}
                >
                  <div className="flex justify-between mb-2">
                    <p className="font-semibold">{addr.label}</p>
                    {addr.isDefault && (
                      <span className="text-xs bg-[#c95b5b] text-white px-2 py-0.5 rounded-full">
                        Default
                      </span>
                    )}
                  </div>
                  <p className="text-sm">{addr.name}</p>
                  <p className="text-sm">
                    {addr.houseNumber}, {addr.street}, {addr.city} - {addr.pincode}
                  </p>
                  <p className="text-sm">Phone: {addr.phone}</p>

                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditAddress(addr);
                    }}
                    className="mt-3 text-sm border px-3 py-1 rounded hover:bg-gray-100"
                  >
                    Edit
                  </button>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => handleAddressSelect("new")}
            className="flex items-center text-[#404040] gap-2 text-sm border border-dashed border-[#C1B086] px-4 py-2 rounded hover:bg-[#faf7f1]"
          >
            <FaPlus /> Add New Address
          </button>

          {selectedAddressId === "new" && (
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="House Number"
                value={address.houseNumber || ""}
                onChange={(e) => handleInputChange("houseNumber", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Street"
                value={address.street || ""}
                onChange={(e) => handleInputChange("street", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Area"
                value={address.area || ""}
                onChange={(e) => handleInputChange("area", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="City"
                value={address.city || ""}
                onChange={(e) => handleInputChange("city", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="State"
                value={address.state || ""}
                onChange={(e) => handleInputChange("state", e.target.value)}
                className="border p-2 rounded"
              />
              <input
                type="text"
                placeholder="Pincode"
                value={address.pincode || ""}
                onChange={(e) => handleInputChange("pincode", e.target.value)}
                className="border p-2 rounded"
              />
            </div>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg w-[90%] max-w-md relative">
            <button
              onClick={() => setIsEditModalOpen(false)}
              className="absolute top-2 right-2 text-gray-500 hover:text-red-600"
            >
              <FaTimes />
            </button>

            <h3 className="text-lg font-semibold mb-4">Edit Address</h3>

            {["houseNumber", "street", "area", "city", "state", "pincode"].map((field) => (
              <input
                key={field}
                type="text"
                placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                value={editData[field] || ""}
                onChange={(e) => handleEditChange(field, e.target.value)}
                className="border p-2 rounded w-full mb-3"
              />
            ))}

            <button
              onClick={handleEditSave}
              className="flex items-center gap-2 bg-[#C1B086] text-white px-4 py-2 rounded hover:bg-[#b89c6f]"
            >
              <FaSave /> Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShippingForm;
