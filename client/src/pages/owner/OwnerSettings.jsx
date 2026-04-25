// import React, { useState } from "react";
// import { showError, showSuccess } from "../../utils/toast";

// export default function OwnerSettings() {
//   const user = JSON.parse(localStorage.getItem("user") || "null");

//   const [email] = useState(user?.email || "");
//   const [phone, setPhone] = useState("");
//   const [venueName, setVenueName] = useState("");
//   const [saving, setSaving] = useState(false);

//   const handleSave = () => {
//     if (!phone.trim()) {
//       showError("Phone number is required");
//       return;
//     }

//     if (!venueName.trim()) {
//       showError("Venue name is required");
//       return;
//     }

//     setSaving(true);

//     setTimeout(() => {
//       showSuccess("Settings saved successfully");
//       setSaving(false);
//     }, 500);
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-6">
//       <div className="mx-auto max-w-6xl">
//         <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <h1 className="text-3xl font-bold tracking-tight text-slate-900">
//             Settings
//           </h1>
//           <p className="mt-1 text-sm text-slate-500">
//             Manage your owner profile and venue information.
//           </p>
//         </div>

//         <div className="grid gap-5 lg:grid-cols-2">
//           <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-5">
//               <h2 className="text-lg font-bold text-slate-900">
//                 Owner Profile
//               </h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Your account contact information.
//               </p>
//             </div>

//             <div className="space-y-4">
//               <Field label="Email">
//                 <input
//                   value={email}
//                   disabled
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-100 px-4 py-3 text-sm text-slate-500 outline-none"
//                 />
//               </Field>

//               <Field label="Phone" required>
//                 <input
//                   value={phone}
//                   onChange={(e) => setPhone(e.target.value)}
//                   placeholder="98XXXXXXXX"
//                   className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white"
//                 />
//               </Field>
//             </div>
//           </section>

//           <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//             <div className="mb-5">
//               <h2 className="text-lg font-bold text-slate-900">Venue Info</h2>
//               <p className="mt-1 text-sm text-slate-500">
//                 Details used to identify your venue.
//               </p>
//             </div>

//             <Field label="Venue Name" required>
//               <input
//                 value={venueName}
//                 onChange={(e) => setVenueName(e.target.value)}
//                 placeholder="Your venue name"
//                 className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white"
//               />
//             </Field>

//             <button
//               type="button"
//               onClick={handleSave}
//               disabled={saving}
//               className="mt-6 w-full rounded-2xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95 disabled:opacity-70"
//             >
//               {saving ? "Saving..." : "Save Changes"}
//             </button>
//           </section>
//         </div>
//       </div>
//     </div>
//   );
// }

// function Field({ label, required, children }) {
//   return (
//     <label className="block">
//       <span className="mb-2 block text-sm font-bold text-slate-700">
//         {label}
//         {required && <span className="ml-1 text-red-500">*</span>}
//       </span>
//       {children}
//     </label>
//   );
// }


import React, { useMemo, useState } from "react";
import { showError, showSuccess } from "../../utils/toast";

const API_BASE =
  import.meta.env.VITE_API_BASE_URL ||
  process.env.REACT_APP_API_BASE_URL ||
  "";

const safeJsonParse = (value, fallback = null) => {
  try {
    return value ? JSON.parse(value) : fallback;
  } catch {
    return fallback;
  }
};

const getStoredUser = () => {
  const auth = safeJsonParse(localStorage.getItem("auth"), null);
  const user = safeJsonParse(localStorage.getItem("user"), null);
  const profile = safeJsonParse(localStorage.getItem("profile"), null);

  if (auth?.user && typeof auth.user === "object") return auth.user;
  if (user && typeof user === "object") return user;
  if (profile && typeof profile === "object") return profile;

  return null;
};

const updateStoredUser = (updates) => {
  const auth = safeJsonParse(localStorage.getItem("auth"), null);
  const user = safeJsonParse(localStorage.getItem("user"), null);

  const currentUser =
    auth?.user && typeof auth.user === "object"
      ? auth.user
      : user && typeof user === "object"
      ? user
      : {};

  const updatedUser = {
    ...currentUser,
    ...updates,
  };

  localStorage.setItem("user", JSON.stringify(updatedUser));

  if (auth && typeof auth === "object") {
    localStorage.setItem(
      "auth",
      JSON.stringify({
        ...auth,
        user: updatedUser,
        role: updatedUser.role || auth.role || "owner",
      })
    );
  }

  window.dispatchEvent(new Event("authChanged"));
  window.dispatchEvent(new Event("userUpdated"));
};

