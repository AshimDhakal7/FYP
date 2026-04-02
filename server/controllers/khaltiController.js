
// import axios from "axios";
// import PDFDocument from "pdfkit";
// import Booking from "../models/Booking.js";

// const formatCurrency = (amount) => `NPR ${Number(amount || 0).toLocaleString()}`;

// const formatDateTime = (value) => {
//   if (!value) return "N/A";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "N/A";
//   return d.toLocaleString();
// };

// const fetchQrCodeBuffer = async (payloadText) => {
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
//     payloadText
//   )}`;

//   const qrResponse = await axios.get(qrUrl, {
//     responseType: "arraybuffer",
//   });

//   return Buffer.from(qrResponse.data);
// };

// export const initiateKhaltiPayment = async (req, res) => {
//   try {
//     const { amount, bookingId, paymentType } = req.body;

//     if (!amount || !bookingId) {
//       return res.status(400).json({ message: "Missing amount or bookingId" });
//     }

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const totalPrice = Number(booking.totalPrice || 0);

//     let expectedAmount = totalPrice;
//     if (paymentType === "advance_30") {
//       expectedAmount = Math.round(totalPrice * 0.3);
//     } else if (paymentType === "full") {
//       expectedAmount = totalPrice;
//     }

//     if (Number(amount) !== Number(expectedAmount)) {
//       return res.status(400).json({
//         message: "Invalid payment amount",
//         expectedAmount,
//       });
//     }

