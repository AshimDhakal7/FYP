import axios from "axios";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";

export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { amount, bookingId, paymentType } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ message: "Missing amount or bookingId" });
    }

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const totalPrice = Number(booking.totalPrice || 0);

    let expectedAmount = totalPrice;
    if (paymentType === "advance_30") {
      expectedAmount = Math.round(totalPrice * 0.3);
    } else if (paymentType === "full") {
      expectedAmount = totalPrice;
    }

    if (Number(amount) !== Number(expectedAmount)) {
      return res.status(400).json({
        message: "Invalid payment amount",
        expectedAmount,
      });
    }

    const payload = {
      return_url: `http://localhost:5173/bookings?bookingId=${bookingId}`,
      website_url: "http://localhost:5173",
      amount: expectedAmount * 100,
      purchase_order_id: bookingId,
      purchase_order_name: "Cricsal Booking",
    };

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/initiate/",
      payload,
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    return res.status(200).json({
      url: response.data.payment_url,
      pidx: response.data.pidx,
    });
  } catch (error) {
    console.error(
      "Khalti Initiate Error:",
      error.response?.data || error.message
    );

    return res.status(500).json({
      message: "Khalti payment failed",
      error: error.response?.data || error.message,
    });
  }
};

export const verifyKhaltiPayment = async (req, res) => {
  try {
    const { pidx, bookingId: bookingIdFromFrontend } = req.body;

    if (!pidx) {
      return res.status(400).json({ message: "Missing pidx" });
    }

    const response = await axios.post(
      "https://a.khalti.com/api/v2/epayment/lookup/",
      { pidx },
      {
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET}`,
          "Content-Type": "application/json",
        },
      }
    );

    const khaltiData = response.data;

    if (!khaltiData || khaltiData.status !== "Completed") {
      return res.status(400).json({
        message: "Payment not completed",
        status: khaltiData?.status,
      });
    }

    const bookingId =
      bookingIdFromFrontend ||
      khaltiData.purchase_order_id ||
      khaltiData.purchaseOrderId;

    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    booking.isPaid = true;
    await booking.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      booking,
    });
  } catch (error) {
    console.error("Khalti Verify Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};