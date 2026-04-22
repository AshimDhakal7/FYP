import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cricsal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Ground",
      required: true,
    },
    booking: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      unique: true,
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    comment: {
      type: String,
      trim: true,
      maxlength: 500,
      default: "",
    },
    ownerReply: {
        type: String,
        default: "",
      },

      isHidden: {
        type: Boolean,
        default: false,
      },
      adminNote: {
        type: String,
        default: "",
      },
  },
  { timestamps: true }
);

const Review = mongoose.model("Review", reviewSchema);

export default Review;