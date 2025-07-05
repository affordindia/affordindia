// Centralized error handler middleware for Express
// Place this after all routes in server.js

const errorHandler = (err, req, res, next) => {
    // Log the error stack for debugging
    console.error(err.stack);

    const status = err.status || 500;
    const response = {
        success: false,
        message: err.message || "Internal Server Error",
    };

    // Only include stack trace in development
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(status).json(response);
};

export default errorHandler;
