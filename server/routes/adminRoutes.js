import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";
import {
  getAdminBookings,
  getAdminUsers,
  getAdminOwners,
  getAdminGrounds,
  blockUser,
  unblockUser,
} from "../controllers/adminController.js";

const router = express.Router();

// All admin routes require auth + admin role
router.use(protect, isAdmin);

// ── Data endpoints ──
router.get("/bookings", getAdminBookings);
router.get("/users", getAdminUsers);
router.get("/owners", getAdminOwners);
router.get("/grounds", getAdminGrounds);

// ── User management ──
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);

export default router;
