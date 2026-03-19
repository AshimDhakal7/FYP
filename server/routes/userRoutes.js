// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { updateMe } from "../controllers/userController.js";
// import upload from "../middleware/uploadMiddleware.js";

// const router = express.Router();

// router.put("/me", protect, updateMe);
// // router.put("/update-profile", authMiddleware, async (req, res) => {
// //     try {
// //       const { name, email, contactNumber } = req.body;
  
// //       const user = await User.findByIdAndUpdate(
// //         req.user.id,
// //         { name, email, contactNumber },
// //         { new: true }
// //       ).select("-password");
  
// //       res.json({ user });
// //     } catch (err) {
// //       res.status(500).json({ message: "Profile update failed" });
// //     }
// //   });
// router.put(
//     "/me",
//     protect,
//     upload.single("profilePicture"),
//     updateProfile
//   );
// export default router;


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