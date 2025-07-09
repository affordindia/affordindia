// Validation utilities for profile and address management

export function validateProfile(profileData) {
    const errors = [];
    if (
        profileData.name !== undefined &&
        typeof profileData.name !== "string"
    ) {
        errors.push("Name must be a string.");
    }
    if (profileData.phone !== undefined) {
        if (!/^\d{10}$/.test(profileData.phone)) {
            errors.push("Phone must be a 10-digit number.");
        }
    }
    return errors;
}

export function validateAddress(address) {
    const errors = [];
    if (!address.label || typeof address.label !== "string") {
        errors.push("Label is required.");
    }
    if (!address.houseNumber || typeof address.houseNumber !== "string") {
        errors.push("House number is required.");
    }
    if (!address.city || typeof address.city !== "string") {
        errors.push("City is required.");
    }
    if (!address.state || typeof address.state !== "string") {
        errors.push("State is required.");
    }
    if (!address.pincode || !/^\d{6}$/.test(address.pincode)) {
        errors.push("Pincode must be a 6-digit number.");
    }
    if (address.phone && !/^\d{10}$/.test(address.phone)) {
        errors.push("Phone must be a 10-digit number.");
    }
    return errors;
}
