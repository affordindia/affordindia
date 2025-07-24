import { getBanners as originalGetBanners } from "./banner.js";
import { getCategories as originalGetCategories } from "./category.js";

// Global references to context (will be set by App.jsx)
let appDataContext = null;

export const setAppDataContext = (context) => {
    appDataContext = context;
};

// Smart banner API - uses context if available, falls back to API
export const getBanners = async (material = null) => {
    console.log("🎯 Smart getBanners called:", {
        material,
        hasContext: !!appDataContext,
    });

    // If context is available and loaded, use it
    if (
        appDataContext &&
        !appDataContext.bannersLoading &&
        !appDataContext.bannersError
    ) {
        console.log("✅ Using cached banners from context");
        const banners = material
            ? appDataContext.getBannersByMaterial(material)
            : appDataContext.getBannersByMaterial("all");

        // Return in same format as API
        return { banners };
    }

    // Fallback to original API
    console.log("⚡ Falling back to API call");
    return originalGetBanners();
};

// Smart categories API - uses context if available, falls back to API
export const getCategories = async () => {
    console.log("🎯 Smart getCategories called:", {
        hasContext: !!appDataContext,
    });

    // If context is available and loaded, use it
    if (
        appDataContext &&
        !appDataContext.categoriesLoading &&
        !appDataContext.categoriesError
    ) {
        console.log("✅ Using cached categories from context");
        const categories = appDataContext.getCategoriesData();

        // Return in same format as API
        return { categories };
    }

    // Fallback to original API
    console.log("⚡ Falling back to API call");
    return originalGetCategories();
};

// Export originals for direct access if needed
export { originalGetBanners, originalGetCategories };
