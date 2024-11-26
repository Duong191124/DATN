import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
});

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    if (
      typeof window !== "undefined" &&
      window.localStorage.getItem("access_token")
    ) {
      config.headers.Authorization =
        "Bearer " + window.localStorage.getItem("access_token");
    }
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Check if response has data
    if (response.data && response.data.data) {
      return response;
    }
    return response;
  },
  function (error) {
    // Handle errors
    if (error.response) {
      const { status } = error.response;
      // If 401/403, remove token and redirect to login
      if (status === 401 || status === 403) {
        if (typeof window !== "undefined") {
          // Clear local storage
          localStorage.removeItem("access_token");

          // Redirect to login page
          window.location.href = "/login"; // Ensure this matches your app's route
        }
      }
    }
    return Promise.reject(error);
  }
);

export default instance;
