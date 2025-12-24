import axios from "axios";

const API = import.meta.env.VITE_API_URL || "http://localhost:5000";

console.log("🔌 CricBook API base URL:", API);

const api = axios.create({
  baseURL: API,
});

export default api;
