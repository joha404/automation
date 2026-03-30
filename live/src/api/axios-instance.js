import axios from "axios";
import { clearToken } from "../utils/cookieHelper.js";

const BASE_URL = import.meta.env.VITE_BASE_URL;

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
});

// ✅ helper to always get latest token
const getAccessToken = () => {
  try {
    const persistRoot = localStorage.getItem("persist:root");
    if (!persistRoot) return null;

    const root = JSON.parse(persistRoot);
    const user = JSON.parse(root?.user || "{}");

    return user?.access_token || null;
  } catch (err) {
    console.error("Token parse error:", err);
    return null;
  }
};

// ✅ Request interceptor
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getAccessToken(); // 🔥 always fresh token

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    console.error("Request Error:", error);
    return Promise.reject(error);
  },
);

// ✅ Response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      switch (error.response.status) {
        case 401:
          clearToken();
          // optional: redirect to login
          // window.location.href = "/login";
          break;

        case 403:
          console.warn("Forbidden");
          break;

        case 429:
          console.warn("Too many requests");
          break;

        default:
          break;
      }
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
