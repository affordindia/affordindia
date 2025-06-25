import {
    createBannerService,
    getAllBannersService,
    getBannerByIdService,
    updateBannerService,
    deleteBannerService,
} from "../services/banner.service.js";
import { uploadToCloudinary } from "../services/upload.service.js";

// Create a new banner
export const createBanner = async (req, res) => {
    try {
        let imageUrl = req.body.image;
        if (req.file) {
            const uploadResult = await uploadToCloudinary(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                    "base64"
                )}`,
                "banners"
            );
            imageUrl = uploadResult.secure_url;
        }
        const banner = await createBannerService({
            ...req.body,
            image: imageUrl,
        });
        res.status(201).json(banner);
    } catch (err) {
        res.status(500).json({
            message: "Failed to create banner",
            error: err.message,
        });
    }
};

// Get all banners (simple, sorted by order)
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

// Get banner by ID
export const getBannerById = async (req, res) => {
    try {
        const banner = await getBannerByIdService(req.params.id);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        res.json(banner);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch banner",
            error: err.message,
        });
    }
};

// Update banner
export const updateBanner = async (req, res) => {
    try {
        let updateData = { ...req.body };
        if (req.file) {
            const uploadResult = await uploadToCloudinary(
                `data:${req.file.mimetype};base64,${req.file.buffer.toString(
                    "base64"
                )}`,
                "banners"
            );
            updateData.image = uploadResult.secure_url;
        }
        const banner = await updateBannerService(req.params.id, updateData);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        res.json(banner);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update banner",
            error: err.message,
        });
    }
};

// Delete banner
export const deleteBanner = async (req, res) => {
    try {
        const banner = await deleteBannerService(req.params.id);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        res.json({ message: "Banner deleted" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete banner",
            error: err.message,
        });
    }
};

// Toggle banner status (active/inactive)
export const toggleBannerStatus = async (req, res) => {
    try {
        const banner = await getBannerByIdService(req.params.id);
        if (!banner)
            return res.status(404).json({ message: "Banner not found" });
        banner.status = banner.status === "active" ? "inactive" : "active";
        await banner.save();
        res.json({ message: `Banner status set to ${banner.status}`, banner });
    } catch (err) {
        res.status(500).json({
            message: "Failed to toggle banner status",
            error: err.message,
        });
    }
};
