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

// Sending OTP 
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

//Verify OTP
export const verifyOtpAndCreateAccount = async (req, res) => {
  try {
    const { pendingId, otp } = req.body;

    if (!pendingId || !otp) {
      return res.status(400).json({ message: "Missing fields" });
    }

    const pending = await PendingSignup.findById(pendingId);
    if (!pending) {
      return res.status(400).json({ message: "Signup session expired" });
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

    // ✅ Auto-login after signup
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return res.status(201).json({
      message: "Account created successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "OTP verification failed" });
  }
};

//Login
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
      { id: user._id, role: user.role },
      process.env.JWT_SECRET || "devsecret",
      { expiresIn: "7d" }
    );

    return res.status(200).json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Login failed" });
  }
};

//Reset Password
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
   //PASSWORD RESET (OTP) - SEND OTP
   //POST /api/auth/password/send-otp
   //body: { email }

export const sendPasswordResetOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const user = await User.findOne({ email });

    //  Don't reveal if email exists
    if (!user) {
      return res.json({ message: "If email exists, OTP has been sent." });
    }

    // 60 seconds to cooldown
    if (
      user.passwordResetOtpLastSentAt &&
      Date.now() - new Date(user.passwordResetOtpLastSentAt).getTime() < 60000
    ) {
      return res.status(429).json({
        message: "Please wait before requesting OTP again.",
      });
    }

    const otp = generateOtp();

    user.passwordResetOtpHash = hashOtp(otp);
    user.passwordResetOtpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min
    user.passwordResetOtpLastSentAt = new Date();
    await user.save();

    //Send OTP email
    await sendEmail({
      to: user.email,
      subject: "CricBook Password Reset OTP",
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
    
          <div style="
            background:linear-gradient(135deg,#0f5132,#198754);
            padding:20px;
            text-align:center;
            color:#ffffff;
          ">
            <h1 style="margin:0;font-size:26px;">CricBook</h1>
            <p style="margin:5px 0 0;font-size:14px;">Password Reset</p>
          </div>
    
          <div style="padding:30px;color:#333333;">
            <p style="font-size:15px;line-height:1.6;">
              Use the OTP below to reset your CricBook password:
            </p>
    
            <div style="margin:30px 0;text-align:center;">
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
              ⏱ This OTP is valid for <b>10 minutes</b>.
            </p>
    
            <p style="font-size:14px;color:#555;">
              If you did not request this, ignore this email.
            </p>
    
            <hr style="border:none;border-top:1px solid #eee;margin:25px 0;" />
    
            <p style="font-size:13px;color:#777;">
              Need help? Contact our support team anytime.
            </p>
          </div>
    
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

    return res.json({ message: "If email exists, OTP has been sent." });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Failed to send reset OTP" });
  }
};

/* =========================
   PASSWORD RESET (OTP) - VERIFY OTP + UPDATE PASSWORD
   POST /api/auth/password/reset-otp
   body: { email, otp, password }
========================= */
export const resetPasswordWithOtp = async (req, res) => {
  try {
    const email = normalizeEmail(req.body.email);
    const { otp, password } = req.body;

    if (!email || !otp || !password) {
      return res.status(400).json({ message: "Missing fields" });
    }

    if (String(password).length < 6) {
      return res
        .status(400)
        .json({ message: "Password must be at least 6 characters." });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid OTP or email" });
    }

    if (!user.passwordResetOtpHash || !user.passwordResetOtpExpires) {
      return res.status(400).json({
        message: "OTP not found. Please request OTP again.",
      });
    }

    if (user.passwordResetOtpExpires < Date.now()) {
      return res.status(400).json({
        message: "OTP expired. Please request OTP again.",
      });
    }

    if (hashOtp(otp) !== user.passwordResetOtpHash) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // ✅ Update password (your User model will hash it)
    user.password = password;

    // ✅ Clear OTP reset fields
    user.passwordResetOtpHash = undefined;
    user.passwordResetOtpExpires = undefined;
    user.passwordResetOtpLastSentAt = undefined;

    await user.save();

    return res.json({ message: "Password updated successfully." });
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
