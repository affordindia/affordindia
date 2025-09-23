// Validation utilities for profile and address management

export function validateProfile(profileData) {
    const errors = [];

    if (profileData.name !== undefined) {
        if (
            typeof profileData.name !== "string" ||
            profileData.name.trim().length < 2
        ) {
            errors.push("Name must be at least 2 characters long.");
        }
        if (profileData.name.trim().length > 50) {
            errors.push("Name must be less than 50 characters.");
        }
    }

    if (profileData.phone !== undefined) {
        // Only accept +91 followed by 10 digits
        if (!/^\+91\d{10}$/.test(profileData.phone)) {
            errors.push(
                "Phone number must be in format +919876543210 (starting with +91 followed by 10 digits)."
            );
        }
    }

    return errors;
}

export function validateAddress(address) {
    const errors = [];

    if (
        !address.label ||
        typeof address.label !== "string" ||
        address.label.trim().length < 2
    ) {
        errors.push(
            "Address label is required and must be at least 2 characters."
        );
    }
    if (address.label && address.label.trim().length > 30) {
        errors.push("Address label must be less than 30 characters.");
    }

    if (
        !address.houseNumber ||
        typeof address.houseNumber !== "string" ||
        address.houseNumber.trim().length < 1
    ) {
        errors.push("House/Building number is required.");
    }
    if (address.houseNumber && address.houseNumber.trim().length > 50) {
        errors.push("House/Building number must be less than 50 characters.");
    }

    if (
        !address.city ||
        typeof address.city !== "string" ||
        address.city.trim().length < 2
    ) {
        errors.push("City is required and must be at least 2 characters.");
    }
    if (address.city && address.city.trim().length > 50) {
        errors.push("City name must be less than 50 characters.");
    }

    if (
        !address.state ||
        typeof address.state !== "string" ||
        address.state.trim().length < 2
    ) {
        errors.push("State is required and must be at least 2 characters.");
    }
    if (address.state && address.state.trim().length > 50) {
        errors.push("State name must be less than 50 characters.");
    }

    if (!address.pincode || !/^\d{6}$/.test(address.pincode.toString())) {
        errors.push("Pincode must be exactly 6 digits.");
    }

    // Optional fields validation
    if (
        address.street &&
        (typeof address.street !== "string" ||
            address.street.trim().length > 100)
    ) {
        errors.push("Street address must be less than 100 characters.");
    }

    if (
        address.landmark &&
        (typeof address.landmark !== "string" ||
            address.landmark.trim().length > 100)
    ) {
        errors.push("Landmark must be less than 100 characters.");
    }

    if (
        address.area &&
        (typeof address.area !== "string" || address.area.trim().length > 100)
    ) {
        errors.push("Area must be less than 100 characters.");
    }

    if (address.phone) {
        // Only accept +91 followed by 10 digits
        if (!/^\+91\d{10}$/.test(address.phone)) {
            errors.push(
                "Address phone number must be in format +919876543210 (starting with +91 followed by 10 digits)."
            );
        }
    }

    if (
        address.isDefault !== undefined &&
        typeof address.isDefault !== "boolean"
    ) {
        errors.push("isDefault must be a boolean value.");
    }

    return errors;
}
