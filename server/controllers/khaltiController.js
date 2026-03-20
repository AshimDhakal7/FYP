// import axios from "axios";

// export const initiateKhaltiPayment = async (req, res) => {
//   try {
//     const { amount, bookingId } = req.body;

//     if (!amount || !bookingId) {
//       return res.status(400).json({ message: "Missing data" });
//     }

//     const payload = {
//       return_url: "http://localhost:5173/bookings",
//       website_url: "http://localhost:5173",
//       amount: amount * 100, // paisa
//       purchase_order_id: bookingId,
//       purchase_order_name: "Cricsal Booking",
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       payload,
//       {
//         headers: {
//             Authorization: `Key ${process.env.KHALTI_SECRET}`,
//             "Content-Type": "application/json",
//           }
//       }
//     );

//     return res.json({
//       url: response.data.payment_url,
//       pidx: response.data.pidx,
//     });

//   } catch (error) {
//     console.error("Khalti Error:", error.response?.data || error.message);
//     return res.status(500).json({
//       message: "Khalti payment failed",
//     });
//   }
// };

import axios from "axios";

export const initiateKhaltiPayment = async (req, res) => {
  try {
    const { amount, bookingId } = req.body;

    if (!amount || !bookingId) {
      return res.status(400).json({ message: "Missing amount or bookingId" });
    }

    // 🔥 Khalti payload
    const payload = {
      return_url: "http://localhost:5173/bookings",
      website_url: "http://localhost:5173",
      amount: amount * 100, // paisa
      purchase_order_id: bookingId,
      purchase_order_name: "Cricsal Booking",
    };

    // 🔥 API call
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

    // ✅ send to frontend
    return res.status(200).json({
      url: response.data.payment_url,
      pidx: response.data.pidx,
    });

  } catch (error) {
    console.error("Khalti Error:", error.response?.data || error.message);
    console.log("SECRET:", process.env.KHALTI_SECRET);

    return res.status(500).json({
      message: "Khalti payment failed",
    });
  }
};