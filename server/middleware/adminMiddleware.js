// export const isAdmin = (req, res, next) => {
//   if (!req.user) {
//     return res.status(401).json({ message: "Not authorized" });
//   }

//   if (req.user.role !== "admin" && req.user.role !== "superadmin") {
//     return res
//       .status(403)
//       .json({ message: "Forbidden: Admin/Superadmin access required" });
//   }

//   next();
// };

export const isAdmin = (req, res, next) => {
  try {
    // 🔒 Check authentication
    if (!req.user) {
      return res.status(401).json({ message: "Not authorized" });
    }

    // 🔒 Normalize role (safety)
    const role = req.user.role?.toLowerCase();

    // 🔒 Check role
    if (role !== "admin" && role !== "superadmin") {
      return res.status(403).json({
        message: "Forbidden: Admin/Superadmin access required",
      });
    }

    next();
  } catch (err) {
    console.error("ADMIN MIDDLEWARE ERROR:", err);
    return res.status(500).json({ message: "Server error" });
  }
};