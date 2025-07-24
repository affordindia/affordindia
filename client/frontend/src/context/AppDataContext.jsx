import React, { createContext, useContext, useEffect, useState } from "react";
import { getBanners } from "../api/banner.js";
import { getCategories } from "../api/category.js";

const AppDataContext = createContext();

export const AppDataProvider = ({ children }) => {
    const [banners, setBanners] = useState([]);
    const [categories, setCategories] = useState([]); // Filtered categories (silver, brass, wood)
    const [allCategories, setAllCategories] = useState([]); // All categories
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const loadAppData = async () => {
            try {
                // Load both banners and categories in parallel
                const [bannersResponse, categoriesResponse] = await Promise.all(
                    [getBanners(), getCategories()]
                );

                const bannersData =
                    bannersResponse?.banners || bannersResponse || [];
                const categoriesData =
                    categoriesResponse?.categories || categoriesResponse || [];

                // Sort banners by order
                const sortedBanners = bannersData
                    .slice()
                    .sort((a, b) => (a.order || 0) - (b.order || 0));

                // Filter categories to only include silver, brass, and wood for navigation
                const allowedCategories = ["silver", "brass", "wood"];
                const filteredCategories = categoriesData.filter((category) =>
                    allowedCategories.includes(category.name?.toLowerCase())
                );

                setBanners(sortedBanners);
                setCategories(filteredCategories); // For navigation
                setAllCategories(categoriesData); // Store all categories for special pages
            } catch (err) {
                console.error("❌ Failed to load app data:", err);
                setError(err.message || "Failed to load app data");
                setBanners([]);
                setCategories([]);
                setAllCategories([]);
            } finally {
                setLoading(false);
            }
        };

        loadAppData();
    }, []);

    // Smart banner filtering function
    const getBannersByMaterial = (material = "all") => {
        if (material === "all" || !material) {
            return banners;
        }

        return banners.filter(
            (banner) =>
                banner.material?.toLowerCase() === material.toLowerCase()
        );
    };

    // Context value
    const value = {
        banners,
        categories, // Filtered categories (silver, brass, wood) for navigation
        allCategories, // All categories including Rakhi for special pages
        loading,
        error,
        getBannersByMaterial,

        // Refresh functions for manual updates
        refreshData: () => {
            setLoading(true);
            loadAppData();
        },
    };

    return (
        <AppDataContext.Provider value={value}>
            {children}
        </AppDataContext.Provider>
    );
};

export const useAppData = () => {
    const context = useContext(AppDataContext);
    if (!context) {
        throw new Error("useAppData must be used within an AppDataProvider");
    }
    return context;
};

export default AppDataContext;
