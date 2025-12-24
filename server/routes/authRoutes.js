// import express from "express";

// import {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   resetPassword,
//   verifyEmailOtp,   
//   resendEmailOtp,    
// } from "../controllers/authController.js";

// const router = express.Router();

// // AUTH
// router.post("/register", registerUser);
// router.post("/login", loginUser);

// // EMAIL OTP 
// router.post("/verify-email-otp", verifyEmailOtp);
// router.post("/resend-email-otp", resendEmailOtp);

// // PASSWORD RESET
// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// export default router;




// import express from "express";
// import {
//   registerUser,
//   loginUser,
//   forgotPassword,
//   resetPassword,
// } from "../controllers/authController.js";

// const router = express.Router();

// router.post("/register", registerUser);
// router.post("/login", loginUser);

// router.post("/forgot-password", forgotPassword);
// router.post("/reset-password/:token", resetPassword);

// export default router;


import express from "express";
import {
  registerUser,
  sendSignupOtp,
  verifyOtpAndCreateAccount,
  loginUser,
  forgotPassword,
  resetPassword,
} from "../controllers/authController.js";

const router = express.Router();

// ✅ Works with old frontend
router.post("/register", registerUser);

// ✅ New OTP signup flow
router.post("/signup/send-otp", sendSignupOtp);
router.post("/signup/verify-otp", verifyOtpAndCreateAccount);

// ✅ Login
router.post("/login", loginUser);

// ✅ Password reset
router.post("/forgot-password", forgotPassword);
router.post("/reset-password/:token", resetPassword);

export default router;
