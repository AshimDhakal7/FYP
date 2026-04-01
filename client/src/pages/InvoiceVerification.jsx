import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const money = (value) => `NPR ${Number(value || 0).toLocaleString()}`;

export default function InvoiceVerification() {
  const { bookingId } = useParams();

  const [loading, setLoading] = useState(true);
  const [invoice, setInvoice] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadInvoice = async () => {
      try {
        setLoading(true);
        setError("");

        const res = await fetch(
          `${API_BASE}/api/payment/invoice/${bookingId}/details`
        );

        const data = await res.json();

        if (!res.ok) {
          setError(data?.message || "Failed to load invoice verification");
          return;
        }

        setInvoice(data);
      } catch (err) {
        console.error("INVOICE VERIFICATION LOAD ERROR:", err);
        setError("Failed to load invoice verification");
      } finally {
        setLoading(false);
      }
    };

    if (bookingId) {
      loadInvoice();
    }
  }, [bookingId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-gray-100 p-8 text-center w-full max-w-md">
          <div className="w-10 h-10 mx-auto border-4 border-green-200 border-t-green-600 rounded-full animate-spin mb-4" />
          <h2 className="text-lg font-semibold text-gray-800">
            Verifying invoice...
          </h2>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we load booking details.
          </p>
        </div>
      </div>
    );
  }

  if (error || !invoice) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 via-white to-gray-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-red-100 p-8 text-center w-full max-w-md">
          <div className="text-4xl mb-3">⚠️</div>
          <h2 className="text-lg font-semibold text-gray-800">
            Verification failed
          </h2>
          <p className="text-sm text-red-600 mt-2">
            {error || "Invoice not found"}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-gray-100 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="bg-green-700 text-white rounded-t-3xl px-6 py-8 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold">CricBook Invoice Verification</h1>
              <p className="text-green-100 mt-2 text-sm">
                Verified booking payment details
              </p>
            </div>
            <div className="bg-white/15 rounded-2xl px-4 py-3 text-sm">
              <div className="text-green-100">Invoice</div>
              <div className="font-semibold text-white">{invoice.invoiceNumber}</div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-b-3xl shadow-lg border border-t-0 border-gray-100 overflow-hidden">
          <div className="grid md:grid-cols-2 gap-0">
            <div className="p-6 border-b md:border-b-0 md:border-r border-gray-100">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">
                Booking Details
              </h2>

              <div className="space-y-4">
                <InfoRow label="Ground" value={invoice.groundName} />
                <InfoRow label="Location" value={invoice.groundLocation} />
                <InfoRow label="Booking Date" value={invoice.bookingDate} />
                <InfoRow label="Time Slot" value={invoice.timeSlot} />
                <InfoRow label="Player Name" value={invoice.player?.name} />
                <InfoRow label="Email" value={invoice.player?.email} />
                <InfoRow label="Phone" value={invoice.player?.phone} />
              </div>
            </div>

            <div className="p-6 bg-gray-50">
              <h2 className="text-lg font-semibold text-gray-800 mb-5">
                Payment Summary
              </h2>

              <div className="space-y-4">
                <div className="rounded-2xl bg-green-50 border border-green-100 p-4">
                  <div className="text-xs font-semibold text-green-700 uppercase tracking-wide">
                    Payment Status
                  </div>
                  <div className="mt-2 text-xl font-bold text-green-800">
                    {invoice.paymentStatus}
                  </div>
                </div>

                <SummaryRow label="Total Amount" value={money(invoice.totalAmount)} />
                <SummaryRow label="Amount Paid" value={money(invoice.amountPaid)} />
                <SummaryRow
                  label="Due Amount"
                  value={money(invoice.dueAmount)}
                  valueClassName={
                    Number(invoice.dueAmount) > 0
                      ? "text-amber-600 font-bold"
                      : "text-green-700 font-bold"
                  }
                />
                <SummaryRow label="Payment Method" value={invoice.paymentMethod} />
                <SummaryRow
                  label="Paid At"
                  value={
                    invoice.paidAt
                      ? new Date(invoice.paidAt).toLocaleString()
                      : "N/A"
                  }
                />
              </div>

              <div className="mt-6 rounded-2xl bg-white border border-gray-200 p-4">
                <div className="text-sm font-semibold text-gray-800">
                  Booking ID
                </div>
                <div className="mt-1 text-sm text-gray-600 break-all">
                  {invoice.bookingId}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ label, value }) {
  return (
    <div>
      <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
        {label}
      </div>
      <div className="mt-1 text-sm font-medium text-gray-800 break-words">
        {value || "N/A"}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, valueClassName = "text-gray-800 font-semibold" }) {
  return (
    <div className="flex items-start justify-between gap-4 rounded-xl bg-white border border-gray-200 px-4 py-3">
      <div className="text-sm text-gray-500">{label}</div>
      <div className={`text-sm text-right ${valueClassName}`}>{value || "N/A"}</div>
    </div>
  );
}