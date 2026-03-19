import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function GroundDetails() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);
  const [ground, setGround] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      setError("");
      setLoading(true);
      try {
        const res = await fetch(`${API_BASE}/api/grounds/${id}`);
        const data = await res.json().catch(() => null);
        if (!res.ok) {
          setError(data?.message || "Failed to load ground details");
          setGround(null);
          return;
        }
        setGround(data);
      } catch (e) {
        setError("Server error loading ground details");
        setGround(null);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [id]);

  if (loading) return <div className="p-10 text-center">Loading...</div>;

  if (error)
    return (
      <div className="min-h-screen bg-gray-50 p-10">
        <div className="mx-auto max-w-3xl rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
          {error}
        </div>
        <div className="mx-auto mt-4 max-w-3xl">
          <Link to="/find" className="text-green-700 font-semibold">
            ← Back
          </Link>
        </div>
      </div>
    );

  if (!ground) return null;

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-10">
      <div className="mx-auto max-w-5xl">
        <div className="mb-4 flex items-center justify-between">
          <Link to="/find" className="text-sm font-semibold text-gray-900 hover:underline">
            ← Back to grounds
          </Link>
          <Link
            to={`/book/${ground._id}`}
            className="rounded-full bg-green-600 px-5 py-2 text-sm font-semibold text-white hover:bg-green-700"
          >
            Book this ground
          </Link>
        </div>

        <div className="overflow-hidden rounded-3xl border border-gray-200 bg-white shadow-sm">
          <div className="h-[320px] w-full bg-gray-100">
            <img
              src={
                ground.imageUrl ||
                ground.image ||
                "https://images.unsplash.com/photo-1546519638-68e109acd27d?auto=format&fit=crop&w=1400&q=60"
              }
              alt={ground.name}
              className="h-full w-full object-cover"
            />
          </div>

          <div className="p-6">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <h1 className="text-2xl font-extrabold text-gray-900">{ground.name}</h1>
                <p className="mt-1 text-sm text-gray-600">📍 {ground.area || ground.location}</p>
              </div>

              <div className="rounded-full bg-green-50 px-4 py-2 text-sm font-bold text-green-700">
                Rs {ground.pricePerHour}/hr
              </div>
            </div>

            {!!(ground.features || []).length && (
              <div className="mt-4 flex flex-wrap gap-2">
                {(ground.features || []).map((t) => (
                  <span
                    key={t}
                    className="rounded-full border border-gray-200 bg-gray-50 px-3 py-1 text-xs font-semibold text-gray-700"
                  >
                    {t}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-5 rounded-2xl bg-gray-50 p-4">
              <div className="text-sm font-bold text-gray-900">Description</div>
              <p className="mt-1 text-sm text-gray-700">
                {ground.description || "No description provided yet."}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}