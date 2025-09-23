import crypto from "crypto";

/**
 * Generate unique Order ID
 * Format: ORD-{base36timestamp}-{randomhex}
 * Example: ORD-LXZ2M4K-A7B3
 * @returns {string} Generated order ID
 */
export function generateOrderId() {
    // Get IST timestamp (in seconds)
    const istOffset = 5.5 * 60 * 60 * 1000; // 5.5 hours in ms
    const now = new Date(Date.now() + istOffset);
    const epochSeconds = Math.floor(now.getTime() / 1000);

    // Convert epoch to base36 (shorter alphanumeric string)
    const base36Time = epochSeconds.toString(36).toUpperCase();

    // Generate random suffix (4 chars, alphanumeric uppercase)
    const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();

    // Final Order ID
    return `ORD-${base36Time}-${randomSuffix}`;
}
