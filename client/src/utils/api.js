import axios from "axios";

const API = import.meta.env.VITE_API_URL || ""; // e.g. http://localhost:5000

const instance = axios.create({
  baseURL: API,
  headers: {
    "Content-Type": "application/json",
  },
});

// attach token from localStorage automatically (optional)
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export default instance;
