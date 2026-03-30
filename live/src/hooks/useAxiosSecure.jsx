import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setToken, setUser } from "@/redux/features/user/userSlice";
import errorToast from "./custom/errorToast";

const useAxiosSecure = () => {
  const access_token = useSelector((state) => state.user.access_token);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const baseURL = `${import.meta.env.VITE_BASE_URL}/api`;

  const axiosSecure = axios.create({
    baseURL: baseURL,
    timeout: 1000000, // 10 seconds timeout
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  });

  axiosSecure.interceptors.response.use(
    (response) => response,
    (error) => {
      // 🧩 Ignore expected network errors caused by intentional redirects
      const isRedirecting =
        window.location.href.includes("checkout.stripe.com") ||
        window.location.href.includes("/success") ||
        window.location.href.includes("/cancel");

      if (isRedirecting) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401) {
        dispatch(setUser(null));
        dispatch(setToken(null));
        errorToast("Session expired. Please log in again.");
        navigate("/sign-in");
      } else if (error.request) {
        // ✅ Don’t show toast for redirects — only for genuine network issues
        if (!navigator.onLine) {
          errorToast("Network error. Please check your connection.");
        }
      } else {
        errorToast("An unexpected error occurred");
      }

      return Promise.reject(error);
    },
  );

  return axiosSecure;
};

export default useAxiosSecure;
