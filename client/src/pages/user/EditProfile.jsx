import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { showError, showSuccess } from "../../utils/toast";

const API_BASE = import.meta?.env?.VITE_API_BASE_URL || "http://localhost:5001";

const formatDateOnly = (value) => {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString().split("T")[0];
};

export default function EditProfile() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    contactnumber: "",
    dateJoined: "",
  });

  const [profilePicture, setProfilePicture] = useState(null);
  const [preview, setPreview] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    try {
      const u = JSON.parse(localStorage.getItem("user")) || {};

      const userJoinedDate =
        u.dateJoined ||
        u.joinedAt ||
        u.createdAt ||
        u.created_at ||
        u.registeredAt ||
        "";

      setForm({
        name: u.name || "",
        email: u.email || "",
        contactnumber: u.contactnumber || u.phone || "",
        dateJoined: formatDateOnly(userJoinedDate),
      });

      if (u.profilePicture) {
        setPreview(
          u.profilePicture.startsWith("http")
            ? u.profilePicture
            : `${API_BASE}${u.profilePicture}`
        );
      }
    } catch {
      setForm((prev) => ({
        ...prev,
        dateJoined: "",
      }));
    }
  }, []);

  const token = useMemo(() => {
    return (
      localStorage.getItem("token") ||
      localStorage.getItem("accessToken") ||
      localStorage.getItem("authToken") ||
      ""
    );
  }, []);

  const initials = useMemo(() => {
    const raw = String(form.name || form.email || "User").trim();
    const parts = raw.split(" ").filter(Boolean);
    return ((parts[0]?.[0] || "U") + (parts[1]?.[0] || "")).toUpperCase();
  }, [form.name, form.email]);

  const joinedDisplay = form.dateJoined || "-";

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  };

  const handleImage = (file) => {
    if (!file) return;

    if (!file.type?.startsWith("image/")) {
      showError("Please upload a valid image file");
      return;
    }

    setProfilePicture(file);
    setPreview(URL.createObjectURL(file));
  };

  const validateRequiredFields = () => {
    const name = form.name.trim();
    const email = form.email.trim();
    const phone = form.contactnumber.trim();

    if (!name) {
      showError("Full name is required");
      return false;
    }

    if (!email) {
      showError("Email address is required");
      return false;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      showError("Please enter a valid email address");
      return false;
    }

    if (!phone) {
      showError("Phone number is required");
      return false;
    }

    if (!form.dateJoined) {
      showError("Date joined is required");
      return false;
    }

    return true;
  };

  const onSubmit = async (e) => {
    e.preventDefault();

    if (!validateRequiredFields()) return;

    if (!token) {
      showError("Please login first");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("name", form.name.trim());
      formData.append("email", form.email.trim());
      formData.append("contactnumber", form.contactnumber.trim());
      formData.append("phone", form.contactnumber.trim());
      formData.append("dateJoined", form.dateJoined);
      formData.append("joinedAt", form.dateJoined);

      if (profilePicture) {
        formData.append("profilePicture", profilePicture);
      }

      const res = await fetch(`${API_BASE}/api/users/me`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });

      const data = await res.json().catch(() => ({}));

      if (!res.ok) {
        throw new Error(data?.message || "Update failed");
      }

      const previousUser = JSON.parse(localStorage.getItem("user") || "{}");

      const updatedUser = {
        ...previousUser,
        ...data,
        name: form.name.trim(),
        email: form.email.trim(),
        contactnumber: form.contactnumber.trim(),
        phone: form.contactnumber.trim(),
        dateJoined: form.dateJoined,
        joinedAt: form.dateJoined,
      };

      localStorage.setItem("user", JSON.stringify(updatedUser));
      window.dispatchEvent(new Event("userUpdated"));
      window.dispatchEvent(new Event("user-profile-updated"));

      showSuccess("Profile updated successfully");

      setTimeout(() => {
        navigate("/profile");
      }, 900);
    } catch (e2) {
      showError(e2.message || "Update failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 px-3 py-4 sm:px-5 sm:py-6 lg:px-8">
      <div className="mx-auto w-full max-w-7xl">
        <div className="mb-6 flex flex-col gap-5 rounded-2xl border border-slate-200 bg-white px-4 py-5 shadow-sm sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-green-700">
              My Account
            </p>

            <h1 className="mt-2 text-2xl font-extrabold tracking-tight text-slate-950 sm:text-3xl lg:text-4xl">
              Edit Profile
            </h1>

            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500 sm:text-base">
              Update your personal details, joined date, and profile picture to
              keep your CricBook account accurate and professional.
            </p>
          </div>

          <Link
            to="/profile"
            className="inline-flex w-fit items-center justify-center rounded-2xl border border-green-200 bg-white px-5 py-3 text-sm font-semibold text-green-700 shadow-sm transition hover:border-green-300 hover:bg-green-50"
          >
            ← Back to Profile
          </Link>
        </div>

        <form onSubmit={onSubmit} className="grid gap-6 xl:grid-cols-12">
          <aside className="xl:col-span-4">
            <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
              <div className="bg-gradient-to-r from-green-700 to-green-600 px-5 py-6 text-white sm:px-6">
                <p className="text-sm font-semibold text-green-50">
                  Profile Preview
                </p>
                <h2 className="mt-1 text-2xl font-bold">Identity Card</h2>
              </div>

              <div className="p-5 sm:p-6">
                <div className="flex flex-col items-center text-center">
                  <div className="group relative">
                    <div className="flex h-28 w-28 items-center justify-center overflow-hidden rounded-2xl border-4 border-green-100 bg-green-100 text-3xl font-bold text-green-800 shadow-sm sm:h-32 sm:w-32">
                      {preview ? (
                        <img
                          src={preview}
                          className="h-full w-full object-cover"
                          alt="Profile preview"
                        />
                      ) : (
                        initials
                      )}
                    </div>

                    <label className="absolute inset-0 flex cursor-pointer items-center justify-center rounded-2xl bg-black/45 opacity-0 transition group-hover:opacity-100">
                      <span className="rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900">
                        Change Photo
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={(e) => handleImage(e.target.files?.[0])}
                      />
                    </label>
                  </div>

                  <p className="mt-4 max-w-full break-words text-xl font-bold text-slate-950">
                    {form.name || "Your Name"}
                  </p>

                  <p className="mt-1 max-w-full break-words text-sm text-slate-500">
                    {form.email || "your@email.com"}
                  </p>

                  <div className="mt-4 flex flex-wrap justify-center gap-2">
                    <span className="rounded-full bg-green-600 px-3 py-1 text-xs font-bold uppercase tracking-wide text-white">
                      User
                    </span>

                    <span className="rounded-full bg-green-50 px-3 py-1 text-xs font-bold text-green-700 ring-1 ring-green-200">
                      User since {joinedDisplay}
                    </span>
                  </div>

                  <div className="mt-6 w-full rounded-2xl border border-green-100 bg-green-50 p-4 text-left">
                    <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                      Profile Photo
                    </p>
                    <p className="mt-2 text-sm leading-6 text-green-800">
                      Use a clear profile picture for a more trusted and
                      polished account appearance.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </aside>

          <section className="xl:col-span-8">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-slate-950">
                    Personal Information
                  </h2>

                  <p className="mt-1 text-sm leading-6 text-slate-500">
                    Fields marked with <span className="text-red-600">*</span>{" "}
                    are required.
                  </p>
                </div>

                <div className="w-fit rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-600">
                  Secure profile update
                </div>
              </div>

              <div className="mt-8 grid gap-5 md:grid-cols-2">
                <Field
                  label="Full Name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="Enter your full name"
                  required
                />

                <Field
                  label="Email Address"
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  placeholder="Enter your email"
                  required
                />

                <Field
                  label="Phone Number"
                  name="contactnumber"
                  value={form.contactnumber}
                  onChange={onChange}
                  placeholder="Enter phone number"
                  required
                />

                <Field
                  label="Date Joined"
                  name="dateJoined"
                  type="date"
                  value={form.dateJoined}
                  onChange={onChange}
                  placeholder="Select joined date"
                  required
                />
              </div>

              <div className="mt-6 rounded-2xl border border-green-100 bg-green-50 px-4 py-3">
                <p className="text-xs font-bold uppercase tracking-wider text-green-700">
                  Account Created
                </p>
                <p className="mt-1 text-sm font-semibold text-green-900">
                  User since {joinedDisplay}
                </p>
              </div>

              <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <Link
                  to="/profile"
                  className="rounded-2xl border border-slate-300 bg-white px-5 py-3 text-center text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                  Cancel
                </Link>

                <button
                  type="submit"
                  disabled={loading}
                  className="rounded-2xl bg-green-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {loading ? "Saving Changes..." : "Save Changes"}
                </button>
              </div>
            </div>
          </section>
        </form>
      </div>
    </div>
  );
}

function Field({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = "text",
  required = false,
}) {
  return (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">
        {label}
        {required && <span className="ml-1 text-red-600">*</span>}
      </label>

      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        required={required}
        className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3.5 text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-green-500 focus:bg-white focus:ring-4 focus:ring-green-100"
      />
    </div>
  );
}