import axios from "axios";

class ShiprocketAuthService {
    constructor() {
        this.baseURL = "https://apiv2.shiprocket.in/v1/external";
        this.token = null;
        this.tokenExpiry = null;
    }

    /**
     * Authenticate with Shiprocket and get JWT token
     * @returns {Promise<string>} JWT token
     */
    async authenticate() {
        try {
            // Check if we have a valid token
            if (this.token && this.tokenExpiry && Date.now() < this.tokenExpiry) {
                console.log("Using existing valid Shiprocket token");
                return this.token;
            }

            console.log("Getting new Shiprocket authentication token...");

            const response = await axios.post(`${this.baseURL}/auth/login`, {
                email: process.env.SHIPROCKET_EMAIL,
                password: process.env.SHIPROCKET_PASSWORD,
            }, {
                headers: {
                    'Content-Type': 'application/json'
                }
            });

            if (response.data && response.data.token) {
                this.token = response.data.token;
                // Token is valid for 10 days, we'll refresh it after 9 days to be safe
                this.tokenExpiry = Date.now() + (9 * 24 * 60 * 60 * 1000);

                console.log("✅ Shiprocket authentication successful");
                console.log("Token expires in 9 days");
                
                return this.token;
            } else {
                throw new Error("No token received in response");
            }
        } catch (error) {
            console.error("❌ Shiprocket authentication failed:", error.response?.data || error.message);
            
            if (error.response?.status === 401) {
                throw new Error("Invalid Shiprocket credentials. Please check email and password.");
            } else if (error.response?.status === 422) {
                throw new Error("Invalid request format. Please check email and password fields.");
            } else {
                throw new Error(`Shiprocket authentication failed: ${error.message}`);
            }
        }
    }

    /**
     * Get current token (authenticate if needed)
     * @returns {Promise<string>} JWT token
     */
    async getToken() {
        return await this.authenticate();
    }

    /**
     * Check if current token is valid
     * @returns {boolean} true if token is valid
     */
    isTokenValid() {
        return this.token && this.tokenExpiry && Date.now() < this.tokenExpiry;
    }

    /**
     * Clear stored token (force re-authentication on next call)
     */
    clearToken() {
        this.token = null;
        this.tokenExpiry = null;
        console.log("Shiprocket token cleared");
    }

    /**
     * Get authorization header for API calls
     * @returns {Promise<object>} Authorization header object
     */
    async getAuthHeader() {
        const token = await this.getToken();
        return {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        };
    }
}

// Create singleton instance
const shiprocketAuth = new ShiprocketAuthService();

export default shiprocketAuth;