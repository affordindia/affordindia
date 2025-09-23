import { getAllBannersService } from "../services/banner.service.js";

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
