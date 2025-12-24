import mongoose from "mongoose";

const pendingSignupSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true }, // can be bcrypt-hash
    role: { type: String, default: "user" },

    emailOtpHash: { type: String, required: true },
    emailOtpExpires: { type: Date, required: true },
    emailOtpLastSentAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

// ✅ Auto-delete pending signups after 30 minutes
pendingSignupSchema.index({ createdAt: 1 }, { expireAfterSeconds: 30 * 60 });
const PendingSignup = mongoose.model("PendingSignup", pendingSignupSchema);
export default PendingSignup;


