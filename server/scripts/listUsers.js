import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

await mongoose.connect(process.env.MONGO_URI);
console.log("Connected to MongoDB");

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const users = await User.find({}, { email: 1, role: 1, name: 1 });

if (!users.length) {
  console.log("No users found in database");
} else {
  console.log("Users:");
  users.forEach((u) => {
    console.log(`- ${u.name || "NoName"} | ${u.email} | ${u.role}`);
  });
}

await mongoose.disconnect();