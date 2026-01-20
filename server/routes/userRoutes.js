import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateMe } from "../controllers/userController.js";

const router = express.Router();

router.put("/me", protect, updateMe);

export default router;
