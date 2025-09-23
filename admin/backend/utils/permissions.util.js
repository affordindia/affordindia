import {
    PERMISSIONS,
    hasPermission,
    getPermissionsForLevel,
} from "../config/rbac.config.js";

// Check multiple permissions (AND logic)
export const hasAllPermissions = (userLevel, permissions) => {
    return permissions.every((permission) =>
        hasPermission(userLevel, permission)
    );
};

// Check multiple permissions (OR logic)
export const hasAnyPermission = (userLevel, permissions) => {
    return permissions.some((permission) =>
        hasPermission(userLevel, permission)
    );
};

// Get user's permission summary
export const getUserPermissionSummary = (accessLevel) => {
    const userPermissions = getPermissionsForLevel(accessLevel);

    return {
        accessLevel,
        totalPermissions: userPermissions.length,
        permissions: userPermissions,
        canManageAdmins: hasPermission(accessLevel, "admins.view"),
        canDeleteUsers: hasPermission(accessLevel, "users.delete"),
        canUpdateConfig: hasPermission(accessLevel, "config.update"),
        isSuperAdmin: accessLevel === 5,
    };
};

// Validate permission exists
export const isValidPermission = (permission) => {
    return permission in PERMISSIONS;
};

// Get all available permissions
export const getAllPermissions = () => {
    return Object.keys(PERMISSIONS);
};

// Group permissions by category
export const getPermissionsByCategory = () => {
    const grouped = {};

    Object.keys(PERMISSIONS).forEach((permission) => {
        const [category] = permission.split(".");
        if (!grouped[category]) {
            grouped[category] = [];
        }
        grouped[category].push(permission);
    });

    return grouped;
};
