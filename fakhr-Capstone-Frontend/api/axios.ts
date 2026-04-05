import axios from "axios";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

// Get API URL from environment variable or use default
const getApiUrl = () => {
  const envUrl = process.env.EXPO_PUBLIC_API_URL;
  if (envUrl) {
    return envUrl;
  }

  // Default fallback - localhost only works for web
  const defaultUrl = "http://localhost:8000/api";

  // Log warning if using localhost on mobile platforms
  if (Platform.OS !== 'web') {
    console.warn(
      '⚠️  API URL not configured!\n' +
      'Using localhost which will NOT work on mobile devices/simulators.\n' +
      'Please create a .env file with: EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api\n' +
      'Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api'
    );
  }

  return defaultUrl;
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

// Request interceptor to add auth token
instance.interceptors.request.use(
  async (config) => {
    const token = await SecureStore.getItemAsync("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
      let errorMessage = 'Unable to connect to server. ';

      if (error.code === 'ECONNABORTED' || error.message?.includes('timeout')) {
        errorMessage = 'Request timeout. ';
      } else if (error.code === 'ERR_NETWORK' || error.message?.includes('Network Error')) {
        errorMessage = 'Network error. ';
      }

      // Add helpful guidance for localhost issues
      if (apiUrl.includes('localhost') && Platform.OS !== 'web') {
        errorMessage += '\n\n⚠️ localhost does not work on mobile devices/simulators.\n' +
          'Please configure EXPO_PUBLIC_API_URL in .env file with your IP address.\n' +
          'Example: EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api';
      } else {
        errorMessage += '\n\nPlease check:\n' +
          '1. Your internet connection\n' +
          '2. Backend server is running\n' +
          '3. API URL is correct: ' + apiUrl;
      }

      return Promise.reject(new Error(errorMessage));
    }

    // Handle HTTP errors
    if (error.response?.status === 401) {
      // Handle unauthorized - clear token and redirect to login
      await SecureStore.deleteItemAsync("token");
    }

    // Extract error message from response
    const errorMessage = error.response?.data?.message
      || error.response?.data?.error
      || error.response?.data?.data?.message
      || `Server error: ${error.response.status} ${error.response.statusText}`;

    return Promise.reject(new Error(errorMessage));
  }
);

export default instance;
