import {
    getSiteConfigService,
    updateSiteConfigService,
    getConfigSectionService,
    updateConfigSectionService,
    resetConfigService,
} from "../services/config.service.js";

// Get all site configuration
export const getSiteConfig = async (req, res) => {
    try {
        const config = await getSiteConfigService();

        res.json({
            success: true,
            config,
        });
    } catch (error) {
        console.error("Get site config error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch site configuration",
            error: error.message,
        });
    }
};

// Update site configuration
export const updateSiteConfig = async (req, res) => {
    try {
        const config = await updateSiteConfigService(req.body);

        res.json({
            success: true,
            message: "Site configuration updated successfully",
            config,
        });
    } catch (error) {
        console.error("Update site config error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update site configuration",
            error: error.message,
        });
    }
};

// Get specific configuration section
export const getConfigSection = async (req, res) => {
    try {
        const { section } = req.params;
        const sectionData = await getConfigSectionService(section);

        if (!sectionData) {
            return res.status(404).json({
                success: false,
                message: `Configuration section '${section}' not found`,
            });
        }

        res.json({
            success: true,
            section,
            data: sectionData,
        });
    } catch (error) {
        console.error("Get config section error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to fetch configuration section",
            error: error.message,
        });
    }
};

// Update specific configuration section
export const updateConfigSection = async (req, res) => {
    try {
        const { section } = req.params;
        const sectionData = await updateConfigSectionService(section, req.body);

        if (!sectionData) {
            return res.status(404).json({
                success: false,
                message: "Site configuration not found",
            });
        }

        res.json({
            success: true,
            message: `${section} configuration updated successfully`,
            section,
            data: sectionData,
        });
    } catch (error) {
        console.error("Update config section error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to update configuration section",
            error: error.message,
        });
    }
};

// Reset configuration to defaults
export const resetConfig = async (req, res) => {
    try {
        const config = await resetConfigService();

        res.json({
            success: true,
            message: "Site configuration reset to defaults",
            config,
        });
    } catch (error) {
        console.error("Reset config error:", error);
        res.status(500).json({
            success: false,
            message: "Failed to reset site configuration",
            error: error.message,
        });
    }
};
