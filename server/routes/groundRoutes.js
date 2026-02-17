import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  listGrounds,
  createGround,
  listMyGrounds,
  deleteGround,
} from "../controllers/groundController.js";

const router = express.Router();

// public (users)
router.get("/", listGrounds);

// owner
router.post("/", protect, createGround);
router.get("/mine", protect, listMyGrounds);
router.delete("/:id", protect, deleteGround);

export default router;
