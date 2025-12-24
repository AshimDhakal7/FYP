// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// /* =========================
//    HELPERS (OTP)
// ========================= */
// const generateOtp = () =>
//   String(Math.floor(100000 + Math.random() * 900000)); // 6 digits

// const hashOtp = (otp) =>
//   crypto.createHash("sha256").update(String(otp)).digest("hex");

// /* =========================
//    REGISTER + SEND OTP
// ========================= */
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Please fill all fields" });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // 1️⃣ Create user (NOT verified yet)
//     const user = await User.create({
//       name,
//       email,
//       password, // pre-save hook hashes it
//       role: role || "user",
//       isEmailVerified: false,
//     });

//     // 2️⃣ Generate OTP
//     const otp = generateOtp();
//     user.emailOtpHash = hashOtp(otp);
//     user.emailOtpExpires = Date.now() + 10 * 60 * 1000; // 10 minutes
//     user.emailOtpLastSentAt = Date.now();
//     await user.save();

//     // ✅ DEV MODE: return OTP (later replace with email sender)
//     res.status(201).json({
//       message: "OTP sent to your email. Please verify.",
//       userId: user._id,
//       otp, // ❌ REMOVE IN PRODUCTION
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// /* =========================
//    VERIFY EMAIL OTP
// ========================= */
// export const verifyEmailOtp = async (req, res) => {
//   try {
//     const { userId, otp } = req.body;