const getImageUrl = (picture) => {
  if (!picture) return "";

  const value = String(picture).trim();
  if (!value) return "";

  if (/^https?:\/\//i.test(value)) return value;
  if (value.startsWith("data:image")) return value;

  if (!API_BASE) return value;

  if (value.startsWith("/")) return `${API_BASE}${value}`;
  return `${API_BASE}/${value}`;
};

const getInitials = (user) => {
  const name = String(user?.name || user?.fullName || "").trim();
  const email = String(user?.email || "").trim();

  if (name) {
    const parts = name.split(/\s+/).filter(Boolean);
    const first = parts[0]?.[0] || "A";
    const second = parts[1]?.[0] || "D";
    return `${first}${second}`.toUpperCase();
  }

  if (email) {
    const local = email.split("@")[0]?.replace(/[^a-zA-Z0-9]/g, "") || "AD";
    const first = local[0] || "A";
    const second = local[1] || "D";
    return `${first}${second}`.toUpperCase();
  }

  return "AD";
};

const getFallbackAvatar = (initials) => {
  const text = String(initials || "AD").slice(0, 2).toUpperCase();

  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="120" height="120" viewBox="0 0 120 120">
      <defs>
        <linearGradient id="g" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stop-color="#15803d"/>
          <stop offset="100%" stop-color="#047857"/>
        </linearGradient>
      </defs>
      <rect width="120" height="120" rx="60" fill="url(#g)"/>
      <text
        x="60"
        y="72"
        text-anchor="middle"
        font-family="Arial, sans-serif"
        font-size="38"
        font-weight="900"
        fill="#ffffff"
      >
        ${text}
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};

const formatMemberSince = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
};

const isValidEmail = (value) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value || "").trim());
};

