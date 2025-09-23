import InvoiceCounter from "../models/invoiceCounter.model.js";

/**
 * Generate random alphanumeric string
 * @param {number} length - Length of random string
 * @returns {string} Random alphanumeric string
 */
const generateRandomChars = (length = 4) => {
    const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
    let result = "";
    for (let i = 0; i < length; i++) {
        result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
};

/**
 * Format sequence number with leading zeros
 * @param {number} sequence - Sequence number
 * @param {number} length - Total length with leading zeros
 * @returns {string} Formatted sequence number
 */
const formatSequence = (sequence, length = 4) => {
    return sequence.toString().padStart(length, "0");
};

/**
 * Generate unique invoice number
 * Format: INV_ABCD_0001
 * @param {number} year - Year for the invoice (optional, defaults to current year)
 * @returns {Promise<string>} Generated invoice number
 */
export const generateInvoiceNumber = async (year = null) => {
    try {
        const currentYear = year || new Date().getFullYear();

        // Get next sequence number atomically
        const sequence = await InvoiceCounter.getNextSequence(currentYear);

        // Generate random 4-character string
        const randomChars = generateRandomChars(4);

        // Format sequence number
        const formattedSequence = formatSequence(sequence, 4);

        // Construct invoice number
        const invoiceNumber = `INV_${randomChars}_${formattedSequence}`;

        console.log(
            `Generated invoice number: ${invoiceNumber} (Year: ${currentYear}, Sequence: ${sequence})`
        );

        return invoiceNumber;
    } catch (error) {
        console.error("Error generating invoice number:", error);
        throw new Error("Failed to generate invoice number");
    }
};

/**
 * Parse invoice number to extract components
 * @param {string} invoiceNumber - Invoice number to parse
 * @returns {object} Parsed components
 */
export const parseInvoiceNumber = (invoiceNumber) => {
    const pattern = /^INV_([A-Z0-9]{4})_(\d{4})$/;
    const match = invoiceNumber.match(pattern);

    if (!match) {
        throw new Error("Invalid invoice number format");
    }

    return {
        prefix: "INV",
        randomChars: match[1],
        sequence: parseInt(match[2], 10),
        full: invoiceNumber,
    };
};

/**
 * Validate invoice number format
 * @param {string} invoiceNumber - Invoice number to validate
 * @returns {boolean} Whether the format is valid
 */
export const validateInvoiceNumber = (invoiceNumber) => {
    const pattern = /^INV_[A-Z0-9]{4}_\d{4}$/;
    return pattern.test(invoiceNumber);
};

/**
 * Get current sequence for a year (without incrementing)
 * @param {number} year - Year to check
 * @returns {Promise<number>} Current sequence number
 */
export const getCurrentSequence = async (year = null) => {
    try {
        const currentYear = year || new Date().getFullYear();
        return await InvoiceCounter.getCurrentSequence(currentYear);
    } catch (error) {
        console.error("Error getting current sequence:", error);
        throw new Error("Failed to get current sequence");
    }
};

/**
 * Generate preview invoice number (for testing/preview purposes)
 * This does NOT increment the counter
 * @param {number} year - Year for preview
 * @returns {Promise<string>} Preview invoice number
 */
export const generatePreviewInvoiceNumber = async (year = null) => {
    try {
        const currentYear = year || new Date().getFullYear();
        const currentSequence = await getCurrentSequence(currentYear);
        const nextSequence = currentSequence + 1;

        const randomChars = generateRandomChars(4);
        const formattedSequence = formatSequence(nextSequence, 4);

        return `INV_${randomChars}_${formattedSequence}`;
    } catch (error) {
        console.error("Error generating preview invoice number:", error);
        throw new Error("Failed to generate preview invoice number");
    }
};

export default {
    generateInvoiceNumber,
    parseInvoiceNumber,
    validateInvoiceNumber,
    getCurrentSequence,
    generatePreviewInvoiceNumber,
};
