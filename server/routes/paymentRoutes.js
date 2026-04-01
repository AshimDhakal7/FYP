
// import express from "express";
// import {
//   initiateKhaltiPayment,
//   verifyKhaltiPayment,
// } from "../controllers/khaltiController.js";
// import { protect } from "../middleware/authMiddleware.js";

// const router = express.Router();

// router.post("/khalti/initiate", protect, initiateKhaltiPayment);
// router.post("/khalti/verify", protect, verifyKhaltiPayment);

// export default router;


import express from "express";
import {
  initiateKhaltiPayment,
  verifyKhaltiPayment,
  downloadInvoicePdf,
  getInvoiceVerificationDetails,
  renderInvoiceVerificationPage,
} from "../controllers/khaltiController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/khalti/initiate", protect, initiateKhaltiPayment);
router.post("/khalti/verify", protect, verifyKhaltiPayment);
router.get("/invoice/:bookingId", protect, downloadInvoicePdf);
router.get("/invoice/:bookingId/details", getInvoiceVerificationDetails);
router.get("/invoice/:bookingId/verify", renderInvoiceVerificationPage);

export default router;