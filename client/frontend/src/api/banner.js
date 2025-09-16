import api from "./axios";

// Get all banners
export const getBanners = async () => {
    // console.log("API CALL: getBanners");
    const res = await api.get("/banners");
    return res.data;
};
