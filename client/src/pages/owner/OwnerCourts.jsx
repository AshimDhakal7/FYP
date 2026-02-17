// import React, { useState } from "react";

// export default function OwnerCourts() {
//   const [courts, setCourts] = useState([]);
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [price, setPrice] = useState("");

//   const addCourt = (e) => {
//     e.preventDefault();
//     if (!name || !city || !price) return;

//     setCourts((prev) => [
//       ...prev,
//       { id: Date.now(), name, city, price },
//     ]);

//     setName("");
//     setCity("");
//     setPrice("");
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
//       <p className="mt-1 text-sm text-gray-600">
//         Add and manage your indoor cricket courts.
//       </p>

//       {/* Add court form */}
//       <form
//         onSubmit={addCourt}
//         className="mt-6 rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5"
//       >
//         <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
//           <div className="lg:col-span-2">
//             <label className="block text-xs font-semibold text-gray-700">
//               Court / Venue Name
//             </label>
//             <input
//               value={name}
//               onChange={(e) => setName(e.target.value)}
//               placeholder="Great Himalaya Cricket Academy"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700">
//               City / Area
//             </label>
//             <input
//               value={city}
//               onChange={(e) => setCity(e.target.value)}
//               placeholder="Lalitpur"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>

//           <div>
//             <label className="block text-xs font-semibold text-gray-700">
//               Price (per hour)
//             </label>
//             <input
//               value={price}
//               onChange={(e) => setPrice(e.target.value)}
//               placeholder="1500"
//               className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
//             />
//           </div>
//         </div>

//         <button
//           type="submit"
//           className="mt-4 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
//         >
//           Add Court
//         </button>
//       </form>

//       {/* Court list */}
//       <div className="mt-6">
//         <div className="text-sm font-semibold text-gray-900">Your Courts</div>

//         {courts.length === 0 ? (
//           <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
//             No courts added yet. Add your first court above.
//           </div>
//         ) : (
//           <div className="mt-4 grid gap-4 sm:grid-cols-2">
//             {courts.map((c) => (
//               <div
//                 key={c.id}
//                 className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5"
//               >
//                 <div className="text-base font-semibold text-gray-900">{c.name}</div>
//                 <div className="mt-1 text-sm text-gray-600">{c.city}</div>
//                 <div className="mt-3 inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
//                   NPR {c.price}/hr
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

export default function OwnerCourts() {
  const location = useLocation();

  const user = JSON.parse(localStorage.getItem("user") || "null");
  const ownerKey = useMemo(
    () => `cricbook_owner_courts_${user?.email || "unknown"}`,
    [user?.email]
  );

  const publicKey = "cricbook_public_courts";

  const formRef = useRef(null);
  const nameRef = useRef(null);

  const [courts, setCourts] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [price, setPrice] = useState("");

  // load owner courts (persistent)
  useEffect(() => {
    const saved = localStorage.getItem(ownerKey);
    if (saved) setCourts(JSON.parse(saved));
  }, [ownerKey]);

  // save owner courts (persistent)
  useEffect(() => {
    localStorage.setItem(ownerKey, JSON.stringify(courts));
  }, [courts, ownerKey]);

  // open add / focus when coming from dashboard
  useEffect(() => {
    if (location.state?.openAdd) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        nameRef.current?.focus();
      }, 100);
    }
  }, [location.state]);

  const addCourt = (e) => {
    e.preventDefault();
    if (!name.trim() || !city.trim() || !price.trim()) return;

    const newCourt = {
      id: Date.now(),
      name: name.trim(),
      city: city.trim(),
      price: price.trim(),
      rating: "4.6",
      reviews: "0",
      ownerEmail: user?.email || "unknown",
      createdAt: new Date().toISOString(),
    };

    // 1) save to owner's list
    setCourts((prev) => [newCourt, ...prev]);

    // 2) save to public list (Landing page reads this)
    const existingPublic = JSON.parse(localStorage.getItem(publicKey) || "[]");
    localStorage.setItem(publicKey, JSON.stringify([newCourt, ...existingPublic]));

    setName("");
    setCity("");
    setPrice("");
    nameRef.current?.focus();
  };

  const removeCourt = (id) => {
    // remove from owner's list
    setCourts((prev) => prev.filter((c) => c.id !== id));

    // remove from public list too
    const existingPublic = JSON.parse(localStorage.getItem(publicKey) || "[]");
    const updatedPublic = existingPublic.filter((c) => c.id !== id);
    localStorage.setItem(publicKey, JSON.stringify(updatedPublic));
  };

  return (
    <div>
      <div className="flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
          <p className="mt-1 text-sm text-gray-600">
            Add and manage your indoor cricket courts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
            setTimeout(() => nameRef.current?.focus(), 150);
          }}
          className="rounded-xl bg-green-700 px-4 py-2 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          + Add Court
        </button>
      </div>

      {/* Add court form */}
      <form
        ref={formRef}
        onSubmit={addCourt}
        className="mt-6 rounded-2xl bg-gray-50 p-5 ring-1 ring-black/5"
      >
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <div className="lg:col-span-2">
            <label className="block text-xs font-semibold text-gray-700">
              Court / Venue Name
            </label>
            <input
              ref={nameRef}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Great Himalaya Cricket Academy"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              City / Area
            </label>
            <input
              value={city}
              onChange={(e) => setCity(e.target.value)}
              placeholder="Lalitpur"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-700">
              Price (per hour)
            </label>
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="1500"
              className="mt-1 w-full rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm outline-none focus:border-green-600 focus:ring-2 focus:ring-green-100"
            />
          </div>
        </div>

        <button
          type="submit"
          className="mt-4 rounded-xl bg-green-700 px-5 py-2.5 text-sm font-semibold text-white hover:bg-green-800 transition"
        >
          Save Court
        </button>
      </form>

      {/* Court list */}
      <div className="mt-6">
        <div className="flex items-center justify-between">
          <div className="text-sm font-semibold text-gray-900">Your Courts</div>
          <div className="text-xs text-gray-600">{courts.length} total</div>
        </div>

        {courts.length === 0 ? (
          <div className="mt-3 rounded-xl border border-dashed border-gray-200 p-6 text-sm text-gray-600">
            No courts added yet. Click <span className="font-semibold">+ Add Court</span> to create your first listing.
          </div>
        ) : (
          <div className="mt-4 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courts.map((c) => (
              <div
                key={c.id}
                className="rounded-2xl bg-white p-5 shadow-sm ring-1 ring-black/5 hover:shadow-md transition"
              >
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-base font-semibold text-gray-900">{c.name}</div>
                    <div className="mt-1 text-sm text-gray-600">{c.city}</div>
                  </div>

                  <button
                    type="button"
                    onClick={() => removeCourt(c.id)}
                    className="rounded-xl border border-gray-200 bg-white px-3 py-1.5 text-xs font-semibold text-gray-900 hover:bg-gray-50 transition"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="inline-flex rounded-full bg-green-50 px-3 py-1 text-xs font-semibold text-green-700 ring-1 ring-green-100">
                    NPR {c.price}/hr
                  </div>
                  <div className="text-xs text-gray-500">
                    {new Date(c.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
