// Admin-only middleware — must run AFTER protect
export const isAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ message: "Not authorized" });
  }

  if (req.user.role !== "admin" && req.user.role !== "superadmin") {
    return res
      .status(403)
      .json({ message: "Forbidden: Admin/Superadmin access required" });
  }

  next();
};