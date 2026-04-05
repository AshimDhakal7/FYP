
// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerCourts() {
//   const formRef = useRef(null);
//   const nameRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [courts, setCourts] = useState([]);
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [phone, setPhone] = useState("");
//   const [price, setPrice] = useState("");

//   const [images, setImages] = useState([]);
//   const [preview, setPreview] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState("");

//   const token = useMemo(() => {
//     return (
//       localStorage.getItem("token") ||
//       localStorage.getItem("accessToken") ||
//       localStorage.getItem("authToken") ||
//       ""
//     );
//   }, []);

//   const parseJsonSafe = async (res) => {
//     try {
//       return await res.json();
//     } catch {
//       return null;
//     }
//   };

//   const loadMyCourts = async () => {
//     setLoading(true);
//     setErr("");

//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/mine`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         setErr(data?.message || "Failed to load courts");
//         setCourts([]);
//         return;
//       }

//       setCourts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       setErr(error?.message || "Failed to load courts");
//       setCourts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       setErr("Please log in to manage courts");
//       return;
//     }

//     loadMyCourts();
//   }, [token]);

//   useEffect(() => {
//     return () => {
//       preview.forEach((url) => URL.revokeObjectURL(url));
//     };
//   }, [preview]);

//   const resetFileInput = () => {
//     if (fileInputRef.current) {
//       fileInputRef.current.value = "";
//     }
//   };

//   const clearPreviewUrls = () => {
//     preview.forEach((url) => URL.revokeObjectURL(url));
//   };

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files || []);

//     clearPreviewUrls();
//     setImages(files);
//     setPreview(files.map((file) => URL.createObjectURL(file)));
//   };

//   const handleEdit = (court) => {
//     setErr("");
//     setEditingId(court._id);
//     setName(court.name || "");
//     setCity(court.location || "");
//     setPhone(court.phone || "");
//     setPrice(
//       court.pricePerHour !== undefined && court.pricePerHour !== null
//         ? String(court.pricePerHour)
//         : ""
//     );
//     setExistingImages(Array.isArray(court.images) ? court.images : []);

//     clearPreviewUrls();
//     setImages([]);
//     setPreview([]);
//     resetFileInput();

//     formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
//     setTimeout(() => nameRef.current?.focus(), 100);
//   };

//   const removeExistingImage = (img) => {
//     setExistingImages((prev) => prev.filter((item) => item !== img));
//   };

//   const cancelEdit = () => {
//     clearPreviewUrls();

//     setEditingId(null);
//     setName("");
//     setCity("");
//     setPhone("");
//     setPrice("");
//     setImages([]);
//     setPreview([]);
//     setExistingImages([]);
//     setErr("");
//     resetFileInput();
//   };

//   const validateForm = () => {
//     if (!name.trim() || !city.trim() || !phone.trim() || !price) {
//       return "Please fill all fields";
//     }

//     if (Number.isNaN(Number(price)) || Number(price) <= 0) {
//       return "Price must be a valid number";
//     }

//     return "";
//   };

//   const addCourt = async (e) => {
//     e.preventDefault();
//     setErr("");

//     const validationError = validateForm();
//     if (validationError) {
//       setErr(validationError);
//       return;
//     }

//     setSaving(true);

//     try {
//       let uploadedUrls = [];

//       if (images.length > 0) {
//         try {
//           uploadedUrls = await uploadToCloudinary(images);

//           if (!Array.isArray(uploadedUrls)) {
//             throw new Error("Image upload did not return a valid image list");
//           }
//         } catch (uploadError) {
//           setErr(uploadError?.message || "Image upload failed");
//           return;
//         }
//       }

//       const finalImages = [...existingImages, ...uploadedUrls];

//       const isEditing = Boolean(editingId);
//       const url = isEditing
//         ? `${API_BASE}/api/grounds/${editingId}`
//         : `${API_BASE}/api/grounds`;

