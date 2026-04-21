import React, { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const renderStars = (rating = 0, size = "text-lg") => {
  const rounded = Math.round(Number(rating) || 0);

  return [1, 2, 3, 4, 5].map((star) => (
    <span
      key={star}
      className={`${size} ${
        star <= rounded ? "text-yellow-400" : "text-white/40"
      }`}
    >
      ★
    </span>
  ));
};

export default function GroundDetails() {
  const { id } = useParams();

  const [loading, setLoading] = useState(true);
  const [ground, setGround] = useState(null);
  const [reviewsData, setReviewsData] = useState({
    averageRating: 0,
    numReviews: 0,
    reviews: [],
  });
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);

      try {
        const [groundRes, reviewsRes] = await Promise.all([
          fetch(`${API_BASE}/api/grounds/${id}`),
          fetch(`${API_BASE}/api/reviews/ground/${id}`),
        ]);

        const groundData = await groundRes.json().catch(() => null);
        const reviewsJson = await reviewsRes.json().catch(() => null);

        if (!groundRes.ok) {
          setError(groundData?.message || "Failed to load ground details");
          return;
        }

        setGround(groundData);

        if (reviewsRes.ok) {
          setReviewsData({
            averageRating: Number(reviewsJson?.averageRating || 0),
            numReviews: Number(reviewsJson?.numReviews || 0),
            reviews: Array.isArray(reviewsJson?.reviews) ? reviewsJson.reviews : [],
          });
        } else {
          setReviewsData({
            averageRating: Number(groundData?.averageRating || 0),
            numReviews: Number(groundData?.numReviews || 0),
            reviews: [],
          });
        }
      } catch (e) {
        console.error("GROUND DETAILS LOAD ERROR:", e);
        setError("Server error loading ground details");
      } finally {
        setLoading(false);
      }
    };

    load();
  }, [id]);

  const heroImage = useMemo(() => {
    return (
      ground?.images?.[0] ||
      ground?.imageUrl ||
      ground?.image ||
      "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1400&q=80"
    );
  }, [ground]);

  const locationLabel = useMemo(() => {
    return (
      ground?.location ||
      ground?.area ||
      ground?.address ||
      "Kathmandu"
    );
  }, [ground]);

  const mapQuery = useMemo(() => {
    const q = `${ground?.name || "Ground"} ${locationLabel}`;
    return `https://www.google.com/maps?q=${encodeURIComponent(q)}&z=15&output=embed`;
  }, [ground, locationLabel]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb]">
        <div className="rounded-2xl bg-white p-8 shadow-sm">
          <div className="mx-auto h-10 w-10 animate-spin rounded-full border-4 border-green-200 border-t-green-600" />
          <p className="mt-4 text-sm font-medium text-gray-500">
            Loading ground details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f5f7fb] px-4">
        <div className="w-full max-w-xl rounded-3xl border border-red-200 bg-white p-8 shadow-sm">
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
          <div className="mt-6">
            <Link
              to="/home"
              className="inline-flex items-center rounded-full border border-gray-200 bg-white px-5 py-2.5 text-sm font-semibold text-gray-900 transition hover:bg-gray-50"
            >
              ← Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!ground) return null;

  return (
    <div className="min-h-screen bg-[#f5f7fb]">
      {/* HERO */}
      <section className="relative overflow-hidden">
        <div className="h-[420px] w-full bg-gray-200">
          <img
            src={heroImage}
            alt={ground.name || "Ground"}
            className="h-full w-full object-cover"
            onError={(e) => {
              e.currentTarget.src =
                "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1400&q=80";
            }}
          />
        </div>

        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/35 to-black/10" />

        {/* top action bar */}
        <div className="absolute left-0 right-0 top-0 z-10">
          <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-5 sm:px-6">
            <Link
              to="/home"
              className="inline-flex items-center rounded-full border border-white/20 bg-white/90 px-4 py-2 text-sm font-semibold text-gray-900 shadow-sm backdrop-blur hover:bg-white"
            >
              ← Home
            </Link>

            <Link
              to={`/book/${ground._id}`}
              className="inline-flex items-center rounded-full bg-green-600 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
            >
              Book Now
            </Link>
          </div>
        </div>

        {/* hero content */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="mx-auto max-w-6xl px-4 pb-8 sm:px-6">
            <div className="max-w-3xl">
              <div className="mb-3 inline-flex items-center rounded-full bg-white/10 px-3 py-1 text-xs font-semibold text-white backdrop-blur">
                Premium Futsal Experience
              </div>

              <h1 className="text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
                {ground.name}
              </h1>

              <p className="mt-3 text-sm font-medium text-white/90 sm:text-base">
                📍 {locationLabel}
              </p>

              <div className="mt-5 flex flex-wrap items-center gap-3">
                <div className="flex items-center gap-1 rounded-full bg-white/10 px-3 py-2 backdrop-blur">
                  {renderStars(reviewsData.averageRating, "text-xl")}
                </div>

                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {Number(reviewsData.averageRating || 0).toFixed(1)} rating
                </div>

                <div className="rounded-full bg-white/10 px-4 py-2 text-sm font-semibold text-white backdrop-blur">
                  {reviewsData.numReviews || 0} review
                  {Number(reviewsData.numReviews || 0) === 1 ? "" : "s"}
                </div>

                <div className="rounded-full bg-green-500/90 px-4 py-2 text-sm font-bold text-white shadow">
                  Rs {ground.pricePerHour || 0}/hour
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT */}
      <section className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <div className="grid gap-6 lg:grid-cols-[1.6fr_0.9fr]">
          {/* LEFT */}
          <div className="space-y-6">
            {/* Overview */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex-1">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ground Overview
                  </h2>
                  <p className="mt-2 text-sm leading-7 text-gray-600">
                    {ground.description ||
                      "A well-maintained ground with a comfortable playing environment, suitable for friendly matches, training sessions, and regular bookings."}
                  </p>
                </div>

                <div className="grid min-w-[200px] grid-cols-2 gap-3 sm:w-[240px]">
                  <div className="rounded-2xl bg-gray-50 p-4 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Price
                    </div>
                    <div className="mt-2 text-lg font-bold text-green-600">
                      Rs {ground.pricePerHour || 0}
                    </div>
                  </div>

                  <div className="rounded-2xl bg-gray-50 p-4 text-center">
                    <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                      Rating
                    </div>
                    <div className="mt-2 text-lg font-bold text-gray-900">
                      {Number(reviewsData.averageRating || 0).toFixed(1)}
                    </div>
                  </div>
                </div>
              </div>

              {!!(ground.features || []).length && (
                <div className="mt-6 border-t border-gray-100 pt-5">
                  <div className="mb-3 text-sm font-semibold text-gray-900">
                    Amenities & Features
                  </div>

                  <div className="flex flex-wrap gap-2">
                    {(ground.features || []).map((feature) => (
                      <span
                        key={feature}
                        className="rounded-full border border-green-100 bg-green-50 px-3 py-1.5 text-xs font-semibold text-green-700"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Reviews */}
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Ratings & Reviews
                  </h2>
                  <p className="mt-1 text-sm text-gray-500">
                    Real experiences shared by players who booked this ground.
                  </p>
                </div>

                <div className="hidden rounded-2xl bg-yellow-50 px-4 py-3 text-right sm:block">
                  <div className="text-xs font-semibold uppercase tracking-wide text-gray-400">
                    Average
                  </div>
                  <div className="text-xl font-bold text-gray-900">
                    {Number(reviewsData.averageRating || 0).toFixed(1)}
                  </div>
                </div>
              </div>

              {reviewsData.reviews.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 p-10 text-center text-gray-500">
                  No reviews yet. Be the first to book and share your experience.
                </div>
              ) : (
                <div className="space-y-4">
                  {reviewsData.reviews.map((review) => (
                    <div
                      key={review._id}
                      className="rounded-2xl border border-gray-200 bg-gradient-to-br from-white to-gray-50 p-5 transition hover:shadow-sm"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div>
                          <p className="text-base font-bold text-gray-900">
                            {review.user?.name || "Anonymous User"}
                          </p>

                          <div className="mt-2 flex items-center gap-1">
                            {renderStars(review.rating, "text-lg")}
                          </div>
                        </div>

                        <p className="text-xs font-medium text-gray-400">
                          {review.createdAt
                            ? new Date(review.createdAt).toLocaleDateString()
                            : ""}
                        </p>
                      </div>

                      <p className="mt-4 text-sm leading-7 text-gray-700">
                        {review.comment || "No comment provided."}
                      </p>

                      {review.ownerReply && (
                        <div className="mt-4 rounded-2xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
                          <span className="font-bold">Owner reply:</span>{" "}
                          {review.ownerReply}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT */}
          <div className="space-y-6">
            {/* Booking card */}
            <div className="sticky top-6 rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <h3 className="text-xl font-bold text-gray-900">
                Book this ground
              </h3>
              <p className="mt-2 text-sm text-gray-500">
                Reserve your preferred slot and confirm your game instantly.
              </p>

              <div className="mt-5 rounded-2xl bg-gray-50 p-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">Price</span>
                  <span className="text-lg font-bold text-green-600">
                    Rs {ground.pricePerHour || 0}/hr
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Location</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {locationLabel}
                  </span>
                </div>

                <div className="mt-3 flex items-center justify-between">
                  <span className="text-sm text-gray-500">Rating</span>
                  <span className="text-sm font-semibold text-gray-900">
                    {Number(reviewsData.averageRating || 0).toFixed(1)} / 5
                  </span>
                </div>
              </div>

              <Link
                to={`/book/${ground._id}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-2xl bg-green-600 px-4 py-3 text-sm font-semibold text-white shadow-lg transition hover:bg-green-700"
              >
                Continue to Booking
              </Link>
            </div>

            {/* Small map section */}
            <div className="rounded-3xl border border-gray-200 bg-white p-4 shadow-sm">
              <div className="mb-3">
                <h3 className="text-lg font-bold text-gray-900">Location Map</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Quick view of where this ground is located.
                </p>
              </div>

              <div className="overflow-hidden rounded-2xl border border-gray-200">
                <iframe
                  title="Ground location map"
                  src={mapQuery}
                  width="100%"
                  height="220"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="block w-full"
                />
              </div>

              <p className="mt-3 text-sm text-gray-600">
                📍 {locationLabel}
              </p>

              <a
                href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(
                  `${ground.name || "Ground"} ${locationLabel}`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="mt-3 inline-flex text-sm font-semibold text-green-700 hover:underline"
              >
                Open in Google Maps →
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* MOBILE STICKY CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-30 border-t border-gray-200 bg-white/95 p-4 backdrop-blur sm:hidden">
        <Link
          to={`/book/${ground._id}`}
          className="block w-full rounded-2xl bg-green-600 py-3 text-center font-semibold text-white shadow-lg transition hover:bg-green-700"
        >
          Book This Ground
        </Link>
      </div>
    </div>
  );
}