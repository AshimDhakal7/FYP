
// import mongoose from "mongoose";

// const groundSchema = new mongoose.Schema(
//   {
//     name: { type: String, required: true, trim: true },
//     location: { type: String, required: true, trim: true },
//     phone: { type: String, default: "", trim: true },
//     pricePerHour: { type: Number, required: true },
//     images: {
//       type: [String],
//       default: [],
//     },
//     ownerId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "User",
//       required: true,
//       index: true,
//     },
//   },
//   { timestamps: true }
// );

// export default mongoose.model("Ground", groundSchema);


import mongoose from "mongoose";

const groundSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    location: { type: String, required: true, trim: true },
    latitude: { type: Number, required: true },
    longitude: { type: Number, required: true },
    phone: { type: String, default: "", trim: true },
    pricePerHour: { type: Number, required: true },
    images: {
      type: [String],
      default: [],
    },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },
    averageRating: {
      type: Number,
      default: 0,
    },
    numReviews: {
      type: Number,
      default: 0,
    },
    
    approvedAt: Date,
    rejectedAt: Date,
    
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