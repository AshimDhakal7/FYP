import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import bcrypt from "bcryptjs"; // if your project uses "bcrypt", change this line

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const email = process.argv[2];
const newPassword = process.argv[3];

if (!email || !newPassword) {
  console.log("Usage: node scripts/resetPassword.js email password");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const hashedPassword = await bcrypt.hash(newPassword, 10);

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { $set: { password: hashedPassword } },
  { new: true }
);

if (!user) {
  console.log("User not found");
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`Password reset successful for ${user.email}`);
await mongoose.disconnect();