

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";
import { updateMe } from "../controllers/userController.js";

const router = express.Router();

router.put(
  "/me",
  protect,
  upload.single("profilePicture"),
  updateMe
);

export default router;