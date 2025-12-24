import crypto from "crypto";

export function generateOtp6() {
  return String(Math.floor(100000 + Math.random() * 900000)); // 6 digits
}

export function hashOtp(otp) {
  return crypto.createHash("sha256").update(String(otp)).digest("hex");
}
