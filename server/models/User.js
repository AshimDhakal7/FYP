// // server/models/User.js
// import mongoose from "mongoose";
// import bcrypt from "bcryptjs";

// const userSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     email: { type: String, required: true, unique: true, lowercase: true, trim: true },
//     isEmailVerified: { type: Boolean, default: false },
//     emailOtpHash: { type: String },
//     emailOtpExpires: { type: Date },
//     emailOtpLastSentAt: { type: Date },


//     // IMPORTANT: store plain password on create/update, hook will hash it
//     password: { type: String, required: true, minlength: 6 },

//     role: { type: String, default: "user" },

//     // ✅ Reset password fields (used by forgot/reset controllers)
//     resetPasswordToken: { type: String },
//     resetPasswordExpire: { type: Date },
//   },
//   { timestamps: true }
// );

// userSchema.pre("save", async function (next) {
//   // only hash if password changed
//   if (!this.isModified("password")) return next();

//   const salt = await bcrypt.genSalt(10);
//   this.password = await bcrypt.hash(this.password, salt);
//   next();
// });

// userSchema.methods.matchPassword = async function (enteredPassword) {
//   return bcrypt.compare(enteredPassword, this.password);
// };

// const User = mongoose.model("User", userSchema);
// export default User;




// server/models/User.js
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
    

    // ✅ Once OTP verified, set true
    isEmailVerified: { type: Boolean, default: false },

    // (Optional) keep these if you want future features,
    // but OTP for signup will be stored in PendingSignup, not here.
    emailOtpHash: { type: String },
    emailOtpExpires: { type: Date },
    emailOtpLastSentAt: { type: Date },

    // Password (hook hashes it unless already bcrypt-hashed)
    password: { type: String, required: true, minlength: 6 },

    role: { type: String, default: "user" },

    // Reset password fields (token-based, optional)
    resetPasswordToken: { type: String },
    resetPasswordExpire: { type: Date },

    // ✅ ADDED: Reset password OTP fields (OTP-based forgot password)
    passwordResetOtpHash: { type: String },
    passwordResetOtpExpires: { type: Date },
    passwordResetOtpLastSentAt: { type: Date },

    // ✅ Admin block/unblock
    isBlocked: { type: Boolean, default: false },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  // only hash if password changed
  if (!this.isModified("password")) return next();

  // ✅ If already bcrypt hash, don't hash again
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
