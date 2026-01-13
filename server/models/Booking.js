import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cricsal: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Cricsal",
      required: true,
    },
    date: {
      type: String,
      required: true,
    },
    slot: {
      type: String,
      required: true,
    },
    hours: {
      type: Number,
      default: 1,
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Cancelled"],
      default: "Confirmed",
    },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);

export default Booking;
