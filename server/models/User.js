
import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    phone: {
      type: String,
      default: "",
    },

    loyaltyPoints: {
      type: Number,
      default: 0,
      min: 0,
    },

    isEmailVerified: { type: Boolean, default: false },

    emailOtpHash: { type: String },
    emailOtpExpires: { type: Date },
    emailOtpLastSentAt: { type: Date },

    password: { type: String, required: true, minlength: 6 },

    role: { type: String, default: "user" },

    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    passwordResetOtpHash: { type: String },
    passwordResetOtpExpires: { type: Date },
    passwordResetOtpLastSentAt: { type: Date },

    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();

  if (this.password && this.password.startsWith("$2")) return next();

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);
export default User;