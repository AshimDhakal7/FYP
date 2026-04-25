// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
// import { showError, showSuccess } from "../../utils/toast";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerCourts() {
//   const formRef = useRef(null);
//   const nameRef = useRef(null);
//   const fileInputRef = useRef(null);

//   const [courts, setCourts] = useState([]);
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [latitude, setLatitude] = useState("");
//   const [longitude, setLongitude] = useState("");
//   const [phone, setPhone] = useState("");
//   const [price, setPrice] = useState("");

//   const [images, setImages] = useState([]);
//   const [preview, setPreview] = useState([]);
//   const [existingImages, setExistingImages] = useState([]);

//   const [editingId, setEditingId] = useState(null);

//   const [loading, setLoading] = useState(true);
//   const [saving, setSaving] = useState(false);
//   const [err, setErr] = useState("");
//   const [success, setSuccess] = useState("");

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
//       const res = await fetch(`${API_BASE}/api/grounds/mine/list`, {
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         const message = data?.message || "Failed to load courts";
//         setErr(message);
//         showError(message);
//         setCourts([]);
//         return;
//       }

//       setCourts(Array.isArray(data) ? data : []);
//     } catch (error) {
//       const message = error?.message || "Failed to load courts";
//       setErr(message);
//       showError(message);
//       setCourts([]);
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (!token) {
//       setLoading(false);
//       setErr("Please log in to manage courts");
//       showError("Please log in to manage courts");
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
//     setSuccess("");
//     setEditingId(court._id);
//     setName(court.name || "");
//     setCity(court.location || "");
//     setLatitude(
//       court.latitude !== undefined && court.latitude !== null
//         ? String(court.latitude)
//         : ""
//     );
//     setLongitude(
//       court.longitude !== undefined && court.longitude !== null
//         ? String(court.longitude)
//         : ""
//     );
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
//     showSuccess("Image removed from form");
//   };

//   const cancelEdit = () => {
//     clearPreviewUrls();

//     setEditingId(null);
//     setName("");
//     setCity("");
//     setLatitude("");
//     setLongitude("");
//     setPhone("");
//     setPrice("");
//     setImages([]);
//     setPreview([]);
//     setExistingImages([]);
//     setErr("");
//     setSuccess("");
//     resetFileInput();
//   };

//   const validateForm = () => {
//     if (!name.trim()) return "Court name is required";
//     if (!city.trim()) return "City / address is required";
//     if (!phone.trim()) return "Phone number is required";
//     if (!price) return "Price is required";
//     if (latitude === "") return "Latitude is required";
//     if (longitude === "") return "Longitude is required";

//     if (Number.isNaN(Number(price)) || Number(price) <= 0) {
//       return "Price must be a valid number";
//     }

//     const lat = Number(latitude);
//     const lng = Number(longitude);

//     if (Number.isNaN(lat) || lat < -90 || lat > 90) {
//       return "Latitude must be between -90 and 90";
//     }

//     if (Number.isNaN(lng) || lng < -180 || lng > 180) {
//       return "Longitude must be between -180 and 180";
//     }

//     return "";
//   };

//   const addCourt = async (e) => {
//     e.preventDefault();
//     setErr("");
//     setSuccess("");

//     const validationError = validateForm();
//     if (validationError) {
//       setErr(validationError);
//       showError(validationError);
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
//           const message = uploadError?.message || "Image upload failed";
//           setErr(message);
//           showError(message);
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
//           latitude: Number(latitude),
//           longitude: Number(longitude),
//           phone: phone.trim(),
//           pricePerHour: Number(price),
//           images: finalImages,
//         }),
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         const message = data?.message || "Failed to save court";
//         setErr(message);
//         showError(message);
//         return;
//       }

//       const savedCourt = data?.ground || data?.data || data;

//       if (isEditing) {
//         setCourts((prev) =>
//           prev.map((court) => (court._id === editingId ? savedCourt : court))
//         );
//       } else {
//         setCourts((prev) => [savedCourt, ...prev]);
//       }

//       cancelEdit();

//       const message = isEditing
//         ? "Court updated and sent for admin re-approval"
//         : "Court submitted successfully. Waiting for admin approval";

//       setSuccess(message);
//       showSuccess(message);
//     } catch (error) {
//       const message = error?.message || "Server error";
//       setErr(message);
//       showError(message);
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
//     setSuccess("");

//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
//         method: "DELETE",
//         headers: {
//           Authorization: `Bearer ${token}`,
//         },
//       });

//       const data = await parseJsonSafe(res);

//       if (!res.ok) {
//         const message = data?.message || "Failed to delete";
//         setErr(message);
//         showError(message);
//         return;
//       }

//       setCourts((prev) => prev.filter((court) => court._id !== id));

//       if (editingId === id) {
//         cancelEdit();
//       }

//       setSuccess("Court removed successfully.");
//       showSuccess("Court removed successfully");
//     } catch (error) {
//       const message = error?.message || "Failed to delete";
//       setErr(message);
//       showError(message);
//     }
//   };

//   const getStatusBadge = (status) => {
//     if (status === "approved") {
//       return (
//         <span className="rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
//           Approved
//         </span>
//       );
//     }

//     if (status === "rejected") {
//       return (
//         <span className="rounded-full bg-red-100 px-3 py-1 text-xs font-semibold text-red-700">
//           Rejected
//         </span>
//       );
//     }

//     return (
//       <span className="rounded-full bg-yellow-100 px-3 py-1 text-xs font-semibold text-yellow-700">
//         Pending
//       </span>
//     );
//   };

//   return (
//     <div className="min-h-screen bg-slate-50 px-4 py-6">
//       <div className="mx-auto max-w-7xl">
//         <div className="mb-6 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
//           <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
//             <div>
//               <h1 className="text-3xl font-bold text-slate-900">
//                 Manage Courts
//               </h1>
//               <p className="mt-1 text-sm text-slate-500">
//                 Add, update, and manage your indoor cricket courts.
//               </p>
//             </div>

//             <button
//               type="button"
//               onClick={() => {
//                 cancelEdit();
//                 formRef.current?.scrollIntoView({
//                   behavior: "smooth",
//                   block: "start",
//                 });
//                 setTimeout(() => nameRef.current?.focus(), 100);
//               }}
//               className="rounded-2xl bg-green-700 px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95"
//             >
//               + Add Court
//             </button>
//           </div>
//         </div>

//         <div className="mb-6 rounded-2xl border border-blue-200 bg-blue-50 px-4 py-3 text-sm text-blue-800">
//           New courts are submitted for admin approval. Updating an approved court
//           will send it back to pending review.
//         </div>

//         {err && (
//           <div className="mb-4 rounded-2xl border border-red-100 bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
//             {err}
//           </div>
//         )}

//         {success && (
//           <div className="mb-4 rounded-2xl border border-green-100 bg-green-50 px-4 py-3 text-sm font-semibold text-green-700">
//             {success}
//           </div>
//         )}

//         <form
//           ref={formRef}
//           onSubmit={addCourt}
//           className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm"
//         >
//           <div className="mb-5">
//             <h2 className="text-xl font-bold text-slate-900">
//               {editingId ? "Update Court" : "Add New Court"}
//             </h2>
//             <p className="mt-1 text-sm text-slate-500">
//               Fill all required details before saving your court.
//             </p>
//           </div>

//           <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
//             <InputField
//               inputRef={nameRef}
//               label="Court Name"
//               value={name}
//               onChange={setName}
//               placeholder="Court Name"
//             />

//             <InputField
//               label="City / Address"
//               value={city}
//               onChange={setCity}
//               placeholder="City / Address"
//             />

//             <InputField
//               label="Latitude"
//               type="number"
//               step="any"
//               value={latitude}
//               onChange={setLatitude}
//               placeholder="27.7172"
//             />

//             <InputField
//               label="Longitude"
//               type="number"
//               step="any"
//               value={longitude}
//               onChange={setLongitude}
//               placeholder="85.3240"
//             />

//             <InputField
//               label="Phone Number"
//               value={phone}
//               onChange={setPhone}
//               placeholder="Phone Number"
//             />

//             <InputField
//               label="Price Per Hour"
//               type="number"
//               min="0"
//               value={price}
//               onChange={setPrice}
//               placeholder="Price"
//             />
//           </div>

//           <div className="mt-4">
//             <label className="mb-2 block text-sm font-bold text-slate-700">
//               Court Images
//             </label>
//             <input
//               ref={fileInputRef}
//               type="file"
//               multiple
//               accept="image/*"
//               onChange={handleImageChange}
//               className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-green-500"
//             />
//           </div>

//           {(preview.length > 0 || existingImages.length > 0) && (
//             <div className="mt-4 flex flex-wrap gap-3">
//               {preview.map((img, i) => (
//                 <img
//                   key={i}
//                   src={img}
//                   alt={`Preview ${i + 1}`}
//                   className="h-24 w-24 rounded-2xl object-cover shadow-sm"
//                 />
//               ))}

//               {existingImages.map((img, i) => (
//                 <div key={i} className="relative">
//                   <img
//                     src={img}
//                     alt={`Court ${i + 1}`}
//                     className="h-24 w-24 rounded-2xl object-cover shadow-sm"
//                     onError={(e) => {
//                       e.currentTarget.style.display = "none";
//                     }}
//                   />
//                   <button
//                     type="button"
//                     onClick={() => removeExistingImage(img)}
//                     className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-1 text-xs font-bold text-white shadow"
//                   >
//                     ×
//                   </button>
//                 </div>
//               ))}
//             </div>
//           )}

//           <div className="mt-6 flex flex-wrap gap-3">
//             <button
//               type="submit"
//               disabled={saving}
//               className="rounded-2xl bg-green-700 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95 disabled:opacity-70"
//             >
//               {saving ? "Saving..." : editingId ? "Update Court" : "Save Court"}
//             </button>

//             {editingId && (
//               <button
//                 type="button"
//                 onClick={cancelEdit}
//                 className="rounded-2xl border border-slate-200 bg-white px-6 py-3 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
//               >
//                 Cancel
//               </button>
//             )}
//           </div>
//         </form>

//         {loading ? (
//           <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-6 text-slate-500">
//             Loading courts...
//           </div>
//         ) : courts.length === 0 ? (
//           <div className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center text-slate-500">
//             No courts found.
//           </div>
//         ) : (
//           <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
//             {courts.map((court) => (
//               <CourtCard
//                 key={court._id}
//                 court={court}
//                 onEdit={handleEdit}
//                 onDelete={removeCourt}
//                 getStatusBadge={getStatusBadge}
//               />
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }

