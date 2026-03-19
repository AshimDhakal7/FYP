
// import express from "express";
// import { protect } from "../middleware/authMiddleware.js";
// import { updateMe } from "../controllers/userController.js";
// import {
//   registerUser,
//   sendSignupOtp,
//   verifyOtpAndCreateAccount,
//   loginUser,
//   forgotPassword,
//   resetPassword,
//   sendPasswordResetOtp,
//   resetPasswordWithOtp,
// } from "../controllers/authController.js";


// const router = express.Router();

// router.put("/me", protect, updateMe);

// // ✅ Works with old frontend
// router.post("/register", registerUser);

// // ✅ New OTP signup flow
// router.post("/signup/send-otp", sendSignupOtp);
// router.post("/signup/verify-otp", verifyOtpAndCreateAccount);

// // ✅ Login
// router.post("/login", loginUser);

// // ✅ Password reset
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);
// router.post("/password/send-otp", sendPasswordResetOtp);
// router.post("/password/reset-otp", resetPasswordWithOtp);


// export default router;
import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import { updateMe } from "../controllers/userController.js";
import upload from "../middleware/uploadMiddleware.js";

import {
  sendSignupOtp,
  verifyOtpAndCreateAccount,
  loginUser,
  forgotPassword,
  resetPassword,
  sendPasswordResetOtp,
  resetPasswordWithOtp,
} from "../controllers/authController.js";

const router = express.Router();



router.put("/me", protect, updateMe);


// send OTP to email
router.post("/signup/send-otp", sendSignupOtp);

// verify OTP & actually create the user
router.post("/signup/verify-otp", verifyOtpAndCreateAccount);

router.post("/login", loginUser);


/* =====================================================
   PASSWORD RESET (TOKEN)
===================================================== */

// send reset link token
router.post("/forgot-password", forgotPassword);

// reset using token
router.post("/reset-password/:token", resetPassword);

//UPLOAD PROFILE PICS 
router.put("/me", protect, upload.single("profilePicture"), updateMe);


/* =====================================================
   PASSWORD RESET (OTP)
===================================================== */

// send OTP for password reset
router.post("/password/send-otp", sendPasswordResetOtp);

// verify OTP & update password
router.post("/password/reset-otp", resetPasswordWithOtp);


export default router;
