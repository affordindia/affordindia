// Utility to validate Indian phone numbers (10 digits, numeric only)
export function validatePhoneNumber(phone) {
    if (typeof phone !== "string") return false;
    const cleaned = phone.replace(/[^0-9]/g, "");
    return cleaned.length === 10;
}
