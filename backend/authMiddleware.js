import jwt from "jsonwebtoken";

const authMiddleware = (req, res, next) => {
  try {
    // Get token from headers: usually "Authorization: Bearer <token>"
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "No token provided, authorization denied" });
    }

    const token = authHeader.split(" ")[1];

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Attach userId to request for use in controllers
    req.userId = decoded.id;

    next(); // pass control to next middleware/controller
  } catch (error) {
    console.error("❌ Auth error:", error);
    return res.status(401).json({ message: "Token is invalid or expired" });
  }
};

export default authMiddleware;
