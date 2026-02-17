import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (requires JWT)
export const protect = async (req, res, next) => {
  try {
    // ✅ 1) Read token from multiple places
    let token = null;

    // Authorization: Bearer <token>
    const authHeader = req.headers.authorization;

    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Authorization: <token> (without Bearer)
    if (!token && authHeader && authHeader.trim().length > 0) {
      token = authHeader.trim();
    }

    // x-auth-token: <token>
    if (!token && req.headers["x-auth-token"]) {
      token = req.headers["x-auth-token"];
    }

    // token: <token>
    if (!token && req.headers.token) {
      token = req.headers.token;
    }

    if (!token) {
      return res.status(401).json({ message: "Not authorized, no token" });
    }

    // ✅ 2) Ensure JWT secret exists (NO silent fallback)
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      console.error("JWT_SECRET is missing in .env");
      return res.status(500).json({ message: "Server misconfig: JWT_SECRET missing" });
    }

    // ✅ 3) Verify token
    const decoded = jwt.verify(token, secret);

    // ✅ 4) Support different payload shapes
    const userId = decoded?.id || decoded?._id || decoded?.userId;
    if (!userId) {
      return res.status(401).json({ message: "Not authorized, invalid token payload" });
    }

    // ✅ 5) Attach user
    const user = await User.findById(userId).select("-password");
    if (!user) {
      return res.status(401).json({ message: "User not found" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Protect middleware error:", err.message);
    return res.status(401).json({ message: "Not authorized, token failed" });
  }
};
