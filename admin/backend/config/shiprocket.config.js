import dotenv from 'dotenv';
dotenv.config();

export const SHIPROCKET_CONFIG = {
    BASE_URL: process.env.SHIPROCKET_BASE_URL || 'https://apiv2.shiprocket.in',
    EMAIL: process.env.SHIPROCKET_EMAIL,
    PASSWORD: process.env.SHIPROCKET_PASSWORD,
    PICKUP_LOCATION: process.env.SHIPROCKET_PICKUP_LOCATION || 'VANDANA',
    
    // Default dimensions for products without specified dimensions (in cm)
    DEFAULT_DIMENSIONS: {
        length: 10,
        breadth: 10,
        height: 5,
        weight: 0.5 // in kg
    },
    
    // Token expiry buffer (days before actual expiry to refresh)
    TOKEN_EXPIRY_BUFFER: 9, // Refresh 1 day before 10-day expiry
    
    // Feature flag
    ENABLED: process.env.SHIPROCKET_ENABLED === 'true',
    
    // Server URL for webhook configuration
    SERVER_URL: process.env.SERVER_URL || 'http://localhost:5000'
};
