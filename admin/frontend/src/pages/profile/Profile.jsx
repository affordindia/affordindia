import React from "react";
import { useAuth } from "../../context/AuthContext.jsx";

const Profile = () => {
    const { admin } = useAuth();
    if (!admin) return <div className="p-8">No profile data found.</div>;
    return (
        <div className="max-w-xl mx-auto bg-white rounded-2xl shadow-xl p-10 mt-12 border border-admin-border flex flex-col items-center">
            <div className="w-20 h-20 bg-admin-primary rounded-full flex items-center justify-center mb-4">
                <span className="text-3xl text-white font-bold">
                    {admin.name?.charAt(0)?.toUpperCase() || "A"}
                </span>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-admin-primary">
                {admin.name}
            </h1>
            <p className="text-admin-text-secondary mb-6 text-lg">
                {admin.email}
            </p>
            <div className="w-full grid grid-cols-1 gap-6">
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-admin-text">
                        Access Level:
                    </span>
                    <span className="text-admin-text-secondary">
                        {admin.accessLevel}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-admin-text">
                        Active:
                    </span>
                    <span
                        className={`font-semibold ${
                            admin.isActive ? "text-green-600" : "text-red-600"
                        }`}
                    >
                        {admin.isActive ? "Active" : "Inactive"}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-admin-text">
                        Last Login:
                    </span>
                    <span className="text-admin-text-secondary">
                        {admin.lastLogin
                            ? new Date(admin.lastLogin).toLocaleString()
                            : "-"}
                    </span>
                </div>
                <div className="flex justify-between items-center">
                    <span className="font-semibold text-admin-text">
                        Created At:
                    </span>
                    <span className="text-admin-text-secondary">
                        {admin.createdAt
                            ? new Date(admin.createdAt).toLocaleString()
                            : "-"}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Profile;
