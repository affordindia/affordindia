import React from 'react';
import { useAuth } from '../context/AuthContext';
import { FaEdit } from 'react-icons/fa';

const Profile = () => {
  const { user, logout } = useAuth();

  return (
    <div className="flex justify-center items-center py-10 bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-2xl">
        
        {/* Contact Details */}
        <h2 className="text-center text-lg font-semibold mb-4 flex items-center justify-center gap-2">
          Contact Details <FaEdit className="text-sm text-gray-600" />
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
          <input
            type="text"
            placeholder="First Name"
            defaultValue={user?.firstName || ""}
            className="p-2 border border-gray-300 rounded bg-white"
          />
          <input
            type="text"
            placeholder="Second Name"
            defaultValue={user?.lastName || ""}
            className="p-2 border border-gray-300 rounded bg-white"
          />
          <input
            type="text"
            placeholder="Mobile Number"
            defaultValue={user?.phone || ""}
            className="p-2 border border-gray-300 rounded bg-white sm:col-span-2"
          />
          <input
            type="email"
            placeholder="Email"
            defaultValue={user?.email || ""}
            className="p-2 border border-gray-300 rounded bg-white sm:col-span-2"
          />
        </div>

        {/* Address Section */}
        <h2 className="text-center text-lg font-semibold mb-4 mt-6 flex items-center justify-center gap-2">
          Address <FaEdit className="text-sm text-gray-600" />
        </h2>
        <div className="grid grid-cols-1 gap-4 mb-4">
          <input
            type="text"
            placeholder="Pin code"
            className="p-2 border border-gray-300 rounded bg-white"
          />
          <input
            type="text"
            placeholder="Address (House No., Building, Street, Area)"
            className="p-2 border border-gray-300 rounded bg-white"
          />
          <input
            type="text"
            placeholder="Locality/Town"
            className="p-2 border border-gray-300 rounded bg-white"
          />
          <div className="grid grid-cols-2 gap-4">
            <input
              type="text"
              placeholder="City/District"
              className="p-2 border border-gray-300 rounded bg-white"
            />
            <input
              type="text"
              placeholder="State"
              className="p-2 border border-gray-300 rounded bg-white"
            />
          </div>
        </div>

        {/* Add Another Address */}
        <div className="text-center mt-6">
          <button className="bg-black text-white px-6 py-2 rounded hover:opacity-90">
            Add another Address
          </button>
        </div>

        {/* Logout Button */}
        <div className="text-center mt-4">
          <button
            onClick={logout}
            className="text-red-600 underline text-sm hover:text-red-800"
          >
            Logout
          </button>
        </div>
      </div>
    </div>
  );
};

export default Profile;
