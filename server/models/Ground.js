// import mongoose from "mongoose";

// const GroundSchema = new mongoose.Schema(
//   {
//     owner: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },

//     name: { type: String, required: true, trim: true },
//     area: { type: String, required: true, trim: true }, // city/area
//     pricePerHour: { type: Number, required: true },

//     features: { type: [String], default: [] }, // optional
//     isActive: { type: Boolean, default: true },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Ground", GroundSchema);
import mongoose from "mongoose";

const groundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true }, // city/area
    pricePerHour: { type: Number, required: true },

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