// function InputField({
//   label,
//   value,
//   onChange,
//   placeholder,
//   type = "text",
//   inputRef,
//   ...props
// }) {
//   return (
//     <div>
//       <label className="mb-2 block text-sm font-bold text-slate-700">
//         {label}
//       </label>
//       <input
//         ref={inputRef}
//         type={type}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         placeholder={placeholder}
//         className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none transition focus:border-green-500 focus:bg-white"
//         {...props}
//       />
//     </div>
//   );
// }

// function CourtCard({ court, onEdit, onDelete, getStatusBadge }) {
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
//     <div className="overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-sm transition hover:shadow-md">
//       {images.length > 0 ? (
//         <div className="relative">
//           <img
//             src={images[index]}
//             alt={court.name}
//             className="h-44 w-full object-cover"
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
//                 className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm shadow"
//               >
//                 ‹
//               </button>
//               <button
//                 type="button"
//                 onClick={next}
//                 className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-3 py-2 text-sm shadow"
//               >
//                 ›
//               </button>
//             </>
//           )}
//         </div>
//       ) : (
//         <div className="flex h-44 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
//           No Image
//         </div>
//       )}

//       <div className="p-5">
//         <div className="flex items-start justify-between gap-3">
//           <div>
//             <h3 className="font-bold text-slate-900">{court.name}</h3>
//             <p className="mt-1 text-sm text-slate-500">{court.location}</p>
//           </div>
//           {getStatusBadge(court.status)}
//         </div>

