// import express from "express";
// import axios from "axios";
// import { protect } from "../middleware/authMiddleware.js";
// import { initiateKhaltiPayment } from "../controllers/khaltiController.js";

// const router = express.Router();

// // INITIATE PAYMENT
// router.post("/khalti/initiate", protect, async (req, res) => {
//   try {
//     const { amount, bookingId } = req.body;

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       {
//         return_url: "http://localhost:5173/payment-success",
//         website_url: "http://localhost:5173",
//         amount: amount * 100, // paisa
//         purchase_order_id: bookingId,
//         purchase_order_name: "Court Booking",
//       },
//       {
//         headers: {
//           Authorization: "Key YOUR_SECRET_KEY",
//         },
//       }
//     );

//     res.json({ url: response.data.payment_url });
//   } catch (err) {
//     console.log(err.response?.data || err.message);
//     res.status(500).json({ message: "Khalti init failed" });
//   }
// });
// // const router = express.Router();

// router.post("/khalti/initiate", initiateKhaltiPayment);

// export default router;

// import express from "express";
// import { initiateKhaltiPayment } from "../controllers/khaltiController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// // ✅ SINGLE CLEAN ROUTE
// router.post("/khalti/initiate", protect, initiateKhaltiPayment);

// export default router;



import express from "express";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
} from "../controllers/khaltiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/khalti/initiate", protect, initiateKhaltiPayment);
router.post("/khalti/verify", protect, verifyKhaltiPayment);

export default router;