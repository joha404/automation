import axios from "axios";
import errorToast from "./custom/errorToast";

const useAxiosPublic = () => {
  const baseURL = `${import.meta.env.VITE_BASE_URL}/api`;

  const axiosPublic = axios.create({
    baseURL: baseURL,
    timeout: 10000, // 10 seconds timeout
    headers: {
      "Content-Type": "application/json",
    },
  });


  // Response interceptor
  // axiosPublic.interceptors.response.use(
  //   (response) => {
  //     // You can modify successful responses here
  //     return response;
  //   },
  //   (error) => {
  //     // Error handling
  //     let errorMessage = "An unexpected error occurred";

  //     if (error.code === "ECONNABORTED") {
  //       errorMessage = "Request timeout. Please try again.";
  //     } else if (error.response) {
  //       // Server responded with a status code outside 2xx
  //       switch (error.response.status) {
  //         case 400:
  //           errorMessage = "Bad request";
  //           break;
  //         case 401:
  //           errorMessage = "Unauthorized access";
  //           break;
  //         case 403:
  //           errorMessage = "Forbidden";
  //           break;
  //         case 404:
  //           errorMessage = "Resource not found";
  //           break;
  //         case 500:
  //           errorMessage = "Internal server error";
  //           break;
  //         default:
  //           errorMessage = error.response?.message || "Request failed";
  //       }
  //     } else if (error.request) {
  //       // Request was made but no response received
  //       errorMessage = "Network error. Please check your connection.";
  //     }

  //     // Show error toast (only if not 401 which might be handled by auth flow)
  //     if (error.response?.status !== 401) {
  //       errorToast(errorMessage);
  //     }

  //     console.error("API Error:", {
  //       message: errorMessage,
  //       error: error,
  //     });

  //     return Promise.reject(error);
  //   }
  // );
  return axiosPublic;
};

export default useAxiosPublic;