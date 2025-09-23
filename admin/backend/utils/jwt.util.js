import jwt from "jsonwebtoken";

// Cookie configuration
export const COOKIE_OPTIONS = {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: process.env.NODE_ENV === "production" ? "None" : "Lax",
    path: "/",
};

// Token expiration times
export const ACCESS_TOKEN_EXPIRES = "15m";
export const REFRESH_TOKEN_EXPIRES = "7d";

// Cookie names
export const ACCESS_TOKEN_COOKIE = "admin_access_token";
export const REFRESH_TOKEN_COOKIE = "admin_refresh_token";

// Generate JWT tokens
export const generateTokens = (adminData) => {
    const payload = {
        adminId: adminData._id,
        email: adminData.email,
        accessLevel: adminData.accessLevel,
    };

    const accessToken = jwt.sign(
        { ...payload, type: "access" },
        process.env.JWT_SECRET,
        { expiresIn: ACCESS_TOKEN_EXPIRES }
    );

    const refreshToken = jwt.sign(
        { ...payload, type: "refresh" },
        process.env.JWT_REFRESH_SECRET,
        { expiresIn: REFRESH_TOKEN_EXPIRES }
    );

    return { accessToken, refreshToken };
};

// Verify access token
export const verifyAccessToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        if (decoded.type !== "access") {
            throw new Error("Invalid token type");
        }
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Verify refresh token
export const verifyRefreshToken = (token) => {
    try {
        const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
        if (decoded.type !== "refresh") {
            throw new Error("Invalid token type");
        }
        return { success: true, data: decoded };
    } catch (error) {
        return { success: false, error: error.message };
    }
};

// Set token cookies
export const setTokenCookies = (res, accessToken, refreshToken) => {
    res.cookie(ACCESS_TOKEN_COOKIE, accessToken, {
        ...COOKIE_OPTIONS,
        maxAge: 15 * 60 * 1000, // 15 minutes in milliseconds
    });

    res.cookie(REFRESH_TOKEN_COOKIE, refreshToken, {
        ...COOKIE_OPTIONS,
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
    });
};

// Clear token cookies
export const clearTokenCookies = (res) => {
    res.clearCookie(ACCESS_TOKEN_COOKIE, COOKIE_OPTIONS);
    res.clearCookie(REFRESH_TOKEN_COOKIE, COOKIE_OPTIONS);
};
