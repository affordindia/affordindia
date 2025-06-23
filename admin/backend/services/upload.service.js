import cloudinary from "../config/cloudinary.config.js";

export const uploadToCloudinary = async (filePath, folder = "products") => {
    return await cloudinary.uploader.upload(filePath, {
        folder,
        resource_type: "auto",
    });
};
