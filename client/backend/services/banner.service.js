import Banner from "../models/banner.model.js";

export const getAllBannersService = async () => {
    return Banner.find().sort({ order: 1 });
};

export const getBannersByIdsService = async (bannerIds) => {
    const banners = await Banner.find({
        _id: { $in: bannerIds },
    }).sort({ order: 1 });

    const foundIds = banners.map((banner) => banner._id.toString());
    const failedIds = bannerIds.filter((id) => !foundIds.includes(id));

    return {
        count: banners.length,
        banners,
        failedIds: failedIds.length > 0 ? failedIds : undefined,
    };
};
