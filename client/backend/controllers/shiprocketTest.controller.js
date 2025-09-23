import shiprocketAuth from "../services/shiprocketAuth.service.js";

/**
 * Test Shiprocket authentication
 */
export const testAuth = async (req, res, next) => {
    try {
        console.log("Testing Shiprocket authentication...");
        
        const token = await shiprocketAuth.authenticate();
        
        res.json({
            success: true,
            message: "Shiprocket authentication successful",
            data: {
                hasToken: !!token,
                tokenLength: token ? token.length : 0,
                tokenPreview: token ? `${token.substring(0, 20)}...` : null,
                fullToken: token, // 🚨 FULL TOKEN - Remove in production!
                isValid: shiprocketAuth.isTokenValid(),
                expiresIn: shiprocketAuth.tokenExpiry ? 
                    Math.round((shiprocketAuth.tokenExpiry - Date.now()) / (1000 * 60 * 60 * 24)) + " days" : 
                    "Unknown"
            }
        });
        
    } catch (error) {
        console.error("Authentication test failed:", error);
        res.status(500).json({
            success: false,
            message: "Authentication failed",
            error: error.message
        });
    }
};

/**
 * Get current authentication status
 */
export const getAuthStatus = async (req, res, next) => {
    try {
        const isValid = shiprocketAuth.isTokenValid();
        
        res.json({
            success: true,
            data: {
                isAuthenticated: isValid,
                hasToken: !!shiprocketAuth.token,
                expiresIn: shiprocketAuth.tokenExpiry ? 
                    Math.round((shiprocketAuth.tokenExpiry - Date.now()) / (1000 * 60 * 60 * 24)) + " days" : 
                    "No token"
            }
        });
        
    } catch (error) {
        next(error);
    }
};

/**
 * Clear authentication token (force re-authentication)
 */
export const clearAuth = async (req, res, next) => {
    try {
        shiprocketAuth.clearToken();
        
        res.json({
            success: true,
            message: "Authentication token cleared successfully"
        });
        
    } catch (error) {
        next(error);
    }
};