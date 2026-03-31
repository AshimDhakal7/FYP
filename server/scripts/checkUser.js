import mongoose from "mongoose";
import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, "../.env") });

const email = process.argv[2];

if (!email) {
  console.log("Provide email");
  process.exit(1);
}

await mongoose.connect(process.env.MONGO_URI);

const userSchema = new mongoose.Schema({}, { strict: false });
const User = mongoose.models.User || mongoose.model("User", userSchema);

const user = await User.findOne({ email: email.toLowerCase().trim() });

if (!user) {
  console.log("User not found");
} else {
  console.log({
    name: user.name,
    email: user.email,
    role: user.role,
    hasPassword: !!user.password,
    passwordPreview: user.password ? String(user.password).slice(0, 15) + "..." : null,
  });
}

await mongoose.disconnect();