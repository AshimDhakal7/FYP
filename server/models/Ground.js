// server/models/Ground.js
const mongoose = require("mongoose");

const groundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    location: { type: String, required: true },
    description: { type: String },
    hourlyRate: { type: Number, required: true },
    isActive: { type: Boolean, default: true },
    images: [{ type: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Ground", groundSchema);