//         <div className="mt-4 space-y-1 text-sm text-slate-500">
//           {court.latitude != null && court.longitude != null && (
//             <p>
//               {court.latitude}, {court.longitude}
//             </p>
//           )}
//           {court.phone && <p>{court.phone}</p>}
//         </div>

//         <div className="mt-3 text-lg font-bold text-green-700">
//           Rs {court.pricePerHour}/hr
//         </div>

//         {court.status === "pending" && (
//           <div className="mt-3 rounded-2xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
//             Waiting for admin approval.
//           </div>
//         )}

//         {court.status === "approved" && (
//           <div className="mt-3 rounded-2xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
//             This court is live and visible to users.
//           </div>
//         )}

//         {court.status === "rejected" && (
//           <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
//             This court was rejected by admin. Edit and submit again.
//           </div>
//         )}

//         <div className="mt-4 flex gap-2">
//           <button
//             type="button"
//             onClick={() => onEdit(court)}
//             className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
//           >
//             Edit
//           </button>
//           <button
//             type="button"
//             onClick={() => onDelete(court._id)}
//             className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
//           >
//             Delete
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }



import React, { useEffect, useMemo, useRef, useState } from "react";
import { uploadToCloudinary } from "../../utils/uploadToCloudinary";
import { showError, showSuccess } from "../../utils/toast";

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
  const [showForm, setShowForm] = useState(false);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [err, setErr] = useState("");
  const [success, setSuccess] = useState("");

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
      const res = await fetch(`${API_BASE}/api/grounds/mine/list`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        const message = data?.message || "Failed to load courts";
        setErr(message);
        showError(message);
        setCourts([]);
        return;
      }

      setCourts(Array.isArray(data) ? data : []);
    } catch (error) {
      const message = error?.message || "Failed to load courts";
      setErr(message);
      showError(message);
      setCourts([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!token) {
      setLoading(false);
      setErr("Please log in to manage courts");
      showError("Please log in to manage courts");
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

  const openAddForm = () => {
    cancelEdit(false);
    setShowForm(true);

    setTimeout(() => {
      formRef.current?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      nameRef.current?.focus();
    }, 80);
  };

  const handleEdit = (court) => {
    setErr("");
    setSuccess("");
    setShowForm(true);
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

    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      nameRef.current?.focus();
    }, 80);
  };

  const removeExistingImage = (img) => {
    setExistingImages((prev) => prev.filter((item) => item !== img));
    showSuccess("Image removed from form");
  };

  const cancelEdit = (hideForm = true) => {
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
    setSuccess("");
    resetFileInput();

    if (hideForm) setShowForm(false);
  };

  const validateForm = () => {
    if (!name.trim()) return "Court name is required";
    if (!city.trim()) return "City / address is required";
    if (!phone.trim()) return "Phone number is required";
    if (!price) return "Price is required";
    if (latitude === "") return "Latitude is required";
    if (longitude === "") return "Longitude is required";

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
    setSuccess("");

    const validationError = validateForm();
    if (validationError) {
      setErr(validationError);
      showError(validationError);
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
          const message = uploadError?.message || "Image upload failed";
          setErr(message);
          showError(message);
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
        const message = data?.message || "Failed to save court";
        setErr(message);
        showError(message);
        return;
      }

      const savedCourt = data?.ground || data?.data || data;

      if (isEditing) {
        setCourts((prev) =>
          prev.map((court) => (court._id === editingId ? savedCourt : court))
        );
      } else {
        setCourts((prev) => [savedCourt, ...prev]);
      }

      cancelEdit(true);

      const message = isEditing
        ? "Court updated and sent for admin re-approval"
        : "Court submitted successfully. Waiting for admin approval";

      setSuccess(message);
      showSuccess(message);
    } catch (error) {
      const message = error?.message || "Server error";
      setErr(message);
      showError(message);
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
    setSuccess("");

    try {
      const res = await fetch(`${API_BASE}/api/grounds/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await parseJsonSafe(res);

      if (!res.ok) {
        const message = data?.message || "Failed to delete";
        setErr(message);
        showError(message);
        return;
      }

      setCourts((prev) => prev.filter((court) => court._id !== id));

      if (editingId === id) {
        cancelEdit();
      }

      setSuccess("Court removed successfully.");
      showSuccess("Court removed successfully");
    } catch (error) {
      const message = error?.message || "Failed to delete";
      setErr(message);
      showError(message);
    }
  };

  const getStatusBadge = (status) => {
    if (status === "approved") {
      return (
        <span className="rounded-full bg-green-100 px-2.5 py-1 text-[11px] font-bold text-green-700">
          Approved
        </span>
      );
    }

    if (status === "rejected") {
      return (
        <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-700">
          Rejected
        </span>
      );
    }

    return (
      <span className="rounded-full bg-yellow-100 px-2.5 py-1 text-[11px] font-bold text-yellow-700">
        Pending
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-slate-50 px-4 py-5 sm:px-6">
      <div className="mx-auto max-w-7xl">
        <div className="mb-4 rounded-2xl border border-slate-200 bg-white px-5 py-4 shadow-sm">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-black text-slate-900">
                Manage Courts
              </h1>
              <p className="mt-0.5 text-sm text-slate-500">
                Add, update, and manage your indoor cricket courts.
              </p>
            </div>

            <button
              type="button"
              onClick={openAddForm}
              className="rounded-xl bg-green-700 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95"
            >
              + Add Court
            </button>
          </div>
        </div>

        <div className="mb-4 rounded-xl border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm text-blue-800">
          New courts need admin approval. Updating an approved court sends it
          back to pending review.
        </div>

        {err && (
          <div className="mb-3 rounded-xl border border-red-100 bg-red-50 px-4 py-2.5 text-sm font-semibold text-red-700">
            {err}
          </div>
        )}

        {success && (
          <div className="mb-3 rounded-xl border border-green-100 bg-green-50 px-4 py-2.5 text-sm font-semibold text-green-700">
            {success}
          </div>
        )}

        {showForm && (
          <form
            ref={formRef}
            onSubmit={addCourt}
            className="mb-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm"
          >
            <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <h2 className="text-lg font-black text-slate-900">
                  {editingId ? "Update Court" : "Add New Court"}
                </h2>
                <p className="mt-0.5 text-sm text-slate-500">
                  Fill all required details before saving.
                </p>
              </div>

              <button
                type="button"
                onClick={() => cancelEdit(true)}
                className="w-fit rounded-xl border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
              >
                Close
              </button>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              <InputField
                inputRef={nameRef}
                label="Court Name"
                value={name}
                onChange={setName}
                placeholder="Court Name"
              />

              <InputField
                label="City / Address"
                value={city}
                onChange={setCity}
                placeholder="City / Address"
              />

              <InputField
                label="Phone Number"
                value={phone}
                onChange={setPhone}
                placeholder="Phone Number"
              />

              <InputField
                label="Latitude"
                type="number"
                step="any"
                value={latitude}
                onChange={setLatitude}
                placeholder="27.7172"
              />

              <InputField
                label="Longitude"
                type="number"
                step="any"
                value={longitude}
                onChange={setLongitude}
                placeholder="85.3240"
              />

              <InputField
                label="Price Per Hour"
                type="number"
                min="0"
                value={price}
                onChange={setPrice}
                placeholder="Price"
              />
            </div>

            <div className="mt-3">
              <label className="mb-1.5 block text-sm font-bold text-slate-700">
                Court Images
              </label>
              <input
                ref={fileInputRef}
                type="file"
                multiple
                accept="image/*"
                onChange={handleImageChange}
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500"
              />
            </div>

            {(preview.length > 0 || existingImages.length > 0) && (
              <div className="mt-3 flex flex-wrap gap-2">
                {preview.map((img, i) => (
                  <img
                    key={i}
                    src={img}
                    alt={`Preview ${i + 1}`}
                    className="h-16 w-16 rounded-xl object-cover shadow-sm"
                  />
                ))}

                {existingImages.map((img, i) => (
                  <div key={i} className="relative">
                    <img
                      src={img}
                      alt={`Court ${i + 1}`}
                      className="h-16 w-16 rounded-xl object-cover shadow-sm"
                      onError={(e) => {
                        e.currentTarget.style.display = "none";
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(img)}
                      className="absolute -right-2 -top-2 rounded-full bg-red-600 px-2 py-0.5 text-xs font-bold text-white shadow"
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-green-700 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-green-800 active:scale-95 disabled:opacity-70"
              >
                {saving
                  ? "Saving..."
                  : editingId
                  ? "Update Court"
                  : "Save Court"}
              </button>

              {editingId && (
                <button
                  type="button"
                  onClick={() => cancelEdit(true)}
                  className="rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        )}

        {loading ? (
          <div className="rounded-2xl border border-slate-200 bg-white p-5 text-slate-500">
            Loading courts...
          </div>
        ) : courts.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">
            No courts found.
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {courts.map((court) => (
              <CourtCard
                key={court._id}
                court={court}
                onEdit={handleEdit}
                onDelete={removeCourt}
                getStatusBadge={getStatusBadge}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function InputField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputRef,
  ...props
}) {
  return (
    <div>
      <label className="mb-1.5 block text-sm font-bold text-slate-700">
        {label}
      </label>
      <input
        ref={inputRef}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm outline-none transition focus:border-green-500 focus:bg-white"
        {...props}
      />
    </div>
  );
}

function CourtCard({ court, onEdit, onDelete, getStatusBadge }) {
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
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
      {images.length > 0 ? (
        <div className="relative">
          <img
            src={images[index]}
            alt={court.name}
            className="h-36 w-full object-cover"
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
                className="absolute left-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2.5 py-1.5 text-sm shadow"
              >
                ‹
              </button>
              <button
                type="button"
                onClick={next}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-white/90 px-2.5 py-1.5 text-sm shadow"
              >
                ›
              </button>
            </>
          )}
        </div>
      ) : (
        <div className="flex h-36 items-center justify-center bg-slate-100 text-sm font-semibold text-slate-400">
          No Image
        </div>
      )}

      <div className="p-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0">
            <h3 className="truncate font-bold text-slate-900">{court.name}</h3>
            <p className="mt-0.5 truncate text-sm text-slate-500">
              {court.location}
            </p>
          </div>
          {getStatusBadge(court.status)}
        </div>

        <div className="mt-3 grid gap-1 text-sm text-slate-500">
          {court.latitude != null && court.longitude != null && (
            <p className="truncate">
              {court.latitude}, {court.longitude}
            </p>
          )}
          {court.phone && <p className="truncate">{court.phone}</p>}
        </div>

        <div className="mt-2 text-base font-black text-green-700">
          Rs {court.pricePerHour}/hr
        </div>

        {court.status === "pending" && (
          <div className="mt-2 rounded-xl border border-yellow-200 bg-yellow-50 px-3 py-2 text-xs font-medium text-yellow-800">
            Waiting for admin approval.
          </div>
        )}

        {court.status === "approved" && (
          <div className="mt-2 rounded-xl border border-green-200 bg-green-50 px-3 py-2 text-xs font-medium text-green-800">
            Live and visible to users.
          </div>
        )}

        {court.status === "rejected" && (
          <div className="mt-2 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-medium text-red-800">
            Rejected. Edit and submit again.
          </div>
        )}

        <div className="mt-3 flex gap-2">
          <button
            type="button"
            onClick={() => onEdit(court)}
            className="flex-1 rounded-xl border border-blue-200 bg-blue-50 py-2 text-sm font-bold text-blue-700 transition hover:bg-blue-100"
          >
            Edit
          </button>
          <button
            type="button"
            onClick={() => onDelete(court._id)}
            className="flex-1 rounded-xl border border-red-200 bg-red-50 py-2 text-sm font-bold text-red-700 transition hover:bg-red-100"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}