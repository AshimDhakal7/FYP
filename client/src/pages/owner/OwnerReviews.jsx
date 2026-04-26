import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerReviews() {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [replyText, setReplyText] = useState({});
  const [editingId, setEditingId] = useState("");
  const [savingId, setSavingId] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  useEffect(() => {
    fetchReviews();
  }, []);

  const fetchReviews = async () => {
    try {
      setLoading(true);

      const res = await fetch(`${API_BASE}/api/reviews/owner`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Failed to load reviews");

      setReviews(Array.isArray(data) ? data : data.reviews || []);
    } catch (err) {
      toast.error(err.message || "Failed to load reviews");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  const handleReply = async (reviewId) => {
    const reply = (replyText[reviewId] || "").trim();

    if (!reply) {
      toast.warning("Please write a reply first");
      return;
    }

    try {
      setSavingId(reviewId);

      const res = await fetch(`${API_BASE}/api/reviews/${reviewId}/reply`, {
        method: "POST", // change to PATCH if your backend uses PATCH
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({ reply }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) throw new Error(data?.message || "Failed to save reply");

      toast.success(editingId === reviewId ? "Reply updated" : "Reply submitted");
      setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
      setEditingId("");
      fetchReviews();
    } catch (err) {
      toast.error(err.message || "Failed to save reply");
    } finally {
      setSavingId("");
    }
  };

  const startEdit = (review) => {
    setEditingId(review._id);
    setReplyText((prev) => ({
      ...prev,
      [review._id]: review.ownerReply || "",
    }));
  };

  const cancelEdit = (reviewId) => {
    setEditingId("");
    setReplyText((prev) => ({ ...prev, [reviewId]: "" }));
  };

  const averageRating = useMemo(() => {
    if (!reviews.length) return 0;
    return (
      reviews.reduce((sum, r) => sum + Number(r.rating || 0), 0) /
      reviews.length
    );
  }, [reviews]);

  const repliedCount = reviews.filter((r) => r.ownerReply).length;
  const pendingReplyCount = reviews.length - repliedCount;

  const renderStars = (rating = 0) => {
    const rounded = Math.round(Number(rating) || 0);
    return [1, 2, 3, 4, 5].map((star) => (
      <span
        key={star}
        className={star <= rounded ? "text-yellow-500" : "text-gray-300"}
      >
        ★
      </span>
    ));
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6">
      <div className="mx-auto max-w-6xl space-y-6">
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Reviews & Ratings
              </h1>
              <p className="mt-1 text-sm text-slate-500">
                View customer feedback and reply to reviews.
              </p>
            </div>

            <button
              onClick={fetchReviews}
              className="w-fit rounded-full border border-green-200 bg-green-50 px-4 py-2 text-sm font-semibold text-green-700 transition hover:bg-green-100"
            >
              Refresh
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SummaryCard title="Total Reviews" value={reviews.length} />
          <SummaryCard
            title="Average Rating"
            value={averageRating ? averageRating.toFixed(1) : "0.0"}
            color="yellow"
          />
          <SummaryCard title="Replied" value={repliedCount} color="green" />
          <SummaryCard title="Pending Reply" value={pendingReplyCount} color="red" />
        </div>

        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-slate-900">
              Customer Feedback
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Manage review replies from one place.
            </p>
          </div>

          {loading && (
            <div className="flex justify-center py-16">
              <div className="flex flex-col items-center gap-3">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
                <p className="text-sm text-slate-500">Loading reviews...</p>
              </div>
            </div>
          )}

          {!loading && reviews.length === 0 && (
            <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-12 text-center">
              <p className="text-lg font-bold text-slate-700">No reviews yet</p>
              <p className="mt-1 text-sm text-slate-500">
                Customer reviews will appear here.
              </p>
            </div>
          )}

          {!loading && reviews.length > 0 && (
            <div className="space-y-4">
              {reviews.map((review) => {
                const isEditing = editingId === review._id;

                return (
                  <div
                    key={review._id}
                    className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:border-green-200 hover:shadow-md"
                  >
                    <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                      <div className="flex flex-wrap items-center gap-3">
                        <h3 className="text-xl font-bold text-slate-900">
                          {review.user?.name || "Anonymous User"}
                        </h3>

                        <span className="rounded-full border border-yellow-200 bg-yellow-50 px-3 py-1 text-xs font-bold text-yellow-700">
                          {Number(review.rating || 0).toFixed(1)} Rating
                        </span>

                        {review.ownerReply && (
                          <span className="rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-bold text-green-700">
                            Replied
                          </span>
                        )}
                      </div>

                      <p className="text-xs font-medium text-slate-400">
                        {review.createdAt
                          ? new Date(review.createdAt).toLocaleDateString()
                          : "N/A"}
                      </p>
                    </div>

                    <div className="grid grid-cols-1 gap-3 md:grid-cols-3">
                      <InfoItem
                        label="Ground"
                        value={
                          review.cricsal?.name ||
                          review.ground?.name ||
                          "Cricket Ground"
                        }
                      />

                      <InfoItem
                        label="Rating"
                        value={
                          <span className="flex items-center gap-1 text-base">
                            {renderStars(review.rating)}
                          </span>
                        }
                      />

                      <InfoItem
                        label="Status"
                        value={review.ownerReply ? "Replied" : "Not replied"}
                      />
                    </div>

                    <div className="mt-4 rounded-2xl bg-slate-50 px-4 py-3">
                      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
                        Customer Comment
                      </p>
                      <p className="mt-2 text-sm leading-6 text-slate-700">
                        {review.comment || "No comment provided."}
                      </p>
                    </div>

                    {review.ownerReply && !isEditing && (
                      <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3">
                        <div className="flex items-start justify-between gap-3">
                          <div>
                            <p className="text-xs font-bold uppercase tracking-wide text-green-700">
                              Your Reply
                            </p>
                            <p className="mt-2 text-sm leading-6 text-green-800">
                              {review.ownerReply}
                            </p>
                          </div>

                          <button
                            onClick={() => startEdit(review)}
                            className="rounded-xl border border-green-200 bg-white px-4 py-2 text-xs font-bold text-green-700 hover:bg-green-100"
                          >
                            Edit
                          </button>
                        </div>
                      </div>
                    )}

                    {(!review.ownerReply || isEditing) && (
                      <div className="mt-4">
                        <textarea
                          value={replyText[review._id] || ""}
                          onChange={(e) =>
                            setReplyText((prev) => ({
                              ...prev,
                              [review._id]: e.target.value,
                            }))
                          }
                          placeholder="Write your reply..."
                          rows={3}
                          className="w-full rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none transition focus:border-green-500 focus:ring-4 focus:ring-green-100"
                        />

                        <div className="mt-3 flex gap-2">
                          <button
                            onClick={() => handleReply(review._id)}
                            disabled={savingId === review._id}
                            className="rounded-xl bg-green-600 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                          >
                            {savingId === review._id
                              ? "Saving..."
                              : isEditing
                              ? "Update Reply"
                              : "Submit Reply"}
                          </button>

                          {isEditing && (
                            <button
                              onClick={() => cancelEdit(review._id)}
                              className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 hover:bg-slate-50"
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function SummaryCard({ title, value, color }) {
  const styles = {
    yellow: "border-yellow-200 bg-yellow-50 text-yellow-800",
    green: "border-green-200 bg-green-50 text-green-800",
    red: "border-red-200 bg-red-50 text-red-800",
  };

  return (
    <div
      className={`rounded-3xl border p-5 shadow-sm ${
        styles[color] || "border-slate-200 bg-white text-slate-900"
      }`}
    >
      <p className="text-sm font-semibold opacity-80">{title}</p>
      <p className="mt-2 text-3xl font-bold">{value}</p>
    </div>
  );
}

function InfoItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-2xl bg-slate-50 px-4 py-3">
      <p className="text-xs font-bold uppercase tracking-wide text-slate-400">
        {label}
      </p>
      <div className="mt-1 truncate text-sm font-bold text-slate-900">
        {value}
      </div>
    </div>
  );
}