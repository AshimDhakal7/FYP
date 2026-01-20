import jwt from "jsonwebtoken";
import User from "../models/User.js";

// Protect routes (requires Bearer token)
export const protect = async (req, res, next) => {
  let token;

  // ✅ ESSENTIAL: Allow alternative token headers (fallback)
  if (!req.headers.authorization) {
    const fallbackToken = req.headers["x-auth-token"] || req.headers.token;
    if (fallbackToken) req.headers.authorization = `Bearer ${fallbackToken}`;
  }

  // ✅ ESSENTIAL ADDITION: handle "Authorization: <token>" (without Bearer)
  if (req.headers.authorization && !req.headers.authorization.startsWith("Bearer ")) {
    req.headers.authorization = `Bearer ${req.headers.authorization}`;
  }

  // ✅ ESSENTIAL ADDITION: allow token in query for quick testing (optional)
  if (!req.headers.authorization && req.query && req.query.token) {
    req.headers.authorization = `Bearer ${req.query.token}`;
  }

  // ✅ ESSENTIAL ADDITION: allow token in cookies (optional)
  if (!req.headers.authorization && req.cookies && req.cookies.token) {
    req.headers.authorization = `Bearer ${req.cookies.token}`;
  }

  if (req.headers.authorization && req.headers.authorization.startsWith("Bearer ")) {
    try {
      token = req.headers.authorization.split(" ")[1];

      const decoded = jwt.verify(token, process.env.JWT_SECRET || "devsecret");

      const user = await User.findById(decoded.id).select("-password");
      if (!user) return res.status(401).json({ message: "User not found" });

      req.user = user;
      return next();
    } catch (err) {
      console.error("Protect middleware error:", err.message);
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  return res.status(401).json({ message: "Not authorized, no token" });
};
