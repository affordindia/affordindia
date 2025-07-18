// Dummy authentication middleware for development
// Replace with real authentication logic when ready

const authMiddleware = (req, res, next) => {
    next();
};

export default authMiddleware;
