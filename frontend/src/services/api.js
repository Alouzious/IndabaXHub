import axios from "axios";
import { API_BASE_URL, TOKEN_STORAGE_KEY } from "../utils/constants";

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token from persisted storage on every request.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_STORAGE_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Global 401 handling: clear session and redirect to login.
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response?.status === 401) {
      const onAuthPage =
        window.location.pathname.startsWith("/login") ||
        window.location.pathname.startsWith("/register");
      localStorage.removeItem(TOKEN_STORAGE_KEY);
      // Notify the auth store (and any listeners) to reset state.
      window.dispatchEvent(new CustomEvent("indabaxhub:unauthorized"));
      if (!onAuthPage) {
        window.location.assign("/login");
      }
    }
    return Promise.reject(error);
  }
);

export default api;
