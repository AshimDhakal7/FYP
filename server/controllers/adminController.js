import Booking from "../models/Booking.js";
import Ground from "../models/Ground.js";
import User from "../models/User.js";

// ──────────────────────────────────────────
// GET /api/admin/bookings
// All bookings, fully populated
// ──────────────────────────────────────────
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("cricsal", "name location pricePerHour")
      .populate("user", "name email")
      .populate("ownerId", "name email");

    const normalized = bookings.map((b) => {
      const obj = b.toObject();
      obj.owner = obj.ownerId;
      return obj;
    });

    return res.json({ bookings: normalized });
  } catch (err) {
    console.error("ADMIN GET BOOKINGS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};

// ──────────────────────────────────────────
// GET /api/admin/users
// All regular users with booking count
// ──────────────────────────────────────────
export const getAdminUsers = async (req, res) => {
  try {
    const users = await User.find({ role: "user" })
      .sort({ createdAt: -1 })
      .select("-password");

    const bookingCounts = await Booking.aggregate([
      { $group: { _id: "$user", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    bookingCounts.forEach((item) => {
      countMap[String(item._id)] = item.count;
    });

    const usersWithCount = users.map((u) => ({
      ...u.toObject(),
      bookings: countMap[String(u._id)] || 0,
      status: u.isBlocked ? "blocked" : "active",
    }));

    return res.json({ users: usersWithCount });
  } catch (err) {
    console.error("ADMIN GET USERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch users" });
  }
};

// ──────────────────────────────────────────
// GET /api/admin/owners
// All owner users with ground count
// ──────────────────────────────────────────
export const getAdminOwners = async (req, res) => {
  try {
    const owners = await User.find({ role: "owner" })
      .sort({ createdAt: -1 })
      .select("-password");

    const groundCounts = await Ground.aggregate([
      { $group: { _id: "$ownerId", count: { $sum: 1 } } },
    ]);

    const countMap = {};
    groundCounts.forEach((item) => {
      countMap[String(item._id)] = item.count;
    });

    const ownersWithCount = owners.map((o) => ({
      ...o.toObject(),
      grounds: countMap[String(o._id)] || 0,
      status: o.isBlocked ? "blocked" : "active",
    }));

    return res.json({ owners: ownersWithCount });
  } catch (err) {
    console.error("ADMIN GET OWNERS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch owners" });
  }
};

// ──────────────────────────────────────────
// GET /api/admin/grounds
// All grounds with owner info
// ──────────────────────────────────────────
export const getAdminGrounds = async (req, res) => {
  try {
    const grounds = await Ground.find()
      .sort({ createdAt: -1 })
      .populate("ownerId", "name email");

    const normalized = grounds.map((g) => {
      const obj = g.toObject();
      obj.ownerName = obj.ownerId?.name || "Unknown";
      obj.ownerEmail = obj.ownerId?.email || "";
      obj.status = "active";
      return obj;
    });

    return res.json({ grounds: normalized });
  } catch (err) {
    console.error("ADMIN GET GROUNDS ERROR:", err);
    return res.status(500).json({ message: "Failed to fetch grounds" });
  }
};

// ──────────────────────────────────────────
// PATCH /api/admin/users/:id/block
// ──────────────────────────────────────────
export const blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.role === "admin" || user.role === "superadmin") {
      return res
        .status(403)
        .json({ message: "Cannot block another admin or superadmin" });
    }

    user.isBlocked = true;
    await user.save();

    return res.json({ message: "User blocked successfully", userId: user._id });
  } catch (err) {
    console.error("ADMIN BLOCK USER ERROR:", err);
    return res.status(500).json({ message: "Failed to block user" });
  }
};

// ──────────────────────────────────────────
// PATCH /api/admin/users/:id/unblock
// ──────────────────────────────────────────
export const unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.isBlocked = false;
    await user.save();

    return res.json({
      message: "User unblocked successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error("ADMIN UNBLOCK USER ERROR:", err);
    return res.status(500).json({ message: "Failed to unblock user" });
  }
};