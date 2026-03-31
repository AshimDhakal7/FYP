/**
 * Usage:
 *   node scripts/makeAdmin.js your@email.com
 *
 * This script elevates an existing user account to superadmin role.
 */

import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const email = process.argv[2];

if (!email) {
  console.error("❌  Please provide an email: node scripts/makeAdmin.js your@email.com");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);
console.log("✅  Connected to MongoDB");

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const user = await User.findOneAndUpdate(
  { email: email.toLowerCase().trim() },
  { $set: { role: "superadmin" } },
  { new: true }
);

if (!user) {
  console.error(`❌  No user found with email: ${email}`);
  await mongoose.disconnect();
  process.exit(1);
}

console.log(`✅  Done! ${user.email} is now role: "${user.role}"`);
console.log("👉  Log in with this account at /login to access the superadmin panel.");
await mongoose.disconnect();