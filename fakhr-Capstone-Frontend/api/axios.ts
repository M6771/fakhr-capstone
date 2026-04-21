import axios from "axios";
import * as SecureStore from "expo-secure-store";
import Constants from "expo-constants";
import { Platform } from "react-native";

/** Ensure base URL ends with /api (no trailing slash before it). */
function normalizeApiBase(url: string): string {
  let s = url.trim().replace(/\/+$/, "");
  if (!s.endsWith("/api")) {
    s = `${s}/api`;
  }
  return s;
}

/**
 * Resolve API base URL.
 * - Physical device: EXPO_PUBLIC_API_URL (your Mac LAN IP + /api).
 * - iOS Simulator / Android Emulator (dev): 127.0.0.1 or 10.0.2.2 so a stale hotspot IP in .env does not break requests.
 *   Set EXPO_PUBLIC_API_STRICT=1 to force using EXPO_PUBLIC_API_URL on simulators (e.g. API on another machine).
 */
const getApiUrl = () => {
  const explicit = process.env.EXPO_PUBLIC_API_URL?.trim();
  const strict = process.env.EXPO_PUBLIC_API_STRICT === "1";
  const isDev = typeof __DEV__ !== "undefined" && __DEV__;
  const isPhysicalDevice = Constants.isDevice === true;

  if (isDev && !strict && !isPhysicalDevice) {
    if (Platform.OS === "ios") {
      return normalizeApiBase("http://127.0.0.1:8000");
    }
    if (Platform.OS === "android") {
      return normalizeApiBase("http://10.0.2.2:8000");
    }
    if (Platform.OS === "web") {
      return normalizeApiBase(explicit || "http://localhost:8000");
    }
  }

  if (explicit) {
    return normalizeApiBase(explicit);
  }

  const fallback = "http://localhost:8000/api";

  if (Platform.OS !== "web") {
    console.warn(
      "⚠️  EXPO_PUBLIC_API_URL is not set.\n" +
        "On a physical device, set it in .env to http://YOUR_MAC_LAN_IP:8000/api (same Wi-Fi).\n" +
        `Falling back to: ${fallback} (often wrong on real phones)`
    );
  }

  return fallback;
};

const baseURL = getApiUrl();

// Log the API URL being used (helpful for debugging)
console.log(`🌐 API Base URL: ${baseURL}`);

const instance = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor to add auth token (skip for public directory GETs — avoids edge cases with stale/invalid JWT)
instance.interceptors.request.use(
  async (config) => {
    const method = (config.method ?? "get").toLowerCase();
    const url = typeof config.url === "string" ? config.url : "";
    const isPublicDirectoryGet = method === "get" && url.startsWith("/directory/");
    if (!isPublicDirectoryGet) {
      const token = await SecureStore.getItemAsync("token");
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle errors
instance.interceptors.response.use(
  (response) => {
    return response.data;
  },
  async (error) => {
    // Handle network errors (no response from server)
    if (!error.response) {
      const apiUrl = baseURL;
      let errorMessage = "Unable to connect to server. ";

      if (error.code === "ECONNABORTED" || error.message?.includes("timeout")) {
        errorMessage = "Request timeout. ";
      } else if (error.code === "ERR_NETWORK" || error.message?.includes("Network Error")) {
        errorMessage = "Network error. ";
      }

      // Add helpful guidance for localhost issues
      if (apiUrl.includes("localhost") && Platform.OS !== "web") {
        errorMessage +=
          "\n\n⚠️ localhost does not work on mobile devices/simulators.\n" +
          "Please configure EXPO_PUBLIC_API_URL in .env file with your IP address.\n" +
          "Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api";
      } else {
        errorMessage +=
          "\n\nPlease check:\n" +
          "1. Backend is running (npm start in fakhr-capstone-Backend)\n" +
          "2. Same network (phone + Mac) if using a physical device\n" +
          "3. EXPO_PUBLIC_API_URL matches your setup (see console: API Base URL)\n" +
          "4. URL ends with /api — current: " +
          apiUrl;
      }

      return Promise.reject(new Error(errorMessage));
    }

    const status = error.response?.status;

    // Handle unauthorized — clear token (session invalid)
    if (status === 401) {
      await SecureStore.deleteItemAsync("token");
    }

    // Extract error message from response
    const errorMessage =
      error.response?.data?.message ||
      error.response?.data?.error ||
      error.response?.data?.data?.message ||
      `Server error: ${status} ${error.response.statusText}`;

    const err = new Error(errorMessage) as Error & { status?: number };
    err.status = status;
    return Promise.reject(err);
  }
);

export default instance;
