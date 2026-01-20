import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    cricsal: {
      type: String, // because your cricsals are local (g1, g2...) right now
      required: true,
    },
    date: { type: String, required: true },
    slot: { type: String, required: true },
    hours: { type: Number, default: 1 },
    status: { type: String, default: "confirmed" },
  },
  { timestamps: true }
);

const Booking = mongoose.model("Booking", bookingSchema);
export default Booking;
