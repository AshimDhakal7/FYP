const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:5001";

export const getToken = () =>
  localStorage.getItem("token") ||
  localStorage.getItem("accessToken") ||
  localStorage.getItem("authToken") ||
  "";

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export async function apiPatch(path, body = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getToken()}`,
    },
    body: JSON.stringify(body),
  });

  const data = await res.json().catch(() => ({}));

  if (!res.ok) {
    throw new Error(data?.message || "Request failed");
  }

  return data;
}

export async function safeApiGet(path, fallback = {}) {
  try {
    return await apiGet(path);
  } catch (error) {
    return fallback;
  }
}

export function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString()}`;
}

export function formatDate(value) {
  if (!value) return "N/A";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString();
}

export function statusTone(status = "") {
  const value = status.toLowerCase();

  if (["confirmed", "success", "completed", "paid", "active"].includes(value)) {
    return "bg-emerald-50 text-emerald-700 border-emerald-200";
  }

  if (["pending", "processing"].includes(value)) {
    return "bg-amber-50 text-amber-700 border-amber-200";
  }

  if (["cancelled", "failed", "blocked", "inactive"].includes(value)) {
    return "bg-rose-50 text-rose-700 border-rose-200";
  }

  return "bg-slate-50 text-slate-700 border-slate-200";
}

export function buildOverviewFromBookings(bookings = []) {
  const totalRevenue = bookings.reduce(
    (sum, item) => sum + Number(item?.totalPrice || 0),
    0
  );

  const paidRevenue = bookings
    .filter((item) => item?.isPaid)
    .reduce((sum, item) => sum + Number(item?.totalPrice || 0), 0);

  const confirmed = bookings.filter(
    (item) => String(item?.status || "").toLowerCase() === "confirmed"
  ).length;

  const pending = bookings.filter(
    (item) => String(item?.status || "").toLowerCase() === "pending"
  ).length;

  const uniqueUsers = new Set(
    bookings.map((item) => item?.user?._id || item?.user?.email || item?._id)
  ).size;

  const uniqueOwners = new Set(
    bookings.map((item) => item?.owner?._id || item?.owner?.email || item?._id)
  ).size;

  const groundsMap = new Map();
  bookings.forEach((item) => {
    const name = item?.cricsal?.name || "Unknown Ground";
    const revenue = Number(item?.totalPrice || 0);
    groundsMap.set(name, (groundsMap.get(name) || 0) + revenue);
  });

  const topGrounds = [...groundsMap.entries()]
    .map(([name, revenue]) => ({ name, revenue }))
    .sort((a, b) => b.revenue - a.revenue)
    .slice(0, 5);

  const monthlyMap = {};
  bookings.forEach((item) => {
    const rawDate = item?.date || item?.createdAt;
    const date = new Date(rawDate);
    if (Number.isNaN(date.getTime())) return;
    const key = date.toLocaleString("default", { month: "short" });
    if (!monthlyMap[key]) {
      monthlyMap[key] = { month: key, bookings: 0, revenue: 0 };
    }
    monthlyMap[key].bookings += 1;
    monthlyMap[key].revenue += Number(item?.totalPrice || 0);
  });

  const monthlyData = Object.values(monthlyMap);

  return {
    stats: {
      totalBookings: bookings.length,
      totalRevenue,
      paidRevenue,
      confirmed,
      pending,
      uniqueUsers,
      uniqueOwners,
    },
    monthlyData,
    topGrounds,
    recentBookings: bookings.slice(0, 6),
  };
}