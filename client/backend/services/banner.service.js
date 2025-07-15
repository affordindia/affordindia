import Banner from "../models/banner.model.js";

export const getAllBannersService = async () => {
    return Banner.find().sort({ order: 1 });
};