//       const method = isEditing ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name: name.trim(),
//           location: city.trim(),
//           phone: phone.trim(),
//           pricePerHour: Number(price),
//           images: finalImages,
//         }),
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         setErr(data?.message || "Failed to save court");
//         return;
//       }

//       const savedCourt = data?.data || data;

//       if (isEditing) {
//         setCourts((prev) =>
//           prev.map((court) => (court._id === editingId ? savedCourt : court))
//         );
//       } else {
//         setCourts((prev) => [savedCourt, ...prev]);
//       }

//       cancelEdit();
//     } catch (error) {
//       setErr(error?.message || "Server error");
//     } finally {
//       setSaving(false);
//     }
//   };

//   const removeCourt = async (id) => {
//     const confirmDelete = window.confirm(
//       "Are you sure you want to delete this court?"
//     );
//     if (!confirmDelete) return;

//     setErr("");

//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         setErr(data?.message || "Failed to delete");
//         return;
//       }

//       setCourts((prev) => prev.filter((court) => court._id !== id));

//       if (editingId === id) {
//         cancelEdit();
//       }
//     } catch (error) {
//       setErr(error?.message || "Failed to delete");
//     }
//   };

//   return (
//     <div>
//       <div className="flex justify-between items-end">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
//           <p className="text-sm text-gray-600">
//             Add and manage your indoor cricket courts.
//           </p>
//         </div>

//         <button
//           type="button"
//           onClick={() => {
//             cancelEdit();
//             formRef.current?.scrollIntoView({
//               behavior: "smooth",
//               block: "start",
//             });
//             setTimeout(() => nameRef.current?.focus(), 100);
//           }}
//           className="bg-green-700 text-white px-4 py-2 rounded-xl"
//         >
//           + Add Court
//         </button>
//       </div>

//       {err && <div className="text-red-500 mt-3">{err}</div>}

//       <form ref={formRef} onSubmit={addCourt} className="mt-5 space-y-3">
//         <input
//           ref={nameRef}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Court Name"
//           className="w-full border rounded p-2"
//         />

//         <input
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           className="w-full border rounded p-2"
//         />

//         <input
//           type="text"
//           placeholder="Phone Number"
//           value={phone}
//           onChange={(e) => setPhone(e.target.value)}
//           className="w-full border rounded p-2"
//         />

//         <input
//           type="number"
//           min="0"
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Price"
//           className="w-full border rounded p-2"
//         />

//         <input
//           ref={fileInputRef}
//           type="file"
//           multiple
//           accept="image/*"
//           onChange={handleImageChange}
//         />

//         <div className="flex gap-2 flex-wrap">
//           {preview.map((img, i) => (
//             <img
//               key={i}
//               src={img}
//               alt={`Preview ${i + 1}`}
//               className="w-20 h-20 rounded object-cover"
//             />
//           ))}
//         </div>

//         <div className="flex gap-2 flex-wrap">
//           {existingImages.map((img, i) => (
//             <div key={i} className="relative">
//               <img
//                 src={img}
//                 alt={`Court ${i + 1}`}
//                 className="w-20 h-20 rounded object-cover"
//                 onError={(e) => {
//                   e.currentTarget.style.display = "none";
//                 }}
//               />
//               <button
//                 type="button"
//                 onClick={() => removeExistingImage(img)}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
//               >
//                 ×
//               </button>
//             </div>
//           ))}
//         </div>

//         <div className="flex gap-2">
//           <button
//             type="submit"
//             disabled={saving}
//             className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-70"
//           >
//             {saving ? "Saving..." : editingId ? "Update Court" : "Save Court"}
//           </button>

//           {editingId && (
//             <button
//               type="button"
//               onClick={cancelEdit}
//               className="border px-4 py-2 rounded"
//             >
//               Cancel
//             </button>
//           )}
//         </div>
//       </form>

