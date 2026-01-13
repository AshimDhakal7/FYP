import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/findCricsal.css";

export default function FindCricsal() {
  const navigate = useNavigate();

  // ✅ Protect route (same logic as Home)
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) navigate("/login", { replace: true });
  }, [navigate]);

  const [grounds] = useState([
    {
      id: "g1",
      name: "Doughout Indoor Cricket",
      area: " Bouddha NayaBasti, Kathmandu",
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
      name: "Ball Park Sports Events & Academy ",
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

  // ===== for filters =====
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

    // sort
    if (sort === "priceLow") list.sort((a, b) => a.price - b.price);
    if (sort === "priceHigh") list.sort((a, b) => b.price - a.price);
    if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [grounds, query, area, maxPrice, sort]);

  return (
    <div className="find-page">
      <div className="find-wrap">
        {/* Header */}
        <div className="find-head">
          <div>
            <h1>Browse Cricsals</h1>
            <p className="muted">
              Search, filter, and book an indoor cricket slot instantly.
            </p>
          </div>

          <div className="find-head-actions">
            <Link className="btn-outline" to="/home">
              ← Back
            </Link>
          </div>
        </div>

        {/* Filters Bar */}
        <div className="filters card">
          <div className="filters-row">
            <input
              className="input"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name, area, or features…"
            />

            <select
              className="select"
              value={area}
              onChange={(e) => setArea(e.target.value)}
            >
              {areas.map((a) => (
                <option key={a} value={a}>
                  {a === "all" ? "All Areas" : a}
                </option>
              ))}
            </select>

            <select
              className="select"
              value={maxPrice}
              onChange={(e) => setMaxPrice(e.target.value)}
            >
              <option value="all">Any Price</option>
              <option value="1000">Up to Rs. 1000</option>
              <option value="1500">Up to Rs. 1500</option>
              <option value="2000">Up to Rs. 2000</option>
            </select>

            <select
              className="select"
              value={sort}
              onChange={(e) => setSort(e.target.value)}
            >
              <option value="recommended">Sort: Recommended</option>
              <option value="rating">Sort: Rating</option>
              <option value="priceLow">Sort: Price (Low → High)</option>
              <option value="priceHigh">Sort: Price (High → Low)</option>
            </select>
          </div>

          <div className="filters-meta">
            Showing <b>{filtered.length}</b> cricsal(s)
          </div>
        </div>

        {/* Listing Grid */}
        {filtered.length === 0 ? (
          <div className="card empty">
            <h3>No results found</h3>
            <p className="muted">
              Try clearing filters or searching with a different keyword.
            </p>
            <button
              className="btn"
              onClick={() => {
                setQuery("");
                setArea("all");
                setMaxPrice("all");
                setSort("recommended");
              }}
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid">
            {filtered.map((g) => (
              <div key={g.id} className="card ground-card">
                <div className="ground-top">
                  <div className="ground-badge">{g.type}</div>
                  <div className="ground-rating">⭐ {g.rating}</div>
                </div>

                <h3 className="ground-title">{g.name}</h3>
                <div className="muted">{g.area}</div>

                <div className="chips">
                  {g.features.slice(0, 3).map((f) => (
                    <span key={f} className="chip">
                      {f}
                    </span>
                  ))}
                </div>

                <div className="ground-bottom">
                  <div>
                    <div className="price">Rs. {g.price}</div>
                    <div className="muted small">per hour</div>
                  </div>

                  {/* ✅ Book Now navigation (works) */}
                  <button
                    className="btn book-btn"
                    onClick={() => navigate(`/book/${g.id}`)}
                    type="button"
                  >
                    Book Now
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
