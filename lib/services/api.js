import axios from "axios";

// Use environment variables if available, otherwise fallback to default
const API_URL = process.env.NEXT_PUBLIC_API_URL || "/api";

console.log("API URL:", API_URL);

// Check if network is online
const isOnline = () => {
  return navigator.onLine;
};

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 15000, // Increased timeout for better reliability
});

// Configure axios-retry
// Note: This is a mock implementation since we can't actually install the package in this environment
// In a real environment, you'd need to run: npm install axios-retry
// For now we'll create a simple retry mechanism
const retryDelay = (retryNumber = 0) => {
  const delay = Math.pow(2, retryNumber) * 1000; // exponential backoff
  return Math.min(delay, 5000); // Max 5 seconds delay
};

// Implement a simple retry mechanism
api.interceptors.response.use(undefined, async (err) => {
  const config = err.config || {};

  // Skip retry for specific error codes
  if (err.response && [401, 403, 404].includes(err.response.status)) {
    return Promise.reject(err);
  }

  // Set maximum retries
  config.retryCount = config.retryCount || 0;
  const maxRetries = 2;

  if (config.retryCount >= maxRetries || !isOnline()) {
    return Promise.reject(err);
  }

  // Increase retry count
  config.retryCount += 1;

  // Create new promise to handle retry
  const delay = retryDelay(config.retryCount);
  console.log(
    `Retrying request (${config.retryCount}/${maxRetries}) after ${delay}ms`
  );

  // Wait before retrying
  return new Promise((resolve) =>
    setTimeout(() => resolve(api(config)), delay)
  );
});

// Add interceptor to add auth token to requests
api.interceptors.request.use(
  (config) => {
    // Check if we're online before making the request
    if (!isOnline()) {
      return Promise.reject({
        message:
          "You are currently offline. Please check your network connection.",
        isOffline: true,
      });
    }

    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to better handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network errors handling
    if (error.isOffline || error.code === "ERR_NETWORK" || !error.response) {
      console.error("Network error detected:", error.message);
      return Promise.reject({
        ...error,
        message:
          "Network error. Please check your connection or try again later.",
        isNetworkError: true,
      });
    }
    return Promise.reject(error);
  }
);

export default api;
