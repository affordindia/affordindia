import jwt from "jsonwebtoken";

// POST /api/admin/login
export const loginAdmin = (req, res) => {
    const { email, password } = req.body;
    try {
        if (
            email === process.env.ADMIN_EMAIL &&
            password === process.env.ADMIN_PASSWORD
        ) {
            // Credentials match, issue JWT with email and password in payload
            const token = jwt.sign(
                { email, password },
                process.env.JWT_SECRET,
                {
                    expiresIn: "1d",
                }
            );
            return res.json({ token });
        } else {
            return res.status(401).json({ message: "Invalid credentials" });
        }
    } catch (error) {
        return res
            .status(500)
            .json({ message: "Server error", error: error.message });
    }
};