//     const payload = {
//       return_url: `http://localhost:5173/bookings?bookingId=${bookingId}`,
//       website_url: "http://localhost:5173",
//       amount: expectedAmount * 100,
//       purchase_order_id: bookingId,
//       purchase_order_name: "Cricsal Booking",
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       payload,
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return res.status(200).json({
//       url: response.data.payment_url,
//       pidx: response.data.pidx,
//     });
//   } catch (error) {
//     console.error(
//       "Khalti Initiate Error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       message: "Khalti payment failed",
//       error: error.response?.data || error.message,
//     });
//   }
// };

// export const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, bookingId: bookingIdFromFrontend } = req.body;

//     if (!pidx) {
//       return res.status(400).json({ message: "Missing pidx" });
//     }

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const khaltiData = response.data;

//     if (!khaltiData || khaltiData.status !== "Completed") {
//       return res.status(400).json({
//         message: "Payment not completed",
//         status: khaltiData?.status,
//       });
//     }

//     const bookingId =
//       bookingIdFromFrontend ||
//       khaltiData.purchase_order_id ||
//       khaltiData.purchaseOrderId;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const paymentPreference =
//       booking.paymentPreference === "advance_30" ? "advance_30" : "full";

//     const amountPaid =
//       paymentPreference === "advance_30"
//         ? Math.round(Number(booking.totalPrice || 0) * 0.3)
//         : Number(booking.totalPrice || 0);

//     booking.isPaid = true;
//     booking.amountPaid = amountPaid;
//     booking.paymentMethod = "Khalti";
//     booking.khaltiPidx = pidx;
//     booking.paidAt = new Date();
//     booking.paymentStatusLabel =
//       paymentPreference === "advance_30"
//         ? "30% paid"
//         : "Full amount paid";

//     await booking.save();

//     return res.status(200).json({
//       message: "Payment verified successfully",
//       booking,
//       paymentSummary: {
//         amountPaid,
//         paymentStatusLabel: booking.paymentStatusLabel,
//         paymentMethod: booking.paymentMethod,
//         paidAt: booking.paidAt,
//       },
//     });
//   } catch (error) {
//     console.error("Khalti Verify Error:", error.response?.data || error.message);

//     return res.status(500).json({
//       message: "Payment verification failed",
//       error: error.response?.data || error.message,
//     });
//   }
// };

// export const getInvoiceVerificationDetails = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (!booking.isPaid) {
//       return res.status(400).json({
//         message: "Invoice verification available only after payment",
//       });
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     return res.status(200).json({
//       invoiceNumber,
//       bookingId: booking._id,
//       groundName,
//       groundLocation,
//       bookingDate: booking.date || "N/A",
//       timeSlot: `${booking.startTime || ""} - ${booking.endTime || ""}`,
//       paymentStatus: paidLabel,
//       totalAmount: totalPrice,
//       amountPaid,
//       dueAmount,
//       paymentMethod: booking.paymentMethod || "Khalti",
//       paidAt: booking.paidAt,
//       player: {
//         name: playerName,
//         email: playerEmail,
//         phone: playerPhone,
//       },
//     });
//   } catch (error) {
//     console.error("GET INVOICE VERIFICATION DETAILS ERROR:", error);
//     return res.status(500).json({
//       message: "Failed to fetch invoice verification details",
//       error: error.message,
//     });
//   }
// };

// export const renderInvoiceVerificationPage = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).send(`
//         <html>
//           <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//             <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//               <h1 style="color:#111827;">Invoice not found</h1>
//               <p style="color:#6b7280;">The booking you are trying to verify does not exist.</p>
//             </div>
//           </body>
//         </html>
//       `);
//     }

//     if (!booking.isPaid) {
//       return res.status(400).send(`
//         <html>
//           <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//             <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//               <h1 style="color:#111827;">Payment not completed</h1>
//               <p style="color:#6b7280;">This invoice is not available for verification yet.</p>
//             </div>
//           </body>
//         </html>
//       `);
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     res.setHeader("Content-Type", "text/html; charset=utf-8");

//     return res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>CricBook Invoice Verification</title>
//         <style>
//           * { box-sizing: border-box; }
//           body {
//             margin: 0;
//             font-family: Arial, sans-serif;
//             background: linear-gradient(135deg, #f0fdf4, #ffffff, #f3f4f6);
//             color: #111827;
//           }
//           .wrap {
//             max-width: 980px;
//             margin: 0 auto;
//             padding: 28px 16px;
//           }
//           .header {
//             background: #166534;
//             color: white;
//             border-radius: 28px 28px 0 0;
//             padding: 28px;
//             box-shadow: 0 10px 30px rgba(0,0,0,.08);
//           }
//           .header-top {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             gap: 20px;
//             flex-wrap: wrap;
//           }
//           .header h1 {
//             margin: 0;
//             font-size: 32px;
//             line-height: 1.2;
//           }
//           .header p {
//             margin: 8px 0 0;
//             color: #dcfce7;
//             font-size: 14px;
//           }
//           .invoice-box {
//             background: rgba(255,255,255,.12);
//             border: 1px solid rgba(255,255,255,.2);
//             padding: 14px 18px;
//             border-radius: 18px;
//             min-width: 210px;
//           }
//           .invoice-box .label {
//             color: #dcfce7;
//             font-size: 12px;
//           }
//           .invoice-box .value {
//             margin-top: 4px;
//             font-size: 18px;
//             font-weight: 700;
//           }
//           .content {
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-top: 0;
//             border-radius: 0 0 28px 28px;
//             overflow: hidden;
//             box-shadow: 0 10px 30px rgba(0,0,0,.06);
//           }
//           .grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//           }
//           .left {
//             padding: 28px;
//             border-right: 1px solid #e5e7eb;
//           }
//           .right {
//             padding: 28px;
//             background: #f9fafb;
//           }
//           .section-title {
//             margin: 0 0 20px;
//             font-size: 22px;
//             font-weight: 700;
//           }
//           .row {
//             margin-bottom: 18px;
//           }
//           .row .k {
//             font-size: 12px;
//             color: #6b7280;
//             text-transform: uppercase;
//             letter-spacing: .05em;
//             font-weight: 700;
//           }
//           .row .v {
//             margin-top: 6px;
//             font-size: 15px;
//             color: #111827;
//             font-weight: 600;
//             word-break: break-word;
//           }
//           .status-card {
//             background: #f0fdf4;
//             border: 1px solid #bbf7d0;
//             border-radius: 18px;
//             padding: 18px;
//             margin-bottom: 18px;
//           }
//           .status-card .k {
//             font-size: 12px;
//             color: #166534;
//             text-transform: uppercase;
//             letter-spacing: .05em;
//             font-weight: 700;
//           }
//           .status-card .v {
//             margin-top: 8px;
//             color: #166534;
//             font-size: 24px;
//             font-weight: 800;
//           }
//           .summary-row {
//             display: flex;
//             justify-content: space-between;
//             gap: 16px;
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-radius: 14px;
//             padding: 14px 16px;
//             margin-bottom: 12px;
//           }
//           .summary-row .k {
//             color: #6b7280;
//             font-size: 14px;
//           }
//           .summary-row .v {
//             color: #111827;
//             font-size: 14px;
//             font-weight: 700;
//             text-align: right;
//           }
//           .summary-row .v.warn {
//             color: #b45309;
//           }
//           .summary-row .v.ok {
//             color: #166534;
//           }
//           .booking-box {
//             margin-top: 18px;
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-radius: 16px;
//             padding: 16px;
//           }
//           .booking-box .k {
//             font-size: 13px;
//             color: #374151;
//             font-weight: 700;
//           }
//           .booking-box .v {
//             margin-top: 8px;
//             font-size: 14px;
//             color: #6b7280;
//             word-break: break-all;
//           }
//           @media (max-width: 768px) {
//             .grid { grid-template-columns: 1fr; }
//             .left { border-right: 0; border-bottom: 1px solid #e5e7eb; }
//             .header h1 { font-size: 26px; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="wrap">
//           <div class="header">
//             <div class="header-top">
//               <div>
//                 <h1>CricBook Invoice Verification</h1>
//                 <p>Verified booking payment details</p>
//               </div>
//               <div class="invoice-box">
//                 <div class="label">Invoice</div>
//                 <div class="value">${invoiceNumber}</div>
//               </div>
//             </div>
//           </div>

//           <div class="content">
//             <div class="grid">
//               <div class="left">
//                 <h2 class="section-title">Booking Details</h2>

//                 <div class="row">
//                   <div class="k">Ground</div>
//                   <div class="v">${groundName}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Location</div>
//                   <div class="v">${groundLocation}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Booking Date</div>
//                   <div class="v">${booking.date || "N/A"}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Time Slot</div>
//                   <div class="v">${booking.startTime || ""} - ${booking.endTime || ""}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Player Name</div>
//                   <div class="v">${playerName}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Email</div>
//                   <div class="v">${playerEmail}</div>
//                 </div>

//                 <div class="row">
//                   <div class="k">Phone</div>
//                   <div class="v">${playerPhone}</div>
//                 </div>
//               </div>

//               <div class="right">
//                 <h2 class="section-title">Payment Summary</h2>

//                 <div class="status-card">
//                   <div class="k">Payment Status</div>
//                   <div class="v">${paidLabel}</div>
//                 </div>

//                 <div class="summary-row">
//                   <div class="k">Total Amount</div>
//                   <div class="v">${formatCurrency(totalPrice)}</div>
//                 </div>

//                 <div class="summary-row">
//                   <div class="k">Amount Paid</div>
//                   <div class="v">${formatCurrency(amountPaid)}</div>
//                 </div>

//                 <div class="summary-row">
//                   <div class="k">Due Amount</div>
//                   <div class="v ${dueAmount > 0 ? "warn" : "ok"}">${formatCurrency(dueAmount)}</div>
//                 </div>

//                 <div class="summary-row">
//                   <div class="k">Payment Method</div>
//                   <div class="v">${booking.paymentMethod || "Khalti"}</div>
//                 </div>

//                 <div class="summary-row">
//                   <div class="k">Paid At</div>
//                   <div class="v">${formatDateTime(booking.paidAt)}</div>
//                 </div>

//                 <div class="booking-box">
//                   <div class="k">Booking ID</div>
//                   <div class="v">${booking._id}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error("RENDER INVOICE VERIFICATION PAGE ERROR:", error);
//     return res.status(500).send(`
//       <html>
//         <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//           <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//             <h1 style="color:#111827;">Server error</h1>
//             <p style="color:#6b7280;">Failed to load verification page.</p>
//           </div>
//         </body>
//       </html>
//     `);
//   }
// };

// export const downloadInvoicePdf = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const userId = req.user?._id || req.user?.id;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const isBookingOwner =
//       String(booking.user?._id || booking.user) === String(userId);

//     if (!isBookingOwner) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     if (!booking.isPaid) {
//       return res
//         .status(400)
//         .json({ message: "Invoice available only after payment" });
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     const BACKEND_URL = process.env.BACKEND_URL || "https://your-api-domain.com";
//     const qrPayload = `${BACKEND_URL}/api/payment/invoice/${booking._id}/verify`;

//     const qrBuffer = await fetchQrCodeBuffer(qrPayload);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${invoiceNumber}.pdf`
//     );

//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//     });

//     doc.pipe(res);

//     doc.roundedRect(40, 35, 515, 110, 18).fill("#166534");

//     doc
//       .fillColor("#ffffff")
//       .fontSize(24)
//       .font("Helvetica-Bold")
//       .text("CricBook Invoice", 65, 60);

//     doc
//       .fontSize(10)
//       .font("Helvetica")
//       .fillColor("#dcfce7")
//       .text(`Invoice No: ${invoiceNumber}`, 65, 95)
//       .text(`Generated: ${formatDateTime(booking.paidAt || new Date())}`, 65, 110)
//       .text(`Payment Method: Khalti`, 65, 125);

//     doc.roundedRect(395, 72, 120, 28, 14).fill("#dcfce7");

//     doc
//       .fillColor("#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text("PAYMENT RECEIVED", 410, 81);

//     doc
//       .roundedRect(40, 170, 330, 310, 18)
//       .fill("#ffffff")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(15)
//       .font("Helvetica-Bold")
//       .text("Booking Details", 60, 190);

//     const labelX = 60;
//     const valueX = 60;
//     let y = 225;

//     const drawField = (label, value) => {
//       doc
//         .fillColor("#6b7280")
//         .fontSize(9)
//         .font("Helvetica-Bold")
//         .text(label.toUpperCase(), labelX, y);

//       y += 16;

//       doc
//         .fillColor("#111827")
//         .fontSize(12)
//         .font("Helvetica")
//         .text(value, valueX, y, { width: 280 });

//       y += 32;
//     };

//     drawField("Ground", groundName);
//     drawField("Location", groundLocation);
//     drawField("Booking Date", booking.date || "N/A");
//     drawField("Time Slot", `${booking.startTime || ""} - ${booking.endTime || ""}`);
//     drawField("Player Name", playerName);
//     drawField("Email", playerEmail);
//     drawField("Phone", playerPhone);

//     doc
//       .roundedRect(390, 170, 165, 150, 18)
//       .fill("#f9fafb")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(14)
//       .font("Helvetica-Bold")
//       .text("Payment Summary", 407, 190);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("STATUS", 407, 220);

//     doc
//       .fillColor("#166534")
//       .fontSize(12)
//       .font("Helvetica-Bold")
//       .text(paidLabel, 407, 236);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("AMOUNT PAID", 407, 266);

//     doc
//       .fillColor("#111827")
//       .fontSize(16)
//       .font("Helvetica-Bold")
//       .text(formatCurrency(amountPaid), 407, 282);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("TOTAL", 407, 314);

//     doc
//       .fillColor("#111827")
//       .fontSize(11)
//       .font("Helvetica")
//       .text(formatCurrency(totalPrice), 407, 330);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("DUE", 407, 355);

//     doc
//       .fillColor(dueAmount > 0 ? "#b45309" : "#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text(formatCurrency(dueAmount), 407, 371);

//     doc
//       .roundedRect(390, 340, 165, 220, 18)
//       .fill("#ffffff")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(13)
//       .font("Helvetica-Bold")
//       .text("Scan to Verify", 418, 360);

//     doc.image(qrBuffer, 412, 390, {
//       fit: [120, 120],
//       align: "center",
//       valign: "center",
//     });

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica")
//       .text(
//         "QR opens the public invoice verification page for owner checking.",
//         404,
//         520,
//         { width: 135, align: "left" }
//       );

//     doc
//       .roundedRect(40, 505, 330, 55, 14)
//       .fill("#f0fdf4")
//       .strokeColor("#bbf7d0")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text("Thank you for booking with CricBook.", 58, 523);

//     doc
//       .fillColor("#4b5563")
//       .fontSize(9)
//       .font("Helvetica")
//       .text(
//         "Please keep this invoice for entry, verification, and future support.",
//         58,
//         540
//       );

//     doc.end();
//   } catch (error) {
//     console.error("DOWNLOAD INVOICE ERROR:", error);
//     return res.status(500).json({
//       message: "Failed to generate invoice PDF",
//       error: error.message,
//     });
//   }
// };



// import axios from "axios";
// import PDFDocument from "pdfkit";
// import Booking from "../models/Booking.js";

// const formatCurrency = (amount) => `NPR ${Number(amount || 0).toLocaleString()}`;

// const formatDateTime = (value) => {
//   if (!value) return "N/A";
//   const d = new Date(value);
//   if (Number.isNaN(d.getTime())) return "N/A";
//   return d.toLocaleString();
// };

// const fetchQrCodeBuffer = async (payloadText) => {
//   const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
//     payloadText
//   )}`;

//   const qrResponse = await axios.get(qrUrl, {
//     responseType: "arraybuffer",
//   });

//   return Buffer.from(qrResponse.data);
// };

// export const initiateKhaltiPayment = async (req, res) => {
//   try {
//     const { amount, bookingId, paymentType } = req.body;

//     if (!amount || !bookingId) {
//       return res.status(400).json({ message: "Missing amount or bookingId" });
//     }

//     const booking = await Booking.findById(bookingId);

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const totalPrice = Number(booking.totalPrice || 0);

//     let expectedAmount = totalPrice;
//     if (paymentType === "advance_30") {
//       expectedAmount = Math.round(totalPrice * 0.3);
//     } else if (paymentType === "full") {
//       expectedAmount = totalPrice;
//     }

//     if (Number(amount) !== Number(expectedAmount)) {
//       return res.status(400).json({
//         message: "Invalid payment amount",
//         expectedAmount,
//       });
//     }

//     const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

//     const payload = {
//       return_url: `${FRONTEND_URL}/bookings?bookingId=${bookingId}`,
//       website_url: FRONTEND_URL,
//       amount: expectedAmount * 100,
//       purchase_order_id: bookingId,
//       purchase_order_name: "Cricsal Booking",
//     };

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/initiate/",
//       payload,
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     return res.status(200).json({
//       url: response.data.payment_url,
//       pidx: response.data.pidx,
//     });
//   } catch (error) {
//     console.error(
//       "Khalti Initiate Error:",
//       error.response?.data || error.message
//     );

//     return res.status(500).json({
//       message: "Khalti payment failed",
//       error: error.response?.data || error.message,
//     });
//   }
// };

// export const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, bookingId: bookingIdFromFrontend } = req.body;

//     if (!pidx) {
//       return res.status(400).json({ message: "Missing pidx" });
//     }

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const khaltiData = response.data;

//     if (!khaltiData || khaltiData.status !== "Completed") {
//       return res.status(400).json({
//         message: "Payment not completed",
//         status: khaltiData?.status,
//       });
//     }

//     const bookingId =
//       bookingIdFromFrontend ||
//       khaltiData.purchase_order_id ||
//       khaltiData.purchaseOrderId;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const paymentPreference =
//       booking.paymentPreference === "advance_30" ? "advance_30" : "full";

//     const amountPaid =
//       paymentPreference === "advance_30"
//         ? Math.round(Number(booking.totalPrice || 0) * 0.3)
//         : Number(booking.totalPrice || 0);

//     booking.isPaid = true;
//     booking.amountPaid = amountPaid;
//     booking.paymentMethod = "Khalti";
//     booking.khaltiPidx = pidx;
//     booking.paidAt = new Date();
//     booking.paymentStatusLabel =
//       paymentPreference === "advance_30"
//         ? "30% paid"
//         : "Full amount paid";

//     await booking.save();

//     return res.status(200).json({
//       message: "Payment verified successfully",
//       booking,
//       paymentSummary: {
//         amountPaid,
//         paymentStatusLabel: booking.paymentStatusLabel,
//         paymentMethod: booking.paymentMethod,
//         paidAt: booking.paidAt,
//       },
//     });
//   } catch (error) {
//     console.error("Khalti Verify Error:", error.response?.data || error.message);

//     return res.status(500).json({
//       message: "Payment verification failed",
//       error: error.response?.data || error.message,
//     });
//   }
// };

// export const getInvoiceVerificationDetails = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     if (!booking.isPaid) {
//       return res.status(400).json({
//         message: "Invoice verification available only after payment",
//       });
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");
//     res.setHeader("Surrogate-Control", "no-store");

//     return res.status(200).json({
//       invoiceNumber,
//       bookingId: booking._id,
//       groundName,
//       groundLocation,
//       bookingDate: booking.date || "N/A",
//       timeSlot: `${booking.startTime || ""} - ${booking.endTime || ""}`,
//       paymentStatus: paidLabel,
//       totalAmount: totalPrice,
//       amountPaid,
//       dueAmount,
//       paymentMethod: booking.paymentMethod || "Khalti",
//       paidAt: booking.paidAt,
//       player: {
//         name: playerName,
//         email: playerEmail,
//         phone: playerPhone,
//       },
//     });
//   } catch (error) {
//     console.error("GET INVOICE VERIFICATION DETAILS ERROR:", error);
//     return res.status(500).json({
//       message: "Failed to fetch invoice verification details",
//       error: error.message,
//     });
//   }
// };

// export const renderInvoiceVerificationPage = async (req, res) => {
//   try {
//     const { bookingId } = req.params;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     res.setHeader("Content-Type", "text/html; charset=utf-8");
//     res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
//     res.setHeader("Pragma", "no-cache");
//     res.setHeader("Expires", "0");
//     res.setHeader("Surrogate-Control", "no-store");

//     if (!booking) {
//       return res.status(404).send(`
//         <html>
//           <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//             <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//               <h1 style="color:#111827;">Invoice not found</h1>
//               <p style="color:#6b7280;">The booking you are trying to verify does not exist.</p>
//             </div>
//           </body>
//         </html>
//       `);
//     }

//     if (!booking.isPaid) {
//       return res.status(400).send(`
//         <html>
//           <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//             <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//               <h1 style="color:#111827;">Payment not completed</h1>
//               <p style="color:#6b7280;">This invoice is not available for verification yet.</p>
//             </div>
//           </body>
//         </html>
//       `);
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     return res.send(`
//       <!DOCTYPE html>
//       <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>CricBook Invoice Verification</title>
//         <style>
//           * { box-sizing: border-box; }
//           body {
//             margin: 0;
//             font-family: Arial, sans-serif;
//             background: linear-gradient(135deg, #f0fdf4, #ffffff, #f3f4f6);
//             color: #111827;
//           }
//           .wrap {
//             max-width: 980px;
//             margin: 0 auto;
//             padding: 28px 16px;
//           }
//           .header {
//             background: #166534;
//             color: white;
//             border-radius: 28px 28px 0 0;
//             padding: 28px;
//             box-shadow: 0 10px 30px rgba(0,0,0,.08);
//           }
//           .header-top {
//             display: flex;
//             justify-content: space-between;
//             align-items: flex-start;
//             gap: 20px;
//             flex-wrap: wrap;
//           }
//           .header h1 {
//             margin: 0;
//             font-size: 32px;
//             line-height: 1.2;
//           }
//           .header p {
//             margin: 8px 0 0;
//             color: #dcfce7;
//             font-size: 14px;
//           }
//           .invoice-box {
//             background: rgba(255,255,255,.12);
//             border: 1px solid rgba(255,255,255,.2);
//             padding: 14px 18px;
//             border-radius: 18px;
//             min-width: 210px;
//           }
//           .invoice-box .label {
//             color: #dcfce7;
//             font-size: 12px;
//           }
//           .invoice-box .value {
//             margin-top: 4px;
//             font-size: 18px;
//             font-weight: 700;
//           }
//           .content {
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-top: 0;
//             border-radius: 0 0 28px 28px;
//             overflow: hidden;
//             box-shadow: 0 10px 30px rgba(0,0,0,.06);
//           }
//           .grid {
//             display: grid;
//             grid-template-columns: 1fr 1fr;
//           }
//           .left {
//             padding: 28px;
//             border-right: 1px solid #e5e7eb;
//           }
//           .right {
//             padding: 28px;
//             background: #f9fafb;
//           }
//           .section-title {
//             margin: 0 0 20px;
//             font-size: 22px;
//             font-weight: 700;
//           }
//           .row {
//             margin-bottom: 18px;
//           }
//           .row .k {
//             font-size: 12px;
//             color: #6b7280;
//             text-transform: uppercase;
//             letter-spacing: .05em;
//             font-weight: 700;
//           }
//           .row .v {
//             margin-top: 6px;
//             font-size: 15px;
//             color: #111827;
//             font-weight: 600;
//             word-break: break-word;
//           }
//           .status-card {
//             background: #f0fdf4;
//             border: 1px solid #bbf7d0;
//             border-radius: 18px;
//             padding: 18px;
//             margin-bottom: 18px;
//           }
//           .status-card .k {
//             font-size: 12px;
//             color: #166534;
//             text-transform: uppercase;
//             letter-spacing: .05em;
//             font-weight: 700;
//           }
//           .status-card .v {
//             margin-top: 8px;
//             color: #166534;
//             font-size: 24px;
//             font-weight: 800;
//           }
//           .summary-row {
//             display: flex;
//             justify-content: space-between;
//             gap: 16px;
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-radius: 14px;
//             padding: 14px 16px;
//             margin-bottom: 12px;
//           }
//           .summary-row .k {
//             color: #6b7280;
//             font-size: 14px;
//           }
//           .summary-row .v {
//             color: #111827;
//             font-size: 14px;
//             font-weight: 700;
//             text-align: right;
//           }
//           .summary-row .v.warn {
//             color: #b45309;
//           }
//           .summary-row .v.ok {
//             color: #166534;
//           }
//           .booking-box {
//             margin-top: 18px;
//             background: white;
//             border: 1px solid #e5e7eb;
//             border-radius: 16px;
//             padding: 16px;
//           }
//           .booking-box .k {
//             font-size: 13px;
//             color: #374151;
//             font-weight: 700;
//           }
//           .booking-box .v {
//             margin-top: 8px;
//             font-size: 14px;
//             color: #6b7280;
//             word-break: break-all;
//           }
//           @media (max-width: 768px) {
//             .grid { grid-template-columns: 1fr; }
//             .left { border-right: 0; border-bottom: 1px solid #e5e7eb; }
//             .header h1 { font-size: 26px; }
//           }
//         </style>
//       </head>
//       <body>
//         <div class="wrap">
//           <div class="header">
//             <div class="header-top">
//               <div>
//                 <h1>CricBook Invoice Verification</h1>
//                 <p>Verified booking payment details</p>
//               </div>
//               <div class="invoice-box">
//                 <div class="label">Invoice</div>
//                 <div class="value">${invoiceNumber}</div>
//               </div>
//             </div>
//           </div>

//           <div class="content">
//             <div class="grid">
//               <div class="left">
//                 <h2 class="section-title">Booking Details</h2>

//                 <div class="row"><div class="k">Ground</div><div class="v">${groundName}</div></div>
//                 <div class="row"><div class="k">Location</div><div class="v">${groundLocation}</div></div>
//                 <div class="row"><div class="k">Booking Date</div><div class="v">${booking.date || "N/A"}</div></div>
//                 <div class="row"><div class="k">Time Slot</div><div class="v">${booking.startTime || ""} - ${booking.endTime || ""}</div></div>
//                 <div class="row"><div class="k">Player Name</div><div class="v">${playerName}</div></div>
//                 <div class="row"><div class="k">Email</div><div class="v">${playerEmail}</div></div>
//                 <div class="row"><div class="k">Phone</div><div class="v">${playerPhone}</div></div>
//               </div>

//               <div class="right">
//                 <h2 class="section-title">Payment Summary</h2>

//                 <div class="status-card">
//                   <div class="k">Payment Status</div>
//                   <div class="v">${paidLabel}</div>
//                 </div>

//                 <div class="summary-row"><div class="k">Total Amount</div><div class="v">${formatCurrency(totalPrice)}</div></div>
//                 <div class="summary-row"><div class="k">Amount Paid</div><div class="v">${formatCurrency(amountPaid)}</div></div>
//                 <div class="summary-row"><div class="k">Due Amount</div><div class="v ${dueAmount > 0 ? "warn" : "ok"}">${formatCurrency(dueAmount)}</div></div>
//                 <div class="summary-row"><div class="k">Payment Method</div><div class="v">${booking.paymentMethod || "Khalti"}</div></div>
//                 <div class="summary-row"><div class="k">Paid At</div><div class="v">${formatDateTime(booking.paidAt)}</div></div>

//                 <div class="booking-box">
//                   <div class="k">Booking ID</div>
//                   <div class="v">${booking._id}</div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </body>
//       </html>
//     `);
//   } catch (error) {
//     console.error("RENDER INVOICE VERIFICATION PAGE ERROR:", error);
//     return res.status(500).send(`
//       <html>
//         <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
//           <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
//             <h1 style="color:#111827;">Server error</h1>
//             <p style="color:#6b7280;">Failed to load verification page.</p>
//           </div>
//         </body>
//       </html>
//     `);
//   }
// };

// export const downloadInvoicePdf = async (req, res) => {
//   try {
//     const { bookingId } = req.params;
//     const userId = req.user?._id || req.user?.id;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const isBookingOwner =
//       String(booking.user?._id || booking.user) === String(userId);

//     if (!isBookingOwner) {
//       return res.status(403).json({ message: "Not allowed" });
//     }

//     if (!booking.isPaid) {
//       return res.status(400).json({ message: "Invoice available only after payment" });
//     }

//     const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
//     const groundName = booking.cricsal?.name || "CricBook Ground";
//     const groundLocation = booking.cricsal?.location || "N/A";
//     const playerName = booking.user?.name || "N/A";
//     const playerEmail = booking.user?.email || "N/A";
//     const playerPhone = booking.user?.phone || "N/A";
//     const paidLabel = booking.paymentStatusLabel || "Paid";
//     const amountPaid = Number(booking.amountPaid || 0);
//     const totalPrice = Number(booking.totalPrice || 0);
//     const dueAmount = Math.max(totalPrice - amountPaid, 0);

//     const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5001").trim();
//     const verifyUrl = `${BACKEND_URL}/api/payment/invoice/${booking._id}/verify?v=${booking.updatedAt?.getTime?.() || Date.now()}`;

//     const qrBuffer = await fetchQrCodeBuffer(verifyUrl);

//     res.setHeader("Content-Type", "application/pdf");
//     res.setHeader(
//       "Content-Disposition",
//       `attachment; filename=${invoiceNumber}.pdf`
//     );

//     const doc = new PDFDocument({
//       size: "A4",
//       margin: 50,
//     });

//     doc.pipe(res);

//     doc.roundedRect(40, 35, 515, 110, 18).fill("#166534");

//     doc
//       .fillColor("#ffffff")
//       .fontSize(24)
//       .font("Helvetica-Bold")
//       .text("CricBook Invoice", 65, 60);

//     doc
//       .fontSize(10)
//       .font("Helvetica")
//       .fillColor("#dcfce7")
//       .text(`Invoice No: ${invoiceNumber}`, 65, 95)
//       .text(`Generated: ${formatDateTime(booking.paidAt || new Date())}`, 65, 110)
//       .text(`Payment Method: Khalti`, 65, 125);

//     doc.roundedRect(395, 72, 120, 28, 14).fill("#dcfce7");

//     doc
//       .fillColor("#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text("PAYMENT RECEIVED", 410, 81);

//     doc
//       .roundedRect(40, 170, 330, 310, 18)
//       .fill("#ffffff")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(15)
//       .font("Helvetica-Bold")
//       .text("Booking Details", 60, 190);

//     const labelX = 60;
//     const valueX = 60;
//     let y = 225;

//     const drawField = (label, value) => {
//       doc
//         .fillColor("#6b7280")
//         .fontSize(9)
//         .font("Helvetica-Bold")
//         .text(label.toUpperCase(), labelX, y);

//       y += 16;

//       doc
//         .fillColor("#111827")
//         .fontSize(12)
//         .font("Helvetica")
//         .text(value, valueX, y, { width: 280 });

//       y += 32;
//     };

//     drawField("Ground", groundName);
//     drawField("Location", groundLocation);
//     drawField("Booking Date", booking.date || "N/A");
//     drawField("Time Slot", `${booking.startTime || ""} - ${booking.endTime || ""}`);
//     drawField("Player Name", playerName);
//     drawField("Email", playerEmail);
//     drawField("Phone", playerPhone);

//     doc
//       .roundedRect(390, 170, 165, 150, 18)
//       .fill("#f9fafb")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(14)
//       .font("Helvetica-Bold")
//       .text("Payment Summary", 407, 190);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("STATUS", 407, 220);

//     doc
//       .fillColor("#166534")
//       .fontSize(12)
//       .font("Helvetica-Bold")
//       .text(paidLabel, 407, 236);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("AMOUNT PAID", 407, 266);

//     doc
//       .fillColor("#111827")
//       .fontSize(16)
//       .font("Helvetica-Bold")
//       .text(formatCurrency(amountPaid), 407, 282);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("TOTAL", 407, 314);

//     doc
//       .fillColor("#111827")
//       .fontSize(11)
//       .font("Helvetica")
//       .text(formatCurrency(totalPrice), 407, 330);

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica-Bold")
//       .text("DUE", 407, 355);

//     doc
//       .fillColor(dueAmount > 0 ? "#b45309" : "#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text(formatCurrency(dueAmount), 407, 371);

//     doc
//       .roundedRect(390, 340, 165, 220, 18)
//       .fill("#ffffff")
//       .strokeColor("#e5e7eb")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#111827")
//       .fontSize(13)
//       .font("Helvetica-Bold")
//       .text("Scan to Verify", 418, 360);

//     doc.image(qrBuffer, 412, 390, {
//       fit: [120, 120],
//       align: "center",
//       valign: "center",
//     });

//     doc
//       .fillColor("#6b7280")
//       .fontSize(9)
//       .font("Helvetica")
//       .text(
//         "QR opens the public invoice verification page for owner checking.",
//         404,
//         520,
//         { width: 135, align: "left" }
//       );

//     doc
//       .roundedRect(40, 505, 330, 55, 14)
//       .fill("#f0fdf4")
//       .strokeColor("#bbf7d0")
//       .lineWidth(1)
//       .stroke();

//     doc
//       .fillColor("#166534")
//       .fontSize(11)
//       .font("Helvetica-Bold")
//       .text("Thank you for booking with CricBook.", 58, 523);

//     doc
//       .fillColor("#4b5563")
//       .fontSize(9)
//       .font("Helvetica")
//       .text(
//         "Please keep this invoice for entry, verification, and future support.",
//         58,
//         540
//       );

//     doc.end();
//   } catch (error) {
//     console.error("DOWNLOAD INVOICE ERROR:", error);
//     return res.status(500).json({
//       message: "Failed to generate invoice PDF",
//       error: error.message,
//     });
//   }
// };


import axios from "axios";
import PDFDocument from "pdfkit";
import Booking from "../models/Booking.js";
import User from "../models/User.js";
import LoyaltyTransaction from "../models/LoyaltyTransaction.js";

const formatCurrency = (amount) => `NPR ${Number(amount || 0).toLocaleString()}`;

const formatDateTime = (value) => {
  if (!value) return "N/A";
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return "N/A";
  return d.toLocaleString();
};

const fetchQrCodeBuffer = async (payloadText) => {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(
    payloadText
  )}`;

  const qrResponse = await axios.get(qrUrl, {
    responseType: "arraybuffer",
  });

  return Buffer.from(qrResponse.data);
};

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

    const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:5173";

    const payload = {
      return_url: `${FRONTEND_URL}/bookings?bookingId=${bookingId}`,
      website_url: FRONTEND_URL,
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

// export const verifyKhaltiPayment = async (req, res) => {
//   try {
//     const { pidx, bookingId: bookingIdFromFrontend } = req.body;

//     if (!pidx) {
//       return res.status(400).json({ message: "Missing pidx" });
//     }

//     const response = await axios.post(
//       "https://a.khalti.com/api/v2/epayment/lookup/",
//       { pidx },
//       {
//         headers: {
//           Authorization: `Key ${process.env.KHALTI_SECRET}`,
//           "Content-Type": "application/json",
//         },
//       }
//     );

//     const khaltiData = response.data;

//     if (!khaltiData || khaltiData.status !== "Completed") {
//       return res.status(400).json({
//         message: "Payment not completed",
//         status: khaltiData?.status,
//       });
//     }

//     const bookingId =
//       bookingIdFromFrontend ||
//       khaltiData.purchase_order_id ||
//       khaltiData.purchaseOrderId;

//     const booking = await Booking.findById(bookingId)
//       .populate("cricsal", "name location")
//       .populate("user", "name email phone");

//     if (!booking) {
//       return res.status(404).json({ message: "Booking not found" });
//     }

//     const paymentPreference =
//       booking.paymentPreference === "advance_30" ? "advance_30" : "full";

//     const amountPaid =
//       paymentPreference === "advance_30"
//         ? Math.round(Number(booking.totalPrice || 0) * 0.3)
//         : Number(booking.totalPrice || 0);

//     booking.isPaid = true;
//     booking.amountPaid = amountPaid;
//     booking.paymentMethod = "Khalti";
//     booking.khaltiPidx = pidx;
//     booking.paidAt = new Date();
//     booking.paymentStatusLabel =
//       paymentPreference === "advance_30"
//         ? "30% paid"
//         : "Full amount paid";

//     if (!booking.rewardStatus) {
//       booking.rewardStatus = "none";
//     }

//     let earnedPoints = Number(booking.pointsEarned || 0);

//     if (booking.rewardStatus !== "earned") {
//       earnedPoints = Math.floor(Number(amountPaid || 0) / 10);

//       const userId = booking.user?._id || booking.user;
//       const user = await User.findById(userId);

//       if (user) {
//         user.loyaltyPoints = Number(user.loyaltyPoints || 0) + earnedPoints;
//         await user.save();
//       }

//       booking.pointsEarned = earnedPoints;
//       booking.rewardStatus = "earned";
//     }

//     await booking.save();

//     return res.status(200).json({
//       message: "Payment verified successfully",
//       booking,
//       loyalty: {
//         pointsEarned: earnedPoints,
//         rewardStatus: booking.rewardStatus,
//       },
//       paymentSummary: {
//         amountPaid,
//         paymentStatusLabel: booking.paymentStatusLabel,
//         paymentMethod: booking.paymentMethod,
//         paidAt: booking.paidAt,
//       },
//     });
//   } catch (error) {
//     console.error("Khalti Verify Error:", error.response?.data || error.message);

//     return res.status(500).json({
//       message: "Payment verification failed",
//       error: error.response?.data || error.message,
//     });
//   }
// };
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

    const booking = await Booking.findById(bookingId)
      .populate("cricsal", "name location")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const paymentPreference =
      booking.paymentPreference === "advance_30" ? "advance_30" : "full";

    const amountPaid =
      paymentPreference === "advance_30"
        ? Math.round(Number(booking.totalPrice || 0) * 0.3)
        : Number(booking.totalPrice || 0);

    booking.isPaid = true;
    booking.amountPaid = amountPaid;
    booking.paymentMethod = "Khalti";
    booking.khaltiPidx = pidx;
    booking.paidAt = new Date();
    booking.paymentStatusLabel =
      paymentPreference === "advance_30"
        ? "30% paid"
        : "Full amount paid";

    if (!booking.rewardStatus) {
      booking.rewardStatus = "none";
    }

    let earnedPoints = Number(booking.pointsEarned || 0);

    if (booking.rewardStatus !== "earned") {
      earnedPoints = Math.floor(Number(amountPaid || 0) / 10);

      const userId = booking.user?._id || booking.user;
      const user = await User.findById(userId);

      if (user) {
        user.loyaltyPoints = Number(user.loyaltyPoints || 0) + earnedPoints;
        await user.save();

        await LoyaltyTransaction.create({
          user: user._id,
          booking: booking._id,
          type: "earn",
          points: earnedPoints,
          amountValue: amountPaid,
          description: "Points earned from successful Khalti payment",
        });
      }

      booking.pointsEarned = earnedPoints;
      booking.rewardStatus = "earned";
    }

    await booking.save();

    return res.status(200).json({
      message: "Payment verified successfully",
      booking,
      loyalty: {
        pointsEarned: earnedPoints,
        rewardStatus: booking.rewardStatus,
      },
      paymentSummary: {
        amountPaid,
        paymentStatusLabel: booking.paymentStatusLabel,
        paymentMethod: booking.paymentMethod,
        paidAt: booking.paidAt,
      },
    });
  } catch (error) {
    console.error("Khalti Verify Error:", error.response?.data || error.message);

    return res.status(500).json({
      message: "Payment verification failed",
      error: error.response?.data || error.message,
    });
  }
};

export const getInvoiceVerificationDetails = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("cricsal", "name location")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (!booking.isPaid) {
      return res.status(400).json({
        message: "Invoice verification available only after payment",
      });
    }

    const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
    const groundName = booking.cricsal?.name || "CricBook Ground";
    const groundLocation = booking.cricsal?.location || "N/A";
    const playerName = booking.user?.name || "N/A";
    const playerEmail = booking.user?.email || "N/A";
    const playerPhone = booking.user?.phone || "N/A";
    const paidLabel = booking.paymentStatusLabel || "Paid";
    const amountPaid = Number(booking.amountPaid || 0);
    const totalPrice = Number(booking.totalPrice || 0);
    const dueAmount = Math.max(totalPrice - amountPaid, 0);

    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    return res.status(200).json({
      invoiceNumber,
      bookingId: booking._id,
      groundName,
      groundLocation,
      bookingDate: booking.date || "N/A",
      timeSlot: `${booking.startTime || ""} - ${booking.endTime || ""}`,
      paymentStatus: paidLabel,
      totalAmount: totalPrice,
      amountPaid,
      dueAmount,
      paymentMethod: booking.paymentMethod || "Khalti",
      paidAt: booking.paidAt,
      player: {
        name: playerName,
        email: playerEmail,
        phone: playerPhone,
      },
    });
  } catch (error) {
    console.error("GET INVOICE VERIFICATION DETAILS ERROR:", error);
    return res.status(500).json({
      message: "Failed to fetch invoice verification details",
      error: error.message,
    });
  }
};

export const renderInvoiceVerificationPage = async (req, res) => {
  try {
    const { bookingId } = req.params;

    const booking = await Booking.findById(bookingId)
      .populate("cricsal", "name location")
      .populate("user", "name email phone");

    res.setHeader("Content-Type", "text/html; charset=utf-8");
    res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
    res.setHeader("Pragma", "no-cache");
    res.setHeader("Expires", "0");
    res.setHeader("Surrogate-Control", "no-store");

    if (!booking) {
      return res.status(404).send(`
        <html>
          <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
            <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
              <h1 style="color:#111827;">Invoice not found</h1>
              <p style="color:#6b7280;">The booking you are trying to verify does not exist.</p>
            </div>
          </body>
        </html>
      `);
    }

    if (!booking.isPaid) {
      return res.status(400).send(`
        <html>
          <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
            <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
              <h1 style="color:#111827;">Payment not completed</h1>
              <p style="color:#6b7280;">This invoice is not available for verification yet.</p>
            </div>
          </body>
        </html>
      `);
    }

    const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
    const groundName = booking.cricsal?.name || "CricBook Ground";
    const groundLocation = booking.cricsal?.location || "N/A";
    const playerName = booking.user?.name || "N/A";
    const playerEmail = booking.user?.email || "N/A";
    const playerPhone = booking.user?.phone || "N/A";
    const paidLabel = booking.paymentStatusLabel || "Paid";
    const amountPaid = Number(booking.amountPaid || 0);
    const totalPrice = Number(booking.totalPrice || 0);
    const dueAmount = Math.max(totalPrice - amountPaid, 0);

    return res.send(`
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>CricBook Invoice Verification</title>
        <style>
          * { box-sizing: border-box; }
          body {
            margin: 0;
            font-family: Arial, sans-serif;
            background: linear-gradient(135deg, #f0fdf4, #ffffff, #f3f4f6);
            color: #111827;
          }
          .wrap {
            max-width: 980px;
            margin: 0 auto;
            padding: 28px 16px;
          }
          .header {
            background: #166534;
            color: white;
            border-radius: 28px 28px 0 0;
            padding: 28px;
            box-shadow: 0 10px 30px rgba(0,0,0,.08);
          }
          .header-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;
            gap: 20px;
            flex-wrap: wrap;
          }
          .header h1 {
            margin: 0;
            font-size: 32px;
            line-height: 1.2;
          }
          .header p {
            margin: 8px 0 0;
            color: #dcfce7;
            font-size: 14px;
          }
          .invoice-box {
            background: rgba(255,255,255,.12);
            border: 1px solid rgba(255,255,255,.2);
            padding: 14px 18px;
            border-radius: 18px;
            min-width: 210px;
          }
          .invoice-box .label {
            color: #dcfce7;
            font-size: 12px;
          }
          .invoice-box .value {
            margin-top: 4px;
            font-size: 18px;
            font-weight: 700;
          }
          .content {
            background: white;
            border: 1px solid #e5e7eb;
            border-top: 0;
            border-radius: 0 0 28px 28px;
            overflow: hidden;
            box-shadow: 0 10px 30px rgba(0,0,0,.06);
          }
          .grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
          }
          .left {
            padding: 28px;
            border-right: 1px solid #e5e7eb;
          }
          .right {
            padding: 28px;
            background: #f9fafb;
          }
          .section-title {
            margin: 0 0 20px;
            font-size: 22px;
            font-weight: 700;
          }
          .row {
            margin-bottom: 18px;
          }
          .row .k {
            font-size: 12px;
            color: #6b7280;
            text-transform: uppercase;
            letter-spacing: .05em;
            font-weight: 700;
          }
          .row .v {
            margin-top: 6px;
            font-size: 15px;
            color: #111827;
            font-weight: 600;
            word-break: break-word;
          }
          .status-card {
            background: #f0fdf4;
            border: 1px solid #bbf7d0;
            border-radius: 18px;
            padding: 18px;
            margin-bottom: 18px;
          }
          .status-card .k {
            font-size: 12px;
            color: #166534;
            text-transform: uppercase;
            letter-spacing: .05em;
            font-weight: 700;
          }
          .status-card .v {
            margin-top: 8px;
            color: #166534;
            font-size: 24px;
            font-weight: 800;
          }
          .summary-row {
            display: flex;
            justify-content: space-between;
            gap: 16px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 14px;
            padding: 14px 16px;
            margin-bottom: 12px;
          }
          .summary-row .k {
            color: #6b7280;
            font-size: 14px;
          }
          .summary-row .v {
            color: #111827;
            font-size: 14px;
            font-weight: 700;
            text-align: right;
          }
          .summary-row .v.warn {
            color: #b45309;
          }
          .summary-row .v.ok {
            color: #166534;
          }
          .booking-box {
            margin-top: 18px;
            background: white;
            border: 1px solid #e5e7eb;
            border-radius: 16px;
            padding: 16px;
          }
          .booking-box .k {
            font-size: 13px;
            color: #374151;
            font-weight: 700;
          }
          .booking-box .v {
            margin-top: 8px;
            font-size: 14px;
            color: #6b7280;
            word-break: break-all;
          }
          @media (max-width: 768px) {
            .grid { grid-template-columns: 1fr; }
            .left { border-right: 0; border-bottom: 1px solid #e5e7eb; }
            .header h1 { font-size: 26px; }
          }
        </style>
      </head>
      <body>
        <div class="wrap">
          <div class="header">
            <div class="header-top">
              <div>
                <h1>CricBook Invoice Verification</h1>
                <p>Verified booking payment details</p>
              </div>
              <div class="invoice-box">
                <div class="label">Invoice</div>
                <div class="value">${invoiceNumber}</div>
              </div>
            </div>
          </div>

          <div class="content">
            <div class="grid">
              <div class="left">
                <h2 class="section-title">Booking Details</h2>

                <div class="row"><div class="k">Ground</div><div class="v">${groundName}</div></div>
                <div class="row"><div class="k">Location</div><div class="v">${groundLocation}</div></div>
                <div class="row"><div class="k">Booking Date</div><div class="v">${booking.date || "N/A"}</div></div>
                <div class="row"><div class="k">Time Slot</div><div class="v">${booking.startTime || ""} - ${booking.endTime || ""}</div></div>
                <div class="row"><div class="k">Player Name</div><div class="v">${playerName}</div></div>
                <div class="row"><div class="k">Email</div><div class="v">${playerEmail}</div></div>
                <div class="row"><div class="k">Phone</div><div class="v">${playerPhone}</div></div>
              </div>

              <div class="right">
                <h2 class="section-title">Payment Summary</h2>

                <div class="status-card">
                  <div class="k">Payment Status</div>
                  <div class="v">${paidLabel}</div>
                </div>

                <div class="summary-row"><div class="k">Total Amount</div><div class="v">${formatCurrency(totalPrice)}</div></div>
                <div class="summary-row"><div class="k">Amount Paid</div><div class="v">${formatCurrency(amountPaid)}</div></div>
                <div class="summary-row"><div class="k">Due Amount</div><div class="v ${dueAmount > 0 ? "warn" : "ok"}">${formatCurrency(dueAmount)}</div></div>
                <div class="summary-row"><div class="k">Payment Method</div><div class="v">${booking.paymentMethod || "Khalti"}</div></div>
                <div class="summary-row"><div class="k">Paid At</div><div class="v">${formatDateTime(booking.paidAt)}</div></div>

                <div class="booking-box">
                  <div class="k">Booking ID</div>
                  <div class="v">${booking._id}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </body>
      </html>
    `);
  } catch (error) {
    console.error("RENDER INVOICE VERIFICATION PAGE ERROR:", error);
    return res.status(500).send(`
      <html>
        <body style="font-family: Arial, sans-serif; background:#f9fafb; padding:40px;">
          <div style="max-width:700px;margin:0 auto;background:#fff;border:1px solid #e5e7eb;border-radius:20px;padding:32px;text-align:center;">
            <h1 style="color:#111827;">Server error</h1>
            <p style="color:#6b7280;">Failed to load verification page.</p>
          </div>
        </body>
      </html>
    `);
  }
};

export const downloadInvoicePdf = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const userId = req.user?._id || req.user?.id;

    const booking = await Booking.findById(bookingId)
      .populate("cricsal", "name location")
      .populate("user", "name email phone");

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isBookingOwner =
      String(booking.user?._id || booking.user) === String(userId);

    if (!isBookingOwner) {
      return res.status(403).json({ message: "Not allowed" });
    }

    if (!booking.isPaid) {
      return res.status(400).json({ message: "Invoice available only after payment" });
    }

    const invoiceNumber = `INV-${String(booking._id).slice(-6).toUpperCase()}`;
    const groundName = booking.cricsal?.name || "CricBook Ground";
    const groundLocation = booking.cricsal?.location || "N/A";
    const playerName = booking.user?.name || "N/A";
    const playerEmail = booking.user?.email || "N/A";
    const playerPhone = booking.user?.phone || "N/A";
    const paidLabel = booking.paymentStatusLabel || "Paid";
    const amountPaid = Number(booking.amountPaid || 0);
    const totalPrice = Number(booking.totalPrice || 0);
    const dueAmount = Math.max(totalPrice - amountPaid, 0);

    const BACKEND_URL = (process.env.BACKEND_URL || "http://localhost:5001").trim();
    const verifyUrl = `${BACKEND_URL}/api/payment/invoice/${booking._id}/verify?v=${booking.updatedAt?.getTime?.() || Date.now()}`;

    const qrBuffer = await fetchQrCodeBuffer(verifyUrl);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=${invoiceNumber}.pdf`
    );

    const doc = new PDFDocument({
      size: "A4",
      margin: 50,
    });

    doc.pipe(res);

    doc.roundedRect(40, 35, 515, 110, 18).fill("#166534");

    doc
      .fillColor("#ffffff")
      .fontSize(24)
      .font("Helvetica-Bold")
      .text("CricBook Invoice", 65, 60);

    doc
      .fontSize(10)
      .font("Helvetica")
      .fillColor("#dcfce7")
      .text(`Invoice No: ${invoiceNumber}`, 65, 95)
      .text(`Generated: ${formatDateTime(booking.paidAt || new Date())}`, 65, 110)
      .text(`Payment Method: Khalti`, 65, 125);

    doc.roundedRect(395, 72, 120, 28, 14).fill("#dcfce7");

    doc
      .fillColor("#166534")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("PAYMENT RECEIVED", 410, 81);

    doc
      .roundedRect(40, 170, 330, 310, 18)
      .fill("#ffffff")
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .stroke();

    doc
      .fillColor("#111827")
      .fontSize(15)
      .font("Helvetica-Bold")
      .text("Booking Details", 60, 190);

    const labelX = 60;
    const valueX = 60;
    let y = 225;

    const drawField = (label, value) => {
      doc
        .fillColor("#6b7280")
        .fontSize(9)
        .font("Helvetica-Bold")
        .text(label.toUpperCase(), labelX, y);

      y += 16;

      doc
        .fillColor("#111827")
        .fontSize(12)
        .font("Helvetica")
        .text(value, valueX, y, { width: 280 });

      y += 32;
    };

    drawField("Ground", groundName);
    drawField("Location", groundLocation);
    drawField("Booking Date", booking.date || "N/A");
    drawField("Time Slot", `${booking.startTime || ""} - ${booking.endTime || ""}`);
    drawField("Player Name", playerName);
    drawField("Email", playerEmail);
    drawField("Phone", playerPhone);

    doc
      .roundedRect(390, 170, 165, 150, 18)
      .fill("#f9fafb")
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .stroke();

    doc
      .fillColor("#111827")
      .fontSize(14)
      .font("Helvetica-Bold")
      .text("Payment Summary", 407, 190);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("STATUS", 407, 220);

    doc
      .fillColor("#166534")
      .fontSize(12)
      .font("Helvetica-Bold")
      .text(paidLabel, 407, 236);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("AMOUNT PAID", 407, 266);

    doc
      .fillColor("#111827")
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(formatCurrency(amountPaid), 407, 282);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("TOTAL", 407, 314);

    doc
      .fillColor("#111827")
      .fontSize(11)
      .font("Helvetica")
      .text(formatCurrency(totalPrice), 407, 330);

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica-Bold")
      .text("DUE", 407, 355);

    doc
      .fillColor(dueAmount > 0 ? "#b45309" : "#166534")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text(formatCurrency(dueAmount), 407, 371);

    doc
      .roundedRect(390, 340, 165, 220, 18)
      .fill("#ffffff")
      .strokeColor("#e5e7eb")
      .lineWidth(1)
      .stroke();

    doc
      .fillColor("#111827")
      .fontSize(13)
      .font("Helvetica-Bold")
      .text("Scan to Verify", 418, 360);

    doc.image(qrBuffer, 412, 390, {
      fit: [120, 120],
      align: "center",
      valign: "center",
    });

    doc
      .fillColor("#6b7280")
      .fontSize(9)
      .font("Helvetica")
      .text(
        "QR opens the public invoice verification page for owner checking.",
        404,
        520,
        { width: 135, align: "left" }
      );

    doc
      .roundedRect(40, 505, 330, 55, 14)
      .fill("#f0fdf4")
      .strokeColor("#bbf7d0")
      .lineWidth(1)
      .stroke();

    doc
      .fillColor("#166534")
      .fontSize(11)
      .font("Helvetica-Bold")
      .text("Thank you for booking with CricBook.", 58, 523);

    doc
      .fillColor("#4b5563")
      .fontSize(9)
      .font("Helvetica")
      .text(
        "Please keep this invoice for entry, verification, and future support.",
        58,
        540
      );

    doc.end();
  } catch (error) {
    console.error("DOWNLOAD INVOICE ERROR:", error);
    return res.status(500).json({
      message: "Failed to generate invoice PDF",
      error: error.message,
    });
  }
};