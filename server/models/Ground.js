
import mongoose from "mongoose";

const groundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },

    location: { type: String, required: true, trim: true }, // city/area

    phone: { type: String },

    pricePerHour: { type: Number, required: true },

    // Cloudinary image URLs
    images: [
      {
        type: String,
      },
    ],

    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Ground", groundSchema);