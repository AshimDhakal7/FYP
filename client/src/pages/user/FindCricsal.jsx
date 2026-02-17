
import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function FindCricsal() {
  const navigate = useNavigate();

  // ✅ Protect route
  useEffect(() => {
    const token =
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      "";
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const [grounds] = useState([
    {
      id: "g1",
      name: "Doughout Indoor Cricket",
      area: "Bouddha NayaBasti, Kathmandu",
      price: 1600,
      type: "Indoor",
      rating: 4.6,
      features: ["Turf", "Parking", "Changing Room"],
    },
    {
      id: "g2",
      name: "Great Himalaya Cricket Academy GHCA",
      area: "Lalitpur",
      price: 1500,
      type: "Indoor",
      rating: 4.4,
      features: ["Turf", "Cafe", "Shower"],
    },
    {
      id: "g3",
      name: "Velocity Arena",
      area: "Ratopul",
      price: 1700,
      type: "Indoor",
      rating: 4.8,
      features: ["Parking"],
    },
    {
      id: "g4",
      name: "Royal KCTC Indoor Cricket",
      area: "Kathmandu",
      price: 2000,
      type: "Indoor",
      rating: 4.8,
      features: ["Premium", "AC", "Cafe", "Shower"],
    },
    {
      id: "g5",
      name: "Kathmandu Cricket Academy",
      area: "Budhanilkantha, Kathmandu",
      price: 2000,
      type: "Indoor",
      rating: 4.6,
      features: ["Parking", "Changing room"],
    },
    {
      id: "g7",
      name: "Cricket Excellence Center (CEC)",
      area: "Bhaktapur",
      price: 2000,
      type: "Indoor",
      rating: 4.6,
      features: ["Parking", "Changing room"],
    },
    {
      id: "g8",
      name: "Ball Park Sports Events & Academy",
      area: "Lalitpur",
      price: 2500,
      type: "Indoor",
      rating: 4.6,
      features: ["Parking", "Changing room", "Cafe"],
    },
    {
      id: "g9",
      name: "Sports Zone",
      area: "Patan",
      price: 2000,
      type: "Indoor",
      rating: 4.5,
      features: ["Parking", "Changing room", "Cafe"],
    },
  ]);

  // filters
  const [query, setQuery] = useState("");
  const [area, setArea] = useState("all");
  const [maxPrice, setMaxPrice] = useState("all");
  const [sort, setSort] = useState("recommended");

  const areas = useMemo(() => {
    const set = new Set(grounds.map((g) => g.area));
    return ["all", ...Array.from(set)];
  }, [grounds]);

  const filtered = useMemo(() => {
    let list = grounds.slice();

    // search
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((g) =>
        (g.name + " " + g.area + " " + g.features.join(" "))
          .toLowerCase()
          .includes(q)
      );
    }

    // area filter
    if (area !== "all") list = list.filter((g) => g.area === area);

    // price filter
    if (maxPrice !== "all") {
      const max = Number(maxPrice);
      list = list.filter((g) => g.price <= max);
    }

    // sorting
    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [grounds, query, area, maxPrice, sort]);

  const resetFilters = () => {
    setQuery("");
    setArea("all");
    setMaxPrice("all");
    setSort("recommended");
  };

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-8">
      <div className="mx-auto w-full max-w-6xl space-y-5">
        {/* Header */}
        <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="inline-flex items-center gap-2 rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                Browse
                <span className="h-1 w-1 rounded-full bg-green-600" />
                Cricsals
              </div>
              <h1 className="mt-3 text-2xl font-bold text-gray-900">
                Browse Cricsals
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Search, filter, and book an indoor cricket slot instantly.
              </p>
            </div>

            <div className="flex gap-2">
              <Link
                className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
                to="/home"
              >
                ← Back
              </Link>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5">
          <div className="grid gap-3 lg:grid-cols-12">
            <div className="lg:col-span-5">
              <label className="block text-xs font-semibold text-gray-700">
                Search
              </label>
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search by name, area, or features…"
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              />
            </div>

            <div className="lg:col-span-3">
              <label className="block text-xs font-semibold text-gray-700">
                Area
              </label>
              <select
                value={area}
                onChange={(e) => setArea(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                {areas.map((a) => (
                  <option key={a} value={a}>
                    {a === "all" ? "All Areas" : a}
                  </option>
                ))}
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-700">
                Max Price
              </label>
              <select
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="all">Any Price</option>
                <option value="1000">Up to Rs. 1000</option>
                <option value="1500">Up to Rs. 1500</option>
                <option value="2000">Up to Rs. 2000</option>
                <option value="2500">Up to Rs. 2500</option>
              </select>
            </div>

            <div className="lg:col-span-2">
              <label className="block text-xs font-semibold text-gray-700">
                Sort
              </label>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
              >
                <option value="recommended">Recommended</option>
                <option value="rating">Rating</option>
                <option value="priceLow">Price (Low → High)</option>
                <option value="priceHigh">Price (High → Low)</option>
              </select>
            </div>
          </div>

          <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
            <div className="text-sm text-gray-600">
              Showing <span className="font-semibold text-gray-900">{filtered.length}</span>{" "}
              cricsal(s)
            </div>

            <button
              type="button"
              onClick={resetFilters}
              className="rounded-xl border border-gray-200 bg-white px-4 py-2 text-sm font-semibold text-gray-900 hover:bg-gray-50 transition"
            >
              Reset Filters
            </button>
          </div>
        </div>

        {/* Listing */}
        {filtered.length === 0 ? (
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-black/5">
            <div className="text-lg font-bold text-gray-900">No results found</div>
            <p className="mt-1 text-sm text-gray-600">
              Try clearing filters or searching with a different keyword.
            </p>
            <button
              className="mt-4 rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
              onClick={resetFilters}
              type="button"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((g) => (
              <div
                key={g.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                    {g.type}
                  </div>
                  <div className="inline-flex items-center rounded-full bg-yellow-50 px-3 py-1 text-xs font-semibold text-yellow-700 ring-1 ring-yellow-100">
                    ⭐ {g.rating}
                  </div>
                </div>

                <div className="mt-3 text-base font-semibold text-gray-900">
                  {g.name}
                </div>
                <div className="mt-1 text-sm text-gray-600">{g.area}</div>

                <div className="mt-4 flex flex-wrap gap-2">
                  {g.features.slice(0, 3).map((f) => (
                    <span
                      key={f}
                      className="rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100"
                    >
                      {f}
                    </span>
                  ))}
                </div>

                <div className="mt-5 flex items-end justify-between gap-3">
                  <div>
                    <div className="text-lg font-bold text-gray-900">
                      Rs. {g.price}
                    </div>
                    <div className="text-xs text-gray-600">per hour</div>
                  </div>

                  <Link
  to={`/book/${g.id}`}
  className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
>
  Book Now
</Link>

                </div>
              </div>
            ))}
          </div>
        )}

        <div className="pt-2 text-center text-xs text-gray-500">
          © 2026 CricBook
        </div>
      </div>
    </div>
  );
}
