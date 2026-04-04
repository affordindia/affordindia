import api from "./axios";

// Get all banners
export const getBanners = async () => {
    // console.log("API CALL: getBanners");
    const res = await api.get("/banners");
    return res.data;
};

// Get specific banners by IDs
export const getBannersByIds = async (bannerIds) => {
    console.log("API CALL: getBannersByIds", bannerIds);
    const res = await api.post("/banners/bulk", { bannerIds });
    return res.data;
};
