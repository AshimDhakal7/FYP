import express from "express";
import {
  getAdminLoyaltySettings,
  updateAdminLoyaltySettings,
  resetAdminLoyaltySettings,
} from "../controllers/adminLoyaltyController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminLoyaltySettings);
router.put("/", protect, updateAdminLoyaltySettings);
router.post("/reset", protect, resetAdminLoyaltySettings);

export default router;