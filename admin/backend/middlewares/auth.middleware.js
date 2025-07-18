import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ message: "No token provided" });
    }
    const token = authHeader.split(" ")[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Check both email and password from token against env
        if (
            decoded.email === process.env.ADMIN_EMAIL &&
            decoded.password === process.env.ADMIN_PASSWORD
        ) {
            req.admin = decoded;
            next();
        } else {
            return res
                .status(401)
                .json({ message: "Invalid admin credentials in token" });
        }
    } catch (err) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
};

export default authMiddleware;
