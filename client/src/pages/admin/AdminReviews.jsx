import React, { useEffect, useMemo, useState } from "react";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

const renderStars = (rating = 0) => {
  const rounded = Math.round(Number(rating) || 0);
  return [1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={star <= rounded ? "text-yellow-400" : "text-slate-600"}
    >
      ★
    </span>
  ));
};

export default function AdminReviews() {
  const [loading, setLoading] = useState(true);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [noteDrafts, setNoteDrafts] = useState({});
  const [savingId, setSavingId] = useState("");

  const getToken = () =>
    localStorage.getItem("token") ||
    localStorage.getItem("accessToken") ||
    localStorage.getItem("authToken") ||
    "";

  const fetchReviews = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await fetch(`${API_BASE}/api/reviews/admin/all`, {
        headers: {
          Authorization: `Bearer ${getToken()}`,
        },
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to load reviews");
      }

      setReviews(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("FETCH ADMIN REVIEWS ERROR:", err);
      setError(err.message || "Failed to load reviews");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, []);

  const filteredReviews = useMemo(() => {
    let list = [...reviews];
    const q = search.trim().toLowerCase();

    if (q) {
      list = list.filter((r) => {
        const userName = String(r.user?.name || "").toLowerCase();
        const userEmail = String(r.user?.email || "").toLowerCase();
        const groundName = String(r.cricsal?.name || "").toLowerCase();
        const location = String(r.cricsal?.location || "").toLowerCase();
        const comment = String(r.comment || "").toLowerCase();
        const ownerReply = String(r.ownerReply || "").toLowerCase();
        const adminNote = String(r.adminNote || "").toLowerCase();

        return (
          userName.includes(q) ||
          userEmail.includes(q) ||
          groundName.includes(q) ||
          location.includes(q) ||
          comment.includes(q) ||
          ownerReply.includes(q) ||
          adminNote.includes(q)
        );
      });
    }

    if (statusFilter === "visible") {
      list = list.filter((r) => !r.isHidden);
    }

    if (statusFilter === "hidden") {
      list = list.filter((r) => r.isHidden);
    }

    return list;
  }, [reviews, search, statusFilter]);

  const handleToggleHidden = async (reviewId) => {
    try {
      setSavingId(reviewId);

      const res = await fetch(
        `${API_BASE}/api/reviews/admin/${reviewId}/toggle-hidden`,
        {
          method: "PATCH",
          headers: {
            Authorization: `Bearer ${getToken()}`,
          },
        }
      );

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to update visibility");
      }

      setReviews((prev) => prev.map((r) => (r._id === reviewId ? data : r)));
    } catch (err) {
      console.error("TOGGLE HIDDEN ERROR:", err);
      alert(err.message || "Failed to update visibility");
    } finally {
      setSavingId("");
    }
  };

  const handleSaveNote = async (reviewId) => {
    try {
      setSavingId(reviewId);

      const res = await fetch(`${API_BASE}/api/reviews/admin/${reviewId}/note`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${getToken()}`,
        },
        body: JSON.stringify({
          adminNote: noteDrafts[reviewId] ?? "",
        }),
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Failed to save note");
      }

      setReviews((prev) => prev.map((r) => (r._id === reviewId ? data : r)));
    } catch (err) {
      console.error("SAVE ADMIN NOTE ERROR:", err);
      alert(err.message || "Failed to save note");
    } finally {
      setSavingId("");
    }
  };

  const totalReviews = reviews.length;
  const hiddenReviews = reviews.filter((r) => r.isHidden).length;
  const visibleReviews = totalReviews - hiddenReviews;

  return (
    <div className="min-h-screen rounded-[28px] bg-[linear-gradient(180deg,_rgba(2,6,23,0.98)_0%,_rgba(8,15,35,0.98)_100%)] text-white">
      <div className="rounded-[28px] border border-cyan-500/10 bg-[radial-gradient(circle_at_top,_rgba(16,185,129,0.10),_transparent_35%),linear-gradient(180deg,rgba(2,6,23,0.96),rgba(9,18,38,0.98))] p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.03)] sm:p-8">
        <div className="mb-8">
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-emerald-300/80">
            Admin Dashboard
          </p>
          <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Reviews Monitoring
          </h1>
          <p className="mt-3 max-w-3xl text-sm leading-7 text-slate-400">
            Monitor player feedback, owner replies, and moderate review visibility across the platform.
          </p>
        </div>

        <div className="rounded-[32px] border border-emerald-400/10 bg-[linear-gradient(180deg,rgba(14,27,51,0.92),rgba(9,22,44,0.92))] p-5 shadow-[0_0_30px_rgba(16,185,129,0.08)] sm:p-6">
          <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(20,35,58,0.96),rgba(14,28,49,0.96))] p-5 sm:p-6">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-white">Review Center</h2>
              <p className="mt-2 text-sm text-slate-400">
                Search, filter, and take moderation action on customer reviews.
              </p>
            </div>

            <div className="mb-6 grid gap-4 lg:grid-cols-3">
              <div className="rounded-[24px] bg-white/5 p-5">
                <p className="text-sm text-slate-400">Total Reviews</p>
                <p className="mt-4 text-4xl font-bold text-white">{totalReviews}</p>
              </div>

              <div className="rounded-[24px] bg-white/5 p-5">
                <p className="text-sm text-slate-400">Visible</p>
                <p className="mt-4 text-4xl font-bold text-emerald-300">{visibleReviews}</p>
              </div>

              <div className="rounded-[24px] bg-white/5 p-5">
                <p className="text-sm text-slate-400">Hidden</p>
                <p className="mt-4 text-4xl font-bold text-amber-300">{hiddenReviews}</p>
              </div>
            </div>

            <div className="mb-8 grid gap-3 lg:grid-cols-[1.5fr_0.7fr_0.5fr]">
              <input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search by player, ground, comment, reply or note"
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
              />

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm text-white outline-none focus:border-emerald-400/50"
              >
                <option value="all" className="bg-slate-900">All Reviews</option>
                <option value="visible" className="bg-slate-900">Visible Only</option>
                <option value="hidden" className="bg-slate-900">Hidden Only</option>
              </select>

              <button
                onClick={fetchReviews}
                className="rounded-2xl border border-white/10 bg-white/5 px-5 py-4 text-sm font-semibold text-slate-200 transition hover:bg-white/10"
              >
                Refresh
              </button>
            </div>

            <div className="overflow-hidden rounded-[28px] border border-white/10">
              {loading ? (
                <div className="flex justify-center bg-[#0f1b31] py-16">
                  <div className="flex flex-col items-center gap-3">
                    <div className="h-10 w-10 animate-spin rounded-full border-4 border-emerald-200/30 border-t-emerald-400" />
                    <p className="text-sm text-slate-400">Loading reviews...</p>
                  </div>
                </div>
              ) : error ? (
                <div className="m-4 rounded-2xl border border-rose-500/20 bg-rose-500/10 p-4 text-rose-300">
                  {error}
                </div>
              ) : filteredReviews.length === 0 ? (
                <div className="bg-[#0f1b31] p-12 text-center text-slate-400">
                  No reviews found.
                </div>
              ) : (
                <div className="overflow-x-auto bg-[#0f1b31]">
                  <table className="min-w-full">
                    <thead>
                      <tr className="border-b border-white/10 bg-white/5 text-left text-sm text-slate-300">
                        <th className="px-6 py-5 font-semibold">Ground</th>
                        <th className="px-6 py-5 font-semibold">Player</th>
                        <th className="px-6 py-5 font-semibold">Rating</th>
                        <th className="px-6 py-5 font-semibold">Comment</th>
                        <th className="px-6 py-5 font-semibold">Owner Reply</th>
                        <th className="px-6 py-5 font-semibold">Status</th>
                        <th className="px-6 py-5 font-semibold">Date</th>
                        <th className="px-6 py-5 font-semibold">Actions</th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredReviews.map((review) => (
                        <tr
                          key={review._id}
                          className="border-b border-white/5 align-top transition hover:bg-white/[0.03]"
                        >
                          <td className="px-6 py-5">
                            <div className="font-semibold text-white">
                              {review.cricsal?.name || "Unknown Ground"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {review.cricsal?.location || "No location"}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="font-semibold text-white">
                              {review.user?.name || "Anonymous User"}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {review.user?.email || "No email"}
                            </div>
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex items-center gap-1 text-base">
                              {renderStars(review.rating)}
                            </div>
                            <div className="mt-1 text-xs text-slate-500">
                              {Number(review.rating || 0).toFixed(1)} / 5
                            </div>
                          </td>

                          <td className="max-w-[280px] px-6 py-5">
                            <div className="rounded-2xl bg-white/5 p-3 text-sm leading-6 text-slate-300">
                              {review.comment || "No comment provided."}
                            </div>
                          </td>

                          <td className="max-w-[260px] px-6 py-5">
                            {review.ownerReply ? (
                              <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/10 p-3 text-sm leading-6 text-emerald-200">
                                {review.ownerReply}
                              </div>
                            ) : (
                              <div className="rounded-2xl bg-white/5 p-3 text-sm text-slate-500">
                                No reply yet
                              </div>
                            )}
                          </td>

                          <td className="px-6 py-5">
                            <span
                              className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold ${
                                review.isHidden
                                  ? "bg-amber-400/15 text-amber-300 ring-1 ring-amber-300/20"
                                  : "bg-emerald-400/15 text-emerald-300 ring-1 ring-emerald-300/20"
                              }`}
                            >
                              {review.isHidden ? "Hidden" : "Visible"}
                            </span>
                          </td>

                          <td className="px-6 py-5 text-sm text-slate-400">
                            {review.createdAt
                              ? new Date(review.createdAt).toLocaleDateString()
                              : "No date"}
                          </td>

                          <td className="px-6 py-5">
                            <div className="flex min-w-[260px] flex-col gap-3">
                              <textarea
                                rows={3}
                                value={noteDrafts[review._id] ?? review.adminNote ?? ""}
                                onChange={(e) =>
                                  setNoteDrafts((prev) => ({
                                    ...prev,
                                    [review._id]: e.target.value,
                                  }))
                                }
                                placeholder="Write internal moderation note..."
                                className="w-full rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-white outline-none placeholder:text-slate-500 focus:border-emerald-400/50"
                              />

                              <div className="grid gap-2 sm:grid-cols-2">
                                <button
                                  onClick={() => handleToggleHidden(review._id)}
                                  disabled={savingId === review._id}
                                  className={`rounded-2xl px-4 py-3 text-sm font-semibold text-white transition ${
                                    review.isHidden
                                      ? "bg-emerald-600 hover:bg-emerald-500"
                                      : "bg-amber-500 hover:bg-amber-400 text-slate-950"
                                  } disabled:cursor-not-allowed disabled:opacity-70`}
                                >
                                  {savingId === review._id
                                    ? "Saving..."
                                    : review.isHidden
                                    ? "Make Visible"
                                    : "Hide Review"}
                                </button>

                                <button
                                  onClick={() => handleSaveNote(review._id)}
                                  disabled={savingId === review._id}
                                  className="rounded-2xl bg-white text-slate-900 px-4 py-3 text-sm font-semibold transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-70"
                                >
                                  {savingId === review._id ? "Saving..." : "Save Note"}
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}