import React, { useState } from "react";

const API_BASE =
  import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function ReviewModal({
  isOpen,
  onClose,
  booking,
  onSuccess,
}) {
  const [rating, setRating] = useState(0);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!booking?._id) return;
    if (!rating) {
      alert("Please select a rating");
      return;
    }

    try {
      setSubmitting(true);

      const res = await fetch(`${API_BASE}/api/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          bookingId: booking._id,
          rating,
          comment,
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to submit review");
      }

      alert("✅ Review submitted successfully");
      setRating(0);
      setHovered(0);
      setComment("");
      onClose?.();
      onSuccess?.();
    } catch (err) {
      console.error("SUBMIT REVIEW ERROR:", err);
      alert(`❌ ${err.message}`);
    } finally {
      setSubmitting(false);
    }
  };

  if (!isOpen || !booking) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-lg rounded-3xl bg-white p-6 shadow-2xl">
        <div className="mb-5 flex items-start justify-between gap-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Rate & Review</h2>
            <p className="mt-1 text-sm text-gray-500">
              Share your experience for {booking.cricsal?.name || "this ground"}
            </p>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="rounded-xl bg-gray-100 px-3 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-200"
          >
            Close
          </button>
        </div>

        <div className="mb-5 rounded-2xl bg-gray-50 p-4">
          <p className="text-sm font-semibold text-gray-800">
            {booking.cricsal?.name || "Ground"}
          </p>
          <p className="mt-1 text-sm text-gray-500">{booking.date}</p>
          <p className="mt-1 text-sm text-gray-500">
            {booking.startTime} - {booking.endTime}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <p className="mb-3 text-sm font-semibold text-gray-700">Your Rating</p>
            <div className="flex items-center gap-2">
              {[1, 2, 3, 4, 5].map((star) => {
                const active = star <= (hovered || rating);
                return (
                  <button
                    key={star}
                    type="button"
                    onMouseEnter={() => setHovered(star)}
                    onMouseLeave={() => setHovered(0)}
                    onClick={() => setRating(star)}
                    className={`text-3xl transition ${
                      active ? "text-yellow-500" : "text-gray-300"
                    }`}
                  >
                    ★
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="mb-2 block text-sm font-semibold text-gray-700">
              Comment
            </label>
            <textarea
              rows={5}
              maxLength={500}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Write your experience..."
              className="w-full rounded-2xl border border-gray-200 p-4 outline-none focus:border-green-500"
            />
            <p className="mt-1 text-xs text-gray-400">{comment.length}/500</p>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-2xl bg-green-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
          >
            {submitting ? "Submitting..." : "Submit Review"}
          </button>
        </form>
      </div>
    </div>
  );
}