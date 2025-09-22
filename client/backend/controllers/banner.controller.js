import {
    getAllBannersService,
    getBannersByIdsService,
} from "../services/banner.service.js";

export const getAllBanners = async (req, res) => {
    try {
        const banners = await getAllBannersService();
        res.json(banners);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch banners",
            error: err.message,
        });
    }
};

export const getBannersByIds = async (req, res) => {
    try {
        const { bannerIds } = req.body;

        if (!bannerIds || !Array.isArray(bannerIds)) {
            return res.status(400).json({
                message: "bannerIds array is required in request body",
            });
        }

        if (bannerIds.length === 0) {
            return res.json({ count: 0, banners: [] });
        }

        if (bannerIds.length > 20) {
            return res.status(400).json({
                message: "Maximum 20 banner IDs allowed per request",
            });
        }

        // Validate ObjectId format
        const invalidIds = bannerIds.filter(
            (id) => !/^[0-9a-fA-F]{24}$/.test(id)
        );
        if (invalidIds.length > 0) {
            return res.status(400).json({
                message: "Invalid banner ID format",
                invalidIds,
            });
        }

        const result = await getBannersByIdsService(bannerIds);
        res.json(result);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch banners by IDs",
            error: err.message,
        });
    }
};
