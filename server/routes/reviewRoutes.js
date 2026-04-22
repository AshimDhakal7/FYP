import express from "express";
import {
  createReview,
  getGroundReviews,
  canReviewBooking,
  getOwnerReviews,
  replyToReview,
  getAdminReviews,
  toggleReviewVisibility,
  saveAdminReviewNote,
} from "../controllers/reviewController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, createReview);
router.get("/ground/:groundId", getGroundReviews);
router.get("/can-review/:bookingId", protect, canReviewBooking);
router.get("/owner", protect, getOwnerReviews);
router.post("/:id/reply", protect, replyToReview);
router.get("/admin/all", protect, getAdminReviews);
router.patch("/admin/:id/toggle-hidden", protect, toggleReviewVisibility);
router.patch("/admin/:id/note", protect, saveAdminReviewNote);

export default router;