//       {loading ? (
//         <div className="mt-6 text-gray-500">Loading courts...</div>
//       ) : courts.length === 0 ? (
//         <div className="mt-6 text-gray-500">No courts found.</div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
//           {courts.map((court) => (
//             <CourtCard
//               key={court._id}
//               court={court}
//               onEdit={handleEdit}
//               onDelete={removeCourt}
//             />
//           ))}
//         </div>
//       )}
//     </div>
//   );
// }

// function CourtCard({ court, onEdit, onDelete }) {
//   const [index, setIndex] = useState(0);
//   const images = Array.isArray(court.images) ? court.images : [];

//   const next = () => {
//     if (images.length === 0) return;
//     setIndex((i) => (i + 1) % images.length);
//   };

//   const prev = () => {
//     if (images.length === 0) return;
//     setIndex((i) => (i - 1 + images.length) % images.length);
//   };

//   useEffect(() => {
//     setIndex(0);
//   }, [court._id, images.length]);

//   return (
//     <div className="bg-white p-4 rounded-xl shadow">
//       {images.length > 0 && (
//         <div className="relative">
//           <img
//             src={images[index]}
//             alt={court.name}
//             className="w-full h-40 object-cover rounded"
//             onError={(e) => {
//               e.currentTarget.src =
//                 "https://placehold.co/600x400?text=Image+Not+Available";
//             }}
//           />

//           {images.length > 1 && (
//             <>
//               <button
//                 type="button"
//                 onClick={prev}
//                 className="absolute left-0 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-r"
//               >
//                 ◀
//               </button>
//               <button
//                 type="button"
//                 onClick={next}
//                 className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-l"
//               >
//                 ▶
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       <div className="mt-2 font-semibold">{court.name}</div>
//       <div className="text-sm text-gray-500">{court.location}</div>
//       {court.phone && <div className="text-sm text-gray-500">{court.phone}</div>}
//       <div className="text-green-700 font-semibold">
//         Rs {court.pricePerHour}/hr
//       </div>

//       <div className="flex gap-2 mt-2">
//         <button
//           type="button"
//           onClick={() => onEdit(court)}
//           className="text-blue-600 text-sm"
//         >
//           Edit
//         </button>
//         <button
//           type="button"
//           onClick={() => onDelete(court._id)}
//           className="text-red-600 text-sm"
//         >
//           Delete
//         </button>
//       </div>
//     </div>
//   );
// }


import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

