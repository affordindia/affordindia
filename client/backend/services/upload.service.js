import cloudinary from "../config/cloudinary.config.js";

export const uploadToCloudinary = async (fileBuffer, folder = "reviews") => {
    return new Promise((resolve, reject) => {
        cloudinary.uploader
            .upload_stream(
                {
                    folder,
                    resource_type: "auto",
                },
                (error, result) => {
                    if (error) {
                        reject(error);
                    } else {
                        resolve(result);
                    }
                }
            )
            .end(fileBuffer);
    });
};

export const deleteFromCloudinary = async (publicId) => {
    try {
        return await cloudinary.uploader.destroy(publicId);
    } catch (error) {
        console.error("Error deleting image from Cloudinary:", error);
        throw error;
    }
};

export const uploadMultipleToCloudinary = async (files, folder = "reviews") => {
    const uploadPromises = files.map((file) =>
        uploadToCloudinary(file.buffer, folder)
    );
    return await Promise.all(uploadPromises);
};
