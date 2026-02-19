import toast from "react-hot-toast";
import { clearToken } from "./cookieHelper.js";

export const handleError = (error) => {
  if (error.response) {
    toast.error(error.response.data.message || "Error: Please try again.");
  }
  if (error.request) {
    toast.error("No response from server. Please try again later.");
  } else toast.error("An error occurred. Please try again.");
  return false;
};

export const handleResponseStatus = (status) => {
  switch (status) {
    case 200:
    case 201:
      return true;
    case 400:
      toast.error("Bad request. Please check your input.");
      return false;
    case 401:
      toast.error("Unauthorized. Please log in again.");
      clearToken();
      return false;
    case 403:
      toast.error("Forbidden request. You don't have permission.");
      return false;
    case 404:
      toast.error("Resource not found.");
      return false;
    default:
      toast.error("An unexpected error occurred. Please try again.");
      return false;
  }
};
