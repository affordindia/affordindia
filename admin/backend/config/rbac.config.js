// RBAC Configuration for Admin System
// Access Levels: 1 (lowest) to 5 (superadmin)

export const ACCESS_LEVELS = {
    LEVEL_1: 1, // Basic access
    LEVEL_2: 2, // Moderate access
    LEVEL_3: 3, // Advanced access
    LEVEL_4: 4, // Manager access
    LEVEL_5: 5, // Superadmin access
};

// Permissions - Single source of truth for access control
export const PERMISSIONS = {
    // Dashboard & Analytics
    "dashboard.view": 1,
    "analytics.view": 2,
    "analytics.export": 3,

    // Products
    "products.view": 1,
    "products.create": 2,
    "products.update": 2,
    "products.delete": 3,
    "products.bulk_update": 3,

    // Categories
    "categories.view": 1,
    "categories.create": 3,
    "categories.update": 3,
    "categories.delete": 4,

    // Orders
    "orders.view": 1,
    "orders.update": 2,
    "orders.cancel": 3,
    "orders.refund": 3,

    // Users (customers)
    "users.view": 2,
    "users.update": 3,
    "users.block": 3,
    "users.delete": 4,

    // Admin Management
    "admins.view": 4,
    "admins.create": 4,
    "admins.update": 4,
    "admins.delete": 5,
    "admins.manage_permissions": 5,

    // System Features
    "banners.view": 1,
    "banners.create": 3,
    "banners.update": 3,
    "banners.delete": 3,

    "coupons.view": 2,
    "coupons.create": 3,
    "coupons.update": 3,
    "coupons.delete": 3,

    "reviews.view": 1,
    "reviews.moderate": 2,
    "reviews.delete": 3,

    // System Configuration
    "config.view": 4,
    "config.update": 4,
    "system.backup": 5,
    "system.logs": 4,
};

// Helper function to check access
export const hasAccess = (userLevel, requiredLevel) => {
    return userLevel >= requiredLevel;
};

// Get permission access level
export const getPermissionLevel = (permission) => {
    const level = PERMISSIONS[permission];
    if (level === undefined) {
        console.warn(
            `Warning: Permission '${permission}' not found in RBAC config`
        );
        return 5; // Default to superadmin if permission not found
    }
    return level;
};

// Check if user has specific permission
export const hasPermission = (userLevel, permission) => {
    const requiredLevel = getPermissionLevel(permission);
    return hasAccess(userLevel, requiredLevel);
};

// Validate access level
export const isValidAccessLevel = (level) => {
    return Number.isInteger(level) && level >= 1 && level <= 5;
};

// Get all permissions for a specific access level
export const getPermissionsForLevel = (accessLevel) => {
    return Object.entries(PERMISSIONS)
        .filter(([permission, requiredLevel]) => accessLevel >= requiredLevel)
        .map(([permission]) => permission);
};
