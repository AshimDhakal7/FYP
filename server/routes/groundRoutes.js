
// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import {
//   createGround,
//   getAllGrounds,
//   getMyGrounds,
// } from "../controllers/groundController.js";

// const router = express.Router();

// // Public: users browse grounds
// router.get("/", getAllGrounds);

// // Owner: view own grounds
// router.get("/mine", protect, getMyGrounds);

// // Owner: create ground
// router.post("/", protect, createGround);

// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createGround,
  getAllGrounds,
  getMyGrounds,
  updateGround,   // ✅ ADD
  deleteGround,   // ✅ ADD
} from "../controllers/groundController.js";

const router = express.Router();

// 🌐 Public: get all grounds
router.get("/", getAllGrounds);

// 🔒 Owner: get own grounds
router.get("/mine", protect, getMyGrounds);

// 🔒 Owner: create ground
router.post("/", protect, createGround);

// 🔒 Owner: update ground
router.put("/:id", protect, updateGround); // ✅ NEW

// 🔒 Owner: delete ground
router.delete("/:id", protect, deleteGround); // ✅ NEW

export default router;