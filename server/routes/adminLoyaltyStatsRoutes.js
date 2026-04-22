import express from "express";
import { getAdminLoyaltyStats } from "../controllers/adminLoyaltyStatsController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", protect, getAdminLoyaltyStats);

export default router;