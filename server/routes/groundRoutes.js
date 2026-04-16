// import express from "express";
// import {
//   createGround,
//   getAllGrounds,
//   getGroundById,
//   getMyGrounds,
//   updateGround,
//   deleteGround,
// } from "../controllers/groundController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.get("/", getAllGrounds);
// router.get("/mine", protect, getMyGrounds);
// router.get("/:id", getGroundById);

// router.post("/", protect, createGround);
// router.put("/:id", protect, updateGround);
// router.delete("/:id", protect, deleteGround);

// export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { isAdmin } from "../middleware/adminMiddleware.js";

import {
  createGround,
  getAllGrounds,
  getGroundById,
  getMyGrounds,
  updateGround,
  deleteGround,
  getAdminGrounds,
  getPendingGrounds,
  approveGround,
  rejectGround,
} from "../controllers/groundController.js";

const router = express.Router();

// admin routes
router.get("/admin/pending", protect, isAdmin, getPendingGrounds);
router.get("/admin", protect, isAdmin, getAdminGrounds);
router.patch("/admin/:id/approve", protect, isAdmin, approveGround);
router.patch("/admin/:id/reject", protect, isAdmin, rejectGround);

// owner routes
router.get("/mine", protect, getMyGrounds);
router.get("/mine/list", protect, getMyGrounds);
router.post("/", protect, createGround);
router.put("/:id", protect, updateGround);
router.delete("/:id", protect, deleteGround);

// public routes
router.get("/", getAllGrounds);

// keep this last
router.get("/:id", getGroundById);

export default router;