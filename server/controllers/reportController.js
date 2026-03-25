import PDFDocument from "pdfkit";

export const downloadOwnerReport = async (req, res) => {
  try {
    const { user, stats, bookings } = req.body;

    const doc = new PDFDocument({ margin: 40, size: "A4" });

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader("Content-Disposition", 'attachment; filename="owner-report.pdf"');

    doc.pipe(res);

    doc.font("Helvetica-Bold").fontSize(20).text("CricBook Owner Dashboard Report", {
      align: "center",
    });

    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(10);
    doc.text(`Generated: ${new Date().toLocaleString()}`);
    doc.text(`Owner: ${user?.name || "N/A"}`);
    doc.text(`Email: ${user?.email || "N/A"}`);

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text("Summary");
    doc.moveDown(0.5);
    doc.font("Helvetica").fontSize(11);
    doc.text(`Courts: ${stats?.courts ?? 0}`);
    doc.text(`Today: ${stats?.today ?? 0}`);
    doc.text(`Upcoming: ${stats?.upcoming ?? 0}`);
    doc.text(`Earnings: NPR ${stats?.earnings ?? 0}`);

    doc.moveDown();
    doc.font("Helvetica-Bold").fontSize(14).text("Recent Bookings");
    doc.moveDown(0.5);

    let y = doc.y;
    const col = {
      sn: 40,
      customer: 70,
      date: 190,
      time: 280,
      amount: 380,
    };

    const drawHeader = () => {
      doc.font("Helvetica-Bold").fontSize(11);
      doc.text("S.N.", col.sn, y);
      doc.text("Customer", col.customer, y);
      doc.text("Date", col.date, y);
      doc.text("Time", col.time, y);
      doc.text("Amount", col.amount, y);
      y += 20;
      doc.moveTo(40, y - 5).lineTo(550, y - 5).stroke();
      doc.font("Helvetica").fontSize(10);
    };

    drawHeader();

    (bookings || []).forEach((b, i) => {
      if (y > 740) {
        doc.addPage();
        y = 50;
        drawHeader();
      }

      doc.text(String(i + 1), col.sn, y);
      doc.text(b.userName || "N/A", col.customer, y, { width: 100 });
      doc.text(b.date || "N/A", col.date, y);
      doc.text(b.time || "N/A", col.time, y);
      doc.text(`NPR ${b.amount || 0}`, col.amount, y);

      y += 20;
    });

    doc.end();
  } catch (err) {
    console.error("Owner report PDF error:", err);
    res.status(500).json({ message: "Failed to generate owner report PDF" });
  }
};