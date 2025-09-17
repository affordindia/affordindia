// Utility functions for handling form data conversions

export const convertToBoolean = (value) => {
    if (value === undefined || value === null) {
        return undefined;
    }

    // Handle string values from checkboxes
    if (typeof value === "string") {
        return value === "on" || value === "true";
    }

    // Handle actual boolean values
    return Boolean(value);
};

export const convertBooleanFields = (data, booleanFields) => {
    const converted = { ...data };

    booleanFields.forEach((field) => {
        if (converted[field] !== undefined) {
            converted[field] = convertToBoolean(converted[field]);
        }
    });

    return converted;
};

export default { convertToBoolean, convertBooleanFields };
