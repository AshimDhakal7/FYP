import express from "express";
import {
  getMyLoyaltySummary,
  getMyLoyaltyHistory,
} from "../controllers/loyaltyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/me", protect, getMyLoyaltySummary);
router.get("/history", protect, getMyLoyaltyHistory);

export default router;