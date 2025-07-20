import React from 'react';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
    const { user, logout } = useAuth();

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-lg shadow-lg p-8">
                <h1 className="text-3xl font-bold text-gray-800 mb-6">My Profile</h1>
                
                <div className="space-y-6">
                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Phone Number
                                </label>
                                <p className="text-lg text-gray-800">{user?.phone || 'Not available'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Name
                                </label>
                                <p className="text-lg text-gray-800">{user?.name || 'Not provided'}</p>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-600 mb-1">
                                    Account Created
                                </label>
                                <p className="text-lg text-gray-800">
                                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Not available'}
                                </p>
                            </div>
                        </div>
                    </div>

                    <div className="border-b border-gray-200 pb-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Quick Actions</h2>
                        <div className="flex flex-wrap gap-4">
                            <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                                Edit Profile
                            </button>
                            <button className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                                Order History
                            </button>
                            <button className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
                                Addresses
                            </button>
                        </div>
                    </div>

                    <div className="pt-4">
                        <h2 className="text-xl font-semibold text-gray-700 mb-4">Account Settings</h2>
                        <button 
                            onClick={logout}
                            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                        >
                            Logout
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;
