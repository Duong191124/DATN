import { Form, message, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import axios from "axios";

// Set config defaults when creating the instance
const instance = axios.create({
  baseURL: import.meta.env.VITE_BACK_END_URL,
});

// Helper function to show and hide the spinner
const setSpinLoadingVisibility = (isVisible) => {
  const spinLoading = document.querySelector(".spin-loading"); // Giả sử class spin-loading có sẵn trong HTML
  if (spinLoading) {
    spinLoading.style.display = isVisible ? "flex" : "none";
  }
};

// Add a request interceptor
instance.interceptors.request.use(
  function (config) {
    // Show spinner before making request
    setSpinLoadingVisibility(true);

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
    // Hide spinner if request fails
    setSpinLoadingVisibility(false);
    return Promise.reject(error);
  }
);

// Add a response interceptor
instance.interceptors.response.use(
  function (response) {
    // Hide spinner when receiving a response
    setSpinLoadingVisibility(false);

    // Check if response has data
    if (response.data && response.data.data) {
      return response;
    }
    return response;
  },
  function (error) {
    // Hide spinner and handle errors
    setSpinLoadingVisibility(false);

    if (error.response) {
      const { status } = error.response;
      // If 401, remove token and redirect to login
      if (status === 401) {
        notification.error({
          message: "Hết phiên đăng nhập",
          description: "Vui lòng đăng nhập lại",
          duration: 2,
        });
        if (typeof window !== "undefined") {
          localStorage.removeItem("access_token");

          window.location.href = "/login"; // Ensure this matches your app's route
        }
      } else if (status === 403) {
        notification.error({
          message: "Không có quyền truy cập",
          description: "Bạn không có quyền",
          duration: 2,
        });
        return;
      }
      // else {
      //   notification.warning({
      //     message: 'Warring',
      //     description: error.response.data.message,
      //     duration: 2
      //   });
      // }
    }
  }
);

export default instance;
