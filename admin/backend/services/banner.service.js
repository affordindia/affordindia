import Banner from "../models/banner.model.js";

export const createBannerService = async (data) => {
    const banner = new Banner(data);
    await banner.save();
    return banner;
};

// Get all banners, sorted by order
export const getAllBannersService = async () => {
    return Banner.find().sort({ order: 1 });
};

export const getBannerByIdService = async (id) => {
    return Banner.findById(id);
};

export const updateBannerService = async (id, updateData) => {
    return Banner.findByIdAndUpdate(id, updateData, { new: true });
};

export const deleteBannerService = async (id) => {
    return Banner.findByIdAndDelete(id);
};
