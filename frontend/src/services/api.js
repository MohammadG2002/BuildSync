import axios from "axios";
import toast from "react-hot-toast";

// Prefer environment-provided API URL; avoid hardcoded fallback
const RAW_API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
// Normalize: strip trailing slash to prevent double slashes in requests
const API_URL = RAW_API_URL.replace(/\/$/, "");

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 30000,
  // withCredentials: true, // enable if using cookie-based auth
});

// Request interceptor - Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - Handle errors globally
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response) {
      // Handle specific error status codes
      switch (error.response.status) {
        case 401:
          // Unauthorized - clear token. For failed login attempts we should
          // let the caller handle the error (so the UI can show a toast)
          localStorage.removeItem("token");
          // If this request was not the login endpoint, redirect to login
          // and show session-expired message. For the login endpoint, do
          // nothing here and allow the caller to handle the error message.
          if (
            error.config &&
            error.config.url &&
            !error.config.url.includes("/auth/login")
          ) {
            window.location.href = "/login";
            toast.error("Session expired. Please login again.");
          }
          break;
        case 403:
          toast.error("You do not have permission to perform this action.");
          break;
        case 404:
          toast.error("Resource not found.");
          break;
        case 500:
          toast.error("Server error. Please try again later.");
          break;
        default:
          toast.error(error.response.data.message || "An error occurred.");
      }
    } else if (error.request) {
      toast.error("Network error. Please check your connection.");
    } else {
      toast.error("An unexpected error occurred.");
    }
    return Promise.reject(error);
  }
);

export default api;
