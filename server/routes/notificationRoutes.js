import express from "express";
import {
  getMyNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  deleteNotification,
} from "../controllers/notificationController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getMyNotifications);
router.patch("/:id/read", protect, markNotificationRead);
router.patch("/read-all", protect, markAllNotificationsRead);
router.delete("/:id", protect, deleteNotification);

export default router;