export default function OwnerSettings() {
  const user = getStoredUser();

  const [email, setEmail] = useState(user?.email || "");
  const [phone, setPhone] = useState(
    user?.phone || user?.contact || user?.contactnumber || ""
  );

  const [memberSince, setMemberSince] = useState(
    formatMemberSince(
      user?.memberSince ||
        user?.createdAt ||
        user?.joinedAt ||
        user?.created_at ||
        ""
    )
  );

  const [saving, setSaving] = useState(false);
  const [imgError, setImgError] = useState(false);

  const initials = useMemo(() => getInitials({ ...user, email }), [user, email]);

  const profilePic = useMemo(() => {
    const picture =
      user?.profilePicture ||
      user?.profilePhoto ||
      user?.photo ||
      user?.avatar ||
      user?.image ||
      user?.picture ||
      "";

    return getImageUrl(picture) || getFallbackAvatar(initials);
  }, [user, initials]);

  const displayName = useMemo(() => {
    return (
      user?.name ||
      user?.fullName ||
      user?.username ||
      email?.split("@")?.[0] ||
      "Owner"
    );
  }, [user, email]);

  const role = useMemo(() => {
    return String(user?.role || "owner").toLowerCase();
  }, [user]);

  const profileComplete = Boolean(email.trim() && phone.trim());

  const handleSave = () => {
    if (!email.trim()) {
      showError("Email is required");
      return;
    }

    if (!isValidEmail(email)) {
      showError("Please enter a valid email address");
      return;
    }

    if (!phone.trim()) {
      showError("Phone number is required");
      return;
    }

    setSaving(true);

    setTimeout(() => {
      updateStoredUser({
        email: email.trim(),
        phone: phone.trim(),
        contact: phone.trim(),
        contactnumber: phone.trim(),
        memberSince: memberSince || user?.memberSince || user?.createdAt || "",
        role: "owner",
      });

      showSuccess("Settings saved successfully");
      setSaving(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-6 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="mb-6 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm">
          <div className="bg-gradient-to-r from-green-700 via-green-600 to-emerald-600 px-6 py-7 text-white sm:px-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-center gap-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-full border-4 border-white/20 bg-white/10 shadow-lg">
                  <img
                    src={imgError ? getFallbackAvatar(initials) : profilePic}
                    alt="Owner profile"
                    className="h-full w-full object-cover"
                    onError={() => setImgError(true)}
                  />
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-green-100">
                    Owner Account
                  </p>

                  <h1 className="mt-1 truncate text-3xl font-black tracking-tight">
                    Owner Settings
                  </h1>

                  <p className="mt-1 truncate text-sm text-green-50/90">
                    {displayName} · {email || "No email added"}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap gap-2">
                <span className="rounded-full bg-white/15 px-4 py-2 text-xs font-bold uppercase tracking-wide text-white ring-1 ring-white/20">
                  {role}
                </span>

                <span
                  className={`rounded-full px-4 py-2 text-xs font-bold ring-1 ${
                    profileComplete
                      ? "bg-white text-green-700 ring-white"
                      : "bg-amber-50 text-amber-700 ring-amber-100"
                  }`}
                >
                  {profileComplete ? "Profile Complete" : "Setup Pending"}
                </span>
              </div>
            </div>
          </div>

          <div className="grid gap-4 p-6 sm:grid-cols-3 sm:p-8">
            <MiniStat
              label="Access Type"
              value={role}
              desc="Current owner role"
            />

            <MiniStat
              label="Phone"
              value={phone ? "Added" : "Missing"}
              desc="Required contact detail"
              warning={!phone}
            />

            <MiniStat
              label="Member Since"
              value={memberSince || "Not set"}
              desc="Owner account date"
              warning={!memberSince}
            />
          </div>
        </div>

        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h2 className="text-2xl font-black tracking-tight text-slate-900">
                Owner Profile
              </h2>
              <p className="mt-1 text-sm text-slate-500">
                Your owner account contact information.
              </p>
            </div>

            <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold uppercase tracking-wide text-green-700">
              Account
            </span>
          </div>

          <div className="grid gap-5 lg:grid-cols-2">
            <Field label="Email" required>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                placeholder="owner@example.com"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </Field>

            <Field label="Phone" required>
              <input
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="98XXXXXXXX"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </Field>

            <Field label="Member Since">
              <input
                value={memberSince}
                onChange={(e) => setMemberSince(e.target.value)}
                type="date"
                className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
              />
            </Field>
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="mt-6 w-full rounded-2xl bg-green-700 px-5 py-3.5 text-sm font-bold text-white shadow-lg shadow-green-900/20 transition hover:bg-green-800 active:scale-[0.99] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
        </section>

        <section className="mt-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-black tracking-tight text-slate-900">
              Setup Checklist
            </h2>
            <p className="mt-1 text-sm text-slate-500">
              Complete these details to make your owner profile ready.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <ChecklistCard
              title="Email"
              desc={email || "Email required"}
              complete={Boolean(email && isValidEmail(email))}
            />

            <ChecklistCard
              title="Phone"
              desc={phone || "Phone required"}
              complete={Boolean(phone)}
            />

            <ChecklistCard
              title="Role"
              desc={`Current role: ${role}`}
              complete={role === "owner"}
            />
          </div>
        </section>
      </div>
    </div>
  );
}

function Field({ label, required, children }) {
  return (
    <label className="block">
      <span className="mb-2 block text-sm font-bold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </span>
      {children}
    </label>
  );
}

function MiniStat({ label, value, desc, warning = false }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        warning
          ? "border-amber-100 bg-amber-50"
          : "border-green-100 bg-green-50"
      }`}
    >
      <p
        className={`text-xs font-black uppercase tracking-[0.18em] ${
          warning ? "text-amber-700" : "text-green-700"
        }`}
      >
        {label}
      </p>

      <p className="mt-2 break-words text-2xl font-black capitalize text-slate-900">
        {value}
      </p>

      <p className="mt-1 text-sm text-slate-500">{desc}</p>
    </div>
  );
}

function ChecklistCard({ title, desc, complete }) {
  return (
    <div
      className={`rounded-2xl border p-4 ${
        complete
          ? "border-green-100 bg-green-50"
          : "border-amber-100 bg-amber-50"
      }`}
    >
      <div className="flex items-start gap-3">
        <span
          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-sm font-black text-white ${
            complete ? "bg-green-700" : "bg-amber-500"
          }`}
        >
          {complete ? "✓" : "!"}
        </span>

        <div className="min-w-0">
          <p className="font-bold text-slate-900">{title}</p>
          <p className="mt-1 break-words text-sm text-slate-500">{desc}</p>
        </div>
      </div>
    </div>
  );
}