// // import express from "express";
// // import { protect } from "../middleware/authMiddleware.js";
// // import {
// //   listGrounds,
// //   createGround,
// //   listMyGrounds,
// //   deleteGround,
// // } from "../controllers/groundController.js";

// // const router = express.Router();

// // // public (users)
// // router.get("/", listGrounds);

// // // owner
// // router.post("/", protect, createGround);
// // router.get("/mine", protect, listMyGrounds);
// // router.delete("/:id", protect, deleteGround);

// // // GET /api/owner/bookings
// // router.get("/bookings", protect, async (req, res) => {  try {
// //     const ownerId = req.user.id;

// //     const bookings = await Booking.find({ ownerId })
// //       .populate("courtId", "name location pricePerHour")
// //       .populate("userId", "name email")
// //       .sort({ createdAt: -1 });

// //     res.json({ bookings });
// //   } catch (err) {
// //     res.status(500).json({ message: err.message || "Server error" });
// //   }
// // });

// // export default router;

// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ If you still need this route, keep it protected.
// // NOTE: You can implement logic later or remove it.
// router.get("/bookings", protect, async (req, res) => {
//   return res.status(200).json({ message: "Use /api/bookings/owner for owner bookings." });
// });

// export default router;

import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import {
  createGround,
  getAllGrounds,
  getMyGrounds,
} from "../controllers/groundController.js";

const router = express.Router();

// Public: users browse grounds
router.get("/", getAllGrounds);

// Owner: view own grounds
router.get("/mine", protect, getMyGrounds);

// Owner: create ground
router.post("/", protect, createGround);

export default router;