import React from "react";
import { useAppData } from "../../context/AppDataContext.jsx";
import BannersOptimized from "./BannersOptimized.jsx";

// Drop-in replacement for original Banners component
// This component automatically uses context when available
// but maintains the exact same API as the original
const Banners = ({ material = "all" }) => {
    const { bannersLoading, bannersError } = useAppData();

    // Show loading state only on initial app load
    if (bannersLoading) {
        return (
            <div className="text-center py-8 text-gray-500">
                Loading banners...
            </div>
        );
    }

    if (bannersError) {
        return (
            <div className="text-center py-8 text-red-500">
                Error loading banners: {bannersError}
            </div>
        );
    }

    // Use optimized version that gets data from context
    return <BannersOptimized material={material} />;
};

export default Banners;