//     if (!userId || !otp) {
//       return res.status(400).json({ message: "Missing fields" });
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.isEmailVerified) {
//       return res.json({ message: "Email already verified" });
//     }

//     if (!user.emailOtpHash || !user.emailOtpExpires) {
//       return res.status(400).json({ message: "OTP not found. Please resend." });
//     }

//     if (user.emailOtpExpires < Date.now()) {
//       return res.status(400).json({ message: "OTP expired. Please resend." });
//     }

//     const hashed = hashOtp(otp);
//     if (hashed !== user.emailOtpHash) {
//       return res.status(400).json({ message: "Invalid OTP" });
//     }

//     // ✅ Verify email
//     user.isEmailVerified = true;
//     user.emailOtpHash = undefined;
//     user.emailOtpExpires = undefined;
//     await user.save();

//     res.json({ message: "Email verified successfully. You can now log in." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "OTP verification failed" });
//   }
// };

// /* =========================
//    RESEND EMAIL OTP
// ========================= */
// export const resendEmailOtp = async (req, res) => {
//   try {
//     const { userId } = req.body;

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(400).json({ message: "User not found" });
//     }

//     if (user.isEmailVerified) {
//       return res.json({ message: "Email already verified" });
//     }

//     // ⏱ cooldown: 60s
//     if (
//       user.emailOtpLastSentAt &&
//       Date.now() - user.emailOtpLastSentAt < 60 * 1000
//     ) {
//       return res.status(429).json({
//         message: "Please wait before requesting a new OTP.",
//       });
//     }

//     const otp = generateOtp();
//     user.emailOtpHash = hashOtp(otp);
//     user.emailOtpExpires = Date.now() + 10 * 60 * 1000;
//     user.emailOtpLastSentAt = Date.now();
//     await user.save();

//     // DEV return
//     res.json({
//       message: "OTP resent.",
//       otp, // ❌ REMOVE IN PRODUCTION
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Resend OTP failed" });
//   }
// };

// /* =========================
//    LOGIN (BLOCK IF NOT VERIFIED)
// ========================= */
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res.status(400).json({ message: "Please provide email and password" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     if (!user.isEmailVerified) {
//       return res
//         .status(403)
//         .json({ message: "Please verify your email OTP first." });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || "devsecret",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// /* =========================
//    FORGOT PASSWORD
// ========================= */
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     if (!user) {
//       return res.json({
//         message: "If this email exists, reset instructions were sent.",
//       });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

//     user.resetPasswordToken = hashed;
//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
//     await user.save();

//     res.json({
//       message: "Reset token generated (DEV)",
//       resetToken,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Forgot password failed" });
//   }
// };

// /* =========================
//    RESET PASSWORD
// ========================= */
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password || password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters." });
//     }

//     const hashed = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashed,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token." });
//     }

//     user.password = password; // pre-save hook hashes it
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.json({ message: "Password updated successfully. Please log in." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Reset password failed" });
//   }
// };






// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import jwt from "jsonwebtoken";
// import User from "../models/User.js";

// /* =========================
//    REGISTER (NO OTP)
// ========================= */
// export const registerUser = async (req, res) => {
//   try {
//     const { name, email, password, role } = req.body;

//     if (!name || !email || !password) {
//       return res.status(400).json({ message: "Please fill all fields" });
//     }

//     const userExists = await User.findOne({ email });
//     if (userExists) {
//       return res.status(400).json({ message: "User already exists" });
//     }

//     // Create user normally
//     const user = await User.create({
//       name,
//       email,
//       password, // pre-save hook hashes it
//       role: role || "user",
//       isEmailVerified: true, // ✅ since you don't want OTP verification
//     });

//     res.status(201).json({
//       message: "Registration successful. You can now log in.",
//       userId: user._id,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Registration failed" });
//   }
// };

// /* =========================
//    LOGIN (NO OTP BLOCK)
// ========================= */
// export const loginUser = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     if (!email || !password) {
//       return res
//         .status(400)
//         .json({ message: "Please provide email and password" });
//     }

//     const user = await User.findOne({ email });
//     if (!user) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const isMatch = await bcrypt.compare(password, user.password);
//     if (!isMatch) {
//       return res.status(400).json({ message: "Invalid credentials" });
//     }

//     const token = jwt.sign(
//       { id: user._id },
//       process.env.JWT_SECRET || "devsecret",
//       { expiresIn: "7d" }
//     );

//     res.json({
//       _id: user._id,
//       name: user.name,
//       email: user.email,
//       role: user.role,
//       token,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Login failed" });
//   }
// };

// /* =========================
//    FORGOT PASSWORD
// ========================= */
// export const forgotPassword = async (req, res) => {
//   try {
//     const { email } = req.body;

//     const user = await User.findOne({ email });

//     // Don't reveal whether email exists
//     if (!user) {
//       return res.json({
//         message: "If this email exists, reset instructions were sent.",
//       });
//     }

//     const resetToken = crypto.randomBytes(20).toString("hex");
//     const hashed = crypto.createHash("sha256").update(resetToken).digest("hex");

//     user.resetPasswordToken = hashed;
//     user.resetPasswordExpire = Date.now() + 15 * 60 * 1000; // 15 mins
//     await user.save();

//     // DEV MODE: return resetToken (in production email this)
//     res.json({
//       message: "Reset token generated (DEV)",
//       resetToken,
//     });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Forgot password failed" });
//   }
// };

// /* =========================
//    RESET PASSWORD
// ========================= */
// export const resetPassword = async (req, res) => {
//   try {
//     const { token } = req.params;
//     const { password } = req.body;

//     if (!password || password.length < 6) {
//       return res
//         .status(400)
//         .json({ message: "Password must be at least 6 characters." });
//     }

//     const hashed = crypto.createHash("sha256").update(token).digest("hex");

//     const user = await User.findOne({
//       resetPasswordToken: hashed,
//       resetPasswordExpire: { $gt: Date.now() },
//     });

//     if (!user) {
//       return res.status(400).json({ message: "Invalid or expired token." });
//     }

//     user.password = password; // pre-save hook hashes it
//     user.resetPasswordToken = undefined;
//     user.resetPasswordExpire = undefined;

//     await user.save();

//     res.json({ message: "Password updated successfully. Please log in." });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: "Reset password failed" });
//   }
// };




import crypto from "crypto";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import PendingSignup from "../models/PendingSignup.js";
import sendEmail from "../utils/sendEmail.js";

/* =========================
   HELPERS
========================= */
const generateOtp = () =>
  String(Math.floor(100000 + Math.random() * 900000));

const hashOtp = (otp) =>
  crypto.createHash("sha256").update(String(otp)).digest("hex");

const normalizeEmail = (email) =>
  String(email || "").trim().toLowerCase();

/* =========================
   SIGNUP STEP 1: SEND OTP
========================= */
export const sendSignupOtp = async (req, res) => {
  try {
    let { name, email, password, role } = req.body;

    email = normalizeEmail(email);
    name = String(name || "").trim();

    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill all fields" });
    }

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    const existingPending = await PendingSignup.findOne({ email });
    if (
      existingPending?.emailOtpLastSentAt &&
      Date.now() - new Date(existingPending.emailOtpLastSentAt).getTime() < 60000
    ) {
      return res
        .status(429)
        .json({ message: "Please wait before requesting OTP again" });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const otp = generateOtp();

    const pending = await PendingSignup.findOneAndUpdate(
      { email },
      {
        name,
        email,
        password: passwordHash,
        role: role || "user",
        emailOtpHash: hashOtp(otp),
        emailOtpExpires: new Date(Date.now() + 10 * 60 * 1000),
        emailOtpLastSentAt: new Date(),
      },
      { new: true, upsert: true, runValidators: true }
    );

    await sendEmail({
      to: pending.email,
      subject: "CricBook Email Verification Code",
      html: `
      <div style="
        background:#f4f6f8;
        padding:30px;
        font-family: Arial, Helvetica, sans-serif;
      ">
        <div style="
          max-width:520px;
          margin:0 auto;
          background:#ffffff;
          border-radius:10px;
          overflow:hidden;
          box-shadow:0 4px 12px rgba(0,0,0,0.1);
        ">
    
          <!-- Header -->
          <div style="
            background:linear-gradient(135deg,#0f5132,#198754);
            padding:20px;
            text-align:center;
            color:#ffffff;
          ">
            <h1 style="margin:0;font-size:26px;">CricBook</h1>
            <p style="margin:5px 0 0;font-size:14px;">
              Email Verification
            </p>
          </div>
    
          <!-- Body -->
          <div style="padding:30px;color:#333333;">
            <p style="font-size:16px;margin:0 0 10px;">
              Hi 👋
            </p>
    
            <p style="font-size:15px;line-height:1.6;">
              Thanks for creating an account on <b>CricBook</b>.
              To complete your registration, please use the verification code below:
            </p>
    
            <!-- OTP Box -->
            <div style="
              margin:30px 0;
              text-align:center;
            ">
              <div style="
                display:inline-block;
                padding:15px 30px;
                font-size:32px;
                letter-spacing:6px;
                font-weight:bold;
                color:#0f5132;
                background:#e9f7ef;
                border-radius:8px;
              ">
                ${otp}
              </div>
            </div>
    
            <p style="font-size:14px;color:#555;">
              ⏱ This code is valid for <b>10 minutes</b>.
            </p>
    
            <p style="font-size:14px;color:#555;">
              If you did not request this code, you can safely ignore this email.
            </p>
    
            <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />
    
            <p style="font-size:13px;color:#777;">
              Need help? Contact our support team anytime.
            </p>
          </div>
    
          <!-- Footer -->
          <div style="
            background:#f9fafb;
            padding:15px;
            text-align:center;
            font-size:12px;
            color:#888;
          ">
            © ${new Date().getFullYear()} CricBook. All rights reserved.
          </div>
    
        </div>
      </div>
      `,
    });
    

    return res.json({
      message: "OTP sent to your email",
      pendingId: pending._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send OTP" });
  }
};

/* =========================
   SIGNUP STEP 2: VERIFY OTP
========================= */
export const verifyOtpAndCreateAccount = async (req, res) => {
  try {
    const { pendingId, otp } = req.body;

    if (!pendingId || !otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const pending = await PendingSignup.findById(pendingId);
    if (!pending) {
      return res
        .status(400)
        .json({ message: "Signup session expired" });
    }

    if (pending.emailOtpExpires < Date.now()) {
      return res.status(400).json({ message: "OTP expired" });
    }

    if (hashOtp(otp) !== pending.emailOtpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    const user = await User.create({
      name: pending.name,
      email: pending.email,
      password: pending.password,
      role: pending.role,
      isEmailVerified: true,
    });

    await PendingSignup.deleteOne({ _id: pending._id });

    return res.status(201).json({
      message: "Account created successfully",
      userId: user._id,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

/* =========================
   LOGIN
========================= */
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email = normalizeEmail(email);

    if (!email || !password) {
      return res.status(400).json({ message: "Missing credentials" });
    }

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token,
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   PASSWORD RESET
========================= */
export const forgotPassword = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    const user = await User.findOne({ email });
    if (!user) {
      return res.json({ message: "If email exists, reset was sent" });
    }

    const token = crypto.randomBytes(20).toString("hex");
    user.resetPasswordToken = hashOtp(token);
    user.resetPasswordExpire = Date.now() + 15 * 60 * 1000;
    await user.save();

    return res.json({ message: "Reset token generated", token });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Forgot password failed" });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const hashed = hashOtp(req.params.token);
    const user = await User.findOne({
      resetPasswordToken: hashed,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: "Invalid or expired token" });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    return res.json({ message: "Password updated successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Reset failed" });
  }
};

/* =========================
   ALIAS (IMPORTANT FIX)
========================= */
// 🔥 This prevents "registerUser not exported" crash
export const registerUser = sendSignupOtp;