export default function OwnerCourts() {
  const formRef = useRef(null);
  const nameRef = useRef(null);
  const fileInputRef = useRef(null);

  const [courts, setCourts] = useState([]);
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [phone, setPhone] = useState("");
  const [price, setPrice] = useState("");

  const [images, setImages] = useState([]);
  const [preview, setPreview] = useState([]);
  const [existingImages, setExistingImages] = useState([]);

  const [editingId, setEditingId] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }, []);

  const parseJsonSafe = async (res) => {
    try {
      return await res.json();
    } catch {
      return null;
    }
  };

  const loadMyCourts = async () => {
    setLoading(true);
    setErr("");

    try {
      const res = await fetch(`${API_BASE}/api/grounds/mine`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        setErr(data?.message || "Failed to load courts");
        setCourts([]);
        return;
      }

      setCourts(Array.isArray(data) ? data : []);
    } catch (error) {
      setErr(error?.message || "Failed to load courts");
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErr("Please log in to manage courts");
      return;
    }

    loadMyCourts();
  }, [token]);

  useEffect(() => {
    return () => {
      preview.forEach((url) => URL.revokeObjectURL(url));
    };
  }, [preview]);

  const resetFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const clearPreviewUrls = () => {
    preview.forEach((url) => URL.revokeObjectURL(url));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files || []);

    clearPreviewUrls();
    setImages(files);
    setPreview(files.map((file) => URL.createObjectURL(file)));
  };

  const handleEdit = (court) => {
    setErr("");
    setEditingId(court._id);
    setName(court.name || "");
    setCity(court.location || "");
    setLatitude(
      court.latitude !== undefined && court.latitude !== null
        ? String(court.latitude)
        : ""
    );
    setLongitude(
      court.longitude !== undefined && court.longitude !== null
        ? String(court.longitude)
        : ""
    );
    setPhone(court.phone || "");
    setPrice(
      court.pricePerHour !== undefined && court.pricePerHour !== null
        ? String(court.pricePerHour)
        : ""
    );
    setExistingImages(Array.isArray(court.images) ? court.images : []);

    clearPreviewUrls();
    setImages([]);
    setPreview([]);
    resetFileInput();

    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => nameRef.current?.focus(), 100);
  };

  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((item) => item !== img));
  };

  const cancelEdit = () => {
    clearPreviewUrls();

    setEditingId(null);
    setName("");
    setCity("");
    setLatitude("");
    setLongitude("");
    setPhone("");
    setPrice("");
    setImages([]);
    setPreview([]);
    setExistingImages([]);
    setErr("");
    resetFileInput();
  };

  const validateForm = () => {
    if (
      !name.trim() ||
      !city.trim() ||
      !phone.trim() ||
      !price ||
      latitude === "" ||
      longitude === ""
    ) {
      return "Please fill all fields";
    }

    if (Number.isNaN(Number(price)) || Number(price) <= 0) {
      return "Price must be a valid number";
    }

    const lat = Number(latitude);
    const lng = Number(longitude);

    if (Number.isNaN(lat) || lat < -90 || lat > 90) {
      return "Latitude must be between -90 and 90";
    }

    if (Number.isNaN(lng) || lng < -180 || lng > 180) {
      return "Longitude must be between -180 and 180";
    }

    return "";
  };

  const addCourt = async (e) => {
    e.preventDefault();
    setErr("");

    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      return;
    }

    setSaving(true);

    try {
      let uploadedUrls = [];

      if (images.length > 0) {
        try {
          uploadedUrls = await uploadToCloudinary(images);

          if (!Array.isArray(uploadedUrls)) {
            throw new Error("Image upload did not return a valid image list");
          }
        } catch (uploadError) {
          setErr(uploadError?.message || "Image upload failed");
          return;
        }
      }

      const finalImages = [...existingImages, ...uploadedUrls];

      const isEditing = Boolean(editingId);
      const url = isEditing
        ? `${API_BASE}/api/grounds/${editingId}`
        : `${API_BASE}/api/grounds`;

      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: name.trim(),
          location: city.trim(),
          latitude: Number(latitude),
          longitude: Number(longitude),
          phone: phone.trim(),
          pricePerHour: Number(price),
          images: finalImages,
        }),
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        setErr(data?.message || "Failed to save court");
        return;
      }

      const savedCourt = data?.data || data;

      if (isEditing) {
        setCourts((prev) =>
          prev.map((court) => (court._id === editingId ? savedCourt : court))
        );
      } else {
        setCourts((prev) => [savedCourt, ...prev]);
      }

      cancelEdit();
    } catch (error) {
      setErr(error?.message || "Server error");
    } finally {
      setSaving(false);
    }
  };

  const removeCourt = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this court?"
    );
    if (!confirmDelete) return;

    setErr("");

    try {
      const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        setErr(data?.message || "Failed to delete");
        return;
      }

      setCourts((prev) => prev.filter((court) => court._id !== id));

      if (editingId === id) {
        cancelEdit();
      }
    } catch (error) {
      setErr(error?.message || "Failed to delete");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Manage Courts</h1>
          <p className="text-sm text-gray-600">
            Add and manage your indoor cricket courts.
          </p>
        </div>

        <button
          type="button"
          onClick={() => {
            cancelEdit();
            formRef.current?.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
            setTimeout(() => nameRef.current?.focus(), 100);
          }}
          className="bg-green-700 text-white px-4 py-2 rounded-xl"
        >
          + Add Court
        </button>
      </div>

      {err && <div className="text-red-500 mt-3">{err}</div>}

      <form ref={formRef} onSubmit={addCourt} className="mt-5 space-y-3">
        <input
          ref={nameRef}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Court Name"
          className="w-full border rounded p-2"
        />

        <input
          value={city}
          onChange={(e) => setCity(e.target.value)}
          placeholder="City / Address"
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          step="any"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          placeholder="Latitude (e.g. 27.7172)"
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          step="any"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          placeholder="Longitude (e.g. 85.3240)"
          className="w-full border rounded p-2"
        />

        <input
          type="text"
          placeholder="Phone Number"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border rounded p-2"
        />

        <input
          type="number"
          min="0"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
          placeholder="Price"
          className="w-full border rounded p-2"
        />

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleImageChange}
        />

        <div className="flex gap-2 flex-wrap">
          {preview.map((img, i) => (
            <img
              key={i}
              src={img}
              alt={`Preview ${i + 1}`}
              className="w-20 h-20 rounded object-cover"
            />
          ))}
        </div>

        <div className="flex gap-2 flex-wrap">
          {existingImages.map((img, i) => (
            <div key={i} className="relative">
              <img
                src={img}
                alt={`Court ${i + 1}`}
                className="w-20 h-20 rounded object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
              <button
                type="button"
                onClick={() => removeExistingImage(img)}
                className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
              >
                ×
              </button>
            </div>
          ))}
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={saving}
            className="bg-green-700 text-white px-4 py-2 rounded disabled:opacity-70"
          >
            {saving ? "Saving..." : editingId ? "Update Court" : "Save Court"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={cancelEdit}
              className="border px-4 py-2 rounded"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {loading ? (
        <div className="mt-6 text-gray-500">Loading courts...</div>
      ) : courts.length === 0 ? (
        <div className="mt-6 text-gray-500">No courts found.</div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 mt-6">
          {courts.map((court) => (
            <CourtCard
              key={court._id}
              court={court}
              onEdit={handleEdit}
              onDelete={removeCourt}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function CourtCard({ court, onEdit, onDelete }) {
  const [index, setIndex] = useState(0);
  const images = Array.isArray(court.images) ? court.images : [];

  const next = () => {
    if (images.length === 0) return;
    setIndex((i) => (i + 1) % images.length);
  };

  const prev = () => {
    if (images.length === 0) return;
    setIndex((i) => (i - 1 + images.length) % images.length);
  };

  useEffect(() => {
    setIndex(0);
  }, [court._id, images.length]);

  return (
    <div className="bg-white p-4 rounded-xl shadow">
      {images.length > 0 && (
        <div className="relative">
          <img
            src={images[index]}
            alt={court.name}
            className="w-full h-40 object-cover rounded"
            onError={(e) => {
              e.currentTarget.src =
                "https://placehold.co/600x400?text=Image+Not+Available";
            }}
          />

          {images.length > 1 && (
            <>
              <button
                type="button"
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-r"
              >
                ◀
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 bg-white px-2 py-1 rounded-l"
              >
                ▶
              </button>
            </>
          )}
        </div>
      )}

      <div className="mt-2 font-semibold">{court.name}</div>
      <div className="text-sm text-gray-500">{court.location}</div>
      {court.latitude != null && court.longitude != null && (
        <div className="text-sm text-gray-500">
          {court.latitude}, {court.longitude}
        </div>
      )}
      {court.phone && <div className="text-sm text-gray-500">{court.phone}</div>}
      <div className="text-green-700 font-semibold">
        Rs {court.pricePerHour}/hr
      </div>

      <div className="flex gap-2 mt-2">
        <button
          type="button"
          onClick={() => onEdit(court)}
          className="text-blue-600 text-sm"
        >
          Edit
        </button>
        <button
          type="button"
          onClick={() => onDelete(court._id)}
          className="text-red-600 text-sm"
        >
          Delete
        </button>
      </div>
    </div>
  );
}