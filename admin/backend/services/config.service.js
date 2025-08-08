import SiteConfig from "../models/siteConfig.model.js";

// Get all site configuration
export const getSiteConfigService = async () => {
    let config = await SiteConfig.findOne();

    // If no config exists, create default one
    if (!config) {
        config = await SiteConfig.create({});
    }

    return config;
};

// Update site configuration
export const updateSiteConfigService = async (
    updateData,
    updatedBy = "admin"
) => {
    const data = {
        ...updateData,
        lastUpdated: new Date(),
        updatedBy,
    };

    const config = await SiteConfig.findOneAndUpdate(
        {}, // Find any config document
        data,
        {
            new: true,
            upsert: true, // Create if doesn't exist
            runValidators: true,
        }
    );

    return config;
};

// Get specific configuration section
export const getConfigSectionService = async (section) => {
    const config = await SiteConfig.findOne();

    if (!config) {
        return null;
    }

    return config[section];
};

// Update specific configuration section
export const updateConfigSectionService = async (
    section,
    updateData,
    updatedBy = "admin"
) => {
    const config = await SiteConfig.findOne();
    if (!config) {
        return null;
    }

    // Update specific section
    config[section] = { ...config[section], ...updateData };
    config.lastUpdated = new Date();
    config.updatedBy = updatedBy;

    await config.save();

    return config[section];
};

// Reset configuration to defaults
export const resetConfigService = async () => {
    await SiteConfig.deleteMany({});
    const config = await SiteConfig.create({});
    return config;
};
