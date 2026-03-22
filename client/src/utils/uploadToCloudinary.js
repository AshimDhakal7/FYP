// import React, { useEffect, useMemo, useRef, useState } from "react";
// import { useLocation } from "react-router-dom";
// import { uploadToCloudinary } from "../utils/uploadToCloudinary";

// const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

// export default function OwnerCourts() {
//   const location = useLocation();
//   const formRef = useRef(null);
//   const nameRef = useRef(null);

//   const [courts, setCourts] = useState([]);
//   const [name, setName] = useState("");
//   const [city, setCity] = useState("");
//   const [price, setPrice] = useState("");

//   const [images, setImages] = useState([]);
//   const [preview, setPreview] = useState([]);

//   const [editingId, setEditingId] = useState(null);
//   const [existingImages, setExistingImages] = useState([]);

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

//   const loadMyCourts = async () => {
//     try {
//       const res = await fetch(`${API_BASE}/api/grounds/mine`, {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       const data = await res.json();
//       setCourts(data || []);
//     } catch {
//       setErr("Failed to load courts");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     loadMyCourts();
//   }, []);

//   const handleImageChange = (e) => {
//     const files = Array.from(e.target.files);
//     setImages(files);
//     setPreview(files.map((f) => URL.createObjectURL(f)));
//   };

//   const handleEdit = (court) => {
//     setEditingId(court._id);
//     setName(court.name);
//     setCity(court.location);
//     setPrice(court.pricePerHour);
//     setExistingImages(court.images || []);
//     setPreview([]);
//     setImages([]);

//     formRef.current?.scrollIntoView({ behavior: "smooth" });
//   };

//   const removeExistingImage = (img) => {
//     setExistingImages((prev) => prev.filter((i) => i !== img));
//   };

//   const addCourt = async (e) => {
//     e.preventDefault();
//     setSaving(true);

//     try {
//       let uploadedUrls = [];

//       if (images.length > 0) {
//         uploadedUrls = await uploadToCloudinary(images);
//       }

//       const finalImages = [...existingImages, ...uploadedUrls];

//       const url = editingId
//         ? `${API_BASE}/api/grounds/${editingId}`
//         : `${API_BASE}/api/grounds`;

//       const method = editingId ? "PUT" : "POST";

//       const res = await fetch(url, {
//         method,
//         headers: {
//           "Content-Type": "application/json",
//           Authorization: `Bearer ${token}`,
//         },
//         body: JSON.stringify({
//           name,
//           location: city,
//           pricePerHour: price,
//           images: finalImages,
//         }),
//       });

//       const data = await res.json();

//       if (editingId) {
//         setCourts((prev) =>
//           prev.map((c) => (c._id === editingId ? data : c))
//         );
//       } else {
//         setCourts((prev) => [data, ...prev]);
//       }

//       // reset
//       setName("");
//       setCity("");
//       setPrice("");
//       setImages([]);
//       setPreview([]);
//       setExistingImages([]);
//       setEditingId(null);
//     } catch {
//       setErr("Failed to save");
//     } finally {
//       setSaving(false);
//     }
//   };

//   return (
//     <div>
//       <h1 className="text-2xl font-bold">Manage Courts</h1>

//       <form ref={formRef} onSubmit={addCourt} className="mt-4 space-y-3">
//         <input
//           ref={nameRef}
//           value={name}
//           onChange={(e) => setName(e.target.value)}
//           placeholder="Court Name"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           value={city}
//           onChange={(e) => setCity(e.target.value)}
//           placeholder="City"
//           className="w-full border p-2 rounded"
//         />

//         <input
//           value={price}
//           onChange={(e) => setPrice(e.target.value)}
//           placeholder="Price"
//           className="w-full border p-2 rounded"
//         />

//         {/* Upload */}
//         <input type="file" multiple onChange={handleImageChange} />

//         {/* Preview */}
//         <div className="flex gap-2 flex-wrap">
//           {preview.map((img, i) => (
//             <img key={i} src={img} className="w-20 h-20 rounded" />
//           ))}
//         </div>

//         {/* Existing images */}
//         <div className="flex gap-2 flex-wrap">
//           {existingImages.map((img, i) => (
//             <div key={i} className="relative">
//               <img src={img} className="w-20 h-20 rounded" />
//               <button
//                 type="button"
//                 onClick={() => removeExistingImage(img)}
//                 className="absolute top-0 right-0 bg-red-500 text-white text-xs px-1 rounded"
//               >
//                 X
//               </button>
//             </div>
//           ))}
//         </div>

//         <button className="bg-green-700 text-white px-4 py-2 rounded">
//           {saving ? "Saving..." : editingId ? "Update" : "Save"}
//         </button>
//       </form>

//       {/* COURTS */}
//       <div className="grid grid-cols-3 gap-4 mt-6">
//         {courts.map((c) => (
//           <CourtCard key={c._id} court={c} onEdit={handleEdit} />
//         ))}
//       </div>
//     </div>
//   );
// }

// // 🎯 CAROUSEL COMPONENT
// function CourtCard({ court, onEdit }) {
//   const [index, setIndex] = useState(0);

//   const images = court.images || [];

//   const next = () => setIndex((i) => (i + 1) % images.length);
//   const prev = () => setIndex((i) => (i - 1 + images.length) % images.length);

//   return (
//     <div className="border rounded p-3">
//       {images.length > 0 && (
//         <div className="relative">
//           <img
//             src={images[index]}
//             className="w-full h-40 object-cover rounded"
//           />

//           {images.length > 1 && (
//             <>
//               <button
//                 onClick={prev}
//                 className="absolute left-0 top-1/2 bg-white px-2"
//               >
//                 ◀
//               </button>
//               <button
//                 onClick={next}
//                 className="absolute right-0 top-1/2 bg-white px-2"
//               >
//                 ▶
//               </button>
//             </>
//           )}
//         </div>
//       )}

//       <div className="mt-2 font-semibold">{court.name}</div>
//       <div className="text-sm text-gray-500">{court.location}</div>
//       <div className="text-green-700">Rs {court.pricePerHour}/hr</div>

//       <button
//         onClick={() => onEdit(court)}
//         className="mt-2 text-blue-600 text-sm"
//       >
//         Edit
//       </button>
//     </div>
//   );
// }

import axios from "axios";

const CLOUD_NAME = "dpbkdq0to";
const UPLOAD_PRESET = "cricbook_upload";

export const uploadToCloudinary = async (files) => {
  const urls = [];

  for (let i = 0; i < files.length; i++) {
    const formData = new FormData();
    formData.append("file", files[i]);
    formData.append("upload_preset", UPLOAD_PRESET);

    const res = await axios.post(
      `https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`,
      formData
    );

    urls.push(res.data.secure_url);
  }

  return urls